import { Avatar, Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CustomNavbar() {
  const customTheme = {
    root: {
      base: "bg-[#f5e1da] px-6 py-3 shadow-md",
      rounded: "rounded-lg",
      bordered: "",
    },
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsAuthenticated(!!localStorage.getItem('token'));
    check();
    const onStorage = (e) => { if (e.key === 'token') check(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    // Re-check auth on route changes (same-tab updates after login/logout)
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [location.pathname]);

  const goToRegister = () => {
    navigate('/registration-selection');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToProfile = () => {
    const userType = (localStorage.getItem('userType') || '').toLowerCase();
    if (userType === 'lawyer') navigate('/lawyerDashboard');
    else navigate('/user/dashboard');
  };

  const handleLogout = () => {
    try { localStorage.removeItem('token'); } catch (_e) {}
    try { localStorage.removeItem('userType'); } catch (_e) {}
    navigate('/login');
  };

  return (
    <Navbar fluid rounded theme={customTheme} className='!bg-[#f4e7df] px-4 py-4'>
      <NavbarBrand href="/">
        <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
        <span className="self-center whitespace-nowrap text-2xl font-bold text-primary">Law Sphere</span>
      </NavbarBrand>

      <NavbarToggle />

      <NavbarCollapse>
        <NavbarLink as={Link} to="/" className="text-white" active>Home</NavbarLink>
        <NavbarLink as={Link} to="/about" className="text-white">About</NavbarLink>
        <NavbarLink as={Link} to="/services" className="text-white">Services</NavbarLink>
        <NavbarLink as={Link} to="/pricing" className="text-white">Pricing</NavbarLink>
        <NavbarLink as={Link} to="/contact" className="text-white">Contact</NavbarLink>
      </NavbarCollapse>

      <div className="flex md:order-2 gap-2">
        {!isAuthenticated && (
          <>
            <Button className="!bg-lightbrown !text-white cursor-pointer" onClick={goToLogin}>Login</Button>
            <Button className="!bg-lightbrown cursor-pointer !hover:bg-darkbrown text-white" onClick={goToRegister}>Register</Button>
          </>
        )}
        {isAuthenticated && (
          <div
            className="relative"
            onMouseEnter={() => {
              if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
              }
              setIsMenuOpen(true);
            }}
            onMouseLeave={() => {
              hideTimerRef.current = setTimeout(() => {
                setIsMenuOpen(false);
                hideTimerRef.current = null;
              }, 150);
            }}
          >
            <div className="cursor-pointer">
              <Avatar alt="Profile" img={undefined} rounded className="ring-2 ring-white/50" />
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 top-full w-44 rounded-md border border-gray-200 bg-white py-2 shadow-xl z-[100]">
                <div className="px-3 pb-2 text-xs font-semibold text-gray-500">Account</div>
                <button
                  onClick={goToProfile}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <div className="my-1 h-px bg-gray-200" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Navbar>
  );
}

export default CustomNavbar;
