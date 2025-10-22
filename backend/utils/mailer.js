import transporter from "../middleware/transporter.js";


export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.FROM_EMAIL || 'jamshaidbodla07@gmail.com'; // safe fallback

  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ sendEmail error:", err?.message || err);
    return { success: false, error: err?.message || String(err) };
  }
}


export function buildStatusEmail(appointment, newStatus) {
  const clientName = appointment.clientName || "Client";
  const lawyerText = appointment.lawyerId?.name || "your lawyer";
  const dateStr = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleString()
    : "";
  const statusPretty = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

  const subject = `Appointment ${statusPretty}`;
  const text = `Hello ${clientName},

Your appointment on ${dateStr} with ${lawyerText} is now: ${statusPretty}.

Case type: ${appointment.caseType}
Time: ${appointment.timeSlot}

Thank you.`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2 style="margin:0 0 8px">Appointment ${statusPretty}</h2>
      <p>Hello ${clientName},</p>
      <p>Your appointment <strong>${dateStr}</strong> with <strong>${lawyerText}</strong> is now: <strong>${statusPretty}</strong>.</p>
      <ul>
        <li>Case type: ${appointment.caseType || "-"}</li>
        <li>Time: ${appointment.timeSlot || "-"}</li>
      </ul>
      <p>Thanks for using our platform.</p>
    </div>`;

  return { subject, text, html };
}
