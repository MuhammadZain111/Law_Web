// services/schedulerService.js
import cron from 'node-cron';
import ReminderService from './reminderService.js';

/**
 * Scheduler Service for Automated Reminder Jobs
 */
export class SchedulerService {
  static jobs = new Map();

  /**
   * Initialize all scheduled jobs
   */
  static initialize() {
    console.log('🕐 Initializing reminder scheduler...');
    
    // Schedule 24-hour reminders - runs every hour at minute 0
    this.scheduleJob('24h-reminders', '0 * * * *', async () => {
      console.log('⏰ Running 24-hour reminder job...');
      await ReminderService.processReminders('24h');
    });

    // Schedule 2-hour reminders - runs every 30 minutes
    this.scheduleJob('2h-reminders', '*/30 * * * *', async () => {
      console.log('⏰ Running 2-hour reminder job...');
      await ReminderService.processReminders('2h');
    });

    // Schedule 30-minute reminders - runs every 15 minutes
    this.scheduleJob('30min-reminders', '*/15 * * * *', async () => {
      console.log('⏰ Running 30-minute reminder job...');
      await ReminderService.processReminders('30min');
    });

    // Schedule cleanup job - runs daily at 2 AM to clean up old reminders
    this.scheduleJob('cleanup-reminders', '0 2 * * *', async () => {
      console.log('🧹 Running reminder cleanup job...');
      await this.cleanupOldReminders();
    });

    console.log('✅ All reminder jobs scheduled successfully');
    this.logScheduledJobs();
  }

  /**
   * Schedule a cron job
   */
  static scheduleJob(name, cronExpression, task) {
    try {
      if (this.jobs.has(name)) {
        console.log(`⚠️ Job ${name} already exists, stopping previous instance`);
        this.jobs.get(name).stop();
      }

      const job = cron.schedule(cronExpression, task, {
        scheduled: false, // Don't start immediately
        timezone: process.env.TZ || 'UTC'
      });

      this.jobs.set(name, job);
      job.start();
      
      console.log(`✅ Scheduled job: ${name} (${cronExpression})`);
    } catch (error) {
      console.error(`❌ Error scheduling job ${name}:`, error);
    }
  }

  /**
   * Stop a specific job
   */
  static stopJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      console.log(`⏹️ Stopped job: ${name}`);
    } else {
      console.log(`⚠️ Job ${name} not found`);
    }
  }

  /**
   * Stop all jobs
   */
  static stopAllJobs() {
    console.log('⏹️ Stopping all scheduled jobs...');
    for (const [name, job] of this.jobs) {
      job.stop();
      console.log(`⏹️ Stopped job: ${name}`);
    }
    this.jobs.clear();
  }

  /**
   * Get status of all jobs
   */
  static getJobStatus() {
    const status = {};
    for (const [name, job] of this.jobs) {
      status[name] = {
        running: job.running,
        scheduled: job.scheduled
      };
    }
    return status;
  }

  /**
   * Log all scheduled jobs
   */
  static logScheduledJobs() {
    console.log('\n📋 Scheduled Reminder Jobs:');
    console.log('┌─────────────────────┬─────────────────┬─────────────────────────────────┐');
    console.log('│ Job Name            │ Schedule        │ Description                     │');
    console.log('├─────────────────────┼─────────────────┼─────────────────────────────────┤');
    console.log('│ 24h-reminders       │ 0 * * * *       │ Every hour - 24h reminders      │');
    console.log('│ 2h-reminders        │ */30 * * * *    │ Every 30 min - 2h reminders     │');
    console.log('│ 30min-reminders     │ */15 * * * *    │ Every 15 min - 30min reminders  │');
    console.log('│ cleanup-reminders   │ 0 2 * * *       │ Daily at 2 AM - cleanup         │');
    console.log('└─────────────────────┴─────────────────┴─────────────────────────────────┘\n');
  }

  /**
   * Clean up old reminders from completed/cancelled appointments
   */
  static async cleanupOldReminders() {
    try {
      const Appointment = (await import('../models/appointment.model.js')).default;
      
      // Find appointments that are completed, cancelled, or rejected
      // and are older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await Appointment.updateMany(
        {
          status: { $in: ['completed', 'cancelled', 'rejected'] },
          updatedAt: { $lt: sevenDaysAgo }
        },
        {
          $unset: { remindersSent: 1 }
        }
      );

      console.log(`🧹 Cleaned up reminders for ${result.modifiedCount} old appointments`);
    } catch (error) {
      console.error('❌ Error during reminder cleanup:', error);
    }
  }

  /**
   * Manually trigger a reminder job (for testing)
   */
  static async triggerReminderJob(reminderType) {
    console.log(`🔧 Manually triggering ${reminderType} reminder job...`);
    return await ReminderService.processReminders(reminderType);
  }

  /**
   * Get upcoming appointments for a user (for dashboard notifications)
   */
  static async getUpcomingAppointments(userId, userRole, hours = 24) {
    try {
      const Appointment = (await import('../models/appointment.model.js')).default;
      
      const now = new Date();
      const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

      const query = {
        status: { $in: ['confirmed', 'pending'] },
        appointmentDate: { $gte: now, $lte: futureTime }
      };

      if (userRole === 'client') {
        query.clientId = userId;
      } else if (userRole === 'lawyer') {
        query.lawyerId = userId;
      }

      const appointments = await Appointment.find(query)
        .populate('clientId', 'name email')
        .populate('lawyerId', 'name email')
        .sort({ appointmentDate: 1 });

      return appointments;
    } catch (error) {
      console.error('❌ Error getting upcoming appointments:', error);
      return [];
    }
  }
}

export default SchedulerService;






