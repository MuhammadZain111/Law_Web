// Test email directly with the client's email
import { sendEmail, buildStatusEmail } from './utils/mailer.js';

const testAppointment = {
  clientName: "ubaid",
  clientEmail: "jamshaidbodla07@gmail.com",
  caseType: "Corporate Law",
  timeSlot: "12:00",
  appointmentDate: new Date('2025-10-22'),
  lawyerId: { name: "na naseer ali" }
};

async function testEmail() {
  console.log('🧪 Testing email to client...');
  
  try {
    const emailContent = buildStatusEmail(testAppointment, 'confirmed');
    console.log('📧 Sending to:', testAppointment.clientEmail);
    console.log('📧 Subject:', emailContent.subject);
    
    const result = await sendEmail({
      to: testAppointment.clientEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    });
    
    console.log('📧 Result:', result);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail();




