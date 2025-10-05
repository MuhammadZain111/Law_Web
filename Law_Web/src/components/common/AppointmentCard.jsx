import React from 'react'

function AppointmentCard({ appointment }) {
  const {
    clientName,
    clientEmail,
    clientPhone,
    caseType,
    appointmentDate,
    timeSlot,
    status,
    consultationFee
  } = appointment || {};

  const dateStr = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString()
    : "";

  const badgeClass =
    status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "rejected" || status === "cancelled"
      ? "bg-red-100 text-red-700"
      : status === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700"; // pending

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{clientName}</h3>
          <p className="text-sm text-gray-500">{clientEmail} {clientPhone && `• ${clientPhone}`}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${badgeClass}`}>{status}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
        <div className="text-gray-600">Date</div>
        <div className="font-medium">{dateStr}</div>

        <div className="text-gray-600">Time</div>
        <div className="font-medium">{timeSlot}</div>

        <div className="text-gray-600">Case Type</div>
        <div className="font-medium">{caseType}</div>

        {typeof consultationFee !== 'undefined' && (
          <>
            <div className="text-gray-600">Fee</div>
            <div className="font-medium">PKR {consultationFee}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard
