import { Activity, AlertCircle, BarChart3, Bell, Calendar, FileText, Search, Settings, Shield, UserCheck, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { mockAppointments, mockDisputes, mockLogs, mockPendingLawyerRegistrations, mockUsers } from "../../data/mockData.js"
import { api, setAuthToken } from "../../shared/api.js"
import { Button } from "../Lawyer/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Lawyer/ui/card.jsx"
import { Skeleton } from "../Lawyer/ui/skeleton.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Lawyer/ui/table.jsx"

export default function Dashboard() {
  const navigate = useNavigate()
  const [lawyers, setLawyers] = useState([])
  const [pendingLawyers, setPendingLawyers] = useState([])
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
      navigate('/admin/login')
      return
    }
    setAuthToken(token)
    const loadData = async () => {
      try {
        // Load approved list for table (use enriched lawyers endpoint)
        const approved = await api.get("/lawyers?status=approved")
        setLawyers(approved.data?.lawyers || approved.data || [])
        // Load pending list for approvals
        const pending = await api.get("/lawyers?status=pending")
        setPendingLawyers(pending.data?.lawyers || pending.data || [])
      } catch (e) {
        if (e?.response?.status === 401 || e?.status === 401) {
          localStorage.removeItem('token')
          navigate('/admin/login')
          return
        }
        setError(e?.response?.data?.error || e?.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // navigate is stable from react-router-dom, so we can safely omit it

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

  // If an error occurred, continue rendering with mock data instead of showing an alert

  
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
    <div className="flex h-screen bg-white text-gray-900">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-[#111111] flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">Law Sphere</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </div>
  
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "overview" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <BarChart3 className="h-5 w-5" /> Overview
            </button>
  
            <button
              onClick={() => setActiveSection("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "users" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <Users className="h-5 w-5" /> User Management
            </button>
  
            <button
              onClick={() => setActiveSection("lawyers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "lawyers" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              Lawyer Verification
              {mockPendingLawyerRegistrations.length > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {mockPendingLawyerRegistrations.length}
                </span>
              )}
            </button>
  
            <button
              onClick={() => setActiveSection("appointments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "appointments" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <Calendar className="h-5 w-5" />
              Appointments
              {stats.pendingAppointments > 0 && (
                <span className="ml-auto bg-white/10 text-gray-200 text-xs px-2 py-1 rounded-full">
                  {stats.pendingAppointments}
                </span>
              )}
            </button>
  
            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "reports" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <FileText className="h-5 w-5" /> Reports & Analytics
            </button>
  
            <button
              onClick={() => setActiveSection("disputes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "disputes" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              Financial Disputes
              {stats.openDisputes > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {stats.openDisputes}
                </span>
              )}
            </button>
  
            <button
              onClick={() => setActiveSection("logs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                activeSection === "logs" ? "bg-blue-500/15 text-blue-300" : "hover:bg-white/5 text-gray-300"
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
          <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search users, lawyers, appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 bg-white rounded-lg text-sm text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10">
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

                {/* Pending Lawyer Verification appears at the top */
                }
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Profile Registrations</CardTitle>
                    <CardDescription>
                      New lawyer registrations awaiting admin approval before profile creation
                      <br />
                      <span className="text-sm text-blue-600 mt-1 block">
                        Required for approval: Full Name, Bar Number, Specialization, Experience, City, CNIC, Phone (10+ digits), and at least one document
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingLawyers.length === 0 ? (
                      <div className="text-gray-400">No pending registrations.</div>
                    ) : (
                      <div className="space-y-4">
                        {pendingLawyers.map((l) => (
                          <div key={l._id || l.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-start justify-between gap-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                <div>
                                  <div className="text-lg font-semibold">{l.fullName || l.name}</div>
                                  <div className="text-sm text-gray-500">{l.userId?.email || l.email}</div>
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
                                  <div className="font-medium">{l.yearsOfExperience ?? l.experience ?? '-'}</div>
                                  <div className="mt-3">
                                    <div className="text-xs uppercase text-gray-500">Phone</div>
                                    <div className="font-medium">{l.phone || '-'}</div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="text-xs uppercase text-gray-500">Submitted on</div>
                                    <div className="font-medium">{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '-'}</div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <div className="text-xs uppercase text-gray-500">Firm / Office</div>
                                    <div className="font-medium">{l.firmName || '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs uppercase text-gray-500">City</div>
                                    <div className="font-medium">{l.city || '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs uppercase text-gray-500">CNIC / ID</div>
                                    <div className="font-medium">{l.cnicNumber || '-'}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs uppercase text-gray-500">Submitted Documents</div>
                                    <div className="font-medium">{l.submittedDocuments ?? 0}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                {/* Check for missing required fields */}
                                {(() => {
                                  const missing = [];
                                  if (!l.fullName) missing.push("Full Name");
                                  if (!l.barNumber) missing.push("Bar Number");
                                  if (!l.specialization) missing.push("Specialization");
                                  if (!l.yearsOfExperience && l.yearsOfExperience !== 0) missing.push("Experience");
                                  if (!l.city) missing.push("City");
                                  if (!l.cnicNumber) missing.push("CNIC");
                                  if (!l.phone || l.phone.length < 10) missing.push("Phone (10+ digits)");
                                  if ((l.submittedDocuments || 0) === 0) missing.push("Documents");
                                  
                                  return missing.length > 0 ? (
                                    <div className="text-xs text-red-600 mb-2 p-2 bg-red-50 rounded">
                                      <strong>Missing:</strong> {missing.join(", ")}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-green-600 mb-2 p-2 bg-green-50 rounded">
                                      ✓ All required fields complete
                                    </div>
                                  );
                                })()}
                                <Button
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={async () => {
                                    try {
                                      // Use userId (User ID) for approval, not Lawyer profile ID
                                      const id = l.userId || l._id || l.id
                                      if (!id) {
                                        alert('Error: User ID not found')
                                        return
                                      }
                                      console.log('Approving lawyer with User ID:', id)
                                      await api.post(`/lawyers/${id}/approve`)
                                      const [approved, pending] = await Promise.all([
                                        api.get('/lawyers?status=approved'),
                                        api.get('/lawyers?status=pending'),
                                      ])
                                      setLawyers(approved.data?.lawyers || approved.data || [])
                                      setPendingLawyers(pending.data?.lawyers || pending.data || [])
                                    } catch (err) {
                                      console.error(err)
                                      
                                      // Handle specific validation errors
                                      if (err?.message && err?.message.includes("Profile is incomplete")) {
                                        // Try to get the missing fields from the error response
                                        const missingFields = err.missing || [];
                                        const missingList = missingFields.length > 0 
                                          ? `\n\nMissing fields: ${missingFields.join(', ')}`
                                          : '';
                                        
                                        alert(`Cannot approve lawyer: Profile is incomplete.${missingList}\n\nPlease ensure the lawyer has completed their profile with all required information.`)
                                      } else {
                                        alert(err?.message || 'Failed to approve lawyer. Please try again.')
                                      }
                                    }
                                  }}
                                >
                                  Approve & Create Profile
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={async () => {
                                    try {
                                      const id = l._id || l.id
                                      if (!id) return
                                      const { data } = await api.get(`/appointments/lawyers/${id}/review`)
                                      const lines = [
                                        `Name: ${data.fullName}`,
                                        `Email: ${l.userId?.email || l.email || ''}`,
                                        `Bar #: ${data.barNumber}`,
                                        `Specialization: ${data.specialization}`,
                                        `Experience: ${data.yearsOfExperience} years`,
                                        `Firm: ${data.firmName || '-'}`,
                                        `City: ${data.city || '-'}`,
                                        `CNIC: ${data.cnicNumber || '-'}`,
                                        `Licenses: ${(data.licenses || []).length}`,
                                        `Documents: ${(data.documents || []).length}`,
                                      ]
                                      alert(lines.join('\n'))
                                    } catch (err) {
                                      console.error(err)
                                    }
                                  }}
                                >
                                  Review Documents
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={async () => {
                                    try {
                                      const id = l._id || l.id
                                      if (!id) return
                                      await api.post(`/lawyers/${id}/reject`, { reason: 'Insufficient documents' })
                                      const pending = await api.get('/lawyers?status=pending')
                                      setPendingLawyers(pending.data?.lawyers || pending.data || [])
                                    } catch (err) {
                                      console.error(err)
                                    }
                                  }}
                                >
                                  Reject
                                </Button>
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
                      <div className="text-gray-400">No registered lawyers yet.</div>
                    ) : (
                      <div className="rounded-md border border-gray-800 overflow-x-auto">
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
                <p className="text-gray-400">Review and approve lawyer registrations</p>

                {/* Pending Lawyer Registrations - dark, compact, with action buttons */}
                <Card className="border border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle>Pending Registrations</CardTitle>
                    <CardDescription>New lawyer registrations awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {mockPendingLawyerRegistrations.length === 0 ? (
                      <div className="text-gray-400">No pending registrations.</div>
                    ) : (
                      <div className="space-y-4">
                        {mockPendingLawyerRegistrations.map((l) => (
                          <div key={l.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_auto] items-start gap-4 border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="space-y-1">
                                <div className="font-semibold text-gray-900">{l.name}</div>
                              <div className="text-sm text-gray-400">{l.email}</div>
                              <div className="text-sm text-gray-400">Bar: {l.barNumber}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs uppercase text-gray-500">Specialization</div>
                              <div className="text-sm text-gray-200">{l.specialization}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs uppercase text-gray-500">Experience</div>
                              <div className="text-sm text-gray-200">{l.experience}</div>
                            </div>
                            <div className="flex flex-col gap-2 lg:justify-center">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={async () => {
                                  try {
                                    // For demo, assume pending list fetched separately; here you should have id
                                    // Map mock to real when API is wired
                                    if (!l._id && !l.id) return;
                                    const id = l._id || l.id;
                                    await api.post(`/lawyers/${id}/approve`);
                                    // Refresh lists
                                    const approved = await api.get("/appointments/lawyers?status=approved");
                                    setLawyers(approved.data?.lawyers || approved.data || []);
                                  } catch (err) {
                                    console.error(err);
                                    alert(err?.message || 'Failed to approve lawyer. Please check profile completeness.');
                                  }
                                }}
                              >
                                Approve & Create Profile
                              </Button>
                              <Button size="sm" variant="outline">Review Documents</Button>
                              <Button size="sm" variant="destructive">Reject</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Registered (approved) lawyers table */}
                <Card className="border border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle>Registered Lawyers</CardTitle>
                    <CardDescription>Approved lawyers visible on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lawyers.length === 0 ? (
                      <div className="text-gray-400">No registered lawyers yet.</div>
                    ) : (
                      <div className="rounded-md border border-gray-800 overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[180px]">Name</TableHead>
                              <TableHead className="min-w-[220px]">Email</TableHead>
                              <TableHead className="min-w-[160px]">Specialization</TableHead>
                              <TableHead className="min-w-[120px]">Experience</TableHead>
                              <TableHead className="min-w-[200px]">Location</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {lawyers.slice(0, 10).map((l) => {
                              const loc = [l.city, l.state, l.country].filter(Boolean).join(', ')
                              return (
                                <TableRow key={l._id || l.id}>
                                  <TableCell className="font-medium">{l.fullName || l.name}</TableCell>
                                  <TableCell>{l.userId?.email || l.email}</TableCell>
                                  <TableCell>{l.specialization}</TableCell>
                                  <TableCell>{(l.yearsOfExperience ?? l.experience ?? 0) + ' yrs'}</TableCell>
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
  
