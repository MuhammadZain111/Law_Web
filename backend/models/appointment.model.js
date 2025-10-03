// models/appointment.model.js
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Client Information
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  
  // Case Information
  caseType: { 
    type: String, 
    required: true,
    enum: [
      'Criminal Law',
      'Family Law', 
      'Civil Litigation',
      'Corporate Law',
      'Property Law',
      'Immigration Law',
      'Tax Law',
      'Employment Law'
    ]
  },
  caseDescription: { type: String, required: true },
  
  // Appointment Details
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  durationMinutes: { type: Number, default: 60 },
  
  // Payment Information
  consultationFee: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['easypaisa', 'jazzcash', 'bank'],
    required: true 
  },
  paymentScreenshot: { type: String }, // File path or URL
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid",
  },
  
  // Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  
  // Additional Fields
  notes: String,
  meetingLink: String,
  lawyerNotes: String, // Notes from lawyer
}, { timestamps: true });

export default mongoose.model("Appointment", AppointmentSchema);
