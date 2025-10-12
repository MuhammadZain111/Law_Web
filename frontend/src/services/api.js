// API service for lawyer dashboard
const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5000';
const API_BASE_URL = `${API_BASE}/api/v1`;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Appointment API functions
export const appointmentAPI = {
  // Get all appointments for lawyer
  getAppointments: async () => {
    return apiRequest('/appointments/');
  },

  // Get single appointment details
  getAppointment: async (id) => {
    return apiRequest(`/appointments/${id}`);
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    return apiRequest(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: 'POST',
    });
  },

  // Create new appointment (for booking form)
  createAppointment: async (appointmentData) => {
    return apiRequest('/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get available time slots
  getAvailableTimeSlots: async (lawyerId, date) => {
    return apiRequest(`/appointments/available-slots/${lawyerId}?date=${date}`);
  },
};

// Lawyer API functions
export const lawyerAPI = {
  // Get all lawyers
  getAllLawyers: async () => {
    return apiRequest('/appointments/lawyers');
  },

  // Get lawyer by ID
  getLawyerById: async (lawyerId) => {
    return apiRequest(`/appointments/lawyers/${lawyerId}`);
  },
};

// User API functions
export const userAPI = {
  // Login
  login: async (email, password) => {
    return apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  register: async (userData) => {
    return apiRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiRequest('/user/profile');
  },
};

// Reminder API functions
export const reminderAPI = {
  // Get upcoming appointments
  getUpcomingAppointments: async (hours = 24) => {
    return apiRequest(`/reminders/upcoming?hours=${hours}`);
  },

  // Update reminder preferences
  updateReminderPreferences: async (appointmentId, preferences) => {
    return apiRequest(`/reminders/preferences/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  },

  // Send manual reminder (lawyer only)
  sendManualReminder: async (appointmentId, reminderType) => {
    return apiRequest(`/reminders/send/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify({ reminderType }),
    });
  },

  // Admin functions
  getSchedulerStatus: async () => {
    return apiRequest('/reminders/admin/status');
  },

  triggerReminderJob: async (reminderType) => {
    return apiRequest('/reminders/admin/trigger', {
      method: 'POST',
      body: JSON.stringify({ reminderType }),
    });
  },

  getReminderStats: async () => {
    return apiRequest('/reminders/admin/stats');
  }
};

export default {
  appointmentAPI,
  lawyerAPI,
  userAPI,
  reminderAPI,
};
