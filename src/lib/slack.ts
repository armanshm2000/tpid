/**
 * Slack webhook integration.
 * Configure SLACK_WEBHOOK_URL in .env to enable.
 */

export interface SlackMessage {
  text: string;
  blocks?: Array<{
    type: string;
    text?: { type: string; text: string };
    fields?: Array<{ type: string; text: string }>;
  }>;
}

export async function sendSlackMessage(message: SlackMessage): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("[SLACK] No webhook configured. Message:", message.text);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    return response.ok;
  } catch (error) {
    console.error("[SLACK] Failed to send:", error);
    return false;
  }
}

export async function notifySlackProjectUpdate(projectName: string, update: string) {
  return sendSlackMessage({
    text: `📋 *Project Update*: ${projectName}\n${update}`,
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: `📋 *Project Update*: ${projectName}\n${update}` },
      },
    ],
  });
}

export async function notifySlackRisk(projectName: string, riskTitle: string, severity: string) {
  const emoji = severity === "CRITICAL" ? "🚨" : severity === "HIGH" ? "⚠️" : "⚡";
  return sendSlackMessage({
    text: `${emoji} *Risk Alert*: ${riskTitle} in ${projectName} [${severity}]`,
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: `${emoji} *Risk Alert*: ${riskTitle}\nProject: *${projectName}*\nSeverity: \`${severity}\`` },
      },
    ],
  });
}

export async function notifySlackHealth(projectName: string, score: number) {
  const emoji = score >= 80 ? "✅" : score >= 60 ? "🟡" : "🔴";
  return sendSlackMessage({
    text: `${emoji} *Health Score*: ${projectName} scored ${score}%`,
  });
}
