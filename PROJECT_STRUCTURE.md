# Lawyer Management System - Project Structure

## 📁 Project Overview
Yeh ek **Full-Stack Lawyer Management System** hai jo **React (Frontend)** aur **Node.js/Express (Backend)** par based hai.

---

## 🎯 Main Modules

### 1. **BACKEND MODULE** (`/backend`)

#### 📂 **Controllers** (`/backend/controllers/`)
Backend logic handle karta hai:
- **`appointmentController.js`** - Appointments create, update, delete, fetch
- **`chatbotController.js`** - AI chatbot integration (XAI/GROQ/OpenAI)
- **`chatController.js`** - Real-time chat messages handle
- **`reminderController.js`** - Appointment reminders manage
- **`user.controller.js`** - User operations (CRUD)

#### 📂 **Models** (`/backend/models/`)
Database schemas define karta hai:
- **`Admin.js`** - Admin user schema
- **`appointment.model.js`** - Appointment data structure
- **`Chat.js`** - Chat conversation schema
- **`Lawyer.js`** - Lawyer profile schema
- **`Message.js`** - Individual messages schema
- **`Notification.js`** - Notifications schema
- **`User.js`** - Regular user schema
- **`user.model.js`** - User model (alternative)

#### 📂 **Routes** (`/backend/routes/`)
API endpoints define karta hai:
- **`appointments.js`** - `/api/v1/appointments/*` routes
- **`auth.routes.js`** - `/api/v1/auth/*` (login, register)
- **`chat.routes.js`** - `/api/v1/chat/*` (real-time chat)
- **`chatbot.js`** - `/api/v1/chatbot/*` (AI chatbot)
- **`lawyer.routes.js`** - `/api/v1/lawyers/*` (lawyer operations)
- **`notifications.js`** - `/api/v1/notifications/*`
- **`reminder.routes.js`** - `/api/v1/reminders/*`
- **`user.route.js`** - `/api/v1/user/*` (user management)

#### 📂 **Middleware** (`/backend/middleware/`)
Request processing:
- **`auth.js`** - JWT authentication & authorization
- **`transporter.js`** - Email sending configuration

#### 📂 **Services** (`/backend/services/`)
Business logic services:
- **`notificationService.js`** - Notification sending logic
- **`reminderService.js`** - Reminder scheduling
- **`schedulerService.js`** - Background job scheduling

#### 📂 **Database** (`/backend/database/`)
- **`db.js`** - MongoDB connection setup

#### 📂 **Utils** (`/backend/utils/`)
- **`mailer.js`** - Email utility functions

#### 📄 **Main Files**
- **`server.js`** - Main server entry point
- **`socket.js`** - WebSocket/Socket.io setup
- **`create-admin.js`** - Admin user creation script
- **`package.json`** - Dependencies & scripts

---

### 2. **FRONTEND MODULE** (`/frontend`)

#### 📂 **Screens** (`/frontend/src/screens/`)
Main application pages:

##### **Admin Screens** (`/screens/Admin/`)
- **`Dashboard.jsx`** - Admin dashboard (users, lawyers, appointments, analytics)
- **`Login.jsx`** - Admin login page
- **`AdminLayout.jsx`** - Admin layout wrapper
- **`ProfileForm.jsx`** - Admin profile management
- **`NotificationBell.jsx`** - Admin notifications

##### **Lawyer Screens** (`/screens/Lawyer/`)
- **`LawyerPage.jsx`** - Main lawyer page
- **`LawyerProfile.jsx`** - Lawyer profile display
- **`dashboard-overview.jsx`** - Lawyer dashboard stats
- **`appointment-management.jsx`** - Manage appointments
- **`case-management.jsx`** - Case tracking
- **`profile-management.jsx`** - Profile settings
- **`payment-status.jsx`** - Payment tracking
- **`live-chat.jsx`** - Real-time chat interface
- **`records-access.jsx`** - Client records access
- **`notifications-panel.jsx`** - Notifications
- **`virtual-consultation.jsx`** - Video consultation
- **`upgrade-profile.jsx`** - Profile upgrade
- **`lawyer-sidebar.jsx`** - Navigation sidebar
- **`theme-provider.jsx`** - Theme management

##### **User Screens**
- **`Home.jsx`** - Landing page
- **`UserDashboard.jsx`** - User dashboard
- **`LawyerDashboard.jsx`** - Lawyer dashboard entry
- **`Lawyers.jsx`** - Browse lawyers
- **`AppointmentBooking.jsx`** - Book appointment
- **`RegisterUser.jsx`** - User registration
- **`RegisterLawyer.jsx`** - Lawyer registration
- **`LoginSelection.jsx`** - Choose login type
- **`RegistrationSelection.jsx`** - Choose registration type
- **`About.jsx`** - About page
- **`Services.jsx`** - Services page
- **`NoPage.jsx`** - 404 page

#### 📂 **Components** (`/frontend/src/components/`)

##### **Common Components** (`/components/common/`)
Reusable UI components:
- **`Badge.jsx`** - Status badges
- **`Button.jsx`** - Custom buttons
- **`Card.jsx`** - Card containers
- **`Input.jsx`** - Form inputs
- **`Label.jsx`** - Form labels
- **`Select.jsx`** - Dropdown selects
- **`TextArea.jsx`** - Text areas
- **`Header.jsx`** - Page headers
- **`Calendar.jsx`** - Date picker
- **`Chatbot.jsx`** - AI chatbot UI
- **`AppointmentCard.jsx`** - Appointment display card
- **`AppointmentList.jsx`** - List of appointments
- **`Metrics.jsx`** - Statistics display
- **`NotificationBell.jsx`** - Notification icon
- **`Popover.jsx`** - Popover tooltips
- **`TodoList.jsx`** - Todo items
- **`Login.jsx`** - Login form

##### **Section Components** (`/components/sections/`)
Page sections:
- **`CustomNavbar.jsx`** - Navigation bar
- **`Herosection.jsx`** - Hero banner
- **`FeaturedLawyers.jsx`** - Featured lawyers list
- **`LegalServices.jsx`** - Services showcase
- **`HowItWorks.jsx`** - Process explanation
- **`WhyChooseUs.jsx`** - Benefits section
- **`About.jsx`** - About section
- **`AboutBanner.jsx`** - About banner
- **`Mission.jsx`** - Mission statement
- **`Vision.jsx`** - Vision statement
- **`Achievements.jsx`** - Achievements display
- **`Cases.jsx`** - Case studies
- **`CaseHistory.jsx`** - Case history
- **`OurAreas.jsx`** - Service areas
- **`OurPartner.jsx`** - Partners
- **`PartnerList.jsx`** - Partner list
- **`Profile.jsx`** - Profile section
- **`ServiceBookingForm.jsx`** - Booking form
- **`Sidebar.jsx`** - Side navigation
- **`Header.jsx`** - Section header
- **`Footer.jsx`** - Page footer

##### **UI Components** (`/components/ui/`)
Shadcn/ui components:
- **`badge.jsx`** - Badge component
- **`button.jsx`** - Button component
- **`card.jsx`** - Card component
- **`tabs.jsx`** - Tabs component

##### **Lawyer UI Components** (`/screens/Lawyer/ui/`)
Advanced UI components (50+ files):
- **`dialog.jsx`** - Modal dialogs
- **`table.jsx`** - Data tables
- **`form.jsx`** - Form components
- **`input.jsx`** - Input fields
- **`select.jsx`** - Select dropdowns
- **`calendar.jsx`** - Calendar picker
- **`chart.jsx`** - Charts/graphs
- **`avatar.jsx`** - User avatars
- **`alert.jsx`** - Alert messages
- **`toast.jsx`** - Toast notifications
- ... aur 40+ components

#### 📂 **Services** (`/frontend/src/services/`)
- **`api.js`** - API client (axios wrapper)

#### 📂 **Shared** (`/frontend/src/shared/`)
- **`api.js`** - Shared API utilities

#### 📂 **Utils** (`/frontend/src/utils/`)
- **`auth.js`** - Authentication helpers

#### 📂 **Hooks** (`/frontend/src/hooks/`)
- **`use-mobile.js`** - Mobile detection hook
- **`use-toast.js`** - Toast notification hook

#### 📂 **Data** (`/frontend/src/data/`)
- **`Lawyers.jsx`** - Mock lawyer data
- **`mockData.js`** - Mock data

#### 📂 **Constants** (`/frontend/src/constants/`)
- **`Images.js`** - Image paths

#### 📂 **Assets** (`/frontend/src/assets/`)
- **`icons/Icons.jsx`** - Icon components
- **`images/Lawyer.png`** - Images

#### 📂 **Lib** (`/frontend/src/lib/`)
- **`utils.js`** - Utility functions

#### 📄 **Main Files**
- **`App.jsx`** - Main app component
- **`main.jsx`** - React entry point
- **`index.css`** - Global styles
- **`tailwind.config.js`** - Tailwind CSS config
- **`vite.config.js`** - Vite build config
- **`package.json`** - Dependencies

---

## 🎨 **Color Scheme**
Project mein **Light-Brown** color scheme use ho rahi hai:
- Primary: `#d79c54` (Amber/Brown)
- Secondary: `#f3ce8c` (Light Brown)
- Dark: `#2f1c0e` (Dark Brown)
- Background: `#fff9f4` (Warm Ivory)

---

## 🔑 **Key Features**

### Backend:
1. **Authentication** - JWT-based auth
2. **Real-time Chat** - Socket.io
3. **AI Chatbot** - XAI/GROQ/OpenAI integration
4. **Appointment Management** - CRUD operations
5. **Email Notifications** - Reminders & alerts
6. **File Uploads** - Document management

### Frontend:
1. **Admin Dashboard** - User/Lawyer/Appointment management
2. **Lawyer Dashboard** - Case management, appointments, chat
3. **User Dashboard** - Book appointments, chat with lawyers
4. **Real-time Chat** - Live messaging
5. **AI Chatbot** - Legal assistance
6. **Responsive Design** - Mobile-friendly UI

---

## 📊 **Database Models**
- **User** - Regular users
- **Lawyer** - Lawyer profiles
- **Admin** - Admin users
- **Appointment** - Booking records
- **Chat** - Conversations
- **Message** - Individual messages
- **Notification** - User notifications

---

## 🚀 **Tech Stack**

### Backend:
- Node.js + Express
- MongoDB (Mongoose)
- Socket.io (WebSocket)
- JWT (Authentication)
- Nodemailer (Email)
- XAI/GROQ/OpenAI (AI)

### Frontend:
- React (Vite)
- Tailwind CSS
- Shadcn/ui
- Axios (API calls)
- Socket.io-client
- React Router

---

## 📝 **Important Notes**
- Backend server: `http://localhost:5000`
- Frontend dev server: `http://localhost:5173`
- Environment variables: `.env` file required
- Database: MongoDB connection required





