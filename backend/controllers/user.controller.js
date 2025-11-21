import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/user.model.js"
import { Lawyer } from "../models/Lawyer.js"

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
      photoUrl,
      specialization,
      yearsOfExperience,
      barNumber,
      firmName,
      city,
      phoneCountryCode,
      phone,
      cnicNumber,
      licenseUrl,
      nationalIdNumber,
      nationalIdFrontUrl,
      nationalIdBackUrl,
    } = req.body

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" })
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = {
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      userType: userType || "user",
      status: userType === "lawyer" ? "pending" : "approved",
    }

    // Add ID card fields if provided
    if (nationalIdNumber) userData.nationalIdNumber = nationalIdNumber
    if (nationalIdFrontUrl) userData.nationalIdFrontUrl = nationalIdFrontUrl
    if (nationalIdBackUrl) userData.nationalIdBackUrl = nationalIdBackUrl
    if (photoUrl) userData.photoUrl = photoUrl

    // For lawyers, also save lawyer-specific fields to User model (as backup)
    if (userType === "lawyer") {
      if (barNumber) userData.barNumber = barNumber.trim()
      if (specialization) userData.specialization = specialization.trim()
      if (yearsOfExperience !== undefined && yearsOfExperience !== null) {
        userData.yearsOfExperience = Number.isFinite(Number(yearsOfExperience)) ? Number(yearsOfExperience) : 0
      }
      if (firmName) userData.firmName = firmName.trim()
      if (city) userData.city = city.trim()
      if (phoneCountryCode) userData.phoneCountryCode = phoneCountryCode
      if (phone) userData.phone = phone.trim()
      if (cnicNumber) userData.cnicNumber = cnicNumber.trim()
      if (licenseUrl) userData.licenseUrl = licenseUrl
    }

    const newUser = await User.create(userData)

    if ((userType || "user") === "lawyer") {
      try {
        // Check if barNumber already exists before creating profile
        if (barNumber) {
          const existingLawyer = await Lawyer.findOne({ barNumber: barNumber.trim() })
          if (existingLawyer) {
            // Delete the user that was just created since registration failed
            await User.findByIdAndDelete(newUser._id)
            return res.status(400).json({ 
              success: false, 
              message: `Bar Number ${barNumber.trim()} is already registered. Please use a different bar number or contact support if this is an error.` 
            })
          }
        }

        const licenses = []
        if (Array.isArray(req.body.licenses)) {
          licenses.push(...req.body.licenses)
        } else if (licenseUrl) {
          licenses.push({ name: "license", url: licenseUrl })
        }

        const documents = Array.isArray(req.body.documents) ? req.body.documents : []

        // Only create lawyer profile if required fields are provided
        const fullName = `${firstname} ${lastname}`.trim()
        if (!fullName || !barNumber || !specialization) {
          console.warn("⚠️ Skipping lawyer profile creation - missing required fields:", {
            hasFullName: !!fullName,
            hasBarNumber: !!barNumber,
            hasSpecialization: !!specialization
          })
        } else {
          const lawyerProfileData = {
            userId: newUser._id,
            fullName: fullName,
            barNumber: barNumber.trim(),
            specialization: specialization.trim(),
            yearsOfExperience: Number.isFinite(Number(yearsOfExperience))
              ? Number(yearsOfExperience)
              : 0,
            firmName: firmName?.trim() || "",
            city: city?.trim() || "",
            phoneCountryCode: phoneCountryCode || "+92",
            phone: phone?.trim() || "",
            cnicNumber: cnicNumber?.trim() || "",
            licenses,
            documents,
            status: "pending",
          }

          console.log("Creating lawyer profile with data:", {
            userId: newUser._id,
            fullName: lawyerProfileData.fullName,
            barNumber: lawyerProfileData.barNumber,
            specialization: lawyerProfileData.specialization,
            city: lawyerProfileData.city,
            phone: lawyerProfileData.phone,
            cnicNumber: lawyerProfileData.cnicNumber,
            licensesCount: licenses.length,
            documentsCount: documents.length,
          })

          try {
            const lawyerProfile = await Lawyer.findOneAndUpdate(
              { userId: newUser._id },
              lawyerProfileData,
              { upsert: true, new: true, setDefaultsOnInsert: true }
            )
            
            console.log("✅ Lawyer profile created/updated successfully:", lawyerProfile?._id)
          } catch (lawyerError) {
            // Handle duplicate key error specifically
            if (lawyerError.code === 11000 || lawyerError.name === 'MongoServerError') {
              // Delete the user that was just created since registration failed
              await User.findByIdAndDelete(newUser._id)
              return res.status(400).json({ 
                success: false, 
                message: `Bar Number ${barNumber.trim()} is already registered. Please use a different bar number or contact support if this is an error.` 
              })
            }
            throw lawyerError
          }
        }
      } catch (profileError) {
        console.error("❌ Failed to seed lawyer profile during signup:", profileError)
        console.error("Error details:", {
          message: profileError.message,
          name: profileError.name,
          code: profileError.code,
          stack: profileError.stack
        })
        
        // If it's a duplicate key error, delete the user and return proper error
        if (profileError.code === 11000 || (profileError.message && profileError.message.includes('duplicate key'))) {
          await User.findByIdAndDelete(newUser._id)
          return res.status(400).json({ 
            success: false, 
            message: `Bar Number ${barNumber?.trim() || 'provided'} is already registered. Please use a different bar number or contact support if this is an error.` 
          })
        }
        
        // For other errors, don't fail the registration, but log the error
      }
    }
    const { password: _, ...userResponse } = newUser.toObject()
    return res.status(201).json({ success: true, message: "Account Created Successfully", user: userResponse })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to register" })
  }
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password, loginType } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    // Explicitly select password
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(400).json({ success: false, message: "Incorrect email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" })
    }

    // Validate user type based on login endpoint
    // If loginType is 'user', only allow regular users
    if (loginType === 'user' && user.userType === 'lawyer') {
      return res.status(403).json({ 
        success: false, 
        message: "Lawyers cannot login from user login page. Please use lawyer login page.",
        userType: user.userType
      })
    }

    // If loginType is 'lawyer', only allow lawyers
    if (loginType === 'lawyer' && user.userType !== 'lawyer') {
      return res.status(403).json({ 
        success: false, 
        message: "Regular users cannot login from lawyer login page. Please use user login page.",
        userType: user.userType
      })
    }

    const jwtSecret = process.env.JWT_SECRET || "dev_secret"
    const token = jwt.sign({ userId: user._id, userType: user.userType }, jwtSecret, { expiresIn: "1d" })

    // remove password before sending
    const { password: _, ...userData } = user.toObject()

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: `Welcome back ${user.firstname}`,
        token: token,
        userType: user.userType,
        user: userData,
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to Login" })
  }
}

// Logout
export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

// Get current user profile (requires auth)
export const getProfile = async (req, res) => {
  try {
    const id = req.user?.id || req.user?.userId
    if (!id) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    const user = await User.findById(id).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.error("getProfile:", error)
    return res.status(500).json({ success: false, message: "Failed to fetch profile" })
  }
}

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id
    const { firstname, lastname, occupation, bio, instagram, facebook, linkedin, github } = req.body

    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false })
    }

    if (firstname) user.firstname = firstname
    if (lastname) user.lastname = lastname
    if (occupation) user.occupation = occupation
    if (instagram) user.instagram = instagram
    if (facebook) user.facebook = facebook
    if (linkedin) user.linkedin = linkedin
    if (github) user.github = github
    if (bio) user.bio = bio

    await user.save()
    return res.status(200).json({ message: "Profile updated successfully", success: true, user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Failed to update profile" })
  }
}

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, message: "User list fetched successfully", total: users.length, users })
  } catch (error) {
    console.error("Error fetching user list:", error)
    res.status(500).json({ success: false, message: "Failed to fetch users" })
  }
}

// Get All Lawyers
export const getAllLawyers = async (_req, res) => {
  try {
    const lawyers = await User.find({ userType: "lawyer" }).select("-password")
    return res
      .status(200)
      .json({ success: true, message: "Lawyer list fetched successfully", total: lawyers.length, lawyers })
  } catch (error) {
    console.error("Error fetching lawyer list:", error)
    return res.status(500).json({ success: false, message: "Failed to fetch lawyers" })
  }
}

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.status(200).json({ success: true, message: "User fetched successfully", user })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ success: false, message: "Failed to fetch user" })
  }
}

// ImageKit Auth - generates signature for client-side upload
export const getImageKitAuth = async (req, res) => {
  try {
    console.log("[v0] ImageKit auth requested")

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY

    console.log("[v0] ImageKit keys check:", {
      hasPrivateKey: !!privateKey,
      hasPublicKey: !!publicKey,
      privateKeyLength: privateKey?.length || 0,
      publicKeyLength: publicKey?.length || 0,
    })

    if (!privateKey || !publicKey) {
      console.error("[v0] ImageKit keys missing!")
      return res.status(500).json({
        success: false,
        message:
          "ImageKit is not configured on the server. Please set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_PUBLIC_KEY environment variables.",
      })
    }

    const token = crypto.randomBytes(16).toString("hex")
    const expire = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex")

    console.log("[v0] ImageKit auth generated successfully:", {
      token: token.substring(0, 8) + "...",
      expire,
      signature: signature.substring(0, 8) + "...",
      publicKey: publicKey.substring(0, 8) + "...",
    })

    return res.status(200).json({
      success: true,
      token,
      expire,
      signature,
      publicKey,
    })
  } catch (error) {
    console.error("[v0] ImageKit auth error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to generate ImageKit authentication",
    })
  }
}

// Local Upload Fallback - for when ImageKit is not available
export const uploadLocal = async (req, res) => {
  try {
    console.log("[v0] Local upload requested")

    // This requires multer middleware to be set up on the route
    if (!req.file) {
      console.error("[v0] No file in request")
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    console.log("[v0] File uploaded locally:", {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    })

    // Construct the URL based on your server configuration
    const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`

    console.log("[v0] Local upload successful:", fileUrl)

    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    })
  } catch (error) {
    console.error("[v0] Local upload error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to upload file locally",
    })
  }
}

// Update payment methods
export const updatePaymentMethods = async (req, res) => {
  try {
    const userId = req.user?.id
    const { paymentMethods } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      })
    }

    if (!paymentMethods) {
      return res.status(400).json({
        success: false,
        message: "Payment methods data is required"
      })
    }

    // Validate payment methods structure
    const validMethods = ['jazzcash', 'easypaisa', 'bankTransfer']
    for (const method of validMethods) {
      if (paymentMethods[method] && paymentMethods[method].enabled) {
        if (method === 'bankTransfer') {
          if (!paymentMethods[method].bankName || !paymentMethods[method].accountNumber || !paymentMethods[method].accountName) {
            return res.status(400).json({
              success: false,
              message: `Bank Transfer requires bank name, account number, and account name`
            })
          }
        } else {
          if (!paymentMethods[method].accountNumber || !paymentMethods[method].accountName) {
            return res.status(400).json({
              success: false,
              message: `${method} requires account number and account name`
            })
          }
        }
      }
    }

    // Update user with payment methods
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { paymentMethods },
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    console.log(`[v0] Payment methods updated for user: ${userId}`)

    res.json({
      success: true,
      message: "Payment methods updated successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("[v0] Update payment methods error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update payment methods"
    })
  }
}
