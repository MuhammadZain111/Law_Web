import mongoose from "mongoose";

const connectDB = async () => {
  try {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bf96668a452d20d1b4d1da28d87ec342aa134ecb
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
<<<<<<< HEAD
=======
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
>>>>>>> newupdate
=======
>>>>>>> bf96668a452d20d1b4d1da28d87ec342aa134ecb
    process.exit(1);
  }
};

export default connectDB;
