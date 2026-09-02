/**
 * Email service using nodemailer.
 * Falls back to console logging in development.
 * Configure SMTP settings in .env for production.
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function getTransporter() {
  // In production, configure with real SMTP
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null; // Fall back to console
  }

  try {
    // Dynamic import to avoid bundling nodemailer in client
    const nodemailer = await import("nodemailer");
    return nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } catch {
    return null;
  }
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = await getTransporter();

  if (!transporter) {
    // Development fallback
    console.log(`[EMAIL] To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Body: ${options.text || options.html.slice(0, 200)}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"TPID" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`[EMAIL] Sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return false;
  }
}

// Template helpers
export function projectUpdateEmail(projectName: string, update: string): EmailOptions {
  return {
    to: "", // Set by caller
    subject: `Project Update: ${projectName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Project Update</h2>
        <p><strong>${projectName}</strong> has been updated:</p>
        <p style="background: #f3f4f6; padding: 12px; border-radius: 8px;">${update}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px;">TPID – Titan Project Intelligence Dashboard</p>
      </div>
    `,
    text: `Project Update: ${projectName}\n\n${update}`,
  };
}

export function riskAlertEmail(projectName: string, riskTitle: string, severity: string, description: string): EmailOptions {
  const color = severity === "CRITICAL" ? "#dc2626" : severity === "HIGH" ? "#ea580c" : "#d97706";
  return {
    to: "",
    subject: `[${severity}] Risk Alert: ${riskTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${color};">⚠️ Risk Alert</h2>
        <div style="background: ${color}10; border-left: 4px solid ${color}; padding: 12px; margin-bottom: 16px;">
          <strong style="color: ${color};">${severity}</strong>
        </div>
        <p><strong>${riskTitle}</strong> in ${projectName}</p>
        <p>${description}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px;">TPID – Titan Project Intelligence Dashboard</p>
      </div>
    `,
    text: `[${severity}] ${riskTitle} in ${projectName}\n\n${description}`,
  };
}
