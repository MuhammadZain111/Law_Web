import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Scale } from 'lucide-react';

function RegistrationSelection() {
  const navigate = useNavigate();

  const goToUserRegistration = () => {
    navigate('/registerUser');
  };

  const goToLawyerRegistration = () => {
    navigate('/registerLawyer');
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Law Sphere</h1>
          <p className="text-xl text-gray-600">Choose how you'd like to join our legal community</p>
        </div>

        {/* Registration Options */}
        <div className="space-y-6">
          {/* User Registration Card */}
          <div 
            onClick={goToUserRegistration}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl group"
          >
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">User Signup</h3>
                <p className="text-gray-600 mb-4">Register as a client seeking legal services and connect with qualified lawyers</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Get Started</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lawyer Registration Card */}
          <div 
            onClick={goToLawyerRegistration}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl group"
          >
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Scale className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Lawyer Signup</h3>
                <p className="text-gray-600 mb-4">Register as a legal professional and start connecting with clients who need your expertise</p>
                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                  <span>Join as Lawyer</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={goBack}
            className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSelection;
