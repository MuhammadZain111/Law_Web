import React from "react";
import { FileText, Clock, CheckCircle, DollarSign, Calendar, User, ArrowRight } from "lucide-react";

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
    { 
      title: 'Active Cases', 
      value: String(activeCases), 
      change: '', 
      color: 'border-l-amber-500', 
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: FileText
    },
    { 
      title: 'Pending Appointments', 
      value: String(pendingCount), 
      change: '', 
      color: 'border-l-amber-500', 
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      icon: Clock
    },
    { 
      title: 'Completed Consultations', 
      value: String(completedConsults), 
      change: '', 
      color: 'border-l-amber-400', 
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: CheckCircle
    },
    { 
      title: 'Outstanding Payments', 
      value: `PKR ${outstandingPayments.toLocaleString()}`, 
      change: '', 
      color: 'border-l-amber-300', 
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: DollarSign
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        {(() => {
          const display = (user?.fullName || user?.name || [user?.firstname || user?.firstName, user?.lastname || user?.lastName].filter(Boolean).join(' ') || user?.username || user?.email || '')
          return (
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome back{display ? `, ${display}` : ''}
              </h1>
              <p className="text-gray-600 text-lg">Here's what's happening with your practice today.</p>
            </div>
          )
        })()}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`border-l-4 ${stat.color} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  {stat.change && <p className="text-xs text-gray-400">{stat.change}</p>}
                </div>
                <div className={`w-14 h-14 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`h-7 w-7 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Today's Appointments</h2>
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {todaysAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No appointments scheduled for today</p>
              </div>
            ) : (
              todaysAppointments.map((a, index) => {
                const name = a.clientName || a.userName || a.client?.name || 'Client'
                const type = a.caseType || a.consultationType || 'Consultation'
                const time = new Date(a.appointmentDate || a.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const status = (a.status || '').toLowerCase()
                return (
                  <div key={index}                   className="group p-4 border-2 border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{name}</p>
                          <p className="text-sm text-gray-600">{type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 mb-1">{time}</p>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          status === 'confirmed' 
                            ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                            : status === 'pending' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}>
                          {status || 'scheduled'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <button 
            onClick={() => onNavigate && onNavigate("appointments")}
            className="w-full mt-6 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            View All Appointments
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Recent Activity</h2>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((n, index) => (
                <div 
                  key={index} 
                  className="group p-4 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{n.title || n.message || 'Update'}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt || n.time || Date.now()).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            View All Notifications
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
