import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    barNumber: { type: String, required: true, trim: true, unique: true },
    specialization: { type: String, required: true, trim: true },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    firmName: { type: String, trim: true },
    phoneCountryCode: { type: String, trim: true, default: '+92' },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    cnicNumber: { type: String, trim: true },
    licenses: [{ name: String, url: String }],
    documents: [{ name: String, url: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    rejectionReason: { type: String }
=======
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, trim: true },
    barNumber: { type: String, trim: true },
    specialization: { type: String, trim: true },
    yearsOfExperience: { type: Number, default: 0 },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    documents: [{ type: String }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String, trim: true },
>>>>>>> c6f8526e07d7162144cd0716876751c0573db4cf
  },
  { timestamps: true }
);

// Idempotent model export for dev hot-reload
export const Lawyer = mongoose.models.Lawyer || mongoose.model("Lawyer", lawyerSchema);



