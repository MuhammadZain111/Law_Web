import { Link, Navigate, Route, Routes } from "react-router-dom";
import UserLogin from './components/common/Login.jsx';
import { Toaster } from "./hooks/use-toast";
import About from './screens/About';
import AdminLayout from './screens/Admin/AdminLayout';
import Dashboard from './screens/Admin/Dashboard';
import AdminLogin from './screens/Admin/Login';
import NotificationBell from './screens/Admin/NotificationBell';
import ProfileForm from './screens/Admin/ProfileForm';
import AppointmentBooking from './screens/AppointmentBooking.jsx';
import Contact from './screens/Contact.jsx';
import Home from './screens/Home';
import LawyerProfile from './screens/Lawyer/LawyerProfile.jsx';
import LawyerDashboard from './screens/LawyerDashboard';
import Lawyers from './screens/Lawyers.jsx';
import LoginSelection from './screens/LoginSelection.jsx';
import NoPage from './screens/NoPage';
import RegisterLawyer from './screens/RegisterLawyer';
import RegisterUser from './screens/RegisterUser';
import RegistrationSelection from './screens/RegistrationSelection';
import ServiceDetail from './screens/ServiceDetail';
import Services from './screens/Services';
import UserDashboard from './screens/UserDashboard.jsx';

const App = () => {
  const RequireAdminAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
  };
  const getRoleFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userType || payload.role || null;
    } catch {
      return null;
    }
  };

  const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  const RequireRole = ({ role, children }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType') || localStorage.getItem('role') || getRoleFromToken();
    if (!token) return <Navigate to={role === 'admin' ? "/admin/login" : "/login"} replace />;
    if (role && userType !== role) return <Navigate to={role === 'admin' ? "/admin/login" : "/"} replace />;
    return children;
  };

  const RequireAdmin = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userType') || localStorage.getItem('role') || getRoleFromToken();
    if (!token) return <Navigate to="/admin/login" replace />;
    if (role !== 'admin') return <Navigate to="/admin/login" replace />;
    return children;
  };
  return (
   <div>
      <Toaster />
      
      <nav>


        <Link to="/"></Link> 
        <Link to="/about"></Link>
        <Link to="/contact"></Link>
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
      <Route path="/contact" element={<Contact />} />

      <Route path="/registration-selection" element={<RegistrationSelection />} />
      <Route path="/registerUser" element={<RegisterUser />} />
      <Route path="/registerLawyer" element={<RegisterLawyer />} />
      <Route path="/lawyerDashboard" element={<RequireRole role="lawyer"><LawyerDashboard /></RequireRole>} />
      <Route path="/lawyerdashboard" element={<RequireRole role="lawyer"><LawyerDashboard /></RequireRole>} />
      <Route path="/userDashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:serviceId" element={<ServiceDetail />} />
      <Route path="/login" element={<LoginSelection />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/login" element={<RegisterUser />} />
      <Route path="/lawyer/login" element={<RegisterLawyer />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<RequireAdminAuth><AdminLayout /></RequireAdminAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
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
