import express from "express";
import fs from "fs";
import ImageKit from "imagekit";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getAllLawyers, getAllUsers, getProfile, getUserById, login, logout, register, updateProfile, updatePaymentMethods } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
// import { isAuthenticated } from "../middleware/isAuthenticated.js";
// import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/lawyers").get(getAllLawyers)
router.route("/").get(getAllUsers)
router.route("/profile").get(auth(), getProfile)
router.route("/profile").put(auth(), updateProfile)
router.route("/payment-methods").put(auth(), updatePaymentMethods)

// Fetch single user by id (used by profile/booking lookups)
router.route("/:id").get(getUserById);

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
    const imagekitAuth = imagekit.getAuthenticationParameters();
    return res.json({ ...imagekitAuth, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
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
    console.log("📤 Upload request received:", {
      hasFile: !!req.file,
      contentType: req.headers['content-type'],
      method: req.method,
      url: req.url
    });
    
    if (!req.file) {
      console.error("❌ No file in upload request");
      console.log("Request body keys:", Object.keys(req.body || {}));
      console.log("Request files:", req.files);
      return res.status(400).json({ message: "No file uploaded. Please ensure the file field is named 'file'." });
    }
    
    // Ensure uploads directory exists
    const uploadsDir = path.resolve("uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("📁 Created uploads directory:", uploadsDir);
    }
    
    const port = process.env.PORT || 5000;
    const base = process.env.BASE_URL || `http://localhost:${port}`;
    const url = `${base}/uploads/${req.file.filename}`;
    console.log("✅ File uploaded successfully:", {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: url
    });
    return res.json({ url });
  } catch (e) {
    console.error("❌ Local upload error:", e);
    console.error("Error stack:", e.stack);
    return res.status(500).json({ 
      message: "Failed to store file: " + (e.message || "Unknown error"),
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
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