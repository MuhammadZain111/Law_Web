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
    console.log("Creating lawyer profile:", { userId: body.userId, fullName: body.fullName, barNumber: body.barNumber });
    
    // Upsert based on userId if provided, otherwise create new
    const filter = body.userId ? { userId: body.userId } : { barNumber: body.barNumber };
    const update = {
      ...body,
      status: "pending",
    };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const doc = await Lawyer.findOneAndUpdate(filter, update, options);
    console.log("Lawyer profile created/updated:", doc);
    return res.status(201).json({ message: "Profile submitted for approval", lawyer: doc });
  } catch (e) {
    console.error("Lawyer profile submit error:", e);
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: e.message });
    }
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
      console.log(`User ${user._id}:`, { 
        hasProfile: !!profile, 
        profileData: profile ? {
          fullName: profile.fullName,
          barNumber: profile.barNumber,
          specialization: profile.specialization,
          yearsOfExperience: profile.yearsOfExperience,
          city: profile.city,
          phone: profile.phone,
          firmName: profile.firmName,
          cnicNumber: profile.cnicNumber,
          licenses: profile.licenses?.length || 0,
          documents: profile.documents?.length || 0
        } : null
      });
      
      return {
        _id: user._id,
        userId: user._id,
        email: user.email,
        fullName: profile?.fullName || `${user.firstname} ${user.lastname}`,
        barNumber: profile?.barNumber || '',
        specialization: profile?.specialization || '',
        yearsOfExperience: profile?.yearsOfExperience !== undefined ? profile.yearsOfExperience : (user.yearsOfExperience || 0),
        city: profile?.city || '',
        state: profile?.state || '',
        country: profile?.country || '',
        phone: profile?.phone || '',
        photoUrl: profile?.photoUrl || user.photoUrl || '',
        firmName: profile?.firmName || '',
        cnicNumber: profile?.cnicNumber || '',
        submittedDocuments: (profile?.licenses?.length || 0) + (profile?.documents?.length || 0),
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

// Get a lawyer's full profile for review (including documents)
router.get("/:id/review", async (req, res) => {
  try {
    const { id } = req.params; // userId
    const profile = await Lawyer.findOne({ userId: id }).lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    const payload = {
      userId: id,
      fullName: profile.fullName,
      barNumber: profile.barNumber,
      specialization: profile.specialization,
      yearsOfExperience: profile.yearsOfExperience,
      firmName: profile.firmName,
      city: profile.city,
      cnicNumber: profile.cnicNumber,
      licenses: profile.licenses || [],
      documents: profile.documents || [],
    };
    return res.json(payload);
  } catch (e) {
    console.error("Lawyer documents fetch error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Approve a lawyer profile
router.post("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure profile has sufficient information before approval
    const profile = await Lawyer.findOne({ userId: id }).lean();
    if (!profile) return res.status(404).json({ error: "Lawyer profile not found" });

    const missing = [];
    if (!profile.fullName) missing.push("fullName");
    if (!profile.barNumber) missing.push("barNumber");
    if (!profile.specialization) missing.push("specialization");
    if (profile.yearsOfExperience === undefined || profile.yearsOfExperience === null) missing.push("yearsOfExperience");
    if (!profile.city) missing.push("city");
    if (!profile.cnicNumber) missing.push("cnicNumber");
    if (!profile.phone || profile.phone.length < 10) missing.push("phone (10+ digits)");
    const totalDocs = (profile.licenses?.length || 0) + (profile.documents?.length || 0);
    if (totalDocs === 0) missing.push("documents/licenses");

    if (missing.length) {
      return res.status(400).json({
        error: "Profile is incomplete. Cannot approve.",
        missing,
      });
    }

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


