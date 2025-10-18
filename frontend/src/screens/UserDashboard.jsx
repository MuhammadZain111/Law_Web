import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api.js';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    let isMounted = true;
    const load = async () => {
      try {
        const { data } = await api.get('/v1/appointments');
        if (!isMounted) return;
        const list = Array.isArray(data?.appointments) ? data.appointments : [];
        setAppointments(list);
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    // Optional: simple polling every 20s for updates
    const id = setInterval(load, 20000);
    return () => { isMounted = false; clearInterval(id); };
  }, [navigate]);

  const approvedOrConfirmed = appointments.filter(a => a?.status === 'confirmed' || a?.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-3xl px-4">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Your Dashboard</h1>

        {loading && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">Loading...</div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Notifications</h2>
              {approvedOrConfirmed.length === 0 ? (
                <p className="text-sm text-gray-600">No new notifications.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {approvedOrConfirmed.map((a) => (
                    <li key={a._id} className="py-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Appointment confirmed</p>
                          <p className="text-sm text-gray-600">With lawyer {a?.lawyerId?.name || a?.lawyerId?.email || 'N/A'}</p>
                          <p className="text-xs text-gray-500">On {a?.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : 'TBD'} ({a?.timeSlot || 'time TBD'})</p>
                        </div>
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{a.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">All Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-sm text-gray-600">You have no appointments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-gray-700">
                      <tr>
                        <th className="py-2 pr-4">Lawyer</th>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Time</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.map((a) => (
                        <tr key={a._id}>
                          <td className="py-2 pr-4">{a?.lawyerId?.name || a?.lawyerId?.email || 'N/A'}</td>
                          <td className="py-2 pr-4">{a?.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : '-'}</td>
                          <td className="py-2 pr-4">{a?.timeSlot || '-'}</td>
                          <td className="py-2 pr-4">{a?.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




