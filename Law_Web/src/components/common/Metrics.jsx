import React from 'react';

// import { FaUser, FaChartLine, FaDollarSign } from 'react-icons/fa'; // Example icons


function Metrics() {
  const metrics = [
    {
      icon: FaUser,
      label: 'Total Users',
      value: 1200,
      color: 'border-blue-500'
    },
    {
      icon: FaChartLine,
      label: 'Monthly Growth',
      value: '15%',
      color: 'border-green-500'
    },
    {
      icon: FaDollarSign,
      label: 'Revenue',
      value: '$25,000',
      color: 'border-yellow-500'
    }
  ];

  return (
   
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className={`border-l-4 ${color} bg-white p-4 rounded shadow flex items-center space-x-4`}
        >
          <Icon className="w-8 h-8 text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Metrics;
