import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, User, LogOut } from 'lucide-react';

function Navigation() {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/registration-selection');
  };

  if (!token) {
    return null; // Don't show navigation if not logged in
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">Legal Services</span>
            </button>
            
            {userType === 'user' && (
              <button
                onClick={() => navigate('/lawyers')}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600"
              >
                <Users className="w-5 h-5" />
                <span>Find Lawyers</span>
              </button>
            )}
            
            {userType === 'lawyer' && (
              <button
                onClick={() => navigate('/lawyerDashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-600"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Logged in as: <span className="font-medium capitalize">{userType}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
