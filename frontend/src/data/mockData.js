export const mockUsers = [
  { id: 1, name: "John Smith", email: "john@example.com", type: "Client", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", type: "Client", status: "Active", joined: "2024-02-20" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", type: "Client", status: "Inactive", joined: "2024-03-10" },
];

export const mockPendingLawyerRegistrations = [
  {
    id: 1,
    name: "Dr. Amanda Foster",
    email: "amanda.foster@lawfirm.com",
    specialization: "Intellectual Property Law",
    experience: "8 years",
    barNumber: "BAR-2016-45892",
    phone: "+1 (555) 123-4567",
    submitted: "2024-09-29",
    documents: ["Bar Certificate", "Law Degree", "ID Proof"],
  },
  {
    id: 2,
    name: "James Patterson",
    email: "james.patterson@legal.com",
    specialization: "Tax Law",
    experience: "12 years",
    barNumber: "BAR-2012-33421",
    phone: "+1 (555) 987-6543",
    submitted: "2024-09-30",
    documents: ["Bar Certificate", "Law Degree", "ID Proof", "References"],
  },
];

export const mockLawyers = [
  { id: 1, name: "Dr. Emily Davis", email: "emily@lawfirm.com", specialization: "Corporate Law", status: "Pending", submitted: "2024-09-25" },
  { id: 2, name: "Robert Wilson", email: "robert@lawfirm.com", specialization: "Criminal Law", status: "Approved", submitted: "2024-09-20" },
];

export const mockAppointments = [
  { id: 1, client: "John Smith", lawyer: "Robert Wilson", date: "2024-10-05", time: "10:00 AM", status: "Pending", type: "Consultation" },
  { id: 2, client: "Sarah Johnson", lawyer: "Dr. Emily Davis", date: "2024-10-06", time: "2:00 PM", status: "Pending", type: "Case Review" },
  { id: 3, client: "Michael Brown", lawyer: "Jennifer Martinez", date: "2024-10-04", time: "11:30 AM", status: "Confirmed", type: "Legal Advice" },
];

export const mockDisputes = [
  { id: 1, client: "John Smith", lawyer: "Robert Wilson", amount: "$500", reason: "Billing discrepancy", status: "Open", date: "2024-09-30" },
  { id: 2, client: "Sarah Johnson", lawyer: "Dr. Emily Davis", amount: "$750", reason: "Service quality", status: "Resolved", date: "2024-09-28" },
];

export const mockLogs = [
  { id: 1, action: "User Login", user: "admin@lawsphere.com", timestamp: "2024-09-30 14:23:15", status: "Success" },
  { id: 2, action: "Lawyer Approved", user: "admin@lawsphere.com", timestamp: "2024-09-30 13:45:22", status: "Success" },
  { id: 3, action: "Failed Login Attempt", user: "unknown@example.com", timestamp: "2024-09-30 12:10:05", status: "Failed" },
];

// This file only exports mock data for UI placeholders. No components here.
