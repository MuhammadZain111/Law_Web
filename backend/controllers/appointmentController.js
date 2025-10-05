// controllers/appointment.controller.js
import Appointment from "../models/appointment.model.js";
import mongoose from "mongoose";

// Create appointment
export const createAppointment = async (req, res) => {
  try {
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
    } = req.body;

    // Validate required fields
    if (
      !lawyerId ||
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !caseType ||
      !caseDescription ||
      !appointmentDate ||
      !timeSlot ||
      !consultationFee ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate date
    const dt = new Date(appointmentDate);
    if (isNaN(dt.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    // Get client ID from token (if available)
    const clientId = req.user?.id || req.user?.userId || null;

    // Validate lawyerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lawyer ID",
      });
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
      status: "pending",
      paymentStatus: "unpaid",
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (err) {
    console.error("createAppointment:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// List appointments (role-aware)
export const listAppointments = async (req, res) => {
  try {
    const q = {};
    const userId = req.user?.userId || req.user?.id;
    const userRole = req.user?.role || req.user?.userType;

    if (userRole === "client") q.clientId = userId;
    if (userRole === "lawyer") q.lawyerId = userId;

    const appointments = await Appointment.find(q)
      .populate("clientId", "name email")
      .populate("lawyerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (err) {
    console.error("listAppointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single appointment with access control
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

    const role = req.user?.role || req.user?.userType;
    const me = (req.user?.id || req.user?.userId || "").toString();

    if (role === "client" && appt.clientId?._id?.toString() !== me) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (role === "lawyer" && appt.lawyerId?._id?.toString() !== me) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ appointment: appt });
  } catch (err) {
    console.error("getAppointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update appointment status (lawyer/client rules)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "rejected", "completed", "cancelled"];

    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: "Not found" });

    const userId = req.user?.userId || req.user?.id;
    const userRole = req.user?.role || req.user?.userType;
    if (userRole === "lawyer" && appt.lawyerId.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (userRole === "client" && status !== "cancelled") {
      return res.status(403).json({ message: "Clients can only cancel" });
    }

    appt.status = status;
    await appt.save();

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

// Get all lawyers (simple)
export const getAllLawyers = async (req, res) => {
  try {
    const User = (await import("../models/user.model.js")).default;
    const lawyers = await User.find({ userType: "lawyer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lawyers fetched successfully",
      lawyers,
    });
  } catch (error) {
    console.error("getAllLawyers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get lawyer by ID
export const getLawyerById = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lawyer ID",
      });
    }

    const User = (await import("../models/user.model.js")).default;
    const lawyer = await User.findOne({
      _id: lawyerId,
      userType: "lawyer",
    }).select("-password");

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lawyer fetched successfully",
      lawyer,
    });
  } catch (error) {
    console.error("getLawyerById:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get available time slots
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Get existing appointments for this lawyer on this date
    const start = new Date(requestedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(requestedDate);
    end.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      lawyerId,
      appointmentDate: { $gte: start, $lt: end },
      status: { $in: ["pending", "confirmed"] },
    });

    const allTimeSlots = [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
    ];

    const bookedSlots = existingAppointments.map((apt) => apt.timeSlot);
    const availableSlots = allTimeSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      message: "Available time slots fetched successfully",
      availableSlots,
      date,
    });
  } catch (error) {
    console.error("getAvailableTimeSlots:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};