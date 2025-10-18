import express from "express";
import ImageKit from "imagekit";
import { getUserById, login, logout, register } from "../controllers/user.controller.js";
// import { isAuthenticated } from "../middleware/isAuthenticated.js";
// import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Fetch single user by id (used by profile/booking lookups)
router.route("/:id").get(getUserById);

// ImageKit signature endpoint (for client-side direct uploads)
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
    return res.json(auth);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to create ImageKit signature" });
  }
});

export default router;