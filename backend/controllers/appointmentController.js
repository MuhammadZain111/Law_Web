// controllers/appointment.controller.js
import Appointment from "../models/appointment.model.js";
import mongoose from "mongoose";
import { sendEmail, buildStatusEmail } from "../utils/mailer.js";
import { createNotification } from "../services/notificationService.js";


export const createAppointment = async (req, res) => {
  try {
    console.log('📋 Creating appointment with data:', {
      lawyerId: req.body.lawyerId,
      clientName: req.body.clientName,
      documents: req.body.documents,
      documentFiles: req.body.documentFiles?.length || 0
    });
    
    const { 
      lawyerId, 
      clientName, 
      clientEmail, 
      clientPhone, 
      caseType, 
      caseDescription, 
      appointmentDate, 
      timeSlot, 
      consultationFee, 
      paymentMethod, 
      paymentScreenshot,
      paymentScreenshotFile,
      // Additional fields
      clientAddress,
      clientCity,
      clientAge,
      clientGender,
      consultationType,
      urgency,
      previousLawyer,
      caseStatus,
      documents,
      documentFiles,
      specialRequirements
    } = req.body;

    // Validate required fields
    if (!lawyerId || !clientName || !clientEmail || !clientPhone || !caseType || !caseDescription || !appointmentDate || !timeSlot || !consultationFee || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Validate date
    const dt = new Date(appointmentDate);
    if (isNaN(dt.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid appointment date" 
      });
    }

    // Get client ID from token (if available) or create without it
    let clientId = req.user?.id || req.user?.userId || null;
    
    console.log('🔍 Authentication info:', {
      hasUser: !!req.user,
      userId: req.user?.id || req.user?.userId,
      userEmail: req.user?.email,
      clientEmail: clientEmail
    });
    
    // If user is authenticated, prioritize linking to their account
    if (req.user && req.user.id) {
      clientId = req.user.id;
      console.log('✅ User is authenticated, linking appointment to user:', clientId);
    } else if (!clientId && clientEmail) {
      // If no authenticated user but we have an email, try to find user by email
      try {
        const User = (await import("../models/user.model.js")).default;
        const user = await User.findOne({ email: clientEmail }).select("_id");
        if (user) {
          clientId = user._id;
          console.log('🔍 Found user by email, linking appointment to user:', clientId);
        }
      } catch (error) {
        console.log('❌ Error finding user by email:', error.message);
      }
    }

    // Validate lawyerId is a valid ObjectId
    console.log('🔍 Validating lawyerId:', lawyerId, 'Type:', typeof lawyerId);
    if (!lawyerId || !mongoose.Types.ObjectId.isValid(lawyerId)) {
      console.log('❌ Invalid lawyer ID:', lawyerId);
      return res.status(400).json({
        success: false,
        message: "Invalid lawyer ID format"
      });
    }

    console.log('📋 Creating appointment with data:', {
      clientId,
      lawyerId: new mongoose.Types.ObjectId(lawyerId),
      clientName,
      clientEmail,
      clientPhone,
      caseType,
      caseDescription,
      appointmentDate: dt,
      timeSlot,
      consultationFee,
      paymentMethod,
      documents,
      documentFiles: documentFiles?.length || 0
    });

    // Debug documentFiles specifically
    console.log('🔍 Debug - documentFiles received:', {
      type: typeof documentFiles,
      isArray: Array.isArray(documentFiles),
      length: documentFiles?.length,
      content: documentFiles
    });

    // Debug the entire request body
    console.log('🔍 Debug - Full request body:', JSON.stringify(req.body, null, 2));

    // Additional validation logging
    console.log('🔍 Field validation check:', {
      lawyerIdValid: mongoose.Types.ObjectId.isValid(lawyerId),
      clientNameValid: !!clientName,
      clientEmailValid: !!clientEmail,
      clientPhoneValid: !!clientPhone,
      caseTypeValid: !!caseType,
      caseDescriptionValid: !!caseDescription,
      appointmentDateValid: !isNaN(dt.getTime()),
      timeSlotValid: !!timeSlot,
      consultationFeeValid: !isNaN(consultationFee) && consultationFee > 0,
      paymentMethodValid: !!paymentMethod
    });

    // Build payment screenshot object: prefer structured file; fall back to simple URL
    let paymentScreenshotFileObj = paymentScreenshotFile || null;
    // Only construct a file object if the provided paymentScreenshot is a URL; otherwise ignore (it's likely a reference/ID)
    if (!paymentScreenshotFileObj && typeof paymentScreenshot === 'string' && /^https?:\/\//i.test(paymentScreenshot)) {
      paymentScreenshotFileObj = {
        name: 'payment_screenshot.jpg',
        size: 0,
        type: 'image/*',
        lastModified: Date.now(),
        url: paymentScreenshot,
      };
    }

    const appointment = await Appointment.create({
      clientId,
      lawyerId: new mongoose.Types.ObjectId(lawyerId),
      clientName,
      clientEmail,
      clientPhone,
      caseType,
      caseDescription,
      appointmentDate: dt,
      timeSlot,
      consultationFee,
      paymentMethod,
      paymentScreenshot,
      paymentScreenshotFile: paymentScreenshotFileObj,
      // Additional fields
      clientAddress,
      clientCity,
      clientAge,
      clientGender,
      consultationType,
      urgency,
      previousLawyer,
      caseStatus,
      documents,
      documentFiles,
      specialRequirements,
      status: 'pending',
      paymentStatus: 'unpaid',
      // Initialize reminder preferences
      remindersSent: [],
      reminderPreferences: {
        emailReminders: true,
        smsReminders: false,
        reminderIntervals: ['24h', '2h']
      }
    });

    console.log('✅ Appointment created successfully:', appointment._id);

    // Persist notifications for both parties
    try {
      const Notification = (await import('../models/Notification.js')).default;
      await Notification.create({ userId: appointment.lawyerId, title: 'New Appointment Request', description: `${clientName} requested an appointment.` });
      if (clientId) await Notification.create({ userId: clientId, title: 'Appointment Requested', description: `Your appointment request was sent.` });
      // Realtime emit to lawyer if connected
      const { io } = await import('../server.js');
      if (io) {
        io.to(String(appointment.lawyerId)).emit('appointment:status', { id: appointment._id.toString(), status: appointment.status });
      }
    } catch (_) {}

    res.status(201).json({ 
      success: true, 
      message: "Appointment created successfully",
      appointment 
    });
  } catch (err) {
    console.error("createAppointment error:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
        details: `Validation failed for fields: ${errors.map(e => e.field).join(', ')}`
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry error"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message
    });
  }
};

export const listAppointments = async (req, res) => {
  try {
    const q = {};
    const userId = req.user.userId || req.user.id; // Handle both userId and id
    const userRole = req.user.role || req.user.userType; // Handle both role and userType
    
    console.log('🔍 listAppointments - User info:', {
      userId,
      userRole,
      userObject: req.user
    });
    
    // Treat normal portal users/clients and also match by email for legacy rows
    if (userRole === "lawyer") {
      q.lawyerId = userId;
    } else {
      // fetch user email for fallback
      let userEmail;
      try {
        const User = (await import("../models/user.model.js")).default;
        const u = await User.findById(userId).select("email");
        userEmail = u?.email;
      } catch(_e) {}
      q.$or = [ { clientId: userId } ];
      if (userEmail) q.$or.push({ clientEmail: userEmail });
    }
    
    console.log('🔍 listAppointments - Query:', q);

    const appointments = await Appointment.find(q)
      .populate("clientId", "firstname lastname email photoUrl")
      .populate("lawyerId", "firstname lastname email photoUrl")
      .sort({ appointmentDate: -1, createdAt: -1 });

    console.log('📋 Returning appointments:', appointments.length, 'appointments');
    console.log('📋 Sample appointment data:', appointments[0] ? {
      clientName: appointments[0].clientName,
      documents: appointments[0].documents,
      documentFiles: appointments[0].documentFiles?.length || 0
    } : 'No appointments');

    res.json({ 
      success: true,
      appointments,
      count: appointments.length,
      userRole,
      userId
    });
  } catch (err) {
    console.error("listAppointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const appt = await Appointment.findById(id)
      .populate("clientId", "name email")
      .populate("lawyerId", "name email");

    if (!appt) return res.status(404).json({ message: "Not found" });

    if (req.user.role === "client" && appt.clientId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.user.role === "lawyer" && appt.lawyerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ appointment: appt });
  } catch (err) {
    console.error("getAppointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "rejected", "completed", "cancelled"];

    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: "Not found" });

    const userId = req.user.userId || req.user.id; // Handle both userId and id
    const userRole = req.user.role || req.user.userType; // Handle both role and userType
    if (userRole === "lawyer" && appt.lawyerId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (userRole === "client" && status !== "cancelled") {
      return res.status(403).json({ message: "Clients can only cancel" });
    }

    appt.status = status;
    await appt.save();
    
    // Send email and notification to client on key status changes
    const shouldNotify = ['confirmed', 'rejected', 'cancelled', 'completed'].includes(status);
    if (shouldNotify) {
      try {
        // Resolve recipient email
        let recipientEmail = appt.clientEmail;
        if (!recipientEmail && appt.clientId) {
          try {
            const User = (await import("../models/user.model.js")).default;
            const u = await User.findById(appt.clientId).select("email");
            recipientEmail = u?.email || null;
          } catch (_) {}
        }

        // Send email
        const { subject, text, html } = buildStatusEmail(appt, status);
        if (recipientEmail) {
          const result = await sendEmail({ to: recipientEmail, subject, text, html });
          console.log('📧 Confirmation email result:', result);
        } else {
          console.warn('📧 Skipping email: no client email available for appointment', String(appt._id));
        }

        // Create notification for client
        if (appt.clientId) {
          const statusMessages = {
            'confirmed': 'Your appointment has been confirmed',
            'rejected': 'Your appointment has been rejected',
            'cancelled': 'Your appointment has been cancelled',
            'completed': 'Your appointment has been completed'
          };
          
          const title = statusMessages[status] || `Appointment status changed to ${status}`;
          const description = `Appointment with ${appt.lawyerId?.name || 'lawyer'} on ${new Date(appt.appointmentDate).toLocaleDateString()}`;
          
          await createNotification(appt.clientId, title, description);
        }

        // Create notification for lawyer (if status changed by client)
        if (userRole === "client" && appt.lawyerId) {
          const title = `Appointment ${status} by client`;
          const description = `Client ${appt.clientName} ${status} the appointment scheduled for ${new Date(appt.appointmentDate).toLocaleDateString()}`;
          
          await createNotification(appt.lawyerId, title, description);
        }

      } catch (emailErr) {
        console.warn('Email/Notification send failed for appointment confirmation:', emailErr?.message || emailErr);
      }
    }
    try {
      // Emit realtime event to client room for this user
      const { io } = await import('../server.js');
      const targetUserId = (req.user.role === 'lawyer' || req.user.userType === 'lawyer') ? appt.clientId?.toString() : appt.lawyerId?.toString();
      if (io && targetUserId) {
        io.to(String(targetUserId)).emit('appointment:status', {
          id: appt._id.toString(),
          status: appt.status,
        });
        // Persist notification for target user
        const Notification = (await import('../models/Notification.js')).default;
        await Notification.create({ userId: targetUserId, title: `Appointment ${status}`, description: `Your appointment status changed to ${status}.` });
      }
    } catch (_) {}
    res.json({ appointment: appt });
  } catch (err) {
    console.error("updateAppointmentStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelAppointment = async (req, res) => {
  req.body.status = "cancelled";
  return updateAppointmentStatus(req, res);
};

// Get all lawyers
export const getAllLawyers = async (req, res) => {
  try {
    const User = (await import("../models/user.model.js")).default;
    const { status } = req.query;
    
    // Build query based on status filter
    let query = { userType: 'lawyer' };
    if (status) {
      query.status = status;
    }
    
    console.log('🔍 Debug - getAllLawyers query:', query);
    
    const lawyers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    console.log('🔍 Debug - Found lawyers:', lawyers.length);

    res.status(200).json({
      success: true,
      message: "Lawyers fetched successfully",
      lawyers
    });
  } catch (error) {
    console.error("getAllLawyers:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get lawyer by ID
export const getLawyerById = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const User = (await import("../models/user.model.js")).default;
    
    const lawyer = await User.findOne({ 
      _id: lawyerId, 
      userType: 'lawyer' 
    }).select('-password');

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lawyer fetched successfully",
      lawyer
    });
  } catch (error) {
    console.error("getLawyerById:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get available time slots for a lawyer on a specific date
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required"
      });
    }

    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    // Get existing appointments for this lawyer on this date
    const existingAppointments = await Appointment.find({
      lawyerId,
      appointmentDate: {
        $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(requestedDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Define available time slots
    const allTimeSlots = [
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00'
    ];

    // Filter out booked time slots
    const bookedSlots = existingAppointments.map(apt => apt.timeSlot);
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      message: "Available time slots fetched successfully",
      availableSlots,
      date: date
    });
  } catch (error) {
    console.error("getAvailableTimeSlots:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
