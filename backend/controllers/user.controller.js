import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { 
      firstname, 
      lastname, 
      username, 
      email, 
      password, 
      userType, 
      nationalIdNumber, 
      nationalIdFrontUrl, 
      nationalIdBackUrl 
    } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      userType: userType || 'user'
    };

    // Add ID card fields if provided
    if (nationalIdNumber) userData.nationalIdNumber = nationalIdNumber;
    if (nationalIdFrontUrl) userData.nationalIdFrontUrl = nationalIdFrontUrl;
    if (nationalIdBackUrl) userData.nationalIdBackUrl = nationalIdBackUrl;

    await User.create(userData);

    return res.status(201).json({ success: true, message: "Account Created Successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to register" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Explicitly select password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "Incorrect email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // remove password before sending
    const { password: _, ...userData } = user.toObject();

    return res
      .status(200)
      .cookie("token", token, { 
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      })
      .json({
        success: true,
        message: `Welcome back ${user.firstname}`,
        token: token,
        userType: user.userType,
        user: userData
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to Login" });
  }
};

// Logout
export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { firstname, lastname, occupation, bio, instagram, facebook, linkedin, github } = req.body;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (occupation) user.occupation = occupation;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (bio) user.bio = bio;

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", success: true, user });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, message: "User list fetched successfully", total: users.length, users });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};
