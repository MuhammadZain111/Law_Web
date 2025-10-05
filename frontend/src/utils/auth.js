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
  // This token was obtained by logging in with testlawyer123@example.com (Test Lawyer)
  const realToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGUwZjU4MGE1ZTVlYTE1MDdlZWYxNmMiLCJpYXQiOjE3NTk1NzMzNzYsImV4cCI6MTc1OTY1OTc3Nn0.A-HkqQUm-84LEiq57caQ0Fk-8QkNfBGueaUoUlraUtI';
  setAuthToken(realToken);
  return realToken;
};
