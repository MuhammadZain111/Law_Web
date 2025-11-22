// routes/appointment.route.js
import express from "express";
import {
  cancelAppointment,
  createAppointment,
  getAllLawyers,
  getAppointment,
  getAvailableTimeSlots,
  getLawyerById,
  listAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/lawyers", getAllLawyers);
router.get("/lawyers/:lawyerId", getLawyerById);
router.get("/available-slots/:lawyerId", getAvailableTimeSlots);

// Booking: allow guests to create appointment (auth optional)
router.post("/", createAppointment);

// role-based list (client sees own, lawyer sees theirs, admin sees all)
router.get("/", auth(), listAppointments);

// details
router.get("/:id", auth(), getAppointment);


// status updates (lawyer/admin or client cancel)
router.patch("/:id/status", auth(), updateAppointmentStatus);

// convenience cancel
router.post("/:id/cancel", auth(), cancelAppointment);

export default router;
