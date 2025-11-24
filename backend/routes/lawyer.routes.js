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
    console.log("📝 Creating/updating lawyer profile:", { 
      userId: body.userId, 
      fullName: body.fullName, 
      barNumber: body.barNumber,
      specialization: body.specialization,
      city: body.city,
      phone: body.phone,
      cnicNumber: body.cnicNumber,
      licensesCount: body.licenses?.length || 0,
      documentsCount: body.documents?.length || 0
    });
    
    // Check for duplicate barNumber if it's a new profile (no userId) or if barNumber is being changed
    if (body.barNumber) {
      const existingLawyer = await Lawyer.findOne({ barNumber: body.barNumber.trim() });
      // If existing lawyer found and it's not the same user, return error
      if (existingLawyer && (!body.userId || existingLawyer.userId.toString() !== body.userId.toString())) {
        return res.status(400).json({ 
          error: "Duplicate bar number", 
          message: `Bar Number ${body.barNumber.trim()} is already registered. Please use a different bar number or contact support if this is an error.` 
        });
      }
    }
    
    // Upsert based on userId if provided, otherwise create new
    const filter = body.userId ? { userId: body.userId } : { barNumber: body.barNumber };
    const update = {
      ...body,
      status: "pending",
    };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    
    try {
      const doc = await Lawyer.findOneAndUpdate(filter, update, options);
      console.log("✅ Lawyer profile created/updated:", {
        _id: doc?._id,
        userId: doc?.userId,
        fullName: doc?.fullName,
        barNumber: doc?.barNumber,
        specialization: doc?.specialization,
        city: doc?.city,
        phone: doc?.phone
      });
      return res.status(201).json({ message: "Profile submitted for approval", lawyer: doc });
    } catch (updateError) {
      // Handle duplicate key error from MongoDB
      if (updateError.code === 11000 || (updateError.message && updateError.message.includes('duplicate key'))) {
        return res.status(400).json({ 
          error: "Duplicate bar number", 
          message: `Bar Number ${body.barNumber?.trim() || 'provided'} is already registered. Please use a different bar number or contact support if this is an error.` 
        });
      }
      throw updateError;
    }
  } catch (e) {
    console.error("❌ Lawyer profile submit error:", e);
    if (e.name === 'ValidationError') {
      console.error("Validation errors:", e.errors);
      return res.status(400).json({ error: "Validation error", details: e.message, errors: e.errors });
    }
    // Check for duplicate key error
    if (e.code === 11000 || (e.message && e.message.includes('duplicate key'))) {
      return res.status(400).json({ 
        error: "Duplicate bar number", 
        message: `Bar Number is already registered. Please use a different bar number or contact support if this is an error.` 
      });
    }
    return res.status(500).json({ error: "Internal server error", message: e.message });
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
    
    // Combine user data with lawyer profile data (prefer profile, fallback to user)
    const list = users.map(user => {
      const profile = lawyerProfiles.find(p => p.userId.toString() === user._id.toString());
      const fullName = profile?.fullName || (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}`.trim() : user.fullName || '');
      
      console.log(`User ${user._id}:`, { 
        hasProfile: !!profile,
        fullName: fullName,
        barNumber: profile?.barNumber || user.barNumber || '',
        specialization: profile?.specialization || user.specialization || '',
        city: profile?.city || user.city || '',
        phone: profile?.phone || user.phone || '',
        cnicNumber: profile?.cnicNumber || user.cnicNumber || '',
        licenses: (profile?.licenses?.length || 0) + (user.licenseUrl ? 1 : 0)
      });
      
      return {
        _id: user._id,
        userId: user._id,
        email: user.email,
        fullName: fullName,
        barNumber: profile?.barNumber || user.barNumber || '',
        specialization: profile?.specialization || user.specialization || '',
        yearsOfExperience: profile?.yearsOfExperience !== undefined && profile.yearsOfExperience !== null 
          ? profile.yearsOfExperience 
          : (user.yearsOfExperience !== undefined && user.yearsOfExperience !== null ? user.yearsOfExperience : 0),
        city: profile?.city || user.city || '',
        state: profile?.state || user.state || '',
        country: profile?.country || user.country || '',
        phone: profile?.phone || user.phone || '',
        photoUrl: profile?.photoUrl || user.photoUrl || '',
        firmName: profile?.firmName || user.firmName || '',
        cnicNumber: profile?.cnicNumber || user.cnicNumber || '',
        submittedDocuments: (profile?.licenses?.length || 0) + (profile?.documents?.length || 0) + (user.licenseUrl ? 1 : 0),
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
    console.log("🔍 Approving lawyer with User ID:", id);
    
    // Get both user and lawyer profile data
    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      console.error("❌ User not found:", id);
      return res.status(404).json({ error: "Lawyer user not found" });
    }
    
    let profile = await Lawyer.findOne({ userId: id }).lean();
    console.log("📋 Profile found:", !!profile);
    
    // If profile doesn't exist, try to create it from user data
    if (!profile) {
      console.log("⚠️ Lawyer profile not found, creating from user data...");
      const fullName = user.firstname && user.lastname 
        ? `${user.firstname} ${user.lastname}`.trim()
        : user.fullName || '';
      
      // Try to create profile from user data
      profile = {
        userId: id,
        fullName: fullName,
        barNumber: user.barNumber || '',
        specialization: user.specialization || '',
        yearsOfExperience: user.yearsOfExperience || 0,
        city: user.city || '',
        phone: user.phone || '',
        cnicNumber: user.cnicNumber || '',
        firmName: user.firmName || '',
        licenses: user.licenseUrl ? [{ name: 'license', url: user.licenseUrl }] : [],
        documents: [],
        status: 'pending'
      };
      
      // Save the profile
      // Ensure barNumber is unique before attempting to save
      if (profile.barNumber) {
        const existingBar = await Lawyer.findOne({ barNumber: profile.barNumber }).lean();
        if (existingBar && existingBar.userId.toString() !== id.toString()) {
          console.error("❌ Cannot create profile - bar number already taken by another user");
          return res.status(400).json({
            error: "Duplicate bar number",
            message: `Bar Number ${profile.barNumber} is already registered with another lawyer. Please resolve the conflict before approving this profile.`,
          });
        }
      }

      try {
        const newProfile = new Lawyer(profile);
        await newProfile.save();
        profile = newProfile.toObject();
        console.log("✅ Created lawyer profile from user data");
      } catch (saveError) {
        if (saveError.code === 11000) {
          console.error("❌ Duplicate bar number detected while creating profile during approval");
          return res.status(400).json({
            error: "Duplicate bar number",
            message: `Bar Number ${profile.barNumber || ""} is already registered. Please resolve the duplicate before approving.`,
          });
        }
        throw saveError;
      }
    }

    // Check for missing required fields (check both profile and user as fallback)
    const missing = [];
    const fullName = profile.fullName || (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}`.trim() : '');
    if (!fullName) missing.push("fullName");
    
    const barNumber = profile.barNumber || user.barNumber || '';
    if (!barNumber) missing.push("barNumber");
    
    const specialization = profile.specialization || user.specialization || '';
    if (!specialization) missing.push("specialization");
    
    const yearsOfExperience = profile.yearsOfExperience !== undefined && profile.yearsOfExperience !== null 
      ? profile.yearsOfExperience 
      : (user.yearsOfExperience !== undefined && user.yearsOfExperience !== null ? user.yearsOfExperience : null);
    if (yearsOfExperience === null || yearsOfExperience === undefined) missing.push("yearsOfExperience");
    
    // Check city in both profile and user
    const city = profile.city || user.city || '';
    if (!city) missing.push("city");
    
    const cnicNumber = profile.cnicNumber || user.cnicNumber || '';
    if (!cnicNumber) missing.push("cnicNumber");
    
    // Check phone in both profile and user
    const phone = profile.phone || user.phone || '';
    if (!phone || phone.length < 10) missing.push("phone (10+ digits)");
    
    const totalDocs = (profile.licenses?.length || 0) + (profile.documents?.length || 0) + (user.licenseUrl ? 1 : 0);
    if (totalDocs === 0) missing.push("documents/licenses");

    if (missing.length) {
      console.log("❌ Missing fields:", missing);
      return res.status(400).json({
        error: "Profile is incomplete. Cannot approve.",
        missing,
      });
    }

    // Update user status to approved
    const updatedUser = await User.findByIdAndUpdate(id, { status: "approved" }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ error: "Lawyer not found" });
    
    // Also update lawyer profile - ensure it exists and is approved
    try {
      await Lawyer.findOneAndUpdate(
        { userId: id }, 
        { 
          status: "approved", 
          rejectionReason: undefined,
          fullName: fullName,
          barNumber: barNumber,
          specialization: specialization,
          yearsOfExperience: yearsOfExperience,
          city: city,
          phone: phone,
          cnicNumber: cnicNumber,
          firmName: profile.firmName || user.firmName || '',
          licenses: profile.licenses || (user.licenseUrl ? [{ name: 'license', url: user.licenseUrl }] : [])
        }, 
        { upsert: true, new: true }
      );
    } catch (updateErr) {
      if (updateErr.code === 11000 || (updateErr.message && updateErr.message.includes("duplicate key"))) {
        console.error("❌ Duplicate bar number detected while approving lawyer");
        return res.status(400).json({
          error: "Duplicate bar number",
          message: `Bar Number ${barNumber || ""} is already registered with another lawyer. Cannot approve until the duplicate is resolved.`,
        });
      }
      throw updateErr;
    }
    
    console.log("✅ Lawyer approved successfully:", id);
    return res.json({ message: "Approved", lawyer: updatedUser });
  } catch (e) {
    console.error("❌ Lawyer approve error:", e);
    return res.status(500).json({ error: "Internal server error", message: e.message });
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


