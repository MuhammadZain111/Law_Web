import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './screens/Home';
import About from './screens/About';
import NoPage from './screens/NoPage';
import RegisterLawyer from './screens/RegisterLawyer';
import RegisterUser from './screens/RegisterUser';
import RegistrationSelection from './screens/RegistrationSelection';
import LawyerDashboard from './screens/LawyerDashboard';
import Services from './screens/Services';
import LawyersPage from './screens/LawyersPage';
// import LawyerPage from '@/components/sections/LawyerPage'

 import LawyerProfile from '@/screens/Lawyer/LawyerProfile'
import AppointmentBooking from '@/screens/AppointmentBooking'
import { Toaster } from '@/screens/Lawyer/ui/toaster'
import { toast } from '@/hooks/use-toast'
import UserAppointments from '@/screens/UserAppointments'

const App = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__toast = (msg = 'Test toast') => toast({ title: msg })
    }
  }, [])

  return (
   <div>

       <nav>
        <Link to="/"></Link> 
        <Link to="/about"></Link>
        <Link to="/registerLawyer"></Link>
        <Link to="/lawyerDashboard"></Link>
        <Link to="/services"></Link>
        <Link to="/lawyerdashboard"></Link>
        <Link  to="/lawyers" ></Link>

      </nav>

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/registration-selection" element={<RegistrationSelection />} />
      <Route path="/registerUser" element={<RegisterUser />} />
      <Route path="/registerLawyer" element={<RegisterLawyer />} />
      <Route path="/lawyerDashboard" element={<LawyerDashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/lawyers" element={<LawyersPage />} />
      <Route path="/lawyers/:id" element={<LawyerProfile />} />
      <Route path="/lawyers/:id/book" element={<AppointmentBooking />} />
      <Route path="/my-appointments" element={<UserAppointments />} />



        <Route path="*" element={<NoPage />} />
      </Routes>
      <Toaster />
   </div>

   
      
  );
};

export default App;
