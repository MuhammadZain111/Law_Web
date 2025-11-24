import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  FileText,
  User,
  Calendar,
  Download,
  Eye,
  Search,
  Filter,
  Mail,
  Phone,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { appointmentAPI } from '@/services/api';
import { api } from '@/shared/api';

export default function RecordsAccess() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("appointments");

  // Get current lawyer ID from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const [, payload] = String(token).split('.');
      if (!payload) return null;
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')) || '{}');
      return json?.id || json?.userId || null;
    } catch (_e) {
      return null;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAppointments();
      
      if (response.appointments) {
        const currentLawyerId = getUserIdFromToken();
        const filtered = currentLawyerId
          ? response.appointments.filter((a) => {
              const lid = a.lawyerId?._id || a.lawyerId;
              return String(lid) === String(currentLawyerId);
            })
          : response.appointments;
        
        // Sort by creation date (newest first)
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || a._id?.toString().substring(0, 8), 16).getTime();
          const dateB = new Date(b.createdAt || b._id?.toString().substring(0, 8), 16).getTime();
          return dateB - dateA;
        });
        
        setAppointments(filtered);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const matchesSearch =
      apt.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.caseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.caseDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get all unique clients
  const uniqueClients = Array.from(
    new Map(
      appointments.map((apt) => [
        apt.clientEmail || apt.clientId?._id,
        {
          name: apt.clientName,
          email: apt.clientEmail,
          phone: apt.clientPhone,
          totalAppointments: 0,
          totalAmount: 0,
        },
      ])
    ).values()
  ).map((client) => {
    const clientAppointments = appointments.filter(
      (apt) => apt.clientEmail === client.email
    );
    client.totalAppointments = clientAppointments.length;
    client.totalAmount = clientAppointments.reduce(
      (sum, apt) => sum + (Number(apt.consultationFee) || 0),
      0
    );
    return client;
  });

  // Get all documents from appointments
  const allDocuments = [];
  appointments.forEach((apt) => {
    if (apt.documentFiles && Array.isArray(apt.documentFiles)) {
      apt.documentFiles.forEach((file) => {
        allDocuments.push({
          ...file,
          clientName: apt.clientName,
          caseType: apt.caseType,
          appointmentDate: apt.appointmentDate,
          appointmentId: apt._id,
        });
      });
    }
    if (apt.paymentScreenshotFile) {
      allDocuments.push({
        ...apt.paymentScreenshotFile,
        clientName: apt.clientName,
        caseType: apt.caseType,
        appointmentDate: apt.appointmentDate,
        appointmentId: apt._id,
        isPaymentScreenshot: true,
      });
    }
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 border font-semibold">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-300 border font-semibold">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-300 border font-semibold">Completed</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-300 border font-semibold">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300 border font-semibold">{status}</Badge>;
    }
  };

  const handleViewFile = (file) => {
    if (file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`File: ${file.name}\nType: ${file.type || 'Unknown'}\nSize: ${file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}`);
    }
  };

  const handleDownloadFile = async (file) => {
    if (file.url) {
      try {
        const response = await fetch(file.url);
        if (response.ok) {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = file.name;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          window.open(file.url, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        window.open(file.url, '_blank', 'noopener,noreferrer');
      }
    }
  };
 
   return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Records & Documents</h1>
        <p className="text-muted-foreground text-lg">Access all your appointments, clients, and documents</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by client, case type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 border-2 border-gray-300 hover:border-amber-500 focus:border-amber-500 shadow-sm hover:shadow-md transition-all duration-200 text-base"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 h-12 border-2 border-gray-300 hover:border-amber-500 focus:border-amber-500 font-medium shadow-sm hover:shadow-md transition-all duration-200">
            <Filter className="h-4 w-4 mr-2 text-amber-600" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="appointments" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold transition-all duration-200"
          >
            Appointments ({filteredAppointments.length})
          </TabsTrigger>
          <TabsTrigger 
            value="clients"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold transition-all duration-200"
          >
            Clients ({uniqueClients.length})
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold transition-all duration-200"
          >
            Documents ({allDocuments.length})
          </TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card className="shadow-lg border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-gray-200">
              <CardTitle className="font-serif text-2xl">All Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-lg">Loading records...</p>
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No appointments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((apt) => (
                    <div
                      key={apt._id || apt.id}
                      className="group p-5 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-lg bg-white transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-gray-900">{apt.clientName}</h3>
                                {getStatusBadge(apt.status)}
                              </div>
                              <p className="text-base font-semibold text-amber-600">{apt.caseType || 'General'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="text-sm font-semibold text-gray-900">{apt.timeSlot || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Mail className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-semibold text-gray-900 truncate">{apt.clientEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  Rs. {Number(apt.consultationFee || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          {apt.caseDescription && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border-l-4 border-l-amber-500">
                              <p className="text-sm text-gray-700 font-medium">{apt.caseDescription}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <Card className="shadow-lg border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-gray-200">
              <CardTitle className="font-serif text-2xl">All Clients</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-lg">Loading clients...</p>
                </div>
              ) : uniqueClients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No clients found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uniqueClients.map((client, index) => (
                    <div
                      key={index}
                      className="group p-5 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-lg bg-white transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{client.name || 'Unknown'}</h3>
                          <p className="text-sm text-gray-600 truncate">{client.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {client.phone && (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">{client.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-700">
                            {client.totalAppointments} appointment{client.totalAppointments !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                          <DollarSign className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-bold text-orange-700">
                            Total: Rs. {client.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="shadow-lg border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-gray-200">
              <CardTitle className="font-serif text-2xl">All Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-lg">Loading documents...</p>
                </div>
              ) : allDocuments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No documents found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="group p-5 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:shadow-lg bg-white transition-all duration-300 hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-lg text-gray-900">{doc.name || 'Document'}</h3>
                              {doc.isPaymentScreenshot && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-300 border font-semibold">
                                  Payment
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Client: <span className="text-amber-600">{doc.clientName}</span> • Case: <span className="text-orange-600">{doc.caseType || 'General'}</span>
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <div className="px-3 py-1 bg-gray-100 rounded-lg">
                                <span className="text-xs font-semibold text-gray-600">
                                  Type: {doc.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                                </span>
                              </div>
                              {doc.size && (
                                <div className="px-3 py-1 bg-gray-100 rounded-lg">
                                  <span className="text-xs font-semibold text-gray-600">
                                    Size: {(doc.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                              )}
                              {doc.appointmentDate && (
                                <div className="px-3 py-1 bg-gray-100 rounded-lg">
                                  <span className="text-xs font-semibold text-gray-600">
                                    Date: {new Date(doc.appointmentDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            onClick={() => handleViewFile(doc)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            onClick={() => handleDownloadFile(doc)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
