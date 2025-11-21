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
      enum: ['user', 'lawyer'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Regular users are approved by default
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // at least 6 characters
      select: false, // by default password query me return nahi hoga
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
    // Lawyer-specific fields (also stored in User model for backup)
    barNumber: {
      type: String,
      default: "",
      trim: true,
    },
    specialization: {
      type: String,
      default: "",
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    firmName: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    phoneCountryCode: {
      type: String,
      default: "+92",
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    cnicNumber: {
      type: String,
      default: "",
      trim: true,
    },
    licenseUrl: {
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

const User = mongoose.model("User", userSchema);

export default User;
