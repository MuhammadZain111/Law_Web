import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// Idempotent model export for dev hot-reload
export const Lawyer = mongoose.models.Lawyer || mongoose.model("Lawyer", lawyerSchema);



