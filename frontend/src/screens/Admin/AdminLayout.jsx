import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../../shared/api.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');
<<<<<<< HEAD
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    setAuthToken(token);
    try {
      const [, payload] = String(token).split('.');
      if (payload) {
        const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')) || '{}');
        const role = json?.role || json?.userType;
        if (role && (!localStorage.getItem('userType') || !localStorage.getItem('role'))) {
          try { localStorage.setItem('userType', role); } catch (_) {}
          try { localStorage.setItem('role', role); } catch (_) {}
        }
      }
    } catch (_e) {}
=======
    if (!token) navigate('/admin/login');
    else setAuthToken(token);
>>>>>>> c6f8526e07d7162144cd0716876751c0573db4cf
  }, [navigate]);

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (_e) {
      // ignore network errors; proceed to clear client state
    } finally {
      try { localStorage.removeItem('token'); } catch (_e) {}
      try { localStorage.removeItem('userType'); } catch (_e) {}
      setAuthToken(null);
      navigate('/admin/login', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <nav className="sticky top-0 z-10 border-b border-gray-800 bg-[#0f0f0f]">
        <div className="px-4">
          <div className="flex h-14 items-center gap-6">
            <div className="font-semibold text-lg">Lawyer Admin</div>
            {/* Sidebar handles navigation; top bar keeps brand + logout only */}
            <div className="ml-auto">
              <button onClick={logout} className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="px-0 py-0">
        <Outlet />
      </main>
    </div>
  );
}


