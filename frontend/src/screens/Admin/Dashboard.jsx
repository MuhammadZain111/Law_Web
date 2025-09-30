import { Activity, AlertCircle, BarChart3, Bell, Calendar, FileText, Search, Settings, Shield, UserCheck, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert.jsx"
import { Button } from "../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { Skeleton } from "../../components/ui/skeleton.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.jsx"
import { api, setAuthToken } from "../../shared/api.js"
import { mockAppointments, mockDisputes, mockLogs, mockPendingLawyerRegistrations, mockUsers } from "../data/mockData.js"

export default function Dashboard() {
  const navigate = useNavigate()
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // UI state
  const [q, setQ] = useState("")
  const [spec, setSpec] = useState("all")
  const [sortKey, setSortKey] = useState("fullName")
  const [sortDir, setSortDir] = useState("asc")
  const [page, setPage] = useState(1)
  const pageSize = 10
  // These must be declared before any early returns to keep hooks order stable
  const [activeSection, setActiveSection] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    setAuthToken(token)
    ;(async () => {
      try {
        const res = await api.get("/lawyers/registered")
        setLawyers(res.data || [])
      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
          return
        }
        setError(e?.response?.data?.error || e?.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    })()
  }, [navigate])

  // Derived UI data
  const specializations = useMemo(() => {
    const all = Array.from(
      new Set(lawyers.map((l) => (l.specialization || "").trim()).filter(Boolean))
    )
    return all.sort((a, b) => a.localeCompare(b))
  }, [lawyers])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    const list = lawyers.filter((l) => {
      const loc = [l.city, l.state, l.country].filter(Boolean).join(", ")
      const matchesQuery =
        !query ||
        l.fullName?.toLowerCase().includes(query) ||
        l.userId?.email?.toLowerCase().includes(query) ||
        l.barNumber?.toLowerCase().includes(query) ||
        l.specialization?.toLowerCase().includes(query) ||
        loc.toLowerCase().includes(query)

      const matchesSpec =
        spec === "all" || (l.specialization || "").toLowerCase() === spec.toLowerCase()

      return matchesQuery && matchesSpec
    })

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      let av = a[sortKey]
      let bv = b[sortKey]

      if (["fullName", "specialization", "city"].includes(sortKey)) {
        av = (av || "").toString().toLowerCase()
        bv = (bv || "").toString().toLowerCase()
        return av.localeCompare(bv) * dir
      }

      if (sortKey === "yearsOfExperience") {
        return ((av || 0) - (bv || 0)) * dir
      }

      return 0
    })

    return list
  }, [lawyers, q, spec, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [q, spec])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Bar #", "Specialization", "Experience", "Location"],
      ...filtered.map((l) => [
        l.fullName || "",
        l.userId?.email || "",
        l.barNumber || "",
        l.specialization || "",
        `${l.yearsOfExperience ?? 0}`,
        [l.city, l.state, l.country].filter(Boolean).join(", "),
      ]),
    ]
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lawyers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader className="p-4">
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  
  const total = lawyers.length
  const totalExperience = lawyers.reduce((sum, l) => sum + (l.yearsOfExperience || 0), 0)
  const uniqueSpecs = specializations.length

  const stats = {
    totalUsers: mockUsers.length,
    totalLawyers: total,
    pendingAppointments: mockAppointments.filter((a) => a.status === "Pending").length,
    openDisputes: mockDisputes.filter((d) => d.status === "Open").length,
  };

  return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold">Law Sphere</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>
  
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "overview" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" /> Overview
            </button>
  
            <button
              onClick={() => setActiveSection("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "users" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" /> User Management
            </button>
  
            <button
              onClick={() => setActiveSection("lawyers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "lawyers" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              Lawyer Verification
              {mockPendingLawyerRegistrations.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {mockPendingLawyerRegistrations.length}
                </span>
              )}
            </button>
  
            <button
              onClick={() => setActiveSection("appointments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "appointments" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <Calendar className="h-5 w-5" />
              Appointments
              {stats.pendingAppointments > 0 && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {stats.pendingAppointments}
                </span>
              )}
            </button>
  
            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "reports" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5" /> Reports & Analytics
            </button>
  
            <button
              onClick={() => setActiveSection("disputes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "disputes" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              Financial Disputes
              {stats.openDisputes > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.openDisputes}
                </span>
              )}
            </button>
  
            <button
              onClick={() => setActiveSection("logs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "logs" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <Activity className="h-5 w-5" /> System Logs
            </button>
          </nav>
  
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@lawsphere.com</p>
              </div>
            </div>
          </div>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <header className="border-b bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search users, lawyers, appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>
  
          <div className="p-8">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                  <p className="text-gray-500 mt-1">Monitor platform performance and key metrics</p>
                </div>

                {/* Pending Lawyer Verification appears at the top */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Profile Registrations</CardTitle>
                    <CardDescription>New lawyer registrations awaiting admin approval before profile creation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockPendingLawyerRegistrations.length === 0 ? (
                      <div className="text-gray-500">No pending registrations.</div>
                    ) : (
                      <div className="space-y-4">
                        {mockPendingLawyerRegistrations.map((l) => (
                          <div key={l.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-start justify-between gap-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                <div>
                                  <div className="text-lg font-semibold">{l.name}</div>
                                  <div className="text-sm text-gray-500">{l.email}</div>
                                  <div className="mt-3">
                                    <div className="text-xs uppercase text-gray-500">Specialization</div>
                                    <div className="font-medium">{l.specialization}</div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="text-xs uppercase text-gray-500">Bar Number</div>
                                    <div className="font-medium">{l.barNumber}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase text-gray-500">Experience</div>
                                  <div className="font-medium">{l.experience}</div>
                                  <div className="mt-3">
                                    <div className="text-xs uppercase text-gray-500">Phone</div>
                                    <div className="font-medium">{l.phone}</div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="text-xs uppercase text-gray-500">Submitted on</div>
                                    <div className="font-medium">{l.submitted}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase text-gray-500">Submitted Documents</div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {l.documents.map((d, i) => (
                                      <span key={i} className="inline-flex items-center rounded-md border px-2 py-1 text-xs">{d}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                <Button className="bg-green-600 hover:bg-green-700">Approve & Create Profile</Button>
                                <Button variant="outline">Review Documents</Button>
                                <Button variant="destructive">Reject</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Registered Lawyers list */}
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Lawyers</CardTitle>
                    <CardDescription>Approved lawyers currently visible on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lawyers.length === 0 ? (
                      <div className="text-gray-500">No registered lawyers yet.</div>
                    ) : (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[180px]">Name</TableHead>
                              <TableHead className="min-w-[220px]">Email</TableHead>
                              <TableHead className="min-w-[120px]">Bar #</TableHead>
                              <TableHead className="min-w-[160px]">Specialization</TableHead>
                              <TableHead className="min-w-[120px]">Experience</TableHead>
                              <TableHead className="min-w-[200px]">Location</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {lawyers.slice(0, 10).map((l) => {
                              const loc = [l.city, l.state, l.country].filter(Boolean).join(', ')
                              return (
                                <TableRow key={l._id}>
                                  <TableCell className="font-medium">{l.fullName}</TableCell>
                                  <TableCell>{l.userId?.email}</TableCell>
                                  <TableCell>{l.barNumber}</TableCell>
                                  <TableCell>{l.specialization}</TableCell>
                                  <TableCell>{(l.yearsOfExperience ?? 0) + ' yrs'}</TableCell>
                                  <TableCell>{loc}</TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
  
            {activeSection === "users" && (
              <div>
                <h2 className="text-3xl font-bold">User Management</h2>
                <p className="text-gray-500 mt-1">Monitor and manage all registered clients</p>
  
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">{user.type}</td>
                          <td className="px-4 py-2">{user.status}</td>
                          <td className="px-4 py-2">{user.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSection === "lawyers" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Lawyer Verification</h2>
                <p className="text-gray-500">Review and approve lawyer registrations</p>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Registrations</CardTitle>
                    <CardDescription>New lawyer registrations awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockPendingLawyerRegistrations.length === 0 ? (
                      <div className="text-gray-500">No pending registrations.</div>
                    ) : (
                      <div className="space-y-3">
                        {mockPendingLawyerRegistrations.map((l) => (
                          <div key={l.id} className="flex items-center justify-between border rounded-lg p-4">
                            <div>
                              <div className="font-semibold">{l.name}</div>
                              <div className="text-sm text-gray-500">{l.email}</div>
                              <div className="text-sm text-gray-500">{l.specialization} • {l.experience}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm">Approve</Button>
                              <Button size="sm" variant="destructive">Reject</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "appointments" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Appointment Management</h2>
                <p className="text-gray-500">Oversee and manage all platform appointments</p>

                {/* Scheduled Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Appointments</CardTitle>
                    <CardDescription>Confirmed appointments scheduled without admin approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Lawyer</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAppointments
                            .filter((a) => a.status === 'Scheduled' || a.status === 'Confirmed')
                            .map((a) => (
                              <TableRow key={a.id}>
                                <TableCell>{a.client}</TableCell>
                                <TableCell>{a.lawyer}</TableCell>
                                <TableCell>{a.type}</TableCell>
                                <TableCell>{a.date}</TableCell>
                                <TableCell>{a.time}</TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center rounded-full bg-green-600/15 text-green-600 text-xs px-2 py-0.5">
                                    {a.status === 'Confirmed' ? 'Confirmed' : 'Scheduled'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button size="sm" variant="outline">View Details</Button>
                                  <Button size="sm" variant="outline">Reschedule</Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* All Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>Complete appointment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Lawyer</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAppointments.map((a) => (
                            <TableRow key={a.id}>
                              <TableCell>{a.client}</TableCell>
                              <TableCell>{a.lawyer}</TableCell>
                              <TableCell>{a.type}</TableCell>
                              <TableCell>{a.date}</TableCell>
                              <TableCell>{a.time}</TableCell>
                              <TableCell>
                                {a.status === 'Pending' ? (
                                  <span className="inline-flex items-center rounded-full bg-yellow-500/15 text-yellow-600 text-xs px-2 py-0.5">Pending</span>
                                ) : a.status === 'Confirmed' || a.status === 'Scheduled' ? (
                                  <span className="inline-flex items-center rounded-full bg-green-600/15 text-green-600 text-xs px-2 py-0.5">{a.status === 'Confirmed' ? 'Confirmed' : 'Scheduled'}</span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-gray-500/15 text-gray-600 text-xs px-2 py-0.5">{a.status}</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline">View</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "disputes" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Financial Disputes</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Open Disputes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockDisputes.filter((d) => d.status === 'Open').length === 0 ? (
                      <div className="text-gray-500">No open disputes.</div>
                    ) : (
                      <div className="space-y-2">
                        {mockDisputes.filter((d) => d.status === 'Open').map((d) => (
                          <div key={d.id} className="border rounded-lg p-3">
                            <div className="font-medium">{d.client} vs {d.lawyer}</div>
                            <div className="text-sm text-gray-500">Amount: {d.amount}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "logs" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold">System Logs</h2>
                  <p className="text-gray-500 mt-1">Monitor system activity and security audit trails</p>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system events and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{log.action}</TableCell>
                              <TableCell>{log.user}</TableCell>
                              <TableCell>{log.timestamp}</TableCell>
                              <TableCell className="text-right">
                                {log.status === 'Success' ? (
                                  <span className="inline-flex items-center rounded-full bg-green-600/15 text-green-600 text-xs px-2 py-0.5">Success</span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-red-600/15 text-red-600 text-xs px-2 py-0.5">Failed</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Failed Login Attempts</CardTitle>
                      <CardDescription>Last 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">3</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Active Sessions</CardTitle>
                      <CardDescription>Currently online</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">342</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">System Uptime</CardTitle>
                      <CardDescription>Last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">99.9%</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
  
