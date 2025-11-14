import React from 'react'
import { useState, useEffect, useCallback } from "react"
import { appointmentAPI, userAPI } from '@/services/api'
import { api } from '@/shared/api'
import { mockLogin } from '@/utils/auth'
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
import { UpgradeProfile } from "./Lawyer/upgrade-profile"
import UpcomingAppointments from "../components/UpcomingAppointments"

export default function LawyerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [todaysAppointments, setTodaysAppointments] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const [, payload] = String(token).split('.')
      if (!payload) return null
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')) || '{}')
      return json?.id || json?.userId || null
    } catch (_e) {
      return null
    }
  }

  const fetchAppointments = useCallback(async () => {
    try {
      console.log('🔍 Fetching appointments...')
      const response = await appointmentAPI.getAppointments()
      console.log('📋 API Response:', response)
      
      if (response.appointments) {
        console.log('✅ Appointments found:', response.appointments.length)
        const currentLawyerId = getUserIdFromToken()
        const filtered = currentLawyerId
          ? response.appointments.filter((a) => {
              const lid = a.lawyerId?._id || a.lawyerId
              return String(lid) === String(currentLawyerId)
            })
          : response.appointments
        setAppointments(filtered)
        // Filter pending appointments for notifications
        const pending = filtered.filter(apt => apt.status === 'pending')
        console.log('⏳ Pending appointments:', pending.length)
        setPendingAppointments(pending)

        // Compute today's appointments dynamically
        try {
          const today = new Date()
          const y = today.getFullYear(), m = today.getMonth(), d = today.getDate()
          const start = new Date(y, m, d, 0, 0, 0, 0).getTime()
          const end = new Date(y, m, d, 23, 59, 59, 999).getTime()
          const todays = filtered.filter((a) => {
            const ts = new Date(a.appointmentDate || a.date || a.scheduledDate || a.createdAt).getTime()
            return ts >= start && ts <= end
          })
          setTodaysAppointments(todays)
        } catch (_e) {
          setTodaysAppointments([])
        }
      } else {
        console.log('❌ No appointments in response')
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecentActivity = useCallback(async () => {
    try {
      const res = await api.get('/notifications')
      const items = res?.data?.notifications || []
      setRecentActivity(items)
    } catch (_e) {
      setRecentActivity([])
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    try {
      const res = await userAPI.getProfile()
      setUser(res.user)
    } catch (e) {
      console.error('❌ Error fetching profile:', e)
      // Fallback: decode JWT and fetch public user endpoint
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1] || ''))
          const userId = payload.userId || payload.id
          if (userId) {
            const resp = await api.get(`/user/${userId}`)
            if (resp?.data?.user) setUser(resp.data.user)
          }
        }
      } catch (_ignored) {}
    }
  }, [])

  // Fetch appointments on component mount
  useEffect(() => {
    // Use real auth token already stored by login flow
    fetchProfile()
    fetchAppointments()
    fetchRecentActivity()
    
    // Set up polling to check for new appointments every 10 seconds (for testing)
    const interval = setInterval(fetchAppointments, 10000)
    
    return () => clearInterval(interval)
  }, [fetchProfile, fetchAppointments, fetchRecentActivity])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 space-y-6">
            <DashboardOverview
              user={user}
              appointments={appointments}
              pendingCount={pendingAppointments.length}
              todaysAppointments={todaysAppointments}
              recentActivity={recentActivity}
            />
            <UpcomingAppointments userRole="lawyer" userId={user?.id} />
          </div>
        )
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
      case "upgrade":
        return <UpgradeProfile />
      case "records":
        return <RecordsAccess />
      case "profile":
        return <ProfileManagement />
      default:
        return (
          <div className="p-6 space-y-6">
            <DashboardOverview user={user} appointments={appointments} pendingCount={pendingAppointments.length} />
            <UpcomingAppointments userRole="lawyer" userId={user?.id} />
          </div>
        )
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
              onClick={fetchAppointments}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh Appointments"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
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
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {(() => {
                  const first = (user?.firstname || user?.firstName || (user?.fullName || user?.name || '').split(' ')[0] || '').trim()
                  const last = (user?.lastname || user?.lastName || (user?.fullName || user?.name || '').split(' ')[1] || '').trim()
                  const initials = `${first?.[0] || ''}${last?.[0] || ''}` || (user?.username?.slice(0,2) || user?.email?.slice(0,2) || '').toUpperCase()
                  return <span className="text-white text-sm font-medium">{initials}</span>
                })()}
              </div>
              {(() => {
                const display = (user?.fullName || user?.name || [user?.firstname || user?.firstName, user?.lastname || user?.lastName].filter(Boolean).join(' ') || user?.username || user?.email || '')
                return <span className="text-sm font-medium">{display || '...'}</span>
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




