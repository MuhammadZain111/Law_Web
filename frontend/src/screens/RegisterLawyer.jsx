"use client"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, Scale } from "lucide-react"
import { api } from "../shared/api.js"
import { toast } from "../hooks/use-toast.js"

function RegisterLawyer() {
  const navigate = useNavigate()
  const location = useLocation()

  const goToDashboard = () => {
    navigate("/lawyerDashboard")
  }

  const goBack = () => {
    navigate("/registration-selection")
  }

  // Default to signup mode on /registerLawyer, and login mode on /lawyer/login
  const initialRegistering = location?.pathname?.includes('/lawyer/login') ? false : true
  const [isRegistering, setIsRegistering] = useState(initialRegistering)
  const [showPassword, setShowPassword] = useState(false)
  // Options for selects
  const specializations = [
    "Criminal Law",
    "Civil Law",
    "Family Law",
    "Corporate Law",
    "Tax Law",
    "Labor/Employment",
    "Intellectual Property",
    "Real Estate",
    "Immigration",
    "Constitutional",
    "Banking/Finance",
    "Cyber/IT Law",
  ]
  const experienceYears = Array.from({ length: 41 }, (_, i) => i) // 0 - 40
  const cities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Peshawar",
    "Quetta",
    "Multan",
    "Faisalabad",
    "Hyderabad",
    "Sialkot",
    "Gujranwala",
    "Bahawalpur",
  ]
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    photoUrl: "",
    specialization: "",
    yearsOfExperience: "",
    barNumber: "",
    firmName: "",
    city: "",
    cnicNumber: "",
    licenseUrl: "",
    phoneCountryCode: "+92",
    phone: "",
  })
  const [errors, setErrors] = useState({})
  const [isUploadingLicense, setIsUploadingLicense] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (isRegistering) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required"
      if (!formData.lastname.trim()) newErrors.lastname = "Last name is required"
      if (!formData.username.trim()) newErrors.username = "Username is required"
      
      // Lawyer-specific required fields
      if (!formData.barNumber.trim()) newErrors.barNumber = "Bar Number is required"
      if (!formData.specialization) newErrors.specialization = "Specialization is required"
      if (formData.yearsOfExperience === "" || formData.yearsOfExperience === null) {
        newErrors.yearsOfExperience = "Experience is required"
      }
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.cnicNumber.trim()) newErrors.cnicNumber = "CNIC/ID is required"
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (formData.phone.length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits"
      }
      // Check if license is uploaded (licenseUrl should be a non-empty string)
      const hasLicense = formData.licenseUrl && formData.licenseUrl.trim() !== ""
      const hasLicensesArray = formData.licenses && formData.licenses.length > 0
      if (!hasLicense && !hasLicensesArray) {
        newErrors.licenseUrl = "At least one document/license is required"
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (isRegistering) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // Prepare data for API call
      const lawyerData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: "lawyer",
        photoUrl: formData.photoUrl,
        specialization: formData.specialization,
        yearsOfExperience: Number(formData.yearsOfExperience || 0),
        barNumber: formData.barNumber,
        firmName: formData.firmName,
        phoneCountryCode: formData.phoneCountryCode,
        phone: formData.phone,
        city: formData.city,
        cnicNumber: formData.cnicNumber,
        licenseUrl: formData.licenseUrl,
      }

      console.log("Sending lawyer registration data:", lawyerData)

      // Make API call to backend
    const { data: result } = await api.post("/user/register", lawyerData)

    if (result?.user) {
        // The Lawyer profile should already be created by the register endpoint
        // But we'll update it with any additional data if needed
        try {
          const lawyerProfileData = {
            userId: result.user?._id || result.user?.id,
            fullName: `${formData.firstname} ${formData.lastname}`,
            barNumber: formData.barNumber,
            specialization: formData.specialization || "General Practice",
            yearsOfExperience: Number(formData.yearsOfExperience || 0),
            city: formData.city,
            phoneCountryCode: formData.phoneCountryCode,
            phone: formData.phone,
            state: "",
            country: "",
            status: "pending",
            firmName: formData.firmName,
            cnicNumber: formData.cnicNumber,
            licenses: formData.licenseUrl ? [{ name: 'license', url: formData.licenseUrl }] : [],
          }

          console.log("Updating lawyer profile with data:", lawyerProfileData)
          const { data: profileCreated } = await api.post("/lawyers/profile", lawyerProfileData)
          if (profileCreated) {
            toast({
              title: "Registration successful",
              description: "Your profile is pending admin approval. You can now login.",
            })
          } else {
            toast({
              title: "Profile update issue",
              description: "User account created but profile creation failed. Please contact support.",
            })
          }
        } catch (profileError) {
          console.error("Profile creation error:", profileError)
          const profileErrorMessage = profileError.message || profileError.data?.message || ""
          
          // Check if it's a duplicate bar number error
          if (profileErrorMessage.includes("Bar Number") && profileErrorMessage.includes("already registered")) {
            toast({
              title: "Bar Number already exists",
              description: profileErrorMessage || "This bar number is already registered. Please use a different bar number.",
            })
            setErrors((prev) => ({ ...prev, barNumber: "This bar number is already registered" }))
            return // Don't reset form or switch to login
          }
          
          // For other errors, don't fail the registration if profile update fails - it might already exist
          toast({
            title: "Registration successful",
            description: "Your profile is pending admin approval. You can now login.",
          })
        }

        // Reset form
        setFormData({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          photoUrl: "",
          specialization: "",
          yearsOfExperience: "",
          barNumber: "",
          firmName: "",
          city: "",
          phoneCountryCode: "+92",
          phone: "",
          cnicNumber: "",
          licenseUrl: "",
        })
        // Switch to login mode
        setIsRegistering(false)
      } else {
        toast({
          title: "Registration failed",
          description: result?.message || "Registration failed. Please try again.",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      
      const errorMessage = error.message || error.data?.message || ""
      
      // Handle specific error cases
      if (errorMessage.includes("Bar Number") && errorMessage.includes("already registered")) {
        toast({
          title: "Bar Number already exists",
          description: errorMessage || "This bar number is already registered. Please use a different bar number or contact support.",
        })
        // Set error on barNumber field
        setErrors((prev) => ({ ...prev, barNumber: "This bar number is already registered" }))
      } else if (errorMessage.includes("Email already exists") || errorMessage.includes("email already")) {
        toast({
          title: "Email already registered",
          description: "Please use a different email or try logging in instead.",
        })
      } else if (errorMessage.includes("Username already exists") || errorMessage.includes("username already")) {
        toast({
          title: "Username already taken",
          description: "Please choose a different username.",
        })
      } else if (error.status === 400) {
        toast({
          title: "Invalid registration data",
          description: errorMessage || "Please check all fields and try again.",
        })
      } else if (error.status === 500) {
        toast({
          title: "Server error",
          description: "Please try again later.",
        })
      } else {
        toast({
          title: "Registration failed",
          description: errorMessage || "Please check your connection and try again.",
        })
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        loginType: 'lawyer' // Specify this is lawyer login
      }

      console.log("Sending lawyer login data:", loginData)

      const { data: result } = await api.post("/user/login", loginData)
      if (result?.token) {
        // Check userType from response
        const userType = result.userType || result?.user?.userType || 'user';
        
        // Check if non-lawyer is trying to login from lawyer login page
        if (userType !== 'lawyer') {
          toast({
            title: "Invalid login",
            description: userType === 'admin' 
              ? "Admins cannot login from lawyer login page. Please use admin login page."
              : "Regular users cannot login from lawyer login page. Please use user login page.",
          })
          if (userType === 'admin') {
            navigate('/admin/login')
          } else {
            navigate('/user/login')
          }
          return;
        }
        
        // Store token in localStorage
        localStorage.setItem("token", result.token)
        localStorage.setItem("userType", userType)
        toast({
          title: "Login successful",
          description: "Welcome back! Redirecting to your dashboard...",
        })
        goToDashboard()
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Please check your credentials.",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      
      // Handle different types of errors
      let errorTitle = "Login failed";
      let errorDescription = "Please check your connection and try again.";
      
      if (error.isNetworkError || error.status === 0) {
        errorTitle = "Connection Error";
        errorDescription = "Cannot connect to server. Please ensure the backend server is running on http://localhost:5000";
      } else if (error.status === 401) {
        errorTitle = "Invalid Credentials";
        errorDescription = error.message || "Email or password is incorrect. Please try again.";
      } else if (error.status === 400) {
        errorTitle = "Invalid Request";
        errorDescription = error.message || "Please check your email and password format.";
      } else if (error.status === 500) {
        errorTitle = "Server Error";
        errorDescription = "Server encountered an error. Please try again later.";
      } else if (error.message) {
        errorDescription = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
      })
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-emerald-50/40 to-white flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-64 w-64 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -right-24 bottom-0 h-72 w-72 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
      </div>
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-3">
            <Scale className="w-4 h-4" /> Lawyer Portal
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {isRegistering ? "Create Lawyer Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isRegistering ? "Connect with clients and grow your legal practice" : "Sign in to manage your profile and appointments"}
          </p>
        </div>

        {/* Form Card */}
        <div className="relative bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-gray-100 p-8 transition-all hover:shadow-2xl hover:ring-emerald-200">
          <div className="absolute inset-x-0 -top-[1px] h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 rounded-t-2xl" />
          <form onSubmit={isRegistering ? handleSubmit : handleLogin} className="space-y-6">
            {isRegistering && (
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors duration-150 ${
                      errors.firstname ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-emerald-500"
                    } group-hover:border-emerald-300`}
                      placeholder=""
                    />
                  </div>
                  {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors duration-150 ${
                      errors.lastname ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-emerald-500"
                    } group-hover:border-emerald-300`}
                      placeholder=""
                    />
                  </div>
                  {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
                </div>
              </div>
            )}

          {isRegistering && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lawyer Type / Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.specialization ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                >
                  <option value="" disabled>Select specialization</option>
                  {specializations.map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
                {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (in years)</label>
                <select
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.yearsOfExperience ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                >
                  <option value="" disabled>Select experience</option>
                  {experienceYears.map((yr) => (
                    <option key={yr} value={yr}>{yr} {yr === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
                {errors.yearsOfExperience && <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bar Council Registration Number</label>
                <input
                  type="text"
                  name="barNumber"
                  inputMode="numeric"
                  value={formData.barNumber}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 13)
                    setFormData((prev) => ({ ...prev, barNumber: onlyDigits }))
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.barNumber ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="13-digit number"
                />
                {errors.barNumber && <p className="mt-1 text-sm text-red-600">{errors.barNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Law Firm / Office Name</label>
                <input
                  type="text"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.firmName ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="e.g. Alpha Law Associates"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">City / Location</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.city ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                >
                  <option value="" disabled>Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleInputChange}
                    className={`px-3 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.phoneCountryCode ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  >
                    {['+92', '+91', '+971', '+1', '+44'].map((cc) => (
                      <option key={cc} value={cc}>{cc}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 11)
                      setFormData((prev) => ({ ...prev, phone: onlyDigits }))
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                      errors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="3001234567 (11 digits)"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CNIC / ID Number</label>
                <input
                  type="text"
                  name="cnicNumber"
                  inputMode="numeric"
                  value={formData.cnicNumber}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 13)
                    setFormData((prev) => ({ ...prev, cnicNumber: onlyDigits }))
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.cnicNumber ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="13-digit number"
                />
                {errors.cnicNumber && <p className="mt-1 text-sm text-red-600">{errors.cnicNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">License / Certificate Upload <span className="text-red-600">*</span></label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) {
                      // Clear licenseUrl if file is removed
                      setFormData((prev) => ({ ...prev, licenseUrl: "" }))
                      setErrors((prev) => {
                        const newErrors = { ...prev }
                        delete newErrors.licenseUrl
                        return newErrors
                      })
                      setIsUploadingLicense(false)
                      return
                    }
                    
                    setIsUploadingLicense(true)
                    // Clear any previous errors immediately
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.licenseUrl
                      return newErrors
                    })
                    
                    try {
                      // Try ImageKit upload first
                      try {
                        const { data: sig } = await api.get('/user/imagekit-auth')
                        if (!sig || !sig.signature) {
                          throw new Error('ImageKit authentication failed')
                        }
                        const form = new FormData()
                        form.append('file', file)
                        form.append('publicKey', sig.publicKey)
                        form.append('signature', sig.signature)
                        form.append('expire', sig.expire)
                        form.append('token', sig.token)
                        form.append('fileName', file.name)
                        const folder = (import.meta.env.VITE_IMAGEKIT_FOLDER || 'lawyer-licenses').replace(/^\/+/, '')
                        form.append('folder', folder)
                        form.append('useUniqueFileName', 'true')
                        const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload'
                        const resp = await fetch(uploadUrl, { method: 'POST', body: form })
                        const json = await resp.json()
                        if (!resp.ok || !json?.url) {
                          throw new Error(json?.message || json?.error || 'ImageKit upload failed')
                        }
                        setFormData((prev) => ({ ...prev, licenseUrl: json.url }))
                        console.log("✅ License uploaded to ImageKit:", json.url)
                        setIsUploadingLicense(false)
                      } catch (imageKitError) {
                        console.log("ImageKit upload failed, trying local upload:", imageKitError)
                        // Fallback to local upload
                        try {
                          const localForm = new FormData()
                          localForm.append('file', file)
                          // Don't set Content-Type header - browser will set it with boundary
                          const localResp = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/v1/user/upload-local`, {
                            method: 'POST',
                            body: localForm,
                            credentials: 'include',
                            headers: {
                              // Don't set Content-Type - let browser set it with boundary
                              ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
                            }
                          })
                          const localData = await localResp.json()
                          if (!localResp.ok) {
                            throw new Error(localData.message || 'Local upload failed')
                          }
                          if (localData?.url) {
                            setFormData((prev) => ({ ...prev, licenseUrl: localData.url }))
                            console.log("✅ License uploaded locally:", localData.url)
                            setIsUploadingLicense(false)
                          } else {
                            throw new Error('Local upload returned no URL')
                          }
                        } catch (localError) {
                          console.error("Local upload error:", localError)
                          const errorMsg = localError.message || 'Upload failed'
                          throw new Error(`Both ImageKit and local upload failed. ${errorMsg}`)
                        }
                      }
                    } catch (err) {
                      console.error("License upload error:", err)
                      const errorMessage = err.message || "Failed to upload license. Please try again."
                      setErrors((prev) => ({ ...prev, licenseUrl: errorMessage }))
                      setFormData((prev) => ({ ...prev, licenseUrl: "" }))
                      setIsUploadingLicense(false)
                    }
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {isUploadingLicense && (
                  <p className="mt-1 text-sm text-blue-600">⏳ Uploading license...</p>
                )}
                {errors.licenseUrl && !isUploadingLicense && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseUrl}</p>
                )}
                {formData.licenseUrl && !isUploadingLicense && (
                  <p className="mt-1 text-sm text-green-600">✓ License uploaded successfully</p>
                )}
                </div>
              </div>
            )}

        {isRegistering && (
          <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo (optional)</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                      console.log("[v0] File selected:", file.name, file.size, "bytes")

                      try {
                        let uploadedUrl = ""

                        try {
                          console.log("[v0] Requesting ImageKit auth...")
                          const { data: sig } = await api.get("/user/imagekit-auth")

                          console.log("[v0] ImageKit auth response:", {
                            hasSignature: !!sig?.signature,
                            hasToken: !!sig?.token,
                            hasExpire: !!sig?.expire,
                            hasPublicKey: !!sig?.publicKey,
                          })

                          if (!sig?.signature || !sig?.token || !sig?.expire || !sig?.publicKey) {
                            throw new Error("ImageKit not configured - missing auth parameters")
                          }

                          console.log("[v0] Building ImageKit upload form...")
                    const form = new FormData()
                          form.append("file", file)
                          form.append("publicKey", sig.publicKey)
                          form.append("signature", sig.signature)
                          form.append("expire", sig.expire)
                          form.append("token", sig.token)
                          form.append("fileName", file.name)

                          const folder = (import.meta.env.VITE_IMAGEKIT_FOLDER || "lawyer-profiles").replace(/^\/+/, "")
                          form.append("folder", folder)
                          form.append("useUniqueFileName", "true")

                          console.log("[v0] Uploading to ImageKit...")
                          const uploadUrl = "https://upload.imagekit.io/api/v1/files/upload"
                          const resp = await fetch(uploadUrl, { method: "POST", body: form })

                          console.log("[v0] ImageKit response status:", resp.status)

                          let json
                          try {
                            json = await resp.json()
                            console.log("[v0] ImageKit response:", json)
                          } catch (_e) {
                            console.error("[v0] Failed to parse ImageKit response")
                            json = {}
                          }

                          if (!resp.ok) {
                            const message = json?.message || json?.error || "Upload failed"
                            throw new Error(`ImageKit error: ${message}`)
                          }

                    if (json?.url) {
                            uploadedUrl = json.url
                            console.log("[v0] ImageKit upload successful:", uploadedUrl)
                          }
                        } catch (_ikErr) {
                          console.error("[v0] ImageKit upload failed:", _ikErr)

                          const disableFallback =
                            (import.meta.env?.VITE_IMAGEKIT_DISABLE_FALLBACK || "").toString().toLowerCase() === "true"

                          if (!disableFallback) {
                            console.log("[v0] Attempting local upload fallback...")
                            const formLocal = new FormData()
                            formLocal.append("file", file)
                            const apiBase = (import.meta.env?.VITE_API_BASE || "http://localhost:5000").replace(
                              /\/$/,
                              "",
                            )
                            const respLocal = await fetch(`${apiBase}/api/v1/user/upload-local`, {
                              method: "POST",
                              body: formLocal,
                            })

                            console.log("[v0] Local upload response status:", respLocal.status)
                            const jsonLocal = await respLocal.json()
                            console.log("[v0] Local upload response:", jsonLocal)

                            if (jsonLocal?.url) {
                              uploadedUrl = jsonLocal.url
                              console.log("[v0] Local upload successful:", uploadedUrl)
                            }
                          } else {
                            const msg =
                              _ikErr && _ikErr.message
                                ? _ikErr.message
                                : "Network or CORS error while uploading to ImageKit"
                            toast({
                              title: "ImageKit upload failed",
                              description: msg,
                            })
                            throw _ikErr
                          }
                        }

                        if (uploadedUrl) {
                          console.log("[v0] Setting photoUrl:", uploadedUrl)
                          setFormData((prev) => ({ ...prev, photoUrl: uploadedUrl }))
                          // Image uploaded successfully - no alert needed
                    } else {
                          console.error("[v0] No URL returned from upload")
                          toast({
                            title: "Image upload failed",
                            description: "Please verify ImageKit keys and endpoint, or use local fallback.",
                          })
                    }
                  } catch (err) {
                        console.error("[v0] Image upload error:", err)
                        const message = err?.message || ""
                        if (message?.toLowerCase().includes("not configured")) {
                          toast({
                            title: "Image upload failed",
                            description: "ImageKit is not configured on the server. Please set IMAGEKIT_* env vars and restart the server.",
                          })
                        } else {
                          toast({
                            title: "Image upload failed",
                            description: message || "Unknown error occurred.",
                          })
                        }
                  }
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {formData.photoUrl && (
                    <img
                      src={formData.photoUrl || "/placeholder.svg"}
                      alt="preview"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">We host via ImageKit. Max 2MB, JPG/PNG recommended.</p>
          </div>
        )}

        {isRegistering && formData.photoUrl && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Preview:</span>
                <img
                  src={formData.photoUrl || "/placeholder.svg"}
                  alt="preview"
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
          </div>
        )}

        {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                      errors.username ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="johndoe123"
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="lawyer@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.password ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                      errors.confirmPassword 
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              className="relative w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transform hover:scale-[1.01] transition-all duration-150 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <span className="absolute inset-0 opacity-0 hover:opacity-10 bg-white transition-opacity"></span>
              {isRegistering ? "Create Lawyer Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                {isRegistering ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={goBack}
            className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Registration Options
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterLawyer
