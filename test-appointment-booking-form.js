// Test the AppointmentBooking form submission
// This simulates what happens when a user fills out the form

// First, let's check what lawyer IDs exist in the database
console.log('🔍 Testing AppointmentBooking form submission...');

// Simulate the form data that would be submitted
const formData = {
  lawyerId: '68e0f580a5e5ea1507eef16c', // Our test lawyer ID
  clientName: 'Form Test Client',
  clientEmail: 'formtest@example.com',
  clientPhone: '+1234567890',
  caseType: 'Employment Law',
  caseDescription: 'Need help with employment dispute',
  appointmentDate: new Date().toISOString(),
  timeSlot: '13:00',
  consultationFee: 3500,
  paymentMethod: 'Bank Transfer',
  paymentScreenshot: '',
  clientAddress: '456 Form St',
  clientCity: 'Form City',
  clientAge: '32',
  clientGender: 'Male',
  consultationType: 'Initial Consultation',
  urgency: 'Normal',
  previousLawyer: 'No',
  caseStatus: 'New',
  documents: [],
  specialRequirements: 'First time client'
};

console.log('📋 Form data to submit:', formData);

// Submit using the same API endpoint as the form
fetch('http://localhost:5000/api/v1/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Form submission successful!');
  console.log('Appointment created:', data);
  
  if (data.success) {
    console.log('🎯 This appointment should now appear in the lawyer dashboard!');
    console.log('📋 Check for:');
    console.log('   - Client: Form Test Client');
    console.log('   - Case: Employment Law');
    console.log('   - Status: pending');
    console.log('   - Time: 13:00');
    
    // Now verify it's in the database
    console.log('\n🔍 Verifying appointment in database...');
    return fetch('http://localhost:5000/api/v1/appointments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGUwZjU4MGE1ZTVlYTE1MDdlZWYxNmMiLCJpYXQiOjE3NTk1NzMzNzYsImV4cCI6MTc1OTY1OTc3Nn0.A-HkqQUm-84LEiq57caQ0Fk-8QkNfBGueaUoUlraUtI'
      }
    });
  } else {
    throw new Error('Form submission failed');
  }
})
.then(response => response.json())
.then(data => {
  console.log('📋 All appointments in database:', data.appointments.length);
  const formAppointment = data.appointments.find(apt => apt.clientName === 'Form Test Client');
  if (formAppointment) {
    console.log('✅ Form appointment found in database!');
    console.log('   Status:', formAppointment.status);
    console.log('   Lawyer ID:', formAppointment.lawyerId);
  } else {
    console.log('❌ Form appointment NOT found in database!');
  }
})
.catch(error => {
  console.error('❌ Error:', error);
});

