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
