import React from 'react';
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';

function CustomNavbar() {
  const customTheme = {
    root: {
      base: "bg-[#f5e1da] px-6 py-3 shadow-md",
      rounded: "rounded-lg",
      bordered: "",
    },
  };

  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/registration-selection');
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
        <Button className="!bg-lightbrown !text-white cursor-pointer">Login</Button>
        <Button className="!bg-lightbrown cursor-pointer !hover:bg-darkbrown text-white" onClick={goToRegister}>Register</Button>
      </div>
    </Navbar>
  );
}

export default CustomNavbar;
