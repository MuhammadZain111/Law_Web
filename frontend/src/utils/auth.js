// Authentication utilities
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Mock authentication for testing
export const mockLogin = () => {
  // Use a real JWT token from the backend for testing
  // This token was obtained by logging in with testlawyer789@example.com (Test Lawyer with appointment)
  const realToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQ3ZjFmZjFlMDJlNDBmMTAyMzMxZjciLCJpYXQiOjE3NTkwNTA2NDUsImV4cCI6MTc1OTEzNzA0NX0.XRtIRy_G7_PSH83wxszSoWhO7k5N_-L9rAeO2EP1zow';
  setAuthToken(realToken);
  return realToken;
};
