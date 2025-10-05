import React from 'react'
import { useState, useEffect } from "react"
import { appointmentAPI, userAPI } from '@/services/api'
import { LawyerSidebar } from "./Lawyer/lawyer-sidebar"
import { DashboardOverview } from "./Lawyer/dashboard-overview"
import { AppointmentManagement } from "./Lawyer/appointment-management"
import { CaseManagement } from "./Lawyer/case-management"
import  LiveChat  from "./Lawyer/live-chat"
import  VirtualConsultation  from "./Lawyer/virtual-consultation"
import { PaymentStatus } from "./Lawyer/payment-status"
import  RecordsAccess  from "./Lawyer/records-access"
import  ProfileManagement  from "./Lawyer/profile-management"
import  NotificationsPanel  from "./Lawyer/notifications-panel"

export default function LawyerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState(null)

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments()
    // load current user profile for header display
    ;(async () => {
      try {
        const res = await userAPI.getProfile()
        if (res && res.user) setMe(res.user)
      } catch (_) {
        // ignore; show fallback avatar
      }
    })()
    
    // Set up polling to check for new appointments every 30 seconds
    const interval = setInterval(fetchAppointments, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAppointments()
      if (response.appointments) {
        setAppointments(response.appointments)
        // Filter pending appointments for notifications
        const pending = response.appointments.filter(apt => apt.status === 'pending')
        setPendingAppointments(pending)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview me={me} appointments={appointments} pendingCount={pendingAppointments.length} />
      case "appointments":
        return <AppointmentManagement appointments={appointments} onUpdate={fetchAppointments} />
      case "cases":
        return <CaseManagement />
      case "chat":
        return <LiveChat />
      case "consultation":
        return <VirtualConsultation />
      case "payments":
        return <PaymentStatus />
      case "records":
        return <RecordsAccess />
      case "profile":
        return <ProfileManagement />
      default:
        return <DashboardOverview me={me} appointments={appointments} pendingCount={pendingAppointments.length} />
    }
  }



  return (
    
    <div className="flex h-screen bg-background">
      <LawyerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />


      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-serif font-bold text-primary">Legal Practice Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19c-5 0-8-3-8-6s4-6 9-6 9 3 9 6c0 3-3 6-8 6z"
                />
              </svg>
              {pendingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingAppointments.length}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2">
              {(() => {
                const first = me?.firstname || ''
                const last = me?.lastname || ''
                const initials = `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || 'JD'
                const displayName = [first, last].filter(Boolean).join(' ') || 'Lawyer'
                return (
                  <>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{initials}</span>
                    </div>
                    <span className="text-sm font-medium">{displayName}</span>
                  </>
                )
              })()}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifications(false)} />

          {/* Panel */}
          <div className="relative ml-auto w-full max-w-md sm:max-w-lg md:max-w-xl bg-background shadow-2xl">
            <NotificationsPanel
              appointments={pendingAppointments}
              onClose={() => setShowNotifications(false)}
              onNavigate={(url) => {
                setShowNotifications(false)
                // Handle navigation based on URL
                if (url === "/appointments") setActiveTab("appointments")
                else if (url === "/payments") setActiveTab("payments")
                else if (url === "/chat") setActiveTab("chat")
                else if (url === "/cases") setActiveTab("cases")
                else if (url === "/profile") setActiveTab("profile")
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}




