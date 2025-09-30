// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import http from "http";
import createError from "http-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import { Server as SocketIOServer } from "socket.io";
import xssClean from "xss-clean";

// Import routes
import userRoute from "./routes/user.route.js";
import appointmentRoute from "./routes/appointments.js";
import authRoutes from "./routes/auth.routes.js";
import lawyerRoutes from "./routes/lawyer.routes.js";
import { registerSocket } from "./socket.js";

// Load env
dotenv.config();

// Debug: print environment variables
console.log("Environment variables:");
console.log({
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
});

const app = express();

// Security & middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    const allowed = (process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ]).map(o => o.trim());

    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(xssClean());
app.use(hpp());
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api/", limiter);

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/appointments", appointmentRoute);
app.use("/api/auth", authRoutes);
app.use("/api/lawyers", lawyerRoutes);

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
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lawyer_admin";
const PORT = process.env.PORT || 5000;

// Debug: print which DB URI will be used
console.log("Attempting to connect to MongoDB at:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connection established successfully!");
    server.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
