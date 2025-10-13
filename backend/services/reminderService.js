// services/reminderService.js
import Appointment from "../models/appointment.model.js";
import { sendEmail } from "../utils/mailer.js";

/**
 * Reminder Service for Automated Appointment Reminders
 */
export class ReminderService {
  
  /**
   * Send reminder email for upcoming appointment
   */
  static async sendReminderEmail(appointment, reminderType) {
    try {
      const { subject, html, text } = this.buildReminderEmail(appointment, reminderType);
      
      const result = await sendEmail({
        to: appointment.clientEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        console.log(`✅ Reminder email sent successfully for appointment ${appointment._id} (${reminderType})`);
        return { success: true, messageId: result.messageId };
      } else {
        console.error(`❌ Failed to send reminder email for appointment ${appointment._id}:`, result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error(`❌ Error sending reminder email for appointment ${appointment._id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Build reminder email content based on type
   */
  static buildReminderEmail(appointment, reminderType) {
    const clientName = appointment.clientName || "Client";
    const lawyerName = appointment.lawyerId?.name || "your lawyer";
    const appointmentDate = new Date(appointment.appointmentDate);
    const dateStr = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = appointment.timeSlot || 'Time not specified';
    const caseType = appointment.caseType || 'Legal Consultation';

    let subject, urgency, timeUntil;
    
    switch (reminderType) {
      case '24h':
        subject = `Reminder: Your appointment is tomorrow - ${dateStr}`;
        urgency = 'gentle';
        timeUntil = '24 hours';
        break;
      case '2h':
        subject = `Reminder: Your appointment is in 2 hours - ${dateStr}`;
        urgency = 'important';
        timeUntil = '2 hours';
        break;
      case '30min':
        subject = `Final Reminder: Your appointment starts in 30 minutes`;
        urgency = 'urgent';
        timeUntil = '30 minutes';
        break;
      default:
        subject = `Appointment Reminder - ${dateStr}`;
        urgency = 'gentle';
        timeUntil = 'soon';
    }

    const text = `Hello ${clientName},

This is a ${urgency} reminder that you have an appointment ${timeUntil}.

Appointment Details:
- Date: ${dateStr}
- Time: ${timeStr}
- Lawyer: ${lawyerName}
- Case Type: ${caseType}
${appointment.meetingLink ? `- Meeting Link: ${appointment.meetingLink}` : ''}

${reminderType === '30min' ? 'Please join the meeting now or contact your lawyer if you need to reschedule.' : 'Please make sure you are prepared and arrive on time.'}

If you need to reschedule or have any questions, please contact your lawyer directly.

Best regards,
Legal Practice Team`;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <div style="background: ${urgency === 'urgent' ? '#ff4444' : urgency === 'important' ? '#ff8800' : '#4CAF50'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${reminderType === '30min' ? '🔔 Final Reminder' : '📅 Appointment Reminder'}</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${clientName}</strong>,</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${urgency === 'urgent' ? '#ff4444' : urgency === 'important' ? '#ff8800' : '#4CAF50'};">
          <p style="margin: 0 0 15px; font-size: 18px; color: ${urgency === 'urgent' ? '#ff4444' : urgency === 'important' ? '#ff8800' : '#333'};">
            ${reminderType === '30min' ? 'Your appointment starts in 30 minutes!' : `Your appointment is ${timeUntil}.`}
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px; color: #333;">Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Date:</td>
              <td style="padding: 8px 0;">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Time:</td>
              <td style="padding: 8px 0;">${timeStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Lawyer:</td>
              <td style="padding: 8px 0;">${lawyerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Case Type:</td>
              <td style="padding: 8px 0;">${caseType}</td>
            </tr>
            ${appointment.meetingLink ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Meeting Link:</td>
              <td style="padding: 8px 0;"><a href="${appointment.meetingLink}" style="color: #4CAF50; text-decoration: none;">Join Meeting</a></td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background: ${urgency === 'urgent' ? '#fff3cd' : '#e7f3ff'}; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid ${urgency === 'urgent' ? '#ffeaa7' : '#b3d9ff'};">
          <p style="margin: 0; color: ${urgency === 'urgent' ? '#856404' : '#004085'};">
            ${reminderType === '30min' 
              ? '🚨 Please join the meeting now or contact your lawyer if you need to reschedule.' 
              : 'Please make sure you are prepared and arrive on time.'}
          </p>
        </div>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you need to reschedule or have any questions, please contact your lawyer directly.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
          Best regards,<br>
          <strong>Legal Practice Team</strong>
        </p>
      </div>
    </div>`;

    return { subject, html, text };
  }

  /**
   * Get appointments that need reminders
   */
  static async getAppointmentsNeedingReminders(reminderType) {
    const now = new Date();
    let targetTime;

    switch (reminderType) {
      case '24h':
        targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case '2h':
        targetTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        break;
      case '30min':
        targetTime = new Date(now.getTime() + 30 * 60 * 1000);
        break;
      default:
        throw new Error('Invalid reminder type');
    }

    // Find appointments that:
    // 1. Are confirmed or pending
    // 2. Are scheduled for the target time (within 1 hour window)
    // 3. Haven't had this type of reminder sent yet
    // 4. Have email reminders enabled
    const startTime = new Date(targetTime.getTime() - 30 * 60 * 1000); // 30 minutes before
    const endTime = new Date(targetTime.getTime() + 30 * 60 * 1000);   // 30 minutes after

    const appointments = await Appointment.find({
      status: { $in: ['confirmed', 'pending'] },
      appointmentDate: { $gte: startTime, $lte: endTime },
      remindersSent: { $ne: reminderType },
      'reminderPreferences.emailReminders': true
    }).populate('lawyerId', 'name email');

    return appointments;
  }

  /**
   * Mark reminder as sent
   */
  static async markReminderSent(appointmentId, reminderType) {
    try {
      await Appointment.findByIdAndUpdate(
        appointmentId,
        { $addToSet: { remindersSent: reminderType } }
      );
      console.log(`✅ Marked ${reminderType} reminder as sent for appointment ${appointmentId}`);
    } catch (error) {
      console.error(`❌ Error marking reminder as sent for appointment ${appointmentId}:`, error);
    }
  }

  /**
   * Process all pending reminders for a specific type
   */
  static async processReminders(reminderType) {
    try {
      console.log(`🔄 Processing ${reminderType} reminders...`);
      
      const appointments = await this.getAppointmentsNeedingReminders(reminderType);
      console.log(`📋 Found ${appointments.length} appointments needing ${reminderType} reminders`);

      let successCount = 0;
      let errorCount = 0;

      for (const appointment of appointments) {
        const result = await this.sendReminderEmail(appointment, reminderType);
        
        if (result.success) {
          await this.markReminderSent(appointment._id, reminderType);
          successCount++;
        } else {
          errorCount++;
        }
      }

      console.log(`✅ ${reminderType} reminders processed: ${successCount} sent, ${errorCount} failed`);
      return { successCount, errorCount, total: appointments.length };
    } catch (error) {
      console.error(`❌ Error processing ${reminderType} reminders:`, error);
      return { successCount: 0, errorCount: 0, total: 0, error: error.message };
    }
  }
}

export default ReminderService;







