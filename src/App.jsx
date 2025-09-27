import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './screens/Home';
import About from './screens/About';
import NoPage from './screens/NoPage';
import RegisterLawyer from './screens/RegisterLawyer';
import RegisterUser from './screens/RegisterUser';
import RegistrationSelection from './screens/RegistrationSelection';
import LawyerDashboard from './screens/LawyerDashboard.jsx';
import Services from './screens/Services';
import LawyerDetail from './screens/LawyerDetail';
import BookAppointment from './screens/BookAppointment';
import LawyersList from './screens/LawyersList';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navigation from './components/common/Navigation';

const App = () => {
  return (
   <div>
      <Navigation />

      <Routes>
        <Route path="/" element={
          <ProtectedRoute allowedUserTypes={['user']}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/registration-selection" element={<RegistrationSelection />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerLawyer" element={<RegisterLawyer />} />
        <Route path="/lawyerDashboard" element={
          <ProtectedRoute allowedUserTypes={['lawyer']}>
            <LawyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/services" element={<Services />} />
        <Route path="/lawyers" element={<LawyersList />} />
        <Route path="/lawyer/:lawyerId" element={<LawyerDetail />} />
        <Route path="/book-appointment/:lawyerId" element={<BookAppointment />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
   </div>

   
      
  );
};

export default App;
