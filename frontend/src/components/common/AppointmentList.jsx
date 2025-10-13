import React, { useEffect, useState } from 'react';
import { api } from '@/shared/api';

const mockAppointments = [
  {
    id: 1,
    clientName: "John Doe",
    date: "2025-05-10",
    time: "2:00 PM",
    caseType: "Family Law",
    status: "upcoming",
  },
  {
    id: 2,
    clientName: "Jane Smith",
    date: "2025-04-25",
    time: "11:00 AM",
    caseType: "Criminal Law",
    status: "completed",
  },
  {
    id: 3,
    clientName: "Alan Grey",
    date: "2025-05-04",
    time: "4:30 PM",
    caseType: "Civil Dispute",
    status: "pending",
  },
];

function AppointmentList() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        // Load user appointments from backend; expected to include status updates
        const res = await api.get('/appointments/');
        const data = res?.data?.appointments || res?.appointments || [];
        // Normalize to our UI shape while preserving status
        const mapped = data.map((a, idx) => ({
          id: a._id || idx,
          clientName: a.clientName || a.userName || a.user?.firstname || 'You',
          date: a.date?.slice(0,10) || a.scheduledDate || '',
          time: a.time || a.scheduledTime || '',
          caseType: a.caseType || a.subject || '—',
          status: a.status || 'pending',
        }));
        if (mapped.length) setAppointments(mapped);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="mt-6">Loading appointments…</div>;
  if (error) return <div className="mt-6 text-red-600">{error}</div>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      {appointments.length === 0 && <div className="text-gray-600">No appointments yet.</div>}
      {appointments.map((appointment) => (
        <div key={appointment.id} className="border p-4 mb-3 rounded shadow">
          <p><strong>Client:</strong> {appointment.clientName}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Case Type:</strong> {appointment.caseType}</p>
          <p><strong>Status:</strong> {appointment.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AppointmentList;
