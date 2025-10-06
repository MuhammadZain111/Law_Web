// middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
      req.user = payload || {};

      // Normalize id field for downstream consumers
      req.user.id = req.user.id || req.user.userId;

      // Ensure role/userType is available on req.user.
      // If token doesn't carry it, fetch minimal user info from DB.
      if (!req.user.role && !req.user.userType && req.user.id) {
        try {
          const User = (await import("../models/user.model.js")).default;
          const userDoc = await User.findById(req.user.id).select("userType");
          if (userDoc) {
            req.user.userType = userDoc.userType; // e.g., 'lawyer' | 'client' | 'admin'
          }
        } catch (fetchErr) {
          // If we fail to fetch user role, proceed without it; route handlers may handle accordingly
          // But do not block the request solely due to this lookup
        }
      }

      // If specific roles were required, enforce them using either role or userType
      const effectiveRole = req.user.role || req.user.userType;
      if (roles.length && !roles.includes(effectiveRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Standalone middleware
export function requireAuth(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    next();
  } catch (_e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

export function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });
}

export default auth;
