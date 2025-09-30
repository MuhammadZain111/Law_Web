import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../../shared/api.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else setAuthToken(token);
  }, [navigate]);

  async function logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex h-14 items-center gap-6">
            <div className="font-semibold text-lg">Lawyer Admin</div>
            <Link to="/admin" className={`hover:text-blue-600 ${location.pathname === '/admin' ? 'text-blue-600' : 'text-gray-700'}`}>Dashboard</Link>
            <Link to="/admin/approvals" className={`hover:text-blue-600 ${location.pathname.includes('/admin/approvals') ? 'text-blue-600' : 'text-gray-700'}`}>Approvals</Link>
            <div className="ml-auto">
              <button onClick={logout} className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}


