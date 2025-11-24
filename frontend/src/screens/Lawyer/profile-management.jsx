import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { api } from "../../shared/api.js";
import { Camera, Mail, Phone, MapPin, Briefcase, Award, Calendar, User, FileText, Globe, Linkedin, Facebook, Twitter, Instagram, Github } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

export default function LawyerProfileSection() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('/user/profile');
        const user = res?.data?.user || res?.data || res?.user || null;
        setProfile(user);
      console.log('📋 Profile data:', user);
      } catch (_) {
        // ignore
      }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      let uploadedUrl = "";

      // Try ImageKit upload first
      try {
        const { data: sig } = await api.get('/user/imagekit-auth');
        
        if (!sig?.signature || !sig?.token || !sig?.expire || !sig?.publicKey) {
          throw new Error("ImageKit not configured");
        }

        const form = new FormData();
        form.append("file", file);
        form.append("publicKey", sig.publicKey);
        form.append("signature", sig.signature);
        form.append("expire", sig.expire);
        form.append("token", sig.token);
        form.append("fileName", file.name);

        const folder = (import.meta.env.VITE_IMAGEKIT_FOLDER || "lawyer-profiles").replace(/^\/+/, "");
        form.append("folder", folder);
        form.append("useUniqueFileName", "true");

        const uploadUrl = "https://upload.imagekit.io/api/v1/files/upload";
        const resp = await fetch(uploadUrl, { method: "POST", body: form });
        const json = await resp.json();

        if (!resp.ok) {
          throw new Error(json?.message || json?.error || "Upload failed");
        }

        if (json?.url) {
          uploadedUrl = json.url;
        }
      } catch (ikError) {
        console.error("ImageKit upload failed:", ikError);
        
        // Try local upload fallback
        try {
          const formLocal = new FormData();
          formLocal.append("file", file);
          const apiBase = (import.meta.env?.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");
          const respLocal = await fetch(`${apiBase}/api/v1/user/upload-local`, {
            method: "POST",
            body: formLocal,
          });
          const jsonLocal = await respLocal.json();

          if (jsonLocal?.url) {
            uploadedUrl = jsonLocal.url;
          } else {
            throw new Error("Local upload failed");
          }
        } catch (localError) {
          console.error("Local upload failed:", localError);
          throw new Error("Both ImageKit and local upload failed");
        }
      }

      if (uploadedUrl) {
        // Update profile with new photoUrl
        setUpdating(true);
        await api.put('/user/profile', { photoUrl: uploadedUrl });
        
        toast({
          title: "Success",
          description: "Profile picture updated successfully!",
        });
        
        // Refresh profile
        await fetchProfile();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUpdating(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Profile Management</h1>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Left Side */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
          <img
            src={profile?.photoUrl || 'https://i.pravatar.cc/120'}
            alt="avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
          />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || updating}
                  className="absolute bottom-0 right-0 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Update profile picture"
                >
                  {uploading || updating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile ? `${profile.firstname || ''} ${profile.lastname || ''}`.trim() || 'Lawyer' : 'Lawyer'}
              </h2>
              <p className="text-gray-600 mb-4">{profile?.email || 'No email'}</p>
              
              {profile?.status && (
                <Badge 
                  className={
                    profile.status === 'approved' 
                      ? 'bg-amber-100 text-amber-700 border-amber-300' 
                      : profile.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      : 'bg-red-100 text-red-700 border-red-300'
                  }
                >
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Card - Right Side */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
          <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-amber-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">First Name</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile?.firstname || '—'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Last Name</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile?.lastname || '—'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile?.email || '—'}</p>
                </div>
                {profile?.username && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Username</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{profile.username}</p>
                  </div>
                )}
                {(profile?.phone || profile?.phoneCountryCode) && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {profile.phoneCountryCode ? `${profile.phoneCountryCode} ` : ''}{profile.phone || '—'}
                    </p>
                  </div>
                )}
          </div>
        </div>

            {/* Professional Information */}
          <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-600" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Specialization</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile?.occupation || profile?.specialization || '—'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Bar Number</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile?.barNumber || '—'}</p>
                </div>
                {profile?.yearsOfExperience && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Years of Experience</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{profile.yearsOfExperience} years</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">City</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{profile?.city || '—'}</p>
          </div>
          </div>
        </div>

            {/* Bio */}
            {profile?.bio && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Bio
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Social Media */}
            {profile?.socialMedia && (profile.socialMedia.facebook || profile.socialMedia.linkedin || profile.socialMedia.twitter || profile.socialMedia.instagram || profile.socialMedia.github) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-600" />
                  Social Media
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.socialMedia.facebook && (
                    <a 
                      href={profile.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                    >
                      <Facebook className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">Facebook</span>
                    </a>
                  )}
                  {profile.socialMedia.linkedin && (
                    <a 
                      href={profile.socialMedia.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">LinkedIn</span>
                    </a>
                  )}
                  {profile.socialMedia.twitter && (
                    <a 
                      href={profile.socialMedia.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">Twitter</span>
                    </a>
                  )}
                  {profile.socialMedia.instagram && (
                    <a 
                      href={profile.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span className="text-sm font-medium text-pink-700">Instagram</span>
                    </a>
                  )}
                  {profile.socialMedia.github && (
                    <a 
                      href={profile.socialMedia.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                    >
                      <Github className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">GitHub</span>
                    </a>
                  )}
        </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
