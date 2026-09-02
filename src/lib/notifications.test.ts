import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock console.log to capture notification output
const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

import { sendNotification, notifyProjectUpdate, notifyRiskAlert } from "@/lib/notifications";

describe("notifications", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it("sendNotification returns true on success", async () => {
    const result = await sendNotification({
      to: "test@example.com",
      subject: "Test",
      body: "Hello",
      type: "info",
    });
    expect(result).toBe(true);
  });

  it("sendNotification logs to console", async () => {
    await sendNotification({
      to: "user@test.com",
      subject: "Alert",
      body: "Something happened",
      type: "warning",
    });

    const calls = consoleSpy.mock.calls.map((c) => String(c[0]));
    expect(calls.some((c) => c.includes("[NOTIFICATION] (warning)"))).toBe(true);
    expect(calls.some((c) => c.includes("To: user@test.com"))).toBe(true);
  });

  it("notifyProjectUpdate sends to all recipients", async () => {
    consoleSpy.mockClear();
    await notifyProjectUpdate(
      ["a@test.com", "b@test.com"],
      "TitanOS",
      "Status changed"
    );
    // Each recipient generates 2 console.log calls (header + subject)
    const calls = consoleSpy.mock.calls.map((c) => String(c[0]));
    expect(calls.some((c) => c.includes("To: a@test.com"))).toBe(true);
    expect(calls.some((c) => c.includes("To: b@test.com"))).toBe(true);
  });

  it("notifyRiskAlert sends with correct type", async () => {
    consoleSpy.mockClear();
    await notifyRiskAlert(
      ["admin@test.com"],
      "TitanOS",
      "Security vulnerability",
      "CRITICAL"
    );
    const calls = consoleSpy.mock.calls.map((c) => String(c[0]));
    expect(calls.some((c) => c.includes("(alert)"))).toBe(true);
  });

  it("notifyRiskAlert uses warning type for non-critical", async () => {
    consoleSpy.mockClear();
    await notifyRiskAlert(
      ["admin@test.com"],
      "TitanOS",
      "Minor issue",
      "MEDIUM"
    );
    const calls = consoleSpy.mock.calls.map((c) => String(c[0]));
    expect(calls.some((c) => c.includes("(warning)"))).toBe(true);
  });
});
