<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import appointmentRoute from "./routes/appointments.js";

dotenv.config({ path: './.env' }); // load variables from .env
// Prefer IPv4 to avoid some resolver issues on Windows/corporate networks
dns.setDefaultResultOrder('ipv4first');
// Optionally override DNS servers if local resolver can't resolve SRV/TXT (set FORCE_PUBLIC_DNS=true)
if (process.env.FORCE_PUBLIC_DNS === 'true') {
  try {
    const servers = (process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (servers.length > 0) {
      dns.setServers(servers);
      console.log("🧭 Using custom DNS servers:", servers.join(", "));
    }
  } catch (e) {
    console.warn("⚠️ Failed to set custom DNS servers:", e?.message || e);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// We'll connect to MongoDB during server bootstrap (before starting the HTTP server)

// CORS middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  credentials: true,
}));

// parse JSON bodies
app.use(express.json());

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/appointments", appointmentRoute);

// health check
app.get("/", (req, res) => {
  res.send("🚀 Server is running & DB connected!");
});

// Start server only after a successful DB connection
async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🚫 Server startup aborted due to DB connection failure.");
    process.exit(1);
  }
}

bootstrap();
=======
// server.js
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Rate limiting disabled temporarily for Express v5 compatibility
// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
// app.use("/api/", limiter);

// Routes
app.get("/", (_req, res) => res.json({ ok: true }));
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
const PORT = process.env.PORT || 3000;

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
>>>>>>> origin/UI
