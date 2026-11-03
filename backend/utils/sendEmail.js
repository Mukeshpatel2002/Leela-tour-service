import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!smtpConfigured) {
    // In production, silently dropping password reset emails would lock out the admin.
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured. Set SMTP_USER and SMTP_PASS.");
    }

    console.log(`\n================== [EMAIL SIMULATION] ==================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text}`);
    console.log(`========================================================\n`);
    return null;
  }

  return getTransporter().sendMail({
    from: `"${process.env.FROM_NAME || "Leela Tours Admin"}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
};
