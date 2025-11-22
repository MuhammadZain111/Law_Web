import { userAPI } from '@/services/api';
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CustomNavbar() {
  const customTheme = {
    root: {
      base: "backdrop-blur bg-white/70 border-b border-gray-200 px-4 md:px-8 py-3 sticky top-0 z-50",
      rounded: "rounded-lg",
      bordered: "",
    },
  };

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('User');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/100');
  const [showCard, setShowCard] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    setIsLoggedIn(!!token);
    setUserType(type);
    if (token) {
      // Load basic profile data for avatar/name; ignore errors silently
      (async () => {
        try {
          const res = await userAPI.getProfile?.();
          const data = res?.data || res; // handle either shape
          const u = data?.user || data; // some endpoints return { user }
          if (u) {
            if (u.name) setUserName(u.name);
            if (u.fullName) setUserName(u.fullName);
            if (u.username) setUserName(u.username);
            if (u.firstname || u.lastname) setUserName(`${u.firstname || ''} ${u.lastname || ''}`.trim() || userName);
            if (u.avatarUrl) setAvatarUrl(u.avatarUrl);
            if (u.profileImage) setAvatarUrl(u.profileImage);
            if (u.photoUrl) setAvatarUrl(u.photoUrl);
          }
        } catch (_) {
          // fall back silently
        }
      })();
    }
  }, []);

  const goToRegister = () => {
    navigate('/registerUser');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToProfile = () => {
    // Decide which dashboard/profile to show based on saved userType
    if (userType === 'lawyer') {
      navigate('/lawyerDashboard');
    } else if (userType === 'admin') {
      navigate('/admin');
    } else {
      // default to user dashboard
      navigate('/userDashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  const linkClass = "text-gray-700 hover:text-gray-900 transition-colors"

  return (
    <Navbar fluid rounded theme={customTheme} className='px-0'>
      <NavbarBrand href="/" className="items-center">
        <img src="/logoo.png" className="mr-3 h-9 w-9 object-contain" alt="Law Sphere Logo" />
        <span className="self-center whitespace-nowrap text-2xl font-extrabold tracking-tight text-gray-900">Law Sphere</span>
      </NavbarBrand>

      <NavbarToggle />

      <NavbarCollapse className="md:mx-6">
        <NavbarLink as={Link} to="/" className={linkClass} active>Home</NavbarLink>
        <NavbarLink as={Link} to="/about" className={linkClass}>About</NavbarLink>
        <NavbarLink as={Link} to="/services" className={linkClass}>Services</NavbarLink>
        <NavbarLink as={Link} to="/contact" className={linkClass}>Contact</NavbarLink>
      </NavbarCollapse>

      <div className="flex md:order-2 gap-2 items-center">
        {isLoggedIn && userType === 'user' ? (
          <div
            className="relative"
            onMouseEnter={() => setShowCard(true)}
            onMouseLeave={() => setShowCard(false)}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-gray-200 overflow-hidden cursor-pointer"
              onClick={goToProfile}
              aria-label="Open profile"
            >
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            </button>

            {showCard && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg p-3">
                <div className="flex items-center gap-3">
                  <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-sm font-semibold text-gray-900 truncate">{userName}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-gray-700 hover:text-red-600 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
        <Button color="light" className="border-2 bg-lightbrown  hover:bg-white hover:text-black  hover:border-black border-lightbrown    text-white transition-all duration-200 cursor-pointer" onClick={goToLogin}>Login</Button>
            <div className="relative">
              <Button
                className="border-2 bg-lightbrown  hover:bg-white hover:text-black  hover:border-black border-lightbrown    text-white transition-all duration-200 cursor-pointer    "
                onClick={() => setShowRegisterMenu((v) => !v)}
                onBlur={() => setTimeout(() => setShowRegisterMenu(false), 120)}
              >
                Register
              </Button>
              {showRegisterMenu && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg p-1 z-50">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setShowRegisterMenu(false); navigate('/registerUser'); }}
                  >
                    User Signup
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setShowRegisterMenu(false); navigate('/registerLawyer'); }}
                  >
                    Lawyer Signup
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Navbar>
  );
}

export default CustomNavbar;
