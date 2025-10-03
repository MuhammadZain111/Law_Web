<<<<<<< HEAD
import express from "express"
import { getAllUsers, getAllLawyers, getProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js"
import auth from "../middleware/auth.js";
import { sendEmail } from "../utils/mailer.js";
import ImageKit from "imagekit";
=======
import express from "express";
import ImageKit from "imagekit";
import { getUserById, login, logout, register } from "../controllers/user.controller.js";
>>>>>>> origin/UI
// import { isAuthenticated } from "../middleware/isAuthenticated.js"
// import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
 router.route("/login").post(login)
 router.route("/logout").get(logout)
<<<<<<< HEAD
 router.route("/lawyers").get(getAllLawyers)
 router.route("/profile").get(auth(), getProfile)
 router.get('/email-test', async (req, res) => {
  try {
    const to = req.query.to;
    if (!to) return res.status(400).json({ success: false, message: 'Provide ?to=email@example.com' });
    const result = await sendEmail({ to, subject: 'SMTP Test', text: 'Test email from Legal Practice', html: '<b>Test email from Legal Practice</b>' });
    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, message: e?.message || 'Failed to send test email' });
  }
 })
=======
 router.route("/:id").get(getUserById)
>>>>>>> origin/UI

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