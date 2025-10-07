import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
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

  const goToRegister = () => {
    navigate('/registration-selection');
  };

  const goToLogin = () => {
    navigate('/login');
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
        <NavbarLink as={Link} to="/pricing" className={linkClass}>Pricing</NavbarLink>
        <NavbarLink as={Link} to="/contact" className={linkClass}>Contact</NavbarLink>
      </NavbarCollapse>

      <div className="flex md:order-2 gap-2">
        <Button color="light" className="border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={goToLogin}>Login</Button>
        <Button className="!bg-emerald-600 hover:!bg-emerald-700 text-white" onClick={goToRegister}>Register</Button>
      </div>
    </Navbar>
  );
}

export default CustomNavbar;
