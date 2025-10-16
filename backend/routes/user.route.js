import express from "express";
import ImageKit from "imagekit";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getAllLawyers, getProfile, getUserById, login, logout, register, updateProfile, updatePaymentMethods } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/lawyers").get(getAllLawyers)
router.route("/profile").get(auth(), getProfile)
router.route("/profile").put(auth(), updateProfile)
router.route("/payment-methods").put(auth(), updatePaymentMethods)

console.log("[v0] ImageKit keys check:", {
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

router.get("/imagekit-auth", async (_req, res) => {
  try {
    const imagekit = new ImageKit({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
    
    if (!process.env.IMAGEKIT_URL_ENDPOINT || !process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
      return res.status(500).json({ message: "ImageKit is not configured on server" });
    }
    const auth = imagekit.getAuthenticationParameters();
    return res.json({ ...auth, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to create ImageKit signature" });
  }
});

// Keep this after fixed routes to avoid capturing known paths like /imagekit-auth
router.route("/:id").get(getUserById)

// Local upload fallback (stores file on server and returns a URL)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.resolve("uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

router.post("/upload-local", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const port = process.env.PORT || 5000;
    const base = process.env.BASE_URL || `http://localhost:${port}`;
    const url = `${base}/uploads/${req.file.filename}`;
    return res.json({ url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to store file" });
  }
});

// Notifications - persistent
router.get('/notifications', auth(), async (req, res) => {
  try {
    const Notification = (await import('../models/Notification.js')).default;
    const items = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, notifications: items });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

router.post('/notifications', auth(), async (req, res) => {
  try {
    const Notification = (await import('../models/Notification.js')).default;
    const { title, description } = req.body;
    const item = await Notification.create({ userId: req.user.id, title, description });
    res.status(201).json({ success: true, notification: item });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

router.post('/notifications/mark-read', auth(), async (req, res) => {
  try {
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.updateMany({ userId: req.user.id, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

export default router;