import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import Login from '../components/common/Login';
import Signup from '../components/common/Signup';

function RegisterUser() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const goBack = () => {
    navigate('/registration-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isRegistering ? "Join thousands of users accessing legal services" : "Sign in to continue to your account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {isRegistering ? (
            <Signup onSwitchToLogin={() => setIsRegistering(false)} userType="user" />
          ) : (
            <Login onSwitchToSignup={() => setIsRegistering(true)} expectedUserType="user" />
          )}
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

export default RegisterUser;
