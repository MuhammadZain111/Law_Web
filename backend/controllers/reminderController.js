// controllers/reminderController.js
import SchedulerService from "../services/schedulerService.js";
import ReminderService from "../services/reminderService.js";
import Appointment from "../models/appointment.model.js";

/**
 * Get upcoming appointments for the current user
 */
export const getUpcomingAppointments = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || req.user.userType;
    const { hours = 24 } = req.query;

    const appointments = await SchedulerService.getUpcomingAppointments(
      userId, 
      userRole, 
      parseInt(hours)
    );

    res.json({
      success: true,
      appointments,
      count: appointments.length
    });
  } catch (error) {
    console.error("getUpcomingAppointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Update reminder preferences for an appointment
 */
export const updateReminderPreferences = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { emailReminders, smsReminders, reminderIntervals } = req.body;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || req.user.userType;

    // Find the appointment and verify ownership
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if user has permission to modify this appointment
    const isOwner = (userRole === 'client' && appointment.clientId?.toString() === userId) ||
                   (userRole === 'lawyer' && appointment.lawyerId?.toString() === userId);

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to modify this appointment"
      });
    }

    // Update reminder preferences
    const updateData = {};
    if (emailReminders !== undefined) {
      updateData['reminderPreferences.emailReminders'] = emailReminders;
    }
    if (smsReminders !== undefined) {
      updateData['reminderPreferences.smsReminders'] = smsReminders;
    }
    if (reminderIntervals !== undefined) {
      updateData['reminderPreferences.reminderIntervals'] = reminderIntervals;
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateData },
      { new: true }
    ).populate('clientId', 'name email').populate('lawyerId', 'name email');

    res.json({
      success: true,
      message: "Reminder preferences updated successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error("updateReminderPreferences:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Manually send a reminder (admin/lawyer only)
 */
export const sendManualReminder = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reminderType } = req.body;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || req.user.userType;

    // Only lawyers and admins can send manual reminders
    if (userRole !== 'lawyer' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only lawyers can send manual reminders"
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('lawyerId', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if lawyer owns this appointment
    if (userRole === 'lawyer' && appointment.lawyerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only send reminders for your own appointments"
      });
    }

    const result = await ReminderService.sendReminderEmail(appointment, reminderType);
    
    if (result.success) {
      // Mark reminder as sent
      await ReminderService.markReminderSent(appointmentId, reminderType);
      
      res.json({
        success: true,
        message: "Reminder sent successfully",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send reminder",
        error: result.error
      });
    }
  } catch (error) {
    console.error("sendManualReminder:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Get scheduler status (admin only)
 */
export const getSchedulerStatus = async (req, res) => {
  try {
    const userRole = req.user.role || req.user.userType;
    
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const jobStatus = SchedulerService.getJobStatus();
    
    res.json({
      success: true,
      scheduler: {
        status: "running",
        jobs: jobStatus,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error("getSchedulerStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Trigger a reminder job manually (admin only)
 */
export const triggerReminderJob = async (req, res) => {
  try {
    const userRole = req.user.role || req.user.userType;
    
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const { reminderType } = req.body;
    
    if (!['24h', '2h', '30min'].includes(reminderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder type. Must be one of: 24h, 2h, 30min"
      });
    }

    const result = await SchedulerService.triggerReminderJob(reminderType);
    
    res.json({
      success: true,
      message: `Reminder job ${reminderType} triggered successfully`,
      result
    });
  } catch (error) {
    console.error("triggerReminderJob:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Get reminder statistics (admin only)
 */
export const getReminderStats = async (req, res) => {
  try {
    const userRole = req.user.role || req.user.userType;
    
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get appointment statistics
    const totalAppointments = await Appointment.countDocuments();
    const upcomingAppointments = await Appointment.countDocuments({
      status: { $in: ['confirmed', 'pending'] },
      appointmentDate: { $gte: now }
    });
    
    const appointmentsWithReminders = await Appointment.countDocuments({
      remindersSent: { $exists: true, $ne: [] }
    });

    // Get recent reminder activity
    const recentAppointments = await Appointment.find({
      updatedAt: { $gte: last24Hours },
      remindersSent: { $exists: true, $ne: [] }
    }).select('remindersSent updatedAt');

    const reminderStats = {
      totalAppointments,
      upcomingAppointments,
      appointmentsWithReminders,
      recentReminderActivity: recentAppointments.length,
      reminderTypes: {
        '24h': 0,
        '2h': 0,
        '30min': 0
      }
    };

    // Count reminder types
    recentAppointments.forEach(apt => {
      apt.remindersSent.forEach(type => {
        if (reminderStats.reminderTypes[type] !== undefined) {
          reminderStats.reminderTypes[type]++;
        }
      });
    });

    res.json({
      success: true,
      stats: reminderStats
    });
  } catch (error) {
    console.error("getReminderStats:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};






