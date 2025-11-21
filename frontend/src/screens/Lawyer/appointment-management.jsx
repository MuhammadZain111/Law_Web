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
import { api } from '@/shared/api';

export function AppointmentManagement({ appointments = [], onUpdate }) {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);

  // Sync local appointments with prop changes
  useEffect(() => {
    console.log('📋 AppointmentManagement received appointments:', appointments.length);
    console.log('📋 Appointments data:', appointments);
    
    // Check for documents and payment screenshots in appointments
    appointments.forEach((apt, index) => {
      console.log(`📋 Appointment ${index} (${apt.clientName}):`, {
        clientName: apt.clientName,
        documents: apt.documents,
        documentFiles: apt.documentFiles,
        hasDocuments: !!apt.documents,
        hasFiles: apt.documentFiles?.length > 0,
        hasPaymentScreenshotFile: !!apt.paymentScreenshotFile,
        hasPaymentScreenshot: !!apt.paymentScreenshot,
        paymentScreenshotFile: apt.paymentScreenshotFile,
        paymentScreenshot: apt.paymentScreenshot
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
    console.log('🔍 handleViewDocuments - Full appointment data:', appointment);
    
    // Handle payment screenshot - check both paymentScreenshotFile object and paymentScreenshot URL
    let paymentScreenshotFile = appointment.paymentScreenshotFile || null;
    
    console.log('🔍 Payment screenshot check:', {
      hasPaymentScreenshotFile: !!appointment.paymentScreenshotFile,
      hasPaymentScreenshot: !!appointment.paymentScreenshot,
      paymentScreenshotFile: appointment.paymentScreenshotFile,
      paymentScreenshot: appointment.paymentScreenshot
    });
    
    // If paymentScreenshotFile is not available but paymentScreenshot URL exists, create file object
    if (!paymentScreenshotFile && appointment.paymentScreenshot) {
      const paymentUrl = appointment.paymentScreenshot;
      console.log('🔍 Creating payment screenshot file from URL:', paymentUrl);
      // Check if it's a valid URL
      if (typeof paymentUrl === 'string' && (paymentUrl.startsWith('http') || paymentUrl.startsWith('/'))) {
        paymentScreenshotFile = {
          name: 'payment_screenshot.jpg',
          size: 0,
          type: 'image/jpeg',
          lastModified: Date.now(),
          url: paymentUrl
        };
        console.log('✅ Created payment screenshot file object:', paymentScreenshotFile);
      }
    }
    
    const documentsData = {
      documents: appointment.documents || '',
      documentFiles: appointment.documentFiles || [],
      paymentScreenshotFile: paymentScreenshotFile,
      clientName: appointment.clientName
      // Note: License certificates are lawyer's own documents, not part of appointment
    };
    
    console.log('🔍 Setting selectedDocuments:', documentsData);
    
    setSelectedDocuments(documentsData);
    setShowDocumentModal(true);
  };

  // Function to handle file viewing
  const handleViewFile = (file) => {
    console.log('🔍 Debug - Viewing file:', file);
    
    // If the file has a URL, open it directly
    if (file.url) {
      console.log('🔍 Debug - Opening file URL:', file.url);
      
      try {
        // Try to open in new tab with proper security attributes
        const newWindow = window.open(file.url, '_blank', 'noopener,noreferrer');
        
        if (!newWindow) {
          // If popup was blocked, try alternative method
          console.log('⚠️ Popup blocked, trying alternative method');
          const link = document.createElement('a');
          link.href = file.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        console.log('✅ File opened successfully:', file.name);
        return;
      } catch (error) {
        console.log('⚠️ Error opening file:', error);
        alert(`Error opening file: ${error.message}`);
        return;
      }
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
  const handleDownloadFile = async (file) => {
    console.log('🔍 Debug - Downloading file:', file);
    setDownloadingFile(file.name);
    
    try {
      // If the file has a URL, trigger download
      if (file.url) {
        console.log('🔍 Debug - Downloading file URL:', file.url);
        
        try {
          // Method 1: Try direct download with fetch
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
            
            // Clean up the object URL
            window.URL.revokeObjectURL(downloadUrl);
            
            console.log('✅ File downloaded successfully:', file.name);
            alert(`✅ File "${file.name}" downloaded successfully!`);
            return;
          }
        } catch (error) {
          console.log('⚠️ Fetch download failed, trying direct link method:', error);
        }
        
        // Method 2: Fallback to direct link
        try {
          const link = document.createElement('a');
          link.href = file.url;
          link.download = file.name;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('✅ File download initiated via direct link:', file.name);
          alert(`✅ Download started for "${file.name}"!`);
          return;
        } catch (error) {
          console.log('⚠️ Direct link download failed:', error);
        }
        
        // Method 3: Open in new tab as last resort
        window.open(file.url, '_blank', 'noopener,noreferrer');
        console.log('✅ File opened in new tab:', file.name);
        alert(`✅ File "${file.name}" opened in new tab!`);
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
    } finally {
      setDownloadingFile(null);
    }
  };

  // Function to render document files
  const renderDocuments = (appointment) => {
    const documents = appointment.documents || '';
    const documentFiles = appointment.documentFiles || [];
    
    // Handle payment screenshot - check both paymentScreenshotFile object and paymentScreenshot URL
    let paymentScreenshotFile = appointment.paymentScreenshotFile || null;
    
    // If paymentScreenshotFile is not available but paymentScreenshot URL exists, create file object
    if (!paymentScreenshotFile && appointment.paymentScreenshot) {
      const paymentUrl = appointment.paymentScreenshot;
      // Check if it's a valid URL
      if (typeof paymentUrl === 'string' && (paymentUrl.startsWith('http') || paymentUrl.startsWith('/'))) {
        paymentScreenshotFile = {
          name: 'payment_screenshot.jpg',
          size: 0,
          type: 'image/jpeg',
          lastModified: Date.now(),
          url: paymentUrl
        };
      }
    }
    
    console.log('🔍 Rendering documents for appointment:', {
      clientName: appointment.clientName,
      documents: documents,
      documentFiles: documentFiles,
      paymentScreenshotFile: paymentScreenshotFile,
      paymentScreenshot: appointment.paymentScreenshot,
      hasDocuments: !!documents,
      hasFiles: documentFiles.length > 0,
      hasPaymentScreenshot: !!paymentScreenshotFile
    });
    
    // Debug: Check which files have URLs
    documentFiles.forEach((file, index) => {
      console.log(`🔍 Case File ${index + 1}:`, {
        name: file.name,
        hasUrl: !!file.url,
        url: file.url,
        type: file.type,
        size: file.size
      });
    });
    
    if (paymentScreenshotFile) {
      console.log('🔍 Payment Screenshot:', {
        name: paymentScreenshotFile.name,
        hasUrl: !!paymentScreenshotFile.url,
        url: paymentScreenshotFile.url,
        type: paymentScreenshotFile.type,
        size: paymentScreenshotFile.size
      });
    }
    
    if (!documents && documentFiles.length === 0 && !paymentScreenshotFile) {
      console.log('❌ No documents to render for:', appointment.clientName);
      return null;
    }

    return (
      <div className="mt-3 space-y-4">
        {/* Payment Screenshot Section */}
        {paymentScreenshotFile && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">💳</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-800">Payment Screenshot</h4>
                  <p className="text-xs text-green-600">Proof of payment for consultation fee</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">📸</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{paymentScreenshotFile.name || 'Payment Screenshot'}</h4>
                  <p className="text-sm text-gray-500">
                    {paymentScreenshotFile.size 
                      ? `${(paymentScreenshotFile.size / 1024 / 1024).toFixed(2)} MB • ` 
                      : ''}
                    {paymentScreenshotFile.type?.split('/')[1]?.toUpperCase() || paymentScreenshotFile.url?.split('.').pop()?.toUpperCase() || 'IMAGE'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="default" 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleViewFile(paymentScreenshotFile)}
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View
                  </Button>
                  <Button 
                    size="default" 
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => handleDownloadFile(paymentScreenshotFile)}
                    disabled={downloadingFile === paymentScreenshotFile.name}
                  >
                    {downloadingFile === paymentScreenshotFile.name ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case Documents Section */}
        {(documents || documentFiles.length > 0) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">Case Documents</h4>
                  <p className="text-xs text-blue-600">Legal documents and case-related files</p>
                </div>
              </div>
              <Button 
                size="default" 
                variant="outline" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => handleViewDocuments(appointment)}
              >
                <Eye className="h-4 w-4 mr-2" />
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
                          size="default"
                          onClick={() => handleAcceptAppointment(appointment._id || appointment.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Accept
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="default" 
                              variant="outline" 
                              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              <RotateCcw className="h-5 w-5 mr-2" />
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
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Documents & Payment - {selectedDocuments?.clientName}</DialogTitle>
            <DialogDescription>
              Review all documents, files, and payment proof provided by the client.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocuments && (
            <div className="space-y-6">
              {/* Payment Screenshot Section - Always show */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">💳</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Payment Screenshot</h3>
                    <p className="text-sm text-green-600">Proof of payment for consultation fee</p>
                  </div>
                </div>
                
                {selectedDocuments.paymentScreenshotFile ? (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-2xl">📸</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{selectedDocuments.paymentScreenshotFile.name || 'Payment Screenshot'}</h4>
                        <p className="text-sm text-gray-500">
                          {selectedDocuments.paymentScreenshotFile.size 
                            ? `${(selectedDocuments.paymentScreenshotFile.size / 1024 / 1024).toFixed(2)} MB • ` 
                            : ''}
                          {selectedDocuments.paymentScreenshotFile.type?.split('/')[1]?.toUpperCase() || selectedDocuments.paymentScreenshotFile.url?.split('.').pop()?.toUpperCase() || 'IMAGE'}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                          onClick={() => handleViewFile(selectedDocuments.paymentScreenshotFile)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                          onClick={() => handleDownloadFile(selectedDocuments.paymentScreenshotFile)}
                          disabled={downloadingFile === selectedDocuments.paymentScreenshotFile.name}
                        >
                          {downloadingFile === selectedDocuments.paymentScreenshotFile.name ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                              <span className="text-xs">Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-1" />
                              <span className="text-xs">Download</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No payment screenshot uploaded by client</p>
                      <p className="text-gray-400 text-xs mt-1">Client has not provided payment proof yet</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Case Documents Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">Case Documents</h3>
                    <p className="text-sm text-blue-600">Legal documents and case-related files</p>
                  </div>
                </div>

                {/* Document Description */}
                {selectedDocuments.documents && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Document Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedDocuments.documents}</p>
                  </div>
                </div>
              )}
              
              {/* Uploaded Files - Client's Documents */}
              {selectedDocuments.documentFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Uploaded Files ({selectedDocuments.documentFiles.length})</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {selectedDocuments.documentFiles.map((file, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white min-h-[120px]">
                        <div className="flex flex-col gap-3">
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
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Button 
                                size="sm" 
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                                onClick={() => handleViewFile(file)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                                onClick={() => handleDownloadFile(file)}
                                disabled={downloadingFile === file.name}
                              >
                                {downloadingFile === file.name ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                                    <span className="text-xs">Downloading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Download</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setShowDocumentModal(false)}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
