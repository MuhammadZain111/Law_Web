// API service for appointment management
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API headers with authentication
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Appointment API functions
export const appointmentAPI = {
  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get all appointments for a lawyer
  getLawyerAppointments: async (lawyerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/lawyer/${lawyerId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching lawyer appointments:', error);
      throw error;
    }
  },

  // Get all appointments for a client
  getClientAppointments: async (clientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/client/${clientId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client appointments:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status, notes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, reason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  // Get available time slots for a lawyer on a specific date
  getAvailableTimeSlots: async (lawyerId, date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/available-slots/${lawyerId}?date=${date}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch available slots');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }
};

// Lawyer API functions
export const lawyerAPI = {
  // Get all lawyers
  getAllLawyers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lawyers`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch lawyers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      throw error;
    }
  },

  // Get lawyer by ID
  getLawyerById: async (lawyerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lawyers/${lawyerId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch lawyer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching lawyer:', error);
      throw error;
    }
  }
};

// User API functions
export const userAPI = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};

export default {
  appointmentAPI,
  lawyerAPI,
  userAPI
};
