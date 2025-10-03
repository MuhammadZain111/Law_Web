import React, { useEffect, useState } from 'react';
import AppointmentList from '@/components/common/AppointmentList';
import { appointmentAPI } from '@/services/api';
import { isAuthenticated } from '@/utils/auth';

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setAuthed(!!localStorage.getItem('token'));
        const res = await appointmentAPI.getAppointments();
        setAppointments(res.appointments || []);
      } catch (e) {
        setError(e.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading appointments...</div>;
  if (error) return <div className="max-w-6xl mx-auto p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      {!authed && (
        <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
          You are not logged in. Please login to see your appointments.
        </div>
      )}
      <AppointmentList appointments={appointments} />
    </div>
  );
}



