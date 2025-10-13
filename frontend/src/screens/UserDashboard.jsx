import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/shared/api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/user/profile');
      setUser(response.data?.user || response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserProfile user={user} onUpdate={fetchUserProfile} />;
      case "appointments":
        return <UserAppointments userId={user?.id} />;
      case "settings":
        return <UserSettings user={user} onUpdate={fetchUserProfile} />;
      default:
        return <UserProfile user={user} onUpdate={fetchUserProfile} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user profile</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  User Dashboard
                </h1>
                <p className="text-sm text-gray-500">Welcome back, {user.firstname}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {user.firstname?.[0]}{user.lastname?.[0]}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Navigation</h2>
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === "profile" ? "bg-white/20" : "bg-gray-100"
                  }`}>
                    <span className="text-lg">👤</span>
                  </div>
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                    activeTab === "appointments"
                      ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === "appointments" ? "bg-white/20" : "bg-green-100"
                  }`}>
                    <span className="text-lg">📅</span>
                  </div>
                  <span>My Appointments</span>
                </button>
                <button
                  onClick={() => navigate('/lawyers')}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-3 text-gray-700 hover:bg-white/50 hover:shadow-md`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100`}>
                    <span className="text-blue-600">⚖️</span>
                  </div>
                  <span>Find Lawyers</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                    activeTab === "settings"
                      ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-white/50 hover:shadow-md"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === "settings" ? "bg-white/20" : "bg-purple-100"
                  }`}>
                    <span className="text-lg">⚙️</span>
                  </div>
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Profile Component
function UserProfile({ user, onUpdate }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Profile Information
        </h2>
        <p className="text-gray-600">Manage your personal information and account details</p>
      </div>
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-4xl">👤</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-2">
              {user.firstname} {user.lastname}
            </h3>
            <p className="text-gray-200 text-lg mb-1">{user.email}</p>
            <div className="flex items-center space-x-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                {user.userType || 'User'} Account
              </span>
              <span className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-600 text-xl">👤</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Personal Information</h4>
          </div>
          <div className="space-y-4">
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">First Name</label>
              <p className="text-lg font-medium text-gray-900">{user.firstname || 'Not provided'}</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Last Name</label>
              <p className="text-lg font-medium text-gray-900">{user.lastname || 'Not provided'}</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
              <p className="text-lg font-medium text-gray-900">{user.email || 'Not provided'}</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
              <p className="text-lg font-medium text-gray-900 font-mono">{user.username || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-xl">🔐</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Account Information</h4>
          </div>
          <div className="space-y-4">
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Account Type</label>
              <p className="text-lg font-medium text-gray-900 capitalize">{user.userType || 'User'}</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Member Since</label>
              <p className="text-lg font-medium text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not available'}
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Account Status</label>
              <div className="flex items-center space-x-2 mt-2">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Active
                </span>
              </div>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Security Level</label>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Appointments Component
function UserAppointments({ userId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/');
      const list = response.data?.appointments || response.data || [];
      // Filter to current user if API returns mixed; also match by email fallback
      const uid = userId;
      const me = await api.get('/user/profile');
      const userEmail = me?.data?.user?.email || me?.data?.email;
      const filtered = Array.isArray(list) ? list.filter(a => {
        const cid = a.clientId?._id || a.clientId || a.userId || a.user?._id;
        const email = a.clientEmail || a.clientId?.email;
        return (uid && cid && String(cid) === String(uid)) || (userEmail && email && email === userEmail);
      }) : [];
      setAppointments(filtered);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          My Appointments
        </h2>
        <p className="text-gray-600">Track and manage your legal consultations</p>
      </div>
      
      {loading ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <p className="text-gray-600 text-lg">Loading your appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No appointments yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't booked any appointments with lawyers yet. Start your legal journey by finding the right lawyer for your needs.
          </p>
          <button
            onClick={() => window.location.href = '/lawyers'}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Find Lawyers
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment._id || appointment.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">⚖️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {appointment.lawyerName || 'Lawyer Name'}
                      </h3>
                      <p className="text-gray-600 font-medium mb-2">{appointment.caseType}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">📅</span>
                          <span className="text-gray-700">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">🕐</span>
                          <span className="text-gray-700">{appointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">💰</span>
                          <span className="text-gray-700 font-semibold">
                            PKR {appointment.consultationFee?.toLocaleString() || '2,000'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">💳</span>
                          <span className="text-gray-700">{appointment.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                    appointment.status === 'confirmed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                    appointment.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                    appointment.status === 'completed' ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white' :
                    appointment.status === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                    'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}>
                    {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                  </span>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    appointment.paymentStatus === 'unpaid' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Payment: {appointment.paymentStatus}
                  </div>
                  
                  {appointment.meetingLink && (
                    <a 
                      href={appointment.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// User Settings Component
function UserSettings({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/user/profile', formData);
      if (response.data?.success) {
        onUpdate();
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Settings
          </h2>
          <p className="text-gray-600">Manage your account preferences and personal information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${
            isEditing 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-xl' 
              : 'bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:shadow-xl'
          }`}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="space-y-8">
            <div>
              <label className="flex text-sm font-bold text-gray-700 mb-3 items-center">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-gray-600">👤</span>
                </span>
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your first name"
                />
              ) : (
                <div className="bg-white/60 rounded-xl p-4">
                  <p className="text-lg font-medium text-gray-900">{user?.firstname || 'Not provided'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="flex text-sm font-bold text-gray-700 mb-3 items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">👤</span>
                </span>
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your last name"
                />
              ) : (
                <div className="bg-white/60 rounded-xl p-4">
                  <p className="text-lg font-medium text-gray-900">{user?.lastname || 'Not provided'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="flex text-sm font-bold text-gray-700 mb-3 items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">📧</span>
                </span>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="bg-white/60 rounded-xl p-4">
                  <p className="text-lg font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
