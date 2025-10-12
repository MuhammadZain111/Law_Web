"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, RotateCcw, Filter, FileText, Download, Eye } from "lucide-react";

export function AppointmentManagement({ appointments = [], onUpdate }) {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState(null);

  // Sync local appointments with prop changes
  useEffect(() => {
    console.log('📋 AppointmentManagement received appointments:', appointments.length);
    console.log('📋 Appointments data:', appointments);
    
    // Check for documents in appointments
    appointments.forEach((apt, index) => {
      console.log(`📋 Appointment ${index}:`, {
        clientName: apt.clientName,
        documents: apt.documents,
        documentFiles: apt.documentFiles,
        hasDocuments: !!apt.documents,
        hasFiles: apt.documentFiles?.length > 0
      });
    });
    
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      const { appointmentAPI } = await import('@/services/api');
      await appointmentAPI.updateAppointmentStatus(appointmentId, 'confirmed');
      setLocalAppointments((prev) =>
        prev.map((apt) => (apt._id === appointmentId ? { ...apt, status: "confirmed" } : apt))
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error accepting appointment:', error);
      alert('Failed to accept appointment');
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      const { appointmentAPI } = await import('@/services/api');
      await appointmentAPI.updateAppointmentStatus(appointmentId, 'rejected');
      setLocalAppointments((prev) =>
        prev.map((apt) => (apt._id === appointmentId ? { ...apt, status: "rejected" } : apt))
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('Failed to reject appointment');
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    if (rescheduleDate && rescheduleTime) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                requestedDate: rescheduleDate,
                requestedTime: rescheduleTime,
                status: "confirmed",
              }
            : apt
        )
      );
      setRescheduleDate("");
      setRescheduleTime("");
      setSelectedAppointment(null);
    }
  };

  const filteredAppointments = localAppointments.filter((apt) => {
    if (filterStatus === "all") return true;
    return apt.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusCount = (status) => {
    return appointments.filter((apt) => apt.status === status).length;
  };

  // Function to handle document viewing
  const handleViewDocuments = (appointment) => {
    setSelectedDocuments({
      documents: appointment.documents || '',
      documentFiles: appointment.documentFiles || [],
      clientName: appointment.clientName
    });
    setShowDocumentModal(true);
  };

  // Function to handle file viewing
  const handleViewFile = (file) => {
    console.log('🔍 Debug - Viewing file:', file);
    
    // If the file has a URL, open it directly
    if (file.url) {
      console.log('🔍 Debug - Opening file URL:', file.url);
      window.open(file.url, '_blank');
      return;
    }
    
    // For files without URLs, show detailed information
    const fileInfo = `
📄 File Information:
Name: ${file.name}
Type: ${file.type || 'Unknown'}
Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
Last Modified: ${file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Unknown'}

⚠️ Note: This file was uploaded but the actual file content is not available for viewing. 
This usually happens with older appointments that were created before ImageKit integration.

Current Status: File metadata only (no actual file content stored)
    `.trim();
    
    alert(fileInfo);
  };

  // Function to handle file download
  const handleDownloadFile = (file) => {
    console.log('🔍 Debug - Downloading file:', file);
    
    // If the file has a URL, trigger download
    if (file.url) {
      console.log('🔍 Debug - Downloading file URL:', file.url);
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank'; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // For files without URLs, show detailed information
    const fileInfo = `
📥 Download Information:
Name: ${file.name}
Type: ${file.type || 'Unknown'}
Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
Last Modified: ${file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Unknown'}

⚠️ Note: This file was uploaded but the actual file content is not available for download. 
This usually happens with older appointments that were created before ImageKit integration.

Current Status: File metadata only (no actual file content stored)
    `.trim();
    
    alert(fileInfo);
  };

  // Function to render document files
  const renderDocuments = (appointment) => {
    const documents = appointment.documents || '';
    const documentFiles = appointment.documentFiles || [];
    
    console.log('🔍 Rendering documents for appointment:', {
      clientName: appointment.clientName,
      documents: documents,
      documentFiles: documentFiles,
      hasDocuments: !!documents,
      hasFiles: documentFiles.length > 0
    });
    
    // Debug: Check which files have URLs
    documentFiles.forEach((file, index) => {
      console.log(`🔍 File ${index + 1}:`, {
        name: file.name,
        hasUrl: !!file.url,
        url: file.url,
        type: file.type,
        size: file.size
      });
    });
    
    if (!documents && documentFiles.length === 0) {
      console.log('❌ No documents to render for:', appointment.clientName);
      return null;
    }

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Case Documents</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-2"
            onClick={() => handleViewDocuments(appointment)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View All
          </Button>
        </div>
        
        {/* Text description of documents */}
        {documents && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-1">Document Description:</p>
            <p className="text-sm text-gray-800 bg-white p-2 rounded border line-clamp-2">{documents}</p>
          </div>
        )}
        
        {/* Uploaded files preview */}
        {documentFiles.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 mb-2">Uploaded Files ({documentFiles.length}):</p>
            <div className="space-y-1">
              {documentFiles.slice(0, 2).map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                  {file.type?.startsWith('image/') ? (
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">IMG</span>
                    </div>
                  ) : file.type === 'application/pdf' ? (
                    <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">PDF</span>
                    </div>
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
              {documentFiles.length > 2 && (
                <p className="text-xs text-gray-500 text-center py-1">
                  +{documentFiles.length - 2} more files
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Appointment Management</h1>
          <p className="text-muted-foreground">Manage client appointment requests and scheduling</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{getStatusCount("pending")}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{getStatusCount("confirmed")}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{getStatusCount("completed")}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{getStatusCount("rejected")}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {filterStatus === "all"
              ? "All Appointments"
              : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Appointments`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found for the selected filter.
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id || appointment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{appointment.clientName}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.caseType || appointment.appointmentType}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : appointment.requestedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.timeSlot || appointment.requestedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {appointment.clientEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {appointment.clientPhone}
                        </span>
                      </div>
                      {(appointment.caseDescription || appointment.notes) && (
                        <p className="text-sm text-muted-foreground italic">Note: {appointment.caseDescription || appointment.notes}</p>
                      )}
                      
                      {/* Display documents if available */}
                      {renderDocuments(appointment)}
                      
                      {/* Test button to show documents (temporary) */}
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            console.log('🧪 Test button clicked for appointment:', appointment);
                            handleViewDocuments(appointment);
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          🧪 Test Documents
                        </Button>
                      </div>
                      
                      {/* Always show document info for debugging */}
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <p><strong>Debug Info:</strong></p>
                        <p>Documents: "{appointment.documents || 'None'}"</p>
                        <p>Document Files: {appointment.documentFiles?.length || 0} files</p>
                        <p>Has Documents: {appointment.documents ? 'Yes' : 'No'}</p>
                        <p>Has Files: {appointment.documentFiles?.length > 0 ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptAppointment(appointment._id || appointment.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedAppointment(appointment)}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reschedule Appointment</DialogTitle>
                              <DialogDescription>
                                Propose a new date and time for {appointment.clientName}'s appointment.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="reschedule-date">New Date</Label>
                                <Input
                                  id="reschedule-date"
                                  type="date"
                                  value={rescheduleDate}
                                  onChange={(e) => setRescheduleDate(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="reschedule-time">New Time</Label>
                                <Input
                                  id="reschedule-time"
                                  type="time"
                                  value={rescheduleTime}
                                  onChange={(e) => setRescheduleTime(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => handleRescheduleAppointment(appointment._id || appointment.id)}
                                disabled={!rescheduleDate || !rescheduleTime}
                              >
                                Confirm Reschedule
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectAppointment(appointment._id || appointment.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button size="sm" variant="outline" disabled>
                        Confirmed
                      </Button>
                    )}
                    {appointment.status === "completed" && (
                      <Button size="sm" variant="outline" disabled>
                        Completed
                      </Button>
                    )}
                    {appointment.status === "rejected" && (
                      <Button size="sm" variant="outline" disabled>
                        Rejected
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document View Modal */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Case Documents - {selectedDocuments?.clientName}</DialogTitle>
            <DialogDescription>
              Review all documents and files provided by the client for this case.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocuments && (
            <div className="space-y-6">
              {/* Document Description */}
              {selectedDocuments.documents && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Document Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedDocuments.documents}</p>
                  </div>
                </div>
              )}
              
              {/* Uploaded Files */}
              {selectedDocuments.documentFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Uploaded Files ({selectedDocuments.documentFiles.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDocuments.documentFiles.map((file, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {file.type?.startsWith('image/') ? (
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-bold">IMG</span>
                              </div>
                            ) : file.type === 'application/pdf' ? (
                              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 text-sm font-bold">PDF</span>
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewFile(file)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadFile(file)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowDocumentModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
