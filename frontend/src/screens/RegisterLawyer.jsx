import React from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Scale } from 'lucide-react';
import { api } from '../shared/api.js'

function RegisterLawyer() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/lawyerDashboard');  
  };

  const goBack = () => {
    navigate('/registration-selection');
  };

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    photoUrl: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isRegistering) {
      if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
      if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isRegistering) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for API call
      const lawyerData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: 'lawyer',
        photoUrl: formData.photoUrl
      };

      console.log('Sending lawyer registration data:', lawyerData);

      // Make API call to backend
      const response = await fetch('http://localhost:5000/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lawyerData),
      });

      const result = await response.json();

      if (response.ok) {
        // After successful user registration, create a lawyer profile
        try {
          const lawyerProfileData = {
            userId: result.user?._id || result.user?.id,
            fullName: `${formData.firstname} ${formData.lastname}`,
            barNumber: `BAR${Date.now()}`, // Temporary bar number - should be provided by user
            specialization: 'General Practice', // Default - should be provided by user
            yearsOfExperience: 0, // Default - should be provided by user
            city: '',
            state: '',
            country: '',
            status: 'pending'
          };

          const profileResponse = await fetch('http://localhost:5000/api/lawyers/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(lawyerProfileData),
          });

          if (profileResponse.ok) {
            alert('Lawyer registration successful! Your profile is pending admin approval. You can now login.');
          } else {
            alert('User account created but profile creation failed. Please contact support.');
          }
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
          alert('User account created but profile creation failed. Please contact support.');
        }

        // Reset form
        setFormData({
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          photoUrl: ''
        });
        // Switch to login mode
        setIsRegistering(false);
      } else {
        alert(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const loginData = {
        email: formData.email,
        password: formData.password
      };

      console.log('Sending lawyer login data:', loginData);

      const response = await fetch('http://localhost:5000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', result.userType || 'lawyer');
        alert('Login successful!');
        goToDashboard();
      } else {
        alert(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Scale className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegistering ? "Join as Lawyer" : "Lawyer Portal"}
          </h1>
          <p className="text-gray-600">
            {isRegistering ? "Connect with clients and grow your legal practice" : "Access your professional dashboard"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={isRegistering ? handleSubmit : handleLogin} className="space-y-6">
            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                        errors.firstname 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-green-500'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstname && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                        errors.lastname 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-green-500'
                      }`}
                      placeholder="Smith"
                    />
                  </div>
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                  )}
                </div>
              </div>
            )}

        {isRegistering && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo (optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    // Get ImageKit auth params
                    const { data: sig } = await api.get('/v1/user/imagekit-auth')
                    if (!sig?.signature || !sig?.token || !sig?.expire) {
                      throw new Error('ImageKit not configured')
                    }
                    const form = new FormData()
                    form.append('file', file)
                    form.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '')
                    form.append('signature', sig.signature)
                    form.append('expire', sig.expire)
                    form.append('token', sig.token)
                    form.append('fileName', file.name)
                    const base = (import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '').replace(/\/$/, '')
                    const resp = await fetch(`${base}/api/v1/files/upload`, { method: 'POST', body: form })
                    const json = await resp.json()
                    if (json?.url) {
                      setFormData(prev => ({ ...prev, photoUrl: json.url }))
                    } else {
                      alert('Failed to upload image')
                    }
                  } catch (err) {
                    console.error('Image upload error', err)
                    alert('Image upload failed')
                  }
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {formData.photoUrl && (
                <img src={formData.photoUrl} alt="preview" className="w-12 h-12 rounded-full object-cover border" />
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">We host via ImageKit. You can change this later.</p>
          </div>
        )}

        {isRegistering && formData.photoUrl && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Preview:</span>
            <img src={formData.photoUrl} alt="preview" className="w-12 h-12 rounded-full object-cover border" onError={(e)=>{e.currentTarget.style.display='none'}} />
          </div>
        )}

        {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                      errors.username 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="johndoe123"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="lawyer@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-green-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-0 transition-colors ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
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
  );
}

export default RegisterLawyer;