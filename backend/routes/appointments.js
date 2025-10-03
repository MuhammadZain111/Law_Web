// routes/appointment.route.js
import express from "express";
import {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAllLawyers,
  getLawyerById,
  getAvailableTimeSlots
} from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/lawyers", getAllLawyers);
router.get("/lawyers/:lawyerId", getLawyerById);
router.get("/available-slots/:lawyerId", getAvailableTimeSlots);

// Protected routes (auth required)
// client books appointment
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
