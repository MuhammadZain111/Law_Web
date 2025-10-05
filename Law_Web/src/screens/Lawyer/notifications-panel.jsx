import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Calendar, User, Phone, Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { appointmentAPI } from "@/services/api";

export default function NotificationsPanel({ appointments = [], onClose, onNavigate }) {
  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentAPI.updateAppointmentStatus(appointmentId, status);
      // Refresh the appointments list by navigating to appointments tab
      onNavigate("/appointments");
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeSlot) => {
    return timeSlot || 'Time not specified';
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {appointments.length} pending appointment{appointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No pending appointments</h3>
            <p className="text-muted-foreground">
              You're all caught up! New appointment requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment._id} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {appointment.clientName}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {appointment.caseType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(appointment.timeSlot)}
                      </div>
                      <div>{formatDate(appointment.appointmentDate)}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{appointment.clientEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{appointment.clientPhone}</span>
                      </div>
                    </div>

                    {/* Case Description */}
                    {appointment.caseDescription && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Case Details:</p>
                        <p className="text-muted-foreground line-clamp-2">
                          {appointment.caseDescription}
                        </p>
                      </div>
                    )}

                    {/* Payment Information */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Consultation Fee:</span>
                      <span className="font-medium">PKR {appointment.consultationFee}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
          <Button
            size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(appointment._id, 'rejected')}
          >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
          </Button>
        </div>
      </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t">
        <Button 
          className="w-full" 
          onClick={() => onNavigate("/appointments")}
        >
          View All Appointments
        </Button>
      </div>
    </div>
  );
}