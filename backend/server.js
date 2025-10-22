// server.js
import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
// import rateLimit from "express-rate-limit";
import http from "http";
import createError from "http-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import { Server as SocketIOServer } from "socket.io";


// Import routes
import appointmentRoute from "./routes/appointments.js";
import authRoutes from "./routes/auth.routes.js";
import lawyerRoutes from "./routes/lawyer.routes.js";
import userRoute from "./routes/user.route.js";
import reminderRoutes from "./routes/reminder.routes.js";
import notificationRoutes from "./routes/notifications.js";
import { registerSocket } from "./socket.js";
import SchedulerService from "./services/schedulerService.js";

// Load env
dotenv.config();

const app = express();

// Security & middleware
app.set("trust proxy", 1);
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Static uploads dir
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (_) {}
}
app.use("/uploads", express.static(uploadsDir));

// Routes
app.get("/", (_req, res) => res.json({ ok: true }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/appointments", appointmentRoute);
app.use("/api/v1/reminders", reminderRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lawyers", lawyerRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// 404 handler
app.use((_req, _res, next) => next(createError(404, "Not found")));

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: { message: err.message || "Internal Server Error", status },
  });
});

// Server + Socket.IO
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  },
});
registerSocket(io);

  // DB connection
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/lawSphere";
let PORT = Number(process.env.PORT) || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    const masked = (MONGO_URI || "").replace(/:\/\/([^:]*):([^@]*)@/g, "://$1:***@");
    console.log("✅ MongoDB connected successfully →", masked || "<no uri>");
    
    // Initialize reminder scheduler
    SchedulerService.initialize();
    
    const startListening = () => {
      server.listen(PORT, () => {
        console.log(`✅ Server listening on http://localhost:${PORT}`);
      });
    };

    server.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        console.error(`⚠️ Port ${PORT} in use, trying ${PORT + 1}...`);
        PORT += 1;
        setTimeout(startListening, 100);
      } else {
        console.error("❌ HTTP server error:", err);
        process.exit(1);
      }
    });

    startListening();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
