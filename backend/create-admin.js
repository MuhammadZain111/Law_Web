import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/lawSphere";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
      isActive: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
