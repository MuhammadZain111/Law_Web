# Automated Appointment Reminder System

## Overview
This system provides automated email reminders for upcoming appointments in the legal practice management system. It uses a scheduled job system to send reminders at specific intervals before appointments.

## Features

### 1. Automated Reminders
- **24-hour reminders**: Sent 24 hours before appointment
- **2-hour reminders**: Sent 2 hours before appointment  
- **30-minute reminders**: Sent 30 minutes before appointment

### 2. Email Templates
- Professional HTML email templates with responsive design
- Different urgency levels (normal, important, urgent)
- Includes appointment details, lawyer/client information, and meeting links

### 3. Reminder Preferences
- Users can customize reminder settings per appointment
- Enable/disable email reminders
- Choose reminder intervals (24h, 2h, 30min)
- Track which reminders have been sent

### 4. Manual Reminders
- Lawyers can send manual reminders to clients
- Admin can trigger reminder jobs for testing

## System Architecture

### Backend Components

#### 1. Models (`backend/models/appointment.model.js`)
```javascript
// Added reminder tracking fields
remindersSent: [String], // Array of sent reminder types
reminderPreferences: {
  emailReminders: Boolean,
  smsReminders: Boolean,
  reminderIntervals: [String] // ['24h', '2h', '30min']
}
```

#### 2. Services

**ReminderService** (`backend/services/reminderService.js`)
- `sendReminderEmail()` - Send reminder emails
- `buildReminderEmail()` - Create email templates
- `getAppointmentsNeedingReminders()` - Find appointments needing reminders
- `processReminders()` - Process all pending reminders

**SchedulerService** (`backend/services/schedulerService.js`)
- `initialize()` - Start all scheduled jobs
- `scheduleJob()` - Schedule individual cron jobs
- `getUpcomingAppointments()` - Get upcoming appointments for dashboard

#### 3. Controllers (`backend/controllers/reminderController.js`)
- `getUpcomingAppointments` - Get upcoming appointments for user
- `updateReminderPreferences` - Update reminder settings
- `sendManualReminder` - Send manual reminder (lawyer only)
- `getSchedulerStatus` - Get scheduler status (admin only)
- `triggerReminderJob` - Trigger reminder job manually (admin only)

#### 4. Routes (`backend/routes/reminder.routes.js`)
```
GET    /api/v1/reminders/upcoming              - Get upcoming appointments
PATCH  /api/v1/reminders/preferences/:id       - Update reminder preferences
POST   /api/v1/reminders/send/:id              - Send manual reminder
GET    /api/v1/reminders/admin/status          - Get scheduler status
POST   /api/v1/reminders/admin/trigger         - Trigger reminder job
GET    /api/v1/reminders/admin/stats           - Get reminder statistics
```

### Frontend Components

#### 1. API Service (`frontend/src/services/api.js`)
- `reminderAPI` - All reminder-related API calls

#### 2. UpcomingAppointments Component (`frontend/src/components/UpcomingAppointments.jsx`)
- Displays upcoming appointments with urgency indicators
- Shows time until appointment
- Allows lawyers to send manual reminders
- Settings modal for reminder preferences

## Scheduled Jobs

The system uses `node-cron` to schedule reminder jobs:

```javascript
// 24-hour reminders - runs every hour
'0 * * * *'

// 2-hour reminders - runs every 30 minutes  
'*/30 * * * *'

// 30-minute reminders - runs every 15 minutes
'*/15 * * * *'

// Cleanup job - runs daily at 2 AM
'0 2 * * *'
```

## Email Templates

### Template Features
- **Responsive design** - Works on desktop and mobile
- **Urgency indicators** - Color-coded based on time remaining
- **Professional styling** - Clean, legal practice branding
- **Complete information** - All appointment details included

### Template Types
1. **24-hour reminder** - Gentle green styling
2. **2-hour reminder** - Important orange styling  
3. **30-minute reminder** - Urgent red styling

## Configuration

### Environment Variables
```bash
# Email configuration (required for reminders)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL="Legal Practice" <no-reply@legalpractice.com>

# Optional
TZ=UTC  # Timezone for scheduled jobs
```

### Default Settings
- Email reminders: **Enabled**
- SMS reminders: **Disabled** (future feature)
- Default intervals: **24h, 2h**
- 30-minute reminders: **Optional**

## Usage

### For Lawyers
1. **View upcoming appointments** - Dashboard shows appointments in next 24 hours
2. **Send manual reminders** - Click buttons to send 2h or 30min reminders
3. **Update preferences** - Modify reminder settings per appointment

### For Clients
- Receive automated email reminders
- Can contact lawyer to update reminder preferences

### For Admins
- Monitor scheduler status
- Trigger manual reminder jobs for testing
- View reminder statistics

## Testing

### Manual Testing
```bash
# Trigger a reminder job manually (admin only)
POST /api/v1/reminders/admin/trigger
{
  "reminderType": "24h"
}

# Check scheduler status
GET /api/v1/reminders/admin/status

# Get reminder statistics
GET /api/v1/reminders/admin/stats
```

### Creating Test Appointments
1. Create appointment with date 25 hours in future
2. Wait for 24h reminder job to run (or trigger manually)
3. Check email delivery and database updates

## Monitoring

### Logs
The system logs all reminder activities:
- ✅ Successful email sends
- ❌ Failed email sends  
- 📋 Jobs processed
- 🧹 Cleanup activities

### Database Tracking
- `remindersSent` array tracks which reminders were sent
- `reminderPreferences` stores user preferences
- Timestamps track when reminders were processed

## Future Enhancements

1. **SMS Reminders** - Add SMS support via Twilio
2. **Push Notifications** - Browser/mobile push notifications
3. **Custom Templates** - Allow lawyers to customize email templates
4. **Bulk Operations** - Send reminders to multiple appointments
5. **Analytics** - Detailed reminder delivery statistics
6. **Time Zones** - Support for different time zones
7. **Recurring Appointments** - Support for recurring appointment reminders

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP configuration
   - Verify email credentials
   - Check spam folder

2. **Reminders not triggering**
   - Check scheduler status
   - Verify appointment dates
   - Check reminder preferences

3. **Database issues**
   - Verify MongoDB connection
   - Check appointment model updates
   - Verify reminder fields exist

### Debug Commands
```bash
# Check if scheduler is running
GET /api/v1/reminders/admin/status

# Trigger manual reminder
POST /api/v1/reminders/admin/trigger
{
  "reminderType": "24h"
}

# Check upcoming appointments
GET /api/v1/reminders/upcoming?hours=24
```































