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
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, RotateCcw, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const mockAppointments = [
  {
    id: "1",
    clientName: "Sarah Mitchell",
    clientEmail: "sarah.mitchell@email.com",
    clientPhone: "(555) 123-4567",
    appointmentType: "Initial Consultation",
    requestedDate: "2024-01-15",
    requestedTime: "09:00",
    status: "pending",
    notes: "Divorce case consultation",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    clientName: "Robert Chen",
    clientEmail: "robert.chen@email.com",
    clientPhone: "(555) 234-5678",
    appointmentType: "Case Review",
    requestedDate: "2024-01-15",
    requestedTime: "11:30",
    status: "confirmed",
    notes: "Contract dispute follow-up",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    clientName: "Maria Rodriguez",
    clientEmail: "maria.rodriguez@email.com",
    clientPhone: "(555) 345-6789",
    appointmentType: "Document Review",
    requestedDate: "2024-01-15",
    requestedTime: "14:00",
    status: "confirmed",
    notes: "Real estate contract review",
    createdAt: "2024-01-09",
  },
  {
    id: "4",
    clientName: "James Wilson",
    clientEmail: "james.wilson@email.com",
    clientPhone: "(555) 456-7890",
    appointmentType: "Legal Advice",
    requestedDate: "2024-01-12",
    requestedTime: "10:00",
    status: "completed",
    notes: "Business incorporation consultation",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    clientName: "Emily Davis",
    clientEmail: "emily.davis@email.com",
    clientPhone: "(555) 567-8901",
    appointmentType: "Initial Consultation",
    requestedDate: "2024-01-14",
    requestedTime: "15:30",
    status: "rejected",
    notes: "Conflict of interest",
    createdAt: "2024-01-07",
  },
];

export function AppointmentManagement({ appointments = [], onUpdate }) {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sync local appointments with prop changes
  useEffect(() => {
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
      toast({ title: "Appointment status updated to Confirmed" });
    } catch (error) {
      console.error('Error accepting appointment:', error);
      toast.error('Failed to accept appointment');
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
      toast({ title: "Appointment status updated to Rejected", variant: "destructive" });
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast({ title: 'Failed to reject appointment', variant: 'destructive' });
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
    </div>
  );
}
