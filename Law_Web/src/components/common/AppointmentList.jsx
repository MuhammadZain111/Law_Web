import React from 'react';
import AppointmentCard from './AppointmentCard';

function AppointmentList({ appointments = [] }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="mt-6 text-sm text-gray-600">
        No appointments yet. Book one to get started.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {appointments.map((apt) => (
        <AppointmentCard key={apt._id || apt.id} appointment={apt} />
      ))}
    </div>
  );
}

export default AppointmentList;
