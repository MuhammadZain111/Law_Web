
import { useState } from "react";
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

const mockCases = [
  { id: "1", caseNumber: "2024-001", title: "Mitchell vs. Mitchell - Divorce Proceedings", clientName: "Sarah Mitchell", clientEmail: "sarah.mitchell@email.com", clientPhone: "(555) 123-4567", caseType: "Family Law", status: "in-progress", priority: "high", createdDate: "2024-01-05", lastUpdated: "2024-01-12", nextCourtDate: "2024-01-25", description: "Divorce proceedings involving asset division and child custody arrangements.", estimatedValue: "$50,000", documents: [{ id: "1", name: "Divorce Petition.pdf", type: "PDF", uploadDate: "2024-01-05", size: "2.3 MB" }, { id: "2", name: "Financial Disclosure.xlsx", type: "Excel", uploadDate: "2024-01-08", size: "1.1 MB" }], notes: [{ id: "1", content: "Initial consultation completed. Client wants to proceed with divorce.", createdAt: "2024-01-05", createdBy: "Attorney Johnson" }, { id: "2", content: "Filed divorce petition with court. Awaiting response from opposing counsel.", createdAt: "2024-01-08", createdBy: "Attorney Johnson" }] },
  { id: "2", caseNumber: "2024-002", title: "Chen Industries - Contract Dispute", clientName: "Robert Chen", clientEmail: "robert.chen@email.com", clientPhone: "(555) 234-5678", caseType: "Business Law", status: "in-progress", priority: "medium", createdDate: "2024-01-08", lastUpdated: "2024-01-14", description: "Contract dispute regarding breach of service agreement with vendor.", estimatedValue: "$25,000", documents: [{ id: "3", name: "Service Agreement.pdf", type: "PDF", uploadDate: "2024-01-08", size: "1.8 MB" }, { id: "4", name: "Email Correspondence.pdf", type: "PDF", uploadDate: "2024-01-10", size: "3.2 MB" }], notes: [{ id: "3", content: "Reviewed service agreement. Clear breach of contract by vendor.", createdAt: "2024-01-08", createdBy: "Attorney Johnson" }, { id: "4", content: "Sent demand letter to vendor. 30-day response period.", createdAt: "2024-01-12", createdBy: "Attorney Johnson" }] },
  { id: "3", caseNumber: "2024-003", title: "Rodriguez Property Purchase", clientName: "Maria Rodriguez", clientEmail: "maria.rodriguez@email.com", clientPhone: "(555) 345-6789", caseType: "Real Estate", status: "completed", priority: "low", createdDate: "2024-01-03", lastUpdated: "2024-01-15", description: "Real estate transaction for residential property purchase.", estimatedValue: "$15,000", documents: [{ id: "5", name: "Purchase Agreement.pdf", type: "PDF", uploadDate: "2024-01-03", size: "2.1 MB" }, { id: "6", name: "Title Report.pdf", type: "PDF", uploadDate: "2024-01-10", size: "4.5 MB" }], notes: [{ id: "5", content: "Purchase agreement reviewed and approved.", createdAt: "2024-01-03", createdBy: "Attorney Johnson" }, { id: "6", content: "Closing completed successfully. All documents filed.", createdAt: "2024-01-15", createdBy: "Attorney Johnson" }] },
];

export function CaseManagement() {
  const [cases, setCases] = useState(mockCases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState("");

  const handleStatusUpdate = (caseId, newStatus) => {
    const today = new Date().toISOString().split("T")[0];
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, status: newStatus, lastUpdated: today } : c
      )
    );
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
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedCase.documents.map((doc) => (
                      <div key={doc.id} className="p-3 border border-border rounded-lg flex justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{`${doc.type} • ${doc.size} • ${doc.uploadDate}`}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
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
