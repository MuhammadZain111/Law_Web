import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    userType: {
      type: String,
      required: true,
      enum: ["user", "lawyer"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Regular users are approved by default; lawyers set to 'pending' at registration
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },
    occupation: {
      type: String,
      default: "",
      trim: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    socialMedia: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    nationalIdNumber: {
      type: String,
      default: "",
      trim: true,
    },
    nationalIdFrontUrl: {
      type: String,
      default: "",
    },
    nationalIdBackUrl: {
      type: String,
      default: "",
    },
    paymentMethods: {
      jazzcash: {
        accountNumber: { type: String, default: "" },
        accountName: { type: String, default: "" },
        enabled: { type: Boolean, default: false }
      },
      easypaisa: {
        accountNumber: { type: String, default: "" },
        accountName: { type: String, default: "" },
        enabled: { type: Boolean, default: false }
      },
      bankTransfer: {
        bankName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
        accountName: { type: String, default: "" },
        iban: { type: String, default: "" },
        enabled: { type: Boolean, default: false }
      }
    },
  },
  { timestamps: true }
);

// Idempotent export to avoid model overwrite on hot reload

const User = mongoose.models.User || mongoose.model("User", userSchema);



export default User;
