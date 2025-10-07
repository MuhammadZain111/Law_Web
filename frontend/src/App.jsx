import { Link, Navigate, Route, Routes } from "react-router-dom";
import About from './screens/About';
import Home from './screens/Home';
import LawyerDashboard from './screens/LawyerDashboard';
import NoPage from './screens/NoPage';
import RegisterLawyer from './screens/RegisterLawyer';
import RegisterUser from './screens/RegisterUser';
import RegistrationSelection from './screens/RegistrationSelection';
import Services from './screens/Services';
// import LawyerPage from '@/components/sections/LawyerPage'

 import AppointmentBooking from '@/screens/AppointmentBooking';
import LawyerProfile from '@/screens/Lawyer/LawyerProfile';
import Lawyers from './screens/Lawyers.jsx';
import AdminLayout from './screens/Admin/AdminLayout';
import Dashboard from './screens/Admin/Dashboard';
import NotificationBell from './screens/Admin/NotificationBell';
import ProfileForm from './screens/Admin/ProfileForm';
import LoginSelection from './screens/LoginSelection.jsx';

const App = () => {
  const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };
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
      <Route path="/lawyer/profile" element={<ProfileForm />} />
       
       <Route path="/lawyer/notifications" element={<NotificationBell />} />
      


      <Route path="/about" element={<About />} />
      <Route path="/registration-selection" element={<RegistrationSelection />} />
      <Route path="/registerUser" element={<RegisterUser />} />
      <Route path="/registerLawyer" element={<RegisterLawyer />} />
      <Route path="/lawyerDashboard" element={<LawyerDashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/login" element={<LoginSelection />} />
      {/* optional dedicated login routes if you have separate pages */}
      {/* <Route path="/user/login" element={<UserLogin />} /> */}
      {/* <Route path="/lawyer/login" element={<LawyerLogin />} /> */}
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/lawyers" element={<Lawyers />} />
      <Route path="/lawyers/:id" element={<LawyerProfile />} />
      <Route path="/lawyers/:id/book" element={<AppointmentBooking />} />



        <Route path="*" element={<NoPage />} />
      </Routes>
   </div>

   
      
  );
};

export default App;
