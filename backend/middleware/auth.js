// middleware/auth.js
import jwt from "jsonwebtoken";



// Role-aware auth middleware: auth(['admin']) or auth(['lawyer']) or auth()

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.token;

    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
      req.user = payload || {};

      // Normalize id field for downstream consumers
      req.user.id = req.user.id || req.user.userId;

      // Ensure role/userType is available on req.user
      // Ensure role/userType is available on req.user.
      // If token doesn't carry it, fetch minimal user info from DB.
      
      if (!req.user.role && !req.user.userType && req.user.id) {
        try {
          const User = (await import("../models/user.model.js")).default;
          const userDoc = await User.findById(req.user.id).select("userType");
          if (userDoc) {
            req.user.userType = userDoc.userType; // e.g., 'lawyer' | 'user' | 'admin'
          }
        } catch (_err) {
          // Non-fatal; route handlers can still decide based on available info
        }
      }

      // If specific roles were required, enforce them using either role or userType
      const effectiveRole = req.user.role || req.user.userType;
      if (roles.length && !roles.includes(effectiveRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }



      next();
    } catch (_err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Simple helpers (optional) for routes that want a minimal check

export function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    next();
  } catch (_e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireAdmin(req, res, next) {
  const role = req.user?.role || req.user?.userType;
  if (role !== "admin") {
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






