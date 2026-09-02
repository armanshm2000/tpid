export interface Notification {
  to: string;
  subject: string;
  body: string;
  type: "info" | "warning" | "alert";
}

/**
 * Send a notification. In production, swap this with nodemailer, Resend, or SendGrid.
 * For now it logs to console (visible in server logs).
 */
export async function sendNotification(notification: Notification): Promise<boolean> {
  try {
    // Development: log to console
    console.log(`[NOTIFICATION] (${notification.type}) To: ${notification.to}`);
    console.log(`  Subject: ${notification.subject}`);
    console.log(`  Body: ${notification.body}`);

    // Production example (uncomment when email provider is configured):
    // await transporter.sendMail({
    //   from: "noreply@tpid.io",
    //   to: notification.to,
    //   subject: notification.subject,
    //   text: notification.body,
    // });

    return true;
  } catch (error) {
    console.error("Failed to send notification:", error);
    return false;
  }
}

export async function notifyProjectUpdate(
  recipients: string[],
  projectName: string,
  update: string
): Promise<void> {
  for (const email of recipients) {
    await sendNotification({
      to: email,
      subject: `Project Update: ${projectName}`,
      body: `${projectName} has been updated: ${update}`,
      type: "info",
    });
  }
}

export async function notifyRiskAlert(
  recipients: string[],
  projectName: string,
  riskTitle: string,
  severity: string
): Promise<void> {
  for (const email of recipients) {
    await sendNotification({
      to: email,
      subject: `[${severity}] Risk Alert: ${riskTitle}`,
      body: `New ${severity.toLowerCase()} risk detected in ${projectName}: ${riskTitle}`,
      type: severity === "CRITICAL" ? "alert" : "warning",
    });
  }
}
