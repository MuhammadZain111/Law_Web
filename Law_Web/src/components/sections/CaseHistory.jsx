import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', cases: 30 },
  { name: 'Feb', cases: 45 },
  { name: 'Mar', cases: 60 },
  { name: 'Apr', cases: 40 },
  { name: 'May', cases: 80 },
];

function CaseHistory() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Case History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="cases" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CaseHistory;
