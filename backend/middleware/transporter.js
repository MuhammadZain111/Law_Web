// transporter.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter using SMTP settings from .env (with sane fallbacks)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.ethereal.email';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_SECURE = SMTP_PORT === 465;

console.log('🔧 SMTP Config:', {
  host: SMTP_HOST,
  port: SMTP_PORT,
  user: SMTP_USER,
  pass: SMTP_PASS ? '***' : 'MISSING',
  secure: SMTP_SECURE
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  // Helps avoid TLS issues in dev/test; remove if using strict SMTP
  tls: { rejectUnauthorized: false },
});

// Optional: verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log(
      `✅ Email transporter ready (host=${SMTP_HOST}, port=${SMTP_PORT}, secure=${SMTP_SECURE})`);
  }
});

export default transporter;
