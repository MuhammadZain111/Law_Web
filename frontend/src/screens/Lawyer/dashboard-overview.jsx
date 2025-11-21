import React from "react";

export function DashboardOverview({ user, appointments = [], pendingCount = 0, todaysAppointments = [], recentActivity = [], onNavigate }) {
  // Compute stats dynamically from props
  const activeCases = Array.isArray(appointments)
    ? appointments.filter(a => (a.caseStatus || '').toLowerCase() !== 'completed').length
    : 0;
  const completedConsults = Array.isArray(appointments)
    ? appointments.filter(a => (a.status || '').toLowerCase() === 'completed').length
    : 0;
  const outstandingPayments = Array.isArray(appointments)
    ? appointments.reduce((sum, a) => sum + (a.paymentStatus === 'unpaid' ? Number(a.consultationFee || 0) : 0), 0)
    : 0;

  const stats = [
    { title: 'Active Cases', value: String(activeCases), change: '', color: 'bg-blue-500' },
    { title: 'Pending Appointments', value: String(pendingCount), change: '', color: 'bg-orange-500' },
    { title: 'Completed Consultations', value: String(completedConsults), change: '', color: 'bg-green-500' },
    { title: 'Outstanding Payments', value: `PKR ${outstandingPayments.toLocaleString()}`, change: '', color: 'bg-red-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        {(() => {
          const display = (user?.fullName || user?.name || [user?.firstname || user?.firstName, user?.lastname || user?.lastName].filter(Boolean).join(' ') || user?.username || user?.email || '')
          return (
            <h1 className="text-3xl font-serif font-bold mb-2">Welcome back{display ? `, ${display}` : ''}</h1>
          )
        })()}
        <p className="text-gray-500">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded shadow bg-white`}
            style={{ borderLeftColor: stat.color.replace("bg-", "") }}
          >
            <p className="text-sm text-gray-500">{stat.title}</p>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-serif mb-4">Today's Appointments</h2>
          <div className="space-y-4">
            {todaysAppointments.map((a, index) => {
              const name = a.clientName || a.userName || a.client?.name || 'Client'
              const type = a.caseType || a.consultationType || 'Consultation'
              const time = new Date(a.appointmentDate || a.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              const status = (a.status || '').toLowerCase()
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-500">{type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{time}</p>
                    <span className={`px-2 py-1 text-xs rounded ${status === 'confirmed' ? 'bg-green-200 text-green-800' : status === 'pending' ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-300 text-gray-800'}`}>
                      {status || 'scheduled'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <button 
            onClick={() => onNavigate && onNavigate("appointments")}
            className="w-full mt-4 border rounded py-2 bg-transparent hover:bg-gray-50 transition-colors"
          >
            View All Appointments
          </button>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-serif mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((n, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">{n.title || n.message || 'Update'}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt || n.time || Date.now()).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 border rounded py-2 bg-transparent">View All Notifications</button>
        </div>
      </div>
    </div>
  );
}
