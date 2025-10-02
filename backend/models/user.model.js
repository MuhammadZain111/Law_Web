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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
