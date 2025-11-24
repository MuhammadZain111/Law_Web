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

const hasCredentials = SMTP_USER && SMTP_PASS;

console.log('🔧 SMTP Config:', {
  host: SMTP_HOST,
  port: SMTP_PORT,
  user: SMTP_USER,
  pass: SMTP_PASS ? '***' : 'MISSING',
  secure: SMTP_SECURE,
  hasCredentials: hasCredentials
});

// Only create transporter with auth if credentials are provided
const transporterConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  // Helps avoid TLS issues in dev/test; remove if using strict SMTP
  tls: { rejectUnauthorized: false },
};

// Only add auth if credentials are provided
if (hasCredentials) {
  transporterConfig.auth = {
    user: SMTP_USER,
    pass: SMTP_PASS,
  };
}

const transporter = nodemailer.createTransport(transporterConfig);

// Only verify connection if credentials are provided
if (hasCredentials) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter error:", error.message);
      console.warn("⚠️  Email functionality will not work. Please set SMTP_USER and SMTP_PASS in .env");
    } else {
      console.log(
        `✅ Email transporter ready (host=${SMTP_HOST}, port=${SMTP_PORT}, secure=${SMTP_SECURE})`);
    }
  });
} else {
  console.warn("⚠️  Email transporter not configured - SMTP credentials missing.");
  console.warn("   Email functionality will be disabled. Set SMTP_USER and SMTP_PASS in .env to enable.");
}

export default transporter;
