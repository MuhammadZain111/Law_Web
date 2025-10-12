// models/appointment.model.js
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Client Information
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientAddress: String,
  clientCity: String,
  clientAge: String,
  clientGender: String,
  
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
  consultationType: String,
  urgency: { type: String, default: 'Normal' },
  previousLawyer: String,
  caseStatus: { type: String, default: 'New' },
  specialRequirements: String,
  
  // Appointment Details
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  durationMinutes: { type: Number, default: 60 },
  
  // Payment Information
  consultationFee: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['EasyPaisa', 'JazzCash', 'Bank Transfer', 'Cash on Meeting', 'Credit Card', 'easypaisa', 'jazzcash', 'bank'],
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
  
  // Document Fields
  documents: String, // Text description of documents
  documentFiles: {
    type: [{
      name: { type: String, required: true },
      size: { type: Number, required: true },
      type: { type: String, required: true },
      lastModified: { type: Number, required: true },
      url: { type: String, required: false } // File URL for viewing/downloading
    }],
    default: []
  }, // Array of uploaded file metadata
  
  // Reminder Fields
  remindersSent: {
    type: [String],
    default: []
  }, // Array of reminder types sent: ['24h', '2h', '30min']
  reminderPreferences: {
    emailReminders: { type: Boolean, default: true },
    smsReminders: { type: Boolean, default: false },
    reminderIntervals: { 
      type: [String], 
      default: ['24h', '2h'] // 24 hours and 2 hours before
    }
  }
}, { timestamps: true });

export default mongoose.model("Appointment", AppointmentSchema);
