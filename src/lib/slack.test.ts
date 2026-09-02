import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

// Clear env
beforeEach(() => {
  delete process.env.SLACK_WEBHOOK_URL;
  consoleSpy.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

import { sendSlackMessage, notifySlackProjectUpdate, notifySlackRisk, notifySlackHealth } from "@/lib/slack";

describe("slack integration", () => {
  it("sendSlackMessage returns false when no webhook configured", async () => {
    const result = await sendSlackMessage({ text: "Hello" });
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("sendSlackMessage attempts fetch when webhook is set", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const result = await sendSlackMessage({ text: "Test message" });
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://hooks.slack.com/test",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("sendSlackMessage returns false on fetch error", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const result = await sendSlackMessage({ text: "Test" });
    expect(result).toBe(false);
  });

  it("notifySlackProjectUpdate sends correct message", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    await notifySlackProjectUpdate("TitanOS", "New release");
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining("TitanOS"),
      })
    );
  });

  it("notifySlackRisk uses correct emoji by severity", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    await notifySlackRisk("Project", "Vuln", "CRITICAL");
    const call = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(call[1]?.body as string);
    expect(body.text).toContain("🚨");

    await notifySlackRisk("Project", "Issue", "HIGH");
    const call2 = vi.mocked(fetch).mock.calls[1];
    const body2 = JSON.parse(call2[1]?.body as string);
    expect(body2.text).toContain("⚠️");
  });

  it("notifySlackHealth sends score message", async () => {
    process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    await notifySlackHealth("TitanOS", 92);
    expect(fetch).toHaveBeenCalled();
  });
});
