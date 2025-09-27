import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedUserTypes }) {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/registration-selection" replace />;
  }

  // If user type is not allowed, redirect to appropriate dashboard
  if (!allowedUserTypes.includes(userType)) {
    if (userType === 'lawyer') {
      return <Navigate to="/lawyerDashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
