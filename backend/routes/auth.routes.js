import { Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = Router();

// Health
router.get("/health", (_req, res) => res.json({ ok: true }));

// Register admin
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password are required" });
    }
    const existing = await Admin.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Admin with this email already exists" });
    }
    const admin = new Admin({
      name,
      email: String(email).toLowerCase(),
      password,
      role: role && ["admin", "super_admin"].includes(role) ? role : "admin",
      isActive: true,
    });
    await admin.save();
    return res.status(201).json({
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      message: "Admin created",
    });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password are required" });
    const admin = await Admin.findOne({ email: String(email).toLowerCase() });
    if (!admin || !admin.isActive) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    admin.lastLogin = new Date();
    await admin.save();
    const payload = { sub: admin._id, role: admin.role, email: admin.email, name: admin.name };
    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    return res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout (stateless)
router.post("/logout", (_req, res) => res.json({ ok: true }));

export default router;


