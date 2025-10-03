import React from 'react';

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
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      {mockAppointments.map((appointment) => (
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
