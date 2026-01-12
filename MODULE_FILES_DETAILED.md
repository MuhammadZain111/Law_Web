# Lawyer Management System - Har Module Ki Files Ka Detailed Breakdown

## 📦 **1. BACKEND MODULE** (`/backend`)

### 🔧 **Main Entry Point**
- **`server.js`** - Server ka main file
  - Express server setup
  - Middleware configuration (CORS, body-parser, etc.)
  - Routes mounting
  - Socket.io initialization
  - Server start karta hai port 5000 par

### 📂 **Controllers** (`/backend/controllers/`)
Backend logic handle karta hai:

#### **`appointmentController.js`**
- **Purpose**: Appointments ka CRUD operations
- **Functions**:
  - `createAppointment()` - Naya appointment create
  - `getAppointments()` - All appointments fetch
  - `getAppointmentById()` - Single appointment
  - `updateAppointment()` - Appointment update
  - `deleteAppointment()` - Appointment delete
  - `getLawyerAppointments()` - Lawyer ke appointments
  - `getUserAppointments()` - User ke appointments

#### **`chatbotController.js`**
- **Purpose**: AI Chatbot integration
- **Functions**:
  - `chatWithBot()` - User message ko AI ke pass bhejta hai
  - XAI/GROQ/OpenAI API integration
  - Legal questions ka response generate karta hai

#### **`chatController.js`**
- **Purpose**: Real-time chat messages
- **Functions**:
  - `sendMessage()` - Message send karta hai
  - `getMessages()` - Chat history fetch
  - `getConversations()` - All conversations
  - Socket.io integration

#### **`reminderController.js`**
- **Purpose**: Appointment reminders
- **Functions**:
  - `createReminder()` - Reminder create
  - `getReminders()` - Reminders fetch
  - `updateReminder()` - Reminder update
  - `deleteReminder()` - Reminder delete

#### **`user.controller.js`**
- **Purpose**: User management
- **Functions**:
  - `getAllUsers()` - All users fetch
  - `getUserById()` - Single user
  - `updateUser()` - User update
  - `deleteUser()` - User delete

---

### 📂 **Models** (`/backend/models/`)
Database schemas define karta hai:

#### **`User.js`**
- **Schema Fields**:
  - `name`, `email`, `password` (hashed)
  - `phone`, `address`
  - `role` (user/lawyer/admin)
  - `createdAt`, `updatedAt`

#### **`Lawyer.js`**
- **Schema Fields**:
  - `userId` (reference to User)
  - `fullName`, `email`, `phone`
  - `barNumber`, `specialization`
  - `yearsOfExperience`, `firmName`
  - `city`, `cnicNumber`
  - `licenses[]` - Array of license documents
  - `documents[]` - Array of supporting documents
  - `status` (pending/approved/rejected)
  - `rating`, `reviews[]`

#### **`Admin.js`**
- **Schema Fields**:
  - `name`, `email`, `password`
  - `role: "admin"`
  - `permissions[]`

#### **`appointment.model.js`**
- **Schema Fields**:
  - `lawyerId` (reference to Lawyer)
  - `userId` (reference to User)
  - `date`, `time`, `duration`
  - `type` (in-person/virtual)
  - `status` (pending/confirmed/completed/cancelled)
  - `fee`, `paymentStatus`
  - `notes`, `disputeFlag`

#### **`Chat.js`**
- **Schema Fields**:
  - `participants[]` - [lawyerId, userId]
  - `lastMessage`, `lastMessageAt`
  - `createdAt`, `updatedAt`

#### **`Message.js`**
- **Schema Fields**:
  - `chatId` (reference to Chat)
  - `senderId`, `senderType` (lawyer/user)
  - `content`, `messageType` (text/file/image)
  - `read`, `readAt`
  - `createdAt`

#### **`Notification.js`**
- **Schema Fields**:
  - `userId` (reference to User)
  - `type` (appointment/reminder/message)
  - `title`, `message`
  - `read`, `readAt`
  - `createdAt`

---

### 📂 **Routes** (`/backend/routes/`)
API endpoints define karta hai:

#### **`appointments.js`**
- **Endpoints**:
  - `POST /api/v1/appointments` - Create appointment
  - `GET /api/v1/appointments` - Get all appointments
  - `GET /api/v1/appointments/:id` - Get single appointment
  - `PUT /api/v1/appointments/:id` - Update appointment
  - `DELETE /api/v1/appointments/:id` - Delete appointment
  - `GET /api/v1/appointments/lawyer/:lawyerId` - Lawyer's appointments
  - `GET /api/v1/appointments/user/:userId` - User's appointments

#### **`auth.routes.js`**
- **Endpoints**:
  - `POST /api/v1/auth/register` - User registration
  - `POST /api/v1/auth/login` - User login
  - `POST /api/v1/auth/admin/login` - Admin login
  - `POST /api/v1/auth/lawyer/register` - Lawyer registration
  - `GET /api/v1/auth/me` - Get current user
  - `POST /api/v1/auth/logout` - Logout

#### **`chat.routes.js`**
- **Endpoints**:
  - `POST /api/v1/chat/send` - Send message
  - `GET /api/v1/chat/conversations` - Get conversations
  - `GET /api/v1/chat/messages/:chatId` - Get messages
  - `PUT /api/v1/chat/messages/:messageId/read` - Mark as read

#### **`chatbot.js`**
- **Endpoints**:
  - `POST /api/v1/chatbot/chat` - Chat with AI bot

#### **`lawyer.routes.js`**
- **Endpoints**:
  - `GET /api/v1/lawyers` - Get all lawyers (with filters)
  - `GET /api/v1/lawyers/:id` - Get single lawyer
  - `GET /api/v1/lawyers/:id/review` - Get lawyer documents for review
  - `PUT /api/v1/lawyers/:id` - Update lawyer
  - `PUT /api/v1/lawyers/:id/approve` - Approve lawyer
  - `PUT /api/v1/lawyers/:id/reject` - Reject lawyer
  - `POST /api/v1/lawyers/:id/upload` - Upload documents

#### **`notifications.js`**
- **Endpoints**:
  - `GET /api/v1/notifications` - Get user notifications
  - `PUT /api/v1/notifications/:id/read` - Mark as read
  - `DELETE /api/v1/notifications/:id` - Delete notification

#### **`reminder.routes.js`**
- **Endpoints**:
  - `POST /api/v1/reminders` - Create reminder
  - `GET /api/v1/reminders` - Get reminders
  - `PUT /api/v1/reminders/:id` - Update reminder
  - `DELETE /api/v1/reminders/:id` - Delete reminder

#### **`user.route.js`**
- **Endpoints**:
  - `GET /api/v1/user` - Get all users
  - `GET /api/v1/user/:id` - Get single user
  - `PUT /api/v1/user/:id` - Update user
  - `DELETE /api/v1/user/:id` - Delete user

---

### 📂 **Middleware** (`/backend/middleware/`)

#### **`auth.js`**
- **Purpose**: JWT authentication & authorization
- **Functions**:
  - `authenticate()` - Token verify karta hai
  - `authorize()` - Role-based access control
  - `isAdmin()` - Admin check
  - `isLawyer()` - Lawyer check

#### **`transporter.js`**
- **Purpose**: Email sending configuration
- **Functions**:
  - Nodemailer setup
  - SMTP configuration
  - Email templates

---

### 📂 **Services** (`/backend/services/`)

#### **`notificationService.js`**
- **Purpose**: Notification sending logic
- **Functions**:
  - `sendNotification()` - Notification create & send
  - `sendEmailNotification()` - Email notification
  - `sendPushNotification()` - Push notification

#### **`reminderService.js`**
- **Purpose**: Reminder scheduling
- **Functions**:
  - `scheduleReminder()` - Reminder schedule karta hai
  - `sendReminder()` - Reminder send karta hai
  - `cancelReminder()` - Reminder cancel

#### **`schedulerService.js`**
- **Purpose**: Background job scheduling
- **Functions**:
  - `scheduleJobs()` - Cron jobs setup
  - `runScheduledTasks()` - Scheduled tasks execute

---

### 📂 **Database** (`/backend/database/`)

#### **`db.js`**
- **Purpose**: MongoDB connection
- **Functions**:
  - `connectDB()` - MongoDB connect karta hai
  - Connection string handling
  - Error handling

---

### 📂 **Utils** (`/backend/utils/`)

#### **`mailer.js`**
- **Purpose**: Email utility functions
- **Functions**:
  - `sendEmail()` - Email send karta hai
  - `sendWelcomeEmail()` - Welcome email
  - `sendAppointmentConfirmation()` - Appointment confirmation
  - `sendReminderEmail()` - Reminder email

---

### 📄 **Other Backend Files**

#### **`socket.js`**
- **Purpose**: WebSocket/Socket.io setup
- **Functions**:
  - Real-time chat connection
  - Message broadcasting
  - Connection/disconnection handling

#### **`create-admin.js`**
- **Purpose**: Admin user creation script
- **Usage**: `node create-admin.js`
- Admin account manually create karta hai

#### **`package.json`**
- **Dependencies**:
  - express, mongoose, jsonwebtoken
  - socket.io, nodemailer
  - bcryptjs, multer
  - dotenv, cors

---

## 🎨 **2. FRONTEND MODULE** (`/frontend`)

### 📂 **Screens** (`/frontend/src/screens/`)

#### 📁 **Admin Screens** (`/screens/Admin/`)

##### **`Dashboard.jsx`** (Main Admin Dashboard)
- **Purpose**: Admin ka main dashboard
- **Features**:
  - User Management (table with search, filter)
  - Lawyer Verification (pending lawyers approve/reject)
  - Appointment Management (all appointments view)
  - Reports & Analytics (charts, stats)
  - Financial Disputes (dispute records)
  - System Logs (activity log)
- **State Management**: useState, useEffect, useMemo
- **API Calls**: `/lawyers`, `/user`, `/appointments`
- **Color Scheme**: Light-brown theme

##### **`Login.jsx`**
- **Purpose**: Admin login page
- **Features**: Email/password login form
- **API**: `POST /api/v1/auth/admin/login`

##### **`AdminLayout.jsx`**
- **Purpose**: Admin pages ka layout wrapper
- **Features**: Sidebar, header, navigation

##### **`ProfileForm.jsx`**
- **Purpose**: Admin profile management
- **Features**: Profile update form

##### **`NotificationBell.jsx`**
- **Purpose**: Admin notifications display
- **Features**: Notification dropdown, badge count

---

#### 📁 **Lawyer Screens** (`/screens/Lawyer/`)

##### **`LawyerPage.jsx`**
- **Purpose**: Main lawyer page (entry point)
- **Features**: Routing, layout management

##### **`LawyerProfile.jsx`**
- **Purpose**: Lawyer profile display
- **Features**: Profile info, ratings, reviews

##### **`dashboard-overview.jsx`**
- **Purpose**: Lawyer dashboard stats
- **Features**:
  - Total appointments
  - Upcoming appointments
  - Revenue stats
  - Client count
  - Charts & graphs

##### **`appointment-management.jsx`**
- **Purpose**: Manage appointments
- **Features**:
  - Appointment list (pending/confirmed/completed)
  - Create/edit appointments
  - Status updates
  - Calendar view
  - Filter & search

##### **`case-management.jsx`**
- **Purpose**: Case tracking
- **Features**:
  - Case list
  - Case details
  - Case status updates
  - Document management

##### **`profile-management.jsx`**
- **Purpose**: Profile settings
- **Features**:
  - Personal info update
  - Specialization update
  - Document upload
  - Social media links
  - Password change

##### **`payment-status.jsx`**
- **Purpose**: Payment tracking
- **Features**:
  - Payment history
  - Pending payments
  - Revenue analytics
  - Payment status filters

##### **`live-chat.jsx`**
- **Purpose**: Real-time chat interface
- **Features**:
  - Conversation list
  - Message sending/receiving
  - File attachments
  - Read receipts
  - Socket.io integration

##### **`records-access.jsx`**
- **Purpose**: Client records access
- **Features**:
  - Client list
  - Document access
  - Case files
  - Search & filter

##### **`notifications-panel.jsx`**
- **Purpose**: Notifications display
- **Features**:
  - Notification list
  - Mark as read
  - Notification filters

##### **`virtual-consultation.jsx`**
- **Purpose**: Video consultation
- **Features**:
  - Video call setup
  - Meeting scheduling
  - Consultation history

##### **`upgrade-profile.jsx`**
- **Purpose**: Profile upgrade
- **Features**: Premium features, subscription

##### **`lawyer-sidebar.jsx`**
- **Purpose**: Navigation sidebar
- **Features**: Menu items, active state

##### **`theme-provider.jsx`**
- **Purpose**: Theme management
- **Features**: Dark/light mode toggle

---

#### 📁 **User Screens**

##### **`Home.jsx`**
- **Purpose**: Landing page
- **Features**: Hero section, featured lawyers, services

##### **`UserDashboard.jsx`**
- **Purpose**: User dashboard
- **Features**: Appointments, chat, profile

##### **`LawyerDashboard.jsx`**
- **Purpose**: Lawyer dashboard entry
- **Features**: Redirect to lawyer pages

##### **`Lawyers.jsx`**
- **Purpose**: Browse lawyers
- **Features**: Lawyer list, filters, search

##### **`AppointmentBooking.jsx`**
- **Purpose**: Book appointment
- **Features**: Date/time picker, lawyer selection

##### **`RegisterUser.jsx`**
- **Purpose**: User registration
- **Features**: Registration form

##### **`RegisterLawyer.jsx`**
- **Purpose**: Lawyer registration
- **Features**: Lawyer signup form, document upload

##### **`LoginSelection.jsx`**
- **Purpose**: Choose login type
- **Features**: User/Lawyer/Admin selection

##### **`RegistrationSelection.jsx`**
- **Purpose**: Choose registration type
- **Features**: User/Lawyer selection

##### **`About.jsx`**
- **Purpose**: About page
- **Features**: Company info, mission, vision

##### **`Services.jsx`**
- **Purpose**: Services page
- **Features**: Service listings

##### **`NoPage.jsx`**
- **Purpose**: 404 page
- **Features**: Error message, back button

---

### 📂 **Components** (`/frontend/src/components/`)

#### 📁 **Common Components** (`/components/common/`)

##### **`Badge.jsx`**
- **Purpose**: Status badges
- **Props**: `variant`, `children`, `className`
- **Variants**: default, success, warning, error

##### **`Button.jsx`**
- **Purpose**: Custom buttons
- **Props**: `variant`, `size`, `onClick`, `disabled`
- **Variants**: primary, secondary, outline, ghost

##### **`Card.jsx`**
- **Purpose**: Card containers
- **Props**: `title`, `children`, `className`

##### **`Input.jsx`**
- **Purpose**: Form inputs
- **Props**: `type`, `placeholder`, `value`, `onChange`

##### **`Label.jsx`**
- **Purpose**: Form labels
- **Props**: `htmlFor`, `children`

##### **`Select.jsx`**
- **Purpose**: Dropdown selects
- **Props**: `options[]`, `value`, `onChange`

##### **`TextArea.jsx`**
- **Purpose**: Text areas
- **Props**: `rows`, `placeholder`, `value`, `onChange`

##### **`Header.jsx`**
- **Purpose**: Page headers
- **Props**: `title`, `subtitle`

##### **`Calendar.jsx`**
- **Purpose**: Date picker
- **Props**: `selectedDate`, `onDateChange`

##### **`Chatbot.jsx`**
- **Purpose**: AI chatbot UI
- **Features**: Chat interface, message history

##### **`AppointmentCard.jsx`**
- **Purpose**: Appointment display card
- **Props**: `appointment` object
- **Features**: Date, time, lawyer info, status

##### **`AppointmentList.jsx`**
- **Purpose**: List of appointments
- **Props**: `appointments[]`
- **Features**: Filter, sort, pagination

##### **`Metrics.jsx`**
- **Purpose**: Statistics display
- **Props**: `title`, `value`, `icon`, `trend`

##### **`NotificationBell.jsx`**
- **Purpose**: Notification icon
- **Props**: `count`, `onClick`

##### **`Popover.jsx`**
- **Purpose**: Popover tooltips
- **Props**: `content`, `trigger`

##### **`TodoList.jsx`**
- **Purpose**: Todo items
- **Props**: `todos[]`, `onToggle`, `onDelete`

##### **`Login.jsx`**
- **Purpose**: Login form
- **Props**: `onSubmit`, `error`

---

#### 📁 **Section Components** (`/components/sections/`)

##### **`CustomNavbar.jsx`**
- **Purpose**: Navigation bar
- **Features**: Logo, menu items, user menu

##### **`Herosection.jsx`**
- **Purpose**: Hero banner
- **Features**: Main heading, CTA button, background image

##### **`FeaturedLawyers.jsx`**
- **Purpose**: Featured lawyers list
- **Features**: Lawyer cards, ratings, specialization

##### **`LegalServices.jsx`**
- **Purpose**: Services showcase
- **Features**: Service cards, icons, descriptions

##### **`HowItWorks.jsx`**
- **Purpose**: Process explanation
- **Features**: Step-by-step guide

##### **`WhyChooseUs.jsx`**
- **Purpose**: Benefits section
- **Features**: Feature cards, icons

##### **`About.jsx`**
- **Purpose**: About section
- **Features**: Company info, team

##### **`AboutBanner.jsx`**
- **Purpose**: About banner
- **Features**: Banner image, text overlay

##### **`Mission.jsx`**
- **Purpose**: Mission statement
- **Features**: Mission text, values

##### **`Vision.jsx`**
- **Purpose**: Vision statement
- **Features**: Vision text, goals

##### **`Achievements.jsx`**
- **Purpose**: Achievements display
- **Features**: Stats, milestones

##### **`Cases.jsx`**
- **Purpose**: Case studies
- **Features**: Case cards, details

##### **`CaseHistory.jsx`**
- **Purpose**: Case history
- **Features**: Timeline, case details

##### **`OurAreas.jsx`**
- **Purpose**: Service areas
- **Features**: Area cards, map

##### **`OurPartner.jsx`**
- **Purpose**: Partners
- **Features**: Partner logos, info

##### **`PartnerList.jsx`**
- **Purpose**: Partner list
- **Features**: Partner cards, filters

##### **`Profile.jsx`**
- **Purpose**: Profile section
- **Features**: Profile display, edit

##### **`ServiceBookingForm.jsx`**
- **Purpose**: Booking form
- **Features**: Form fields, validation

##### **`Sidebar.jsx`**
- **Purpose**: Side navigation
- **Features**: Menu items, active state

##### **`Header.jsx`**
- **Purpose**: Section header
- **Features**: Title, subtitle, actions

##### **`Footer.jsx`**
- **Purpose**: Page footer
- **Features**: Links, copyright, social media

---

#### 📁 **UI Components** (`/components/ui/`)

##### **`badge.jsx`**
- **Purpose**: Badge component (Shadcn/ui)
- **Props**: `variant`, `children`

##### **`button.jsx`**
- **Purpose**: Button component (Shadcn/ui)
- **Props**: `variant`, `size`, `onClick`

##### **`card.jsx`**
- **Purpose**: Card component (Shadcn/ui)
- **Props**: `title`, `description`, `children`

##### **`tabs.jsx`**
- **Purpose**: Tabs component (Shadcn/ui)
- **Props**: `tabs[]`, `defaultTab`

---

#### 📁 **Lawyer UI Components** (`/screens/Lawyer/ui/`)
50+ Advanced UI components (Shadcn/ui based):

##### **Core Components:**
- **`dialog.jsx`** - Modal dialogs
- **`table.jsx`** - Data tables
- **`form.jsx`** - Form components
- **`input.jsx`** - Input fields
- **`select.jsx`** - Select dropdowns
- **`textarea.jsx`** - Text areas
- **`button.jsx`** - Buttons
- **`card.jsx`** - Cards

##### **Layout Components:**
- **`sidebar.jsx`** - Sidebar navigation
- **`sheet.jsx`** - Slide-out panels
- **`drawer.jsx`** - Drawer panels
- **`separator.jsx`** - Dividers

##### **Data Display:**
- **`table.jsx`** - Tables
- **`chart.jsx`** - Charts/graphs
- **`avatar.jsx`** - User avatars
- **`badge.jsx`** - Badges
- **`calendar.jsx`** - Calendar picker
- **`progress.jsx`** - Progress bars
- **`skeleton.jsx`** - Loading skeletons

##### **Feedback:**
- **`alert.jsx`** - Alert messages
- **`toast.jsx`** - Toast notifications
- **`toaster.jsx`** - Toast container
- **`alert-dialog.jsx`** - Alert dialogs

##### **Navigation:**
- **`tabs.jsx`** - Tabs
- **`breadcrumb.jsx`** - Breadcrumbs
- **`navigation-menu.jsx`** - Navigation menus
- **`menubar.jsx`** - Menu bars
- **`pagination.jsx`** - Pagination

##### **Form Controls:**
- **`checkbox.jsx`** - Checkboxes
- **`radio-group.jsx`** - Radio buttons
- **`switch.jsx`** - Toggle switches
- **`slider.jsx`** - Sliders
- **`input-otp.jsx`** - OTP inputs

##### **Overlays:**
- **`popover.jsx`** - Popovers
- **`tooltip.jsx`** - Tooltips
- **`hover-card.jsx`** - Hover cards
- **`context-menu.jsx`** - Context menus
- **`dropdown-menu.jsx`** - Dropdown menus

##### **Utilities:**
- **`accordion.jsx`** - Accordions
- **`collapsible.jsx`** - Collapsible sections
- **`command.jsx`** - Command palette
- **`scroll-area.jsx`** - Scrollable areas
- **`resizable.jsx`** - Resizable panels
- **`aspect-ratio.jsx`** - Aspect ratio containers
- **`carousel.jsx`** - Carousels
- **`toggle.jsx`** - Toggle buttons
- **`toggle-group.jsx`** - Toggle groups
- **`sonner.jsx`** - Sonner toast

##### **Hooks:**
- **`use-mobile.jsx`** - Mobile detection hook
- **`use-toast.js`** - Toast notification hook

---

### 📂 **Services** (`/frontend/src/services/`)

#### **`api.js`**
- **Purpose**: API client (axios wrapper)
- **Functions**:
  - `get()`, `post()`, `put()`, `delete()`
  - Token management
  - Error handling
  - Request/response interceptors

---

### 📂 **Shared** (`/frontend/src/shared/`)

#### **`api.js`**
- **Purpose**: Shared API utilities
- **Functions**: Common API helpers

---

### 📂 **Utils** (`/frontend/src/utils/`)

#### **`auth.js`**
- **Purpose**: Authentication helpers
- **Functions**:
  - `getToken()` - Get stored token
  - `setToken()` - Save token
  - `removeToken()` - Remove token
  - `isAuthenticated()` - Check auth status

---

### 📂 **Hooks** (`/frontend/src/hooks/`)

#### **`use-mobile.js`**
- **Purpose**: Mobile detection hook
- **Returns**: `isMobile` boolean

#### **`use-toast.js`**
- **Purpose**: Toast notification hook
- **Returns**: `toast()` function

---

### 📂 **Data** (`/frontend/src/data/`)

#### **`Lawyers.jsx`**
- **Purpose**: Mock lawyer data
- **Content**: Sample lawyer objects

#### **`mockData.js`**
- **Purpose**: Mock data
- **Content**: Sample data for testing

---

### 📂 **Constants** (`/frontend/src/constants/`)

#### **`Images.js`**
- **Purpose**: Image paths
- **Content**: Image URL constants

---

### 📂 **Assets** (`/frontend/src/assets/`)

#### **`icons/Icons.jsx`**
- **Purpose**: Icon components
- **Content**: Reusable icon components

#### **`images/Lawyer.png`**
- **Purpose**: Images
- **Content**: Static image files

---

### 📂 **Lib** (`/frontend/src/lib/`)

#### **`utils.js`**
- **Purpose**: Utility functions
- **Functions**: `cn()` (classNames merge), helpers

---

### 📄 **Main Frontend Files**

#### **`App.jsx`**
- **Purpose**: Main app component
- **Features**: Routing, layout, providers

#### **`main.jsx`**
- **Purpose**: React entry point
- **Features**: ReactDOM render, providers

#### **`index.css`**
- **Purpose**: Global styles
- **Content**: Tailwind imports, custom CSS

#### **`tailwind.config.js`**
- **Purpose**: Tailwind CSS config
- **Content**: Theme, colors, plugins

#### **`vite.config.js`**
- **Purpose**: Vite build config
- **Content**: Build settings, plugins

#### **`package.json`**
- **Dependencies**:
  - react, react-dom, react-router-dom
  - tailwindcss, lucide-react
  - axios, socket.io-client
  - @radix-ui components
  - recharts, framer-motion

---

## 🎨 **Color Scheme Files**

### **`frontend/styles/globals.css`**
- **Purpose**: Global CSS variables
- **Colors**: Light-brown theme definitions

### **`frontend/src/index.css`**
- **Purpose**: Theme colors
- **Colors**: `--color-lightbrown`, `--color-primary`, etc.

### **`frontend/tailwind.config.js`**
- **Purpose**: Tailwind color config
- **Colors**: `brown-primary`, `amber-*`, etc.

---

## 📊 **Summary**

### **Backend Files Count:**
- Controllers: 5 files
- Models: 8 files
- Routes: 8 files
- Middleware: 2 files
- Services: 3 files
- Utils: 1 file
- **Total: ~30+ files**

### **Frontend Files Count:**
- Admin Screens: 5 files
- Lawyer Screens: 13 files
- User Screens: 12 files
- Common Components: 16 files
- Section Components: 20 files
- UI Components: 50+ files
- **Total: ~120+ files**

### **Total Project Files: ~150+ files**

---

## 🔑 **Key File Relationships**

1. **Backend → Frontend**:
   - `routes/*.js` → `services/api.js`
   - `controllers/*.js` → API endpoints
   - `models/*.js` → Data structure

2. **Frontend Components**:
   - `screens/*.jsx` → Uses `components/*.jsx`
   - `components/common/*` → Reusable components
   - `components/ui/*` → Shadcn/ui components

3. **State Management**:
   - `useState`, `useEffect` → Component state
   - `api.js` → Backend communication
   - `auth.js` → Authentication state

---

## 📝 **Important Notes**

- **Backend Server**: `http://localhost:5000`
- **Frontend Dev Server**: `http://localhost:5173`
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS + Shadcn/ui
- **Color Theme**: Light-Brown (#d79c54, #f3ce8c, #2f1c0e)





