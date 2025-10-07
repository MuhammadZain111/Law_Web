import { Router } from "express";
import { Lawyer } from "../models/Lawyer.js";
import User from "../models/user.model.js";

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

// Create or update a lawyer profile as pending (called on signup/profile submission)
router.post("/profile", async (req, res) => {
  try {
    const body = req.body || {};
    // Upsert based on userId if provided, otherwise create new
    const filter = body.userId ? { userId: body.userId } : { barNumber: body.barNumber };
    const update = {
      ...body,
      status: "pending",
    };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const doc = await Lawyer.findOneAndUpdate(filter, update, options);
    return res.status(201).json({ message: "Profile submitted for approval", lawyer: doc });
  } catch (e) {
    console.error("Lawyer profile submit error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List lawyers by status (admin view): /api/lawyers?status=pending|approved
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userType: 'lawyer' };
    if (status) {
      query.status = status;
    }
    
    // Get users with lawyer type and specified status
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    // Get lawyer profiles for these users
    const userIds = users.map(u => u._id);
    const lawyerProfiles = await Lawyer.find({ userId: { $in: userIds } });
    
    // Combine user data with lawyer profile data
    const list = users.map(user => {
      const profile = lawyerProfiles.find(p => p.userId.toString() === user._id.toString());
      return {
        _id: user._id,
        userId: user._id,
        email: user.email,
        fullName: profile?.fullName || `${user.firstname} ${user.lastname}`,
        barNumber: profile?.barNumber || '',
        specialization: profile?.specialization || '',
        yearsOfExperience: profile?.yearsOfExperience || 0,
        city: profile?.city || '',
        state: profile?.state || '',
        country: profile?.country || '',
        photoUrl: profile?.photoUrl || user.photoUrl || '',
        status: user.status,
        rejectionReason: profile?.rejectionReason || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    });
    
    return res.json(list);
  } catch (e) {
    console.error("Lawyer list error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Approve a lawyer profile
router.post("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update user status to approved
    const updatedUser = await User.findByIdAndUpdate(id, { status: "approved" }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ error: "Lawyer not found" });
    
    // Also update lawyer profile if it exists
    await Lawyer.findOneAndUpdate({ userId: id }, { status: "approved", rejectionReason: undefined }, { new: true });
    
    return res.json({ message: "Approved", lawyer: updatedUser });
  } catch (e) {
    console.error("Lawyer approve error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Reject a lawyer profile
router.post("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};
    
    // Update user status to rejected
    const updatedUser = await User.findByIdAndUpdate(id, { status: "rejected" }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ error: "Lawyer not found" });
    
    // Also update lawyer profile if it exists
    await Lawyer.findOneAndUpdate({ userId: id }, { status: "rejected", rejectionReason: reason || "" }, { new: true });
    
    return res.json({ message: "Rejected", lawyer: updatedUser });
  } catch (e) {
    console.error("Lawyer reject error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;


