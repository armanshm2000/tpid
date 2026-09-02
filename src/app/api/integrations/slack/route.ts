import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendSlackMessage } from "@/lib/slack";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body as { message?: string };

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sent = await sendSlackMessage({ text: message });

    if (sent) {
      return NextResponse.json({ success: true, message: "Sent to Slack" });
    } else {
      return NextResponse.json({
        success: false,
        message: "Slack webhook not configured. Set SLACK_WEBHOOK_URL in .env",
      });
    }
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
