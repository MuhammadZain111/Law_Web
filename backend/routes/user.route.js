import express from "express"
import { getAllUsers, login, logout, register, updateProfile } from "../controllers/user.controller.js"
import ImageKit from "imagekit";
// import { isAuthenticated } from "../middleware/isAuthenticated.js"
// import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
 router.route("/login").post(login)
 router.route("/logout").get(logout)

// ImageKit signature endpoint (for client-side direct uploads)
router.get("/imagekit-auth", async (_req, res) => {
  try {
    const imagekit = new ImageKit({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
    const auth = imagekit.getAuthenticationParameters();
    return res.json(auth);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to create ImageKit signature" });
  }
});


export default router;