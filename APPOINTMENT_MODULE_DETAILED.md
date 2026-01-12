# Appointment Module - Har File Ka Detailed Breakdown

## 📋 **APPOINTMENT MODULE OVERVIEW**
Appointment module system ka core feature hai jo lawyers aur clients ke beech appointments manage karta hai.

---

## 🔧 **1. BACKEND FILES**

### 📄 **`backend/controllers/appointmentController.js`**
**Purpose**: Appointment operations ka main controller

#### **Main Functions:**

##### **`createAppointment(req, res)`**
- **Purpose**: Naya appointment create karta hai
- **Input Fields**:
  - `lawyerId` (required) - Lawyer ka ID
  - `clientName`, `clientEmail`, `clientPhone` (required)
  - `caseType`, `caseDescription` (required)
  - `appointmentDate`, `timeSlot` (required)
  - `consultationFee`, `paymentMethod` (required)
  - `paymentScreenshot`, `paymentScreenshotFile` (optional)
  - `clientAddress`, `clientCity`, `clientAge`, `clientGender` (optional)
  - `consultationType`, `urgency`, `previousLawyer` (optional)
  - `documents`, `documentFiles[]` (optional)
  - `specialRequirements` (optional)
- **Process**:
  1. Required fields validate karta hai
  2. Date validation
  3. Client ID resolve karta hai (authenticated user ya email se)
  4. Lawyer ID validate karta hai
  5. Appointment create karta hai with status "pending"
  6. Notification create karta hai lawyer aur client ke liye
  7. Socket.io event emit karta hai real-time update ke liye
- **Response**: Created appointment object

##### **`listAppointments(req, res)`**
- **Purpose**: Appointments list fetch karta hai (role-based)
- **Role Logic**:
  - **Lawyer**: Sirf apne appointments dikhata hai
  - **Admin**: Sab appointments dikhata hai
  - **User/Client**: Apne appointments (clientId ya email se match)
- **Query Features**:
  - `clientId` ya `clientEmail` se match
  - `lawyerId` se filter
  - Population: `clientId` aur `lawyerId` ke details
  - Sort: Newest first (`createdAt: -1`)
- **Response**: Array of appointments with populated user data

##### **`getAppointment(req, res)`**
- **Purpose**: Single appointment fetch karta hai
- **Authorization**: 
  - Client sirf apne appointments dekh sakta hai
  - Lawyer sirf apne appointments dekh sakta hai
- **Response**: Appointment object with populated data

##### **`updateAppointmentStatus(req, res)`**
- **Purpose**: Appointment status update karta hai
- **Allowed Statuses**: `pending`, `confirmed`, `rejected`, `completed`, `cancelled`
- **Authorization**:
  - Lawyer: Koi bhi status update kar sakta hai
  - Client: Sirf "cancelled" kar sakta hai
- **Process**:
  1. Status validate karta hai
  2. Authorization check
  3. Status update karta hai
  4. Email send karta hai (confirmed/rejected/cancelled/completed par)
  5. Notification create karta hai
  6. Socket.io event emit karta hai
- **Response**: Updated appointment

##### **`cancelAppointment(req, res)`**
- **Purpose**: Appointment cancel karta hai
- **Implementation**: `updateAppointmentStatus` ko "cancelled" status ke saath call karta hai

##### **`updatePaymentStatus(req, res)`**
- **Purpose**: Payment status update karta hai
- **Allowed Statuses**: `unpaid`, `paid`, `refunded`
- **Authorization**: Sirf lawyer apne appointments ka payment status update kar sakta hai
- **Response**: Updated appointment

##### **`linkAppointmentsToUser(req, res)`**
- **Purpose**: Unlinked appointments ko user se link karta hai
- **Use Case**: Jab user login karta hai aur usne pehle guest booking ki thi
- **Process**:
  1. User email se unlinked appointments find karta hai
  2. Un appointments ko user ID se link karta hai
- **Response**: Linked appointments count

##### **`getAllLawyers(req, res)`**
- **Purpose**: Sab approved lawyers fetch karta hai
- **Query Params**: `status` (optional filter)
- **Response**: Array of lawyers (password excluded)

##### **`getLawyerById(req, res)`**
- **Purpose**: Single lawyer fetch karta hai
- **Params**: `lawyerId`
- **Response**: Lawyer object

##### **`getAvailableTimeSlots(req, res)`**
- **Purpose**: Kisi specific date par available time slots fetch karta hai
- **Params**: `lawyerId`
- **Query**: `date` (required)
- **Process**:
  1. Requested date par existing appointments find karta hai
  2. Predefined time slots se booked slots filter karta hai
  3. Available slots return karta hai
- **Time Slots**: 
  - `09:00 - 10:00`
  - `10:00 - 11:00`
  - `11:00 - 12:00`
  - `14:00 - 15:00`
  - `15:00 - 16:00`
  - `16:00 - 17:00`
- **Response**: Available slots array

---

### 📄 **`backend/models/appointment.model.js`**
**Purpose**: Appointment database schema

#### **Schema Fields:**

##### **References:**
- `clientId` (ObjectId, ref: "User", optional) - Client user ID
- `lawyerId` (ObjectId, ref: "User", required) - Lawyer user ID

##### **Client Information:**
- `clientName` (String, required) - Client ka naam
- `clientEmail` (String, required) - Client email
- `clientPhone` (String, required) - Client phone
- `clientAddress` (String, optional) - Client address
- `clientCity` (String, optional) - Client city
- `clientAge` (String, optional) - Client age
- `clientGender` (String, optional) - Client gender

##### **Case Information:**
- `caseType` (String, required, enum) - Case type:
  - `'Criminal Law'`
  - `'Family Law'`
  - `'Civil Litigation'`
  - `'Corporate Law'`
  - `'Property Law'`
  - `'Immigration Law'`
  - `'Tax Law'`
  - `'Employment Law'`
- `caseDescription` (String, required) - Case details
- `consultationType` (String, optional) - Consultation type
- `urgency` (String, default: 'Normal') - Urgency level
- `previousLawyer` (String, optional) - Previous lawyer info
- `caseStatus` (String, default: 'New') - Case status
- `specialRequirements` (String, optional) - Special requirements

##### **Appointment Details:**
- `appointmentDate` (Date, required) - Appointment date
- `timeSlot` (String, required) - Time slot (e.g., "09:00 - 10:00")
- `durationMinutes` (Number, default: 60) - Duration in minutes

##### **Payment Information:**
- `consultationFee` (Number, required) - Consultation fee
- `paymentMethod` (String, required, enum) - Payment method:
  - `'EasyPaisa'`, `'JazzCash'`, `'Bank Transfer'`
  - `'Cash on Meeting'`, `'Credit Card'`
  - `'easypaisa'`, `'jazzcash'`, `'bank'` (lowercase variants)
- `paymentScreenshot` (String, optional) - Payment screenshot URL/path
- `paymentScreenshotFile` (Object, optional) - Payment screenshot file details:
  - `name`, `size`, `type`, `lastModified`, `url`
- `paymentStatus` (String, enum, default: "unpaid") - Payment status:
  - `"unpaid"`, `"paid"`, `"refunded"`

##### **Status:**
- `status` (String, enum, default: "pending") - Appointment status:
  - `"pending"`, `"confirmed"`, `"rejected"`, `"completed"`, `"cancelled"`

##### **Additional Fields:**
- `notes` (String, optional) - General notes
- `meetingLink` (String, optional) - Virtual meeting link
- `lawyerNotes` (String, optional) - Lawyer's private notes

##### **Document Fields:**
- `documents` (String, optional) - Text description of documents
- `documentFiles` (Array, default: []) - Uploaded files array:
  - Each file object: `{ name, size, type, lastModified, url }`

##### **Reminder Fields:**
- `remindersSent` (Array, default: []) - Sent reminder types: `['24h', '2h', '30min']`
- `reminderPreferences` (Object, default) - Reminder settings:
  - `emailReminders` (Boolean, default: true)
  - `smsReminders` (Boolean, default: false)
  - `reminderIntervals` (Array, default: `['24h', '2h']`)

##### **Timestamps:**
- `createdAt` (Auto) - Creation timestamp
- `updatedAt` (Auto) - Update timestamp

---

### 📄 **`backend/routes/appointments.js`**
**Purpose**: Appointment API routes

#### **Route Definitions:**

##### **Public Routes (No Auth Required):**
```javascript
GET /api/v1/appointments/lawyers
// Get all approved lawyers
// Handler: getAllLawyers

GET /api/v1/appointments/lawyers/:lawyerId
// Get single lawyer by ID
// Handler: getLawyerById

GET /api/v1/appointments/available-slots/:lawyerId?date=YYYY-MM-DD
// Get available time slots for a lawyer on specific date
// Handler: getAvailableTimeSlots
```

##### **Optional Auth Routes:**
```javascript
POST /api/v1/appointments
// Create appointment (guest booking allowed)
// Handler: createAppointment
// Middleware: optionalAuth()
```

##### **Protected Routes (Auth Required):**
```javascript
GET /api/v1/appointments
// List appointments (role-based)
// Handler: listAppointments
// Middleware: auth()

POST /api/v1/appointments/link-to-user
// Link existing appointments to logged-in user
// Handler: linkAppointmentsToUser
// Middleware: auth()

GET /api/v1/appointments/:id
// Get single appointment
// Handler: getAppointment
// Middleware: auth()

PATCH /api/v1/appointments/:id/status
// Update appointment status
// Handler: updateAppointmentStatus
// Middleware: auth()

PATCH /api/v1/appointments/:id/payment-status
// Update payment status (lawyer only)
// Handler: updatePaymentStatus
// Middleware: auth()

POST /api/v1/appointments/:id/cancel
// Cancel appointment
// Handler: cancelAppointment
// Middleware: auth()
```

---

## 🎨 **2. FRONTEND FILES**

### 📄 **`frontend/src/screens/AppointmentBooking.jsx`**
**Purpose**: Appointment booking form (User/Lawyer selection page se)

#### **Features:**
- **Lawyer Selection**: URL se lawyer ID receive karta hai
- **Form Fields**:
  - Client Information (name, email, phone, address, city, age, gender)
  - Case Information (case type, description, consultation type, urgency)
  - Appointment Details (date picker, time slot selection)
  - Payment Information (fee, payment method, screenshot upload)
  - Documents Upload (multiple files)
  - Special Requirements (textarea)
- **Dynamic Features**:
  - Lawyer data fetch karta hai
  - Available time slots fetch karta hai selected date par
  - Payment methods lawyer ke settings se filter karta hai
  - File upload handling (documents aur payment screenshot)
  - Form validation
  - Success/error handling with toast notifications
- **Constants**:
  - `APPOINTMENT_TYPES`: 8 case types
  - `TIME_SLOTS`: 18 time slots (9 AM - 5:30 PM, 30-min intervals)
  - `PAYMENT_METHODS`: 5 payment methods
  - `CONSULTATION_TYPES`: 6 consultation types
- **API Calls**:
  - `GET /appointments/lawyers?status=approved` - Fetch lawyers
  - `GET /appointments/available-slots/:lawyerId?date=...` - Get available slots
  - `POST /appointments` - Create appointment
- **Navigation**: Success par redirect karta hai

---

### 📄 **`frontend/src/screens/Lawyer/appointment-management.jsx`**
**Purpose**: Lawyer dashboard ka appointment management section

#### **Features:**

##### **State Management:**
- `localAppointments` - Appointments list
- `selectedAppointment` - Selected appointment for actions
- `rescheduleDate`, `rescheduleTime` - Reschedule form data
- `filterStatus` - Status filter ("all", "pending", "confirmed", etc.)
- `showDocumentModal` - Document modal visibility
- `selectedDocuments` - Selected documents for viewing
- `downloadingFile` - Download in progress indicator

##### **Main Functions:**

###### **`handleAcceptAppointment(appointmentId)`**
- Appointment ko "confirmed" status mein update karta hai
- Local state update karta hai
- Parent component ko notify karta hai

###### **`handleRejectAppointment(appointmentId)`**
- Appointment ko "rejected" status mein update karta hai
- Local state update karta hai

###### **`handleRescheduleAppointment(appointmentId)`**
- Appointment date/time reschedule karta hai
- Form validation

###### **Document Viewing:**
- `handleViewDocument(appointment)` - Document modal open karta hai
- `handleDownloadFile(file)` - File download karta hai
- `handleViewFile(file)` - File view karta hai (new tab)

##### **UI Components:**
- **Appointment Cards**: 
  - Client info, date/time, case type
  - Status badge (pending/confirmed/rejected/completed/cancelled)
  - Action buttons (Accept/Reject/View Details)
- **Status Filter**: Dropdown to filter by status
- **Document Modal**: 
  - Document list with view/download buttons
  - Payment screenshot display
- **Reschedule Dialog**: Date/time picker for rescheduling
- **Color Scheme**: Light-brown theme (amber/orange colors)

##### **API Integration:**
- `appointmentAPI.updateAppointmentStatus()` - Status update
- Real-time updates via Socket.io

---

### 📄 **`frontend/src/components/common/AppointmentCard.jsx`**
**Purpose**: Single appointment display card component

#### **Props:**
- `appointment` (Object) - Appointment data:
  - `clientName` - Client name
  - `date` - Appointment date
  - `time` - Appointment time
  - `caseType` - Case type
  - `status` - Status (upcoming/completed/pending)

#### **Features:**
- **Display**:
  - Client name (heading)
  - Date & time with icons (Calendar, Clock)
  - Case type
  - Status badge with color coding:
    - `upcoming`: Blue background
    - `completed`: Green background
    - `pending`: Yellow background
- **Styling**: White card with shadow, rounded corners

#### **Icons Used:**
- `Calendar` - Date icon
- `Clock` - Time icon

---

### 📄 **`frontend/src/components/common/AppointmentList.jsx`**
**Purpose**: Appointments list component

#### **Features:**

##### **State Management:**
- `appointments` - Appointments array
- `loading` - Loading state
- `error` - Error message

##### **Data Fetching:**
- `useEffect` hook se appointments fetch karta hai
- API: `GET /appointments/`
- Token check (localStorage se)
- Data normalization:
  - `_id` → `id`
  - `clientName` ya `userName` ya `user.firstname` → `clientName`
  - `date` ya `scheduledDate` → `date`
  - `time` ya `scheduledTime` → `time`
  - `caseType` ya `subject` → `caseType`
  - `status` → `status`

##### **UI:**
- **Loading State**: "Loading appointments…"
- **Error State**: Red error message
- **Empty State**: "No appointments yet."
- **List Display**: 
  - Each appointment in a bordered card
  - Shows: Client, Date, Time, Case Type, Status
  - Shadow effect, rounded corners

##### **Mock Data:**
- Fallback mock appointments for testing
- 3 sample appointments with different statuses

---

## 🔄 **DATA FLOW**

### **Appointment Creation Flow:**
1. **User** → `AppointmentBooking.jsx` form fill karta hai
2. **Frontend** → `POST /api/v1/appointments` call karta hai
3. **Backend** → `createAppointment()` function:
   - Validation
   - Client ID resolve
   - Appointment create
   - Notification create
   - Socket.io event emit
4. **Response** → Frontend success message show karta hai

### **Appointment List Flow:**
1. **User/Lawyer** → Dashboard open karta hai
2. **Frontend** → `GET /api/v1/appointments` call karta hai
3. **Backend** → `listAppointments()` function:
   - Role-based filtering
   - Population (client/lawyer details)
   - Sort by date
4. **Response** → Frontend list render karta hai

### **Status Update Flow:**
1. **Lawyer** → `appointment-management.jsx` mein action click karta hai
2. **Frontend** → `PATCH /api/v1/appointments/:id/status` call karta hai
3. **Backend** → `updateAppointmentStatus()` function:
   - Authorization check
   - Status update
   - Email send
   - Notification create
   - Socket.io event emit
4. **Response** → Frontend UI update karta hai

---

## 📊 **STATUS WORKFLOW**

```
pending → confirmed → completed
   ↓
rejected
   ↓
cancelled (by client or lawyer)
```

### **Status Meanings:**
- **pending**: Appointment request submitted, waiting for lawyer approval
- **confirmed**: Lawyer ne accept kar diya
- **rejected**: Lawyer ne reject kar diya
- **completed**: Appointment successfully complete ho gaya
- **cancelled**: Appointment cancel ho gaya (by client or lawyer)

---

## 💳 **PAYMENT WORKFLOW**

### **Payment Status:**
- **unpaid**: Payment abhi nahi hui (default)
- **paid**: Payment confirm ho gayi
- **refunded**: Payment refund ho gayi

### **Payment Methods:**
- EasyPaisa
- JazzCash
- Bank Transfer
- Cash on Meeting
- Credit Card

### **Payment Screenshot:**
- User payment screenshot upload kar sakta hai
- File object store hota hai: `{ name, size, type, lastModified, url }`
- Lawyer payment verify kar sakta hai

---

## 📎 **DOCUMENT MANAGEMENT**

### **Document Types:**
1. **Case Documents** (`documentFiles[]`):
   - Multiple files upload
   - Each file: `{ name, size, type, lastModified, url }`
   - View/Download functionality

2. **Payment Screenshot** (`paymentScreenshotFile`):
   - Single file
   - Payment proof
   - Lawyer verification ke liye

### **Document Features:**
- Upload during booking
- View in appointment details
- Download functionality
- File metadata storage

---

## 🔔 **NOTIFICATIONS & REMINDERS**

### **Notifications:**
- Appointment create: Lawyer aur client dono ko notification
- Status update: Affected party ko notification
- Real-time: Socket.io events

### **Reminders:**
- Email reminders (default: enabled)
- SMS reminders (default: disabled)
- Reminder intervals: 24 hours aur 2 hours before appointment
- `remindersSent[]` array track karta hai sent reminders

---

## 🎨 **UI/UX FEATURES**

### **Color Scheme (Light-Brown Theme):**
- Primary: `#d79c54` (Amber/Brown)
- Secondary: `#f3ce8c` (Light Brown)
- Dark: `#2f1c0e` (Dark Brown)
- Background: `#fff9f4` (Warm Ivory)

### **Status Badge Colors:**
- Pending: Yellow/Amber
- Confirmed: Green
- Rejected: Red
- Completed: Blue/Green
- Cancelled: Gray

### **Icons Used:**
- Calendar, Clock, User, Phone, Mail
- CheckCircle, XCircle, RotateCcw
- FileText, Download, Eye
- Filter, DollarSign

---

## 🔐 **AUTHORIZATION RULES**

### **Lawyer:**
- ✅ Apne appointments dekh sakta hai
- ✅ Appointment status update kar sakta hai
- ✅ Payment status update kar sakta hai
- ❌ Doosre lawyers ke appointments nahi dekh sakta

### **Client/User:**
- ✅ Apne appointments dekh sakta hai
- ✅ Appointment cancel kar sakta hai
- ❌ Status update nahi kar sakta (except cancel)
- ❌ Payment status update nahi kar sakta

### **Admin:**
- ✅ Sab appointments dekh sakta hai
- ✅ Kisi bhi appointment ko manage kar sakta hai
- ✅ Status aur payment status update kar sakta hai

### **Guest:**
- ✅ Appointment create kar sakta hai (without login)
- ❌ Appointments list nahi dekh sakta
- ❌ Status update nahi kar sakta

---

## 📝 **SUMMARY**

### **Backend Files:**
1. **`appointmentController.js`** - 10+ functions, 680+ lines
2. **`appointment.model.js`** - Complete schema, 106 lines
3. **`appointments.js`** - 8 routes, 47 lines

### **Frontend Files:**
1. **`AppointmentBooking.jsx`** - Booking form, 1300+ lines
2. **`appointment-management.jsx`** - Lawyer management, 900+ lines
3. **`AppointmentCard.jsx`** - Display card, 41 lines
4. **`AppointmentList.jsx`** - List component, 83 lines

### **Total: 7 Main Files, 3000+ Lines of Code**

### **Key Features:**
- ✅ Full CRUD operations
- ✅ Role-based access control
- ✅ Real-time updates (Socket.io)
- ✅ Email notifications
- ✅ Document management
- ✅ Payment tracking
- ✅ Reminder system
- ✅ Status workflow
- ✅ Guest booking support
- ✅ File upload/download





