let transporter;

async function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("Email disabled: missing SMTP env vars (SMTP_HOST/SMTP_USER/SMTP_PASS)");
    return null;
  }

  let nodemailer;
  try {
    nodemailer = (await import("nodemailer")).default;
  } catch (err) {
    console.warn("Email disabled: 'nodemailer' package not installed.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const t = await getTransporter();
  if (!t) return { disabled: true };

  const from = process.env.FROM_EMAIL || `"Legal Practice" <no-reply@legalpractice.local>`;

  try {
    const info = await t.sendMail({ from, to, subject, html, text });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("sendEmail error:", err?.message || err);
    return { success: false, error: err?.message || String(err) };
  }
}

export function buildStatusEmail(appointment, newStatus) {
  const clientName = appointment.clientName || "Client";
  const lawyerText = appointment.lawyerId?.name || "your lawyer";
  const dateStr = appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleString() : "";
  const statusPretty = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

  const subject = `Appointment ${statusPretty}`;
  const text = `Hello ${clientName},\n\nYour appointment on ${dateStr} with ${lawyerText} is now: ${statusPretty}.\n\nCase type: ${appointment.caseType}\nTime: ${appointment.timeSlot}\n\nThank you.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2 style="margin:0 0 8px">Appointment ${statusPretty}</h2>
      <p>Hello ${clientName},</p>
      <p>Your appointment <strong>${dateStr}</strong> is now: <strong>${statusPretty}</strong>.</p>
      <ul>
        <li>Case type: ${appointment.caseType || "-"}</li>
        <li>Time: ${appointment.timeSlot || "-"}</li>
      </ul>
      <p>Thanks for using our platform.</p>
    </div>`;
  return { subject, text, html };
}


