import { Router } from "express";

const router = Router();

// Health check
router.get("/health", (_req, res) => res.json({ ok: true }));

// Notifications list for current lawyer (placeholder)
router.get("/me/notifications", (_req, res) => {
  const demoNotifications = [
    { id: "n1", title: "New appointment", read: false, createdAt: new Date().toISOString() },
    { id: "n2", title: "Profile approved", read: true, createdAt: new Date().toISOString() },
  ];
  res.json(demoNotifications);
});

// Submit or update lawyer profile (placeholder)
router.post("/profile", (req, res) => {
  const profile = req.body || {};
  res.status(201).json({ message: "Profile received", profile });
});

export default router;


