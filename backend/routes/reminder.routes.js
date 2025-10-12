// routes/reminder.routes.js
import express from "express";
import { 
  getUpcomingAppointments,
  updateReminderPreferences,
  sendManualReminder,
  getSchedulerStatus,
  triggerReminderJob,
  getReminderStats
} from "../controllers/reminderController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get upcoming appointments for the current user
router.get("/upcoming", getUpcomingAppointments);

// Update reminder preferences for an appointment
router.patch("/preferences/:appointmentId", updateReminderPreferences);

// Send manual reminder (lawyer/admin only)
router.post("/send/:appointmentId", sendManualReminder);

// Admin routes
router.get("/admin/status", getSchedulerStatus);
router.post("/admin/trigger", triggerReminderJob);
router.get("/admin/stats", getReminderStats);

export default router;
