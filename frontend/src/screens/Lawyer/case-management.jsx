
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import  Textarea  from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  FileText,
  User,
  Calendar,
  Clock,
  Upload,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
} from "lucide-react";
import { api } from '@/shared/api';
import { toast } from '../../hooks/use-toast.js';

export function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch appointments and convert them to cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await api.get('/appointments/');
        const appointments = response?.data?.appointments || [];
        
        console.log('📋 Fetched appointments for cases:', appointments.length);
        
        // Convert appointments to cases format
        const convertedCases = appointments.map((apt, index) => {
          const appointmentDate = apt.appointmentDate ? new Date(apt.appointmentDate) : new Date(apt.createdAt || Date.now());
          const createdDate = apt.createdAt ? new Date(apt.createdAt).toISOString().split('T')[0] : appointmentDate.toISOString().split('T')[0];
          
          // Map caseStatus to our status format
          let status = 'in-progress';
          if (apt.caseStatus) {
            const caseStatus = apt.caseStatus.toLowerCase();
            if (caseStatus === 'completed' || caseStatus === 'closed') {
              status = 'completed';
            } else if (caseStatus === 'new' || caseStatus === 'pending') {
              status = 'new';
            } else if (caseStatus === 'postponed' || caseStatus === 'cancelled') {
              status = 'postponed';
            }
          } else if (apt.status) {
            const aptStatus = apt.status.toLowerCase();
            if (aptStatus === 'completed') {
              status = 'completed';
            } else if (aptStatus === 'rejected' || aptStatus === 'cancelled') {
              status = 'postponed';
            }
          }
          
          // Map urgency to priority
          let priority = 'medium';
          if (apt.urgency) {
            const urgency = apt.urgency.toLowerCase();
            if (urgency === 'high' || urgency === 'urgent') {
              priority = 'high';
            } else if (urgency === 'low' || urgency === 'normal') {
              priority = 'low';
            }
          }
          
          // Extract documents from appointment
          const documents = [];
          if (apt.documentFiles && Array.isArray(apt.documentFiles)) {
            apt.documentFiles.forEach((file, idx) => {
              documents.push({
                id: `${apt._id}-doc-${idx}`,
                name: file.name || 'Document',
                type: file.type?.split('/')[1]?.toUpperCase() || 'FILE',
                uploadDate: createdDate,
                size: file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
                url: file.url || null // Include URL for viewing/downloading
              });
            });
          }
          
          // Create case title from client name and case type
          const caseTitle = `${apt.clientName || 'Client'} - ${apt.caseType || 'Legal Case'}`;
          
          return {
            id: apt._id || `case-${index}`,
            caseNumber: `CASE-${String(apt._id || index).slice(-6).toUpperCase()}`,
            title: caseTitle,
            clientName: apt.clientName || apt.clientId?.firstname || 'Unknown Client',
            clientEmail: apt.clientEmail || apt.clientId?.email || '',
            clientPhone: apt.clientPhone || '',
            caseType: apt.caseType || 'General',
            status: status,
            priority: priority,
            createdDate: createdDate,
            lastUpdated: apt.updatedAt ? new Date(apt.updatedAt).toISOString().split('T')[0] : createdDate,
            nextCourtDate: apt.appointmentDate ? new Date(apt.appointmentDate).toISOString().split('T')[0] : null,
            description: apt.caseDescription || apt.description || 'No description available.',
            estimatedValue: apt.consultationFee ? `PKR ${apt.consultationFee.toLocaleString()}` : 'N/A',
            documents: documents,
            notes: [], // Notes can be added later
            appointmentId: apt._id // Keep reference to original appointment
          };
        });
        
        setCases(convertedCases);
        console.log('✅ Converted cases:', convertedCases.length);
      } catch (error) {
        console.error('❌ Error fetching cases:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCases();
  }, []);

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      const caseToUpdate = cases.find(c => c.id === caseId);
      if (!caseToUpdate?.appointmentId) {
        // If no appointmentId, just update locally
        const today = new Date().toISOString().split("T")[0];
        setCases((prev) =>
          prev.map((c) =>
            c.id === caseId ? { ...c, status: newStatus, lastUpdated: today } : c
          )
        );
        return;
      }
      
      // Map our status to caseStatus
      let caseStatus = 'In Progress';
      if (newStatus === 'completed') {
        caseStatus = 'Completed';
      } else if (newStatus === 'new') {
        caseStatus = 'New';
      } else if (newStatus === 'postponed') {
        caseStatus = 'Postponed';
      }
      
      // Update appointment caseStatus via API
      await api.patch(`/appointments/${caseToUpdate.appointmentId}`, {
        caseStatus: caseStatus
      });
      
      const today = new Date().toISOString().split("T")[0];
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId ? { ...c, status: newStatus, lastUpdated: today } : c
        )
      );
    } catch (error) {
      console.error('❌ Error updating case status:', error);
      alert('Failed to update case status. Please try again.');
    }
  };

  const handleAddNote = (caseId) => {
    if (!newNote.trim()) return;
    const note = { id: Date.now().toString(), content: newNote, createdAt: new Date().toISOString().split("T")[0], createdBy: "Attorney Johnson" };
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, notes: [...c.notes, note], lastUpdated: new Date().toISOString().split("T")[0] }
          : c
      )
    );
    setNewNote("");
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCase) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name} is too large. Maximum size is 10MB.`,
      });
      return;
    }

    setUploadingFile(true);
    try {
      // Upload file to backend
      const formData = new FormData();
      formData.append('file', file);
      const apiBase = (import.meta.env?.VITE_API_BASE || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/api/v1/user/upload-local`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        }
      });

      const data = await response.json();
      if (!response.ok || !data?.url) {
        throw new Error(data?.message || 'Upload failed');
      }

      // Add file to selected case
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type?.split('/')[1]?.toUpperCase() || 'FILE',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        url: data.url
      };

      setCases((prev) =>
        prev.map((c) =>
          c.id === selectedCase.id
            ? { ...c, documents: [...(c.documents || []), newDoc], lastUpdated: new Date().toISOString().split("T")[0] }
            : c
        )
      );

      // Update selected case
      setSelectedCase((prev) => ({
        ...prev,
        documents: [...(prev?.documents || []), newDoc]
      }));

      toast({
        title: "Upload successful",
        description: `File ${file.name} uploaded successfully!`,
      });
    } catch (error) {
      console.error('❌ File upload error:', error);
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}: ${error.message}`,
      });
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file view
  const handleViewFile = (file) => {
    if (file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "File not available",
        description: "File URL is not available for viewing.",
      });
    }
  };

  // Handle file download
  const handleDownloadFile = async (file) => {
    if (!file.url) {
      toast({
        title: "File not available",
        description: "File URL is not available for download.",
      });
      return;
    }

    setDownloadingFile(file.name);
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
        
        toast({
          title: "Download successful",
          description: `File ${file.name} downloaded successfully!`,
        });
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      console.error('❌ Download error:', error);
      // Fallback: open in new tab
      window.open(file.url, '_blank', 'noopener,noreferrer');
      toast({
        title: "Download initiated",
        description: `File ${file.name} opened in new tab.`,
      });
    } finally {
      setDownloadingFile(null);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(term) || c.clientName.toLowerCase().includes(term) || c.caseNumber.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    if (status === "new") return <Badge variant="secondary">New</Badge>;
    if (status === "in-progress") return <Badge variant="default">In Progress</Badge>;
    if (status === "completed") return <Badge className="bg-primary">Completed</Badge>;
    if (status === "postponed") return <Badge variant="outline">Postponed</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    if (priority === "high") return <Badge variant="destructive">High Priority</Badge>;
    if (priority === "medium") return <Badge variant="secondary">Medium Priority</Badge>;
    if (priority === "low") return <Badge variant="outline">Low Priority</Badge>;
    return <Badge variant="secondary">{priority}</Badge>;
  };

  const countByStatus = (status) => cases.filter((c) => c.status === status).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Case Management</h1>
          <p className="text-muted-foreground">Track and manage your legal cases</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["in-progress", "completed", "postponed"].map((statusLabel, idx) => (
          <Card key={statusLabel}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {statusLabel === "in-progress" ? "Active Cases" : statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
                  </p>
                  <p className="text-2xl font-bold">{countByStatus(statusLabel)}</p>
                </div>
                {idx === 2 ? (
                  <AlertCircle className="h-8 w-8 text-secondary" />
                ) : (
                  <FileText className="h-8 w-8 text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold">{cases.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases by title, client, or case number..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cases</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="postponed">Postponed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Cases</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading cases...</div>
            ) : (
              <div className="space-y-4">
                {filteredCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No cases found matching your criteria.</div>
                ) : (
                  filteredCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedCase?.id === c.id ? "bg-muted/50 border-primary" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{c.title}</h3>
                            <p className="text-sm text-muted-foreground">Case #{c.caseNumber}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(c.status)}
                            {getPriorityBadge(c.priority)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {c.clientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {c.createdDate}
                          </span>
                        </div>
                        {c.nextCourtDate && (
                          <div className="flex items-center gap-1 text-sm text-primary">
                            <Clock className="h-3 w-3" />
                            Next court date: {c.nextCourtDate}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">{selectedCase ? "Case Details" : "Select a Case"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCase ? (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Overview Content */}
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-medium">Case Information</h3>
                      {(["Case Number", "Type", "Status", "Priority", "Estimated Value"].map((label, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground">{label}:</span>
                          <span>
                            {label === "Case Number" && selectedCase.caseNumber}
                            {label === "Type" && selectedCase.caseType}
                            {label === "Status" && getStatusBadge(selectedCase.status)}
                            {label === "Priority" && getPriorityBadge(selectedCase.priority)}
                            {label === "Estimated Value" && selectedCase.estimatedValue}
                          </span>
                        </div>
                      )))}
                    </div>

                    <div>
                      <h3 className="font-medium">Client Information</h3>
                      {["Name", "Email", "Phone"].map((label, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{label}:</span>
                          <span>
                            {label === "Name" && selectedCase.clientName}
                            {label === "Email" && selectedCase.clientEmail}
                            {label === "Phone" && selectedCase.clientPhone}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-muted-foreground text-sm">{selectedCase.description}</p>
                    </div>

                    <div>
                      <Label htmlFor="status-update">Update Status</Label>
                      <Select value={selectedCase.status} onValueChange={(val) => handleStatusUpdate(selectedCase.id, val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["new", "in-progress", "completed", "postponed"].map((st) => (
                            <SelectItem key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Case Documents</h3>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,application/pdf,.doc,.docx,.txt"
                        disabled={uploadingFile}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                      >
                        {uploadingFile ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" /> Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedCase.documents && selectedCase.documents.length > 0 ? (
                      selectedCase.documents.map((doc) => (
                        <div key={doc.id} className="p-3 border border-border rounded-lg flex justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{`${doc.type} • ${doc.size} • ${doc.uploadDate}`}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleViewFile(doc)}
                              title="View file"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDownloadFile(doc)}
                              disabled={downloadingFile === doc.name}
                              title="Download file"
                            >
                              {downloadingFile === doc.name ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No documents uploaded yet. Click Upload to add documents.
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <h3 className="font-medium">Case Notes</h3>
                    <div className="space-y-3">
                      {selectedCase.notes.map((note) => (
                        <div key={note.id} className="p-3 border border-border rounded-lg">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">{`${note.createdBy} • ${note.createdAt}`}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-note">Add Note</Label>
                    <Textarea id="new-note" placeholder="Enter case note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                    <Button onClick={() => handleAddNote(selectedCase.id)} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a case from the list to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
