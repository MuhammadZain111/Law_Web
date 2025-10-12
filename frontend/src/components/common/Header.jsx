import { Link, useNavigate } from "react-router-dom"
import Button from "./ui/Button.jsx"
import { Scale } from "./icons/Icons.jsx"
import { useState, useEffect } from "react"

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    setIsLoggedIn(!!token);
    setUserType(type);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
          <Scale className="h-6 w-6 mr-2 text-primary" />
          LawSphere
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/lawyers" className="text-gray-600 hover:text-gray-900 transition-colors">
            Find Lawyers
          </Link>
          <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
            Services
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </div>
        <div className="flex space-x-3">
          {isLoggedIn ? (
            <>
              <Link to={userType === 'lawyer' ? '/lawyerDashboard' : '/userDashboard'}>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Login
                </Button>
              </Link>
              <Link to="/registration-selection">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
