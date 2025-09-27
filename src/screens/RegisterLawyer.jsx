import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import LawyerLogin from '../components/common/LawyerLogin';
import LawyerSignup from '../components/common/LawyerSignup';

function RegisterLawyer() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/lawyerDashboard');  
  };

  const goBack = () => {
    navigate('/registration-selection');
  };

  const [isRegistering, setIsRegistering] = useState(false);

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
          {isRegistering ? (
            <LawyerSignup onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <LawyerLogin onSwitchToSignup={() => setIsRegistering(true)} />
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

export default RegisterLawyer;