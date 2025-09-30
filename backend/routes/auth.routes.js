import { Router } from "express";

const router = Router();

// Minimal placeholder routes to satisfy imports
router.get("/health", (_req, res) => res.json({ ok: true }));

export default router;


