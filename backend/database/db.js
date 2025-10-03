import mongoose from "mongoose";

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // Add mongoose connection options appropriate for modern drivers
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4 // prefer IPv4
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    // Mask credentials if present in the URI
    const maskedUri = (process.env.MONGODB_URI || "").replace(/:\/\/([^:]*):([^@]*)@/g, "://$1:***@");
    console.error("❌ MongoDB connection error:", error.message, "URI:", maskedUri || "<empty>");
=======
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
>>>>>>> origin/UI
    process.exit(1);
  }
};

export default connectDB;
