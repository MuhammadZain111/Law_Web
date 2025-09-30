import React from 'react'


function AppointmentCard() {
    
    const { clientName, date, time, caseType, status } = appointment;
     
    
return (
    <div>
      
      <div className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center mb-4">
      <div>
        <h3 className="text-xl font-semibold">{clientName}</h3>
        <p className="text-sm text-gray-600 flex items-center">
          <Calendar className="w-4 h-4 mr-1" /> {date} &nbsp;
          <Clock className="w-4 h-4 mr-1 ml-3" /> {time}
        </p>
        <p className="text-sm text-gray-500">Case: {caseType}</p>
      </div>
      <span
        className={`text-sm px-3 py-1 rounded-full ${
          status === "upcoming"
            ? "bg-blue-100 text-blue-700"
            : status === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status}
      </span>
    </div>



    </div>
  )
}

export default AppointmentCard
