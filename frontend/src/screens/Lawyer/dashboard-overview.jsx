import React from "react";

export function DashboardOverview() {
  const stats = [
    { title: "Active Cases", value: "24", change: "+3 this week", color: "bg-blue-500" },
    { title: "Pending Appointments", value: "8", change: "+2 today", color: "bg-orange-500" },
    { title: "Completed Consultations", value: "156", change: "+12 this month", color: "bg-green-500" },
    { title: "Outstanding Payments", value: "$12,450", change: "-$2,300 this week", color: "bg-red-500" },
  ];

  const recentAppointments = [
    { client: "Sarah Johnson", time: "10:00 AM", type: "Consultation", status: "confirmed" },
    { client: "Michael Chen", time: "2:30 PM", type: "Case Review", status: "pending" },
    { client: "Emily Davis", time: "4:00 PM", type: "Document Signing", status: "confirmed" },
  ];

  const notifications = [
    { message: "New appointment request from Alex Thompson", time: "5 minutes ago" },
    { message: "Payment received from Johnson vs. Smith case", time: "1 hour ago" },
    { message: "Document uploaded for Martinez case", time: "2 hours ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Welcome back, John Doe</h1>
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
            {recentAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div>
                  <p className="font-medium">{appointment.client}</p>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      appointment.status === "confirmed" ? "bg-green-200 text-green-800" : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 border rounded py-2 bg-transparent">View All Appointments</button>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-serif mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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
