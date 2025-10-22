import React, { useState, useEffect } from 'react';
import { reminderAPI } from '../services/api';
import { Calendar, Clock, User, Mail, Phone, Bell, BellOff, Settings, FileText, Eye, Download } from 'lucide-react';

const UpcomingAppointments = ({ userRole, userId }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchUpcomingAppointments();
    // Refresh every 5 minutes
    const interval = setInterval(fetchUpcomingAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      const response = await reminderAPI.getUpcomingAppointments(24); // Next 24 hours
      setUpcomingAppointments(response.appointments || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      setError('Failed to load upcoming appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((date - now) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((date - now) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Function to render document files
  const renderDocuments = (appointment) => {
    const documents = appointment.documents || '';
    const documentFiles = appointment.documentFiles || [];
    
    if (!documents && documentFiles.length === 0) {
      return null;
    }

    return (
      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
        <div className="flex items-center gap-1 mb-1">
          <FileText className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Documents</span>
        </div>
        
        {/* Text description of documents */}
        {documents && (
          <p className="text-xs text-blue-800 mb-1 truncate">{documents}</p>
        )}
        
        {/* Uploaded files count */}
        {documentFiles.length > 0 && (
          <p className="text-xs text-blue-600">
            {documentFiles.length} file(s) uploaded
          </p>
        )}
      </div>
    );
  };

  const getUrgencyClass = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((date - now) / (1000 * 60));

    if (diffMinutes <= 30) return 'urgent';
    if (diffMinutes <= 120) return 'important';
    return 'normal';
  };

  const handleSendReminder = async (appointmentId, reminderType) => {
    try {
      await reminderAPI.sendManualReminder(appointmentId, reminderType);
      alert('Reminder sent successfully!');
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminder');
    }
  };

  const handleUpdatePreferences = async (appointmentId, preferences) => {
    try {
      await reminderAPI.updateReminderPreferences(appointmentId, preferences);
      alert('Reminder preferences updated successfully!');
      setShowSettings(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error('Error updating preferences:', err);
      alert('Failed to update preferences');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading upcoming appointments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <BellOff className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
          <button 
            onClick={fetchUpcomingAppointments}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-600">
          <Calendar className="h-8 w-8 mx-auto mb-2" />
          <p>No upcoming appointments in the next 24 hours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Appointments ({upcomingAppointments.length})
            </h3>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => {
            const urgencyClass = getUrgencyClass(appointment.appointmentDate);
            const isUrgent = urgencyClass === 'urgent';
            const isImportant = urgencyClass === 'important';

            return (
              <div
                key={appointment._id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  isUrgent 
                    ? 'border-red-200 bg-red-50' 
                    : isImportant 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">       
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Clock className={`h-4 w-4 mr-2 ${
                        isUrgent ? 'text-red-600' : isImportant ? 'text-orange-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isUrgent ? 'text-red-800' : isImportant ? 'text-orange-800' : 'text-gray-800'
                      }`}>
                        {formatDate(appointment.appointmentDate)}
                      </span>
                      {isUrgent && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          URGENT
                        </span>
                      )}
                      {isImportant && !isUrgent && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          SOON
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {userRole === 'lawyer' ? appointment.clientName : appointment.lawyerId?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {userRole === 'lawyer' ? appointment.clientEmail : appointment.lawyerId?.email}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {userRole === 'lawyer' ? appointment.clientPhone : 'Contact info available'}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700">
                          {appointment.caseType}
                        </span>
                        {appointment.timeSlot && (
                          <span className="ml-2 text-sm text-gray-600">
                            • {appointment.timeSlot}
                          </span>
                        )}
                      </div>
                      
                      {/* Display documents if available */}
                      {renderDocuments(appointment)}
                    </div>
                  </div>

                  {userRole === 'lawyer' && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleSendReminder(appointment._id, '2h')}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Send 2h Reminder
                      </button>
                      <button
                        onClick={() => handleSendReminder(appointment._id, '30min')}
                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                      >
                        Send 30min Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reminder Settings</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdatePreferences(selectedAppointment._id, {
                emailReminders: formData.get('emailReminders') === 'on',
                smsReminders: formData.get('smsReminders') === 'on',
                reminderIntervals: Array.from(formData.getAll('reminderIntervals'))
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" name="emailReminders" defaultChecked />
                    <span className="ml-2">Email reminders</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" name="smsReminders" />
                    <span className="ml-2">SMS reminders</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reminder intervals:</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" name="reminderIntervals" value="24h" defaultChecked />
                      <span className="ml-2">24 hours before</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="reminderIntervals" value="2h" defaultChecked />
                      <span className="ml-2">2 hours before</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="reminderIntervals" value="30min" />
                      <span className="ml-2">30 minutes before</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;


