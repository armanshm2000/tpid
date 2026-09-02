import { describe, it, expect, vi, beforeEach } from "vitest";

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

import { sendEmail, projectUpdateEmail, riskAlertEmail } from "@/lib/email";

describe("email service", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
    // Clear SMTP env vars so it falls back to console
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  });

  it("sendEmail falls back to console in dev", async () => {
    const result = await sendEmail({
      to: "test@example.com",
      subject: "Hello",
      html: "<p>World</p>",
    });
    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("projectUpdateEmail generates correct template", () => {
    const email = projectUpdateEmail("TitanOS", "Status changed to ACTIVE");
    expect(email.subject).toContain("TitanOS");
    expect(email.html).toContain("TitanOS");
    expect(email.html).toContain("Status changed to ACTIVE");
    expect(email.text).toContain("TitanOS");
  });

  it("riskAlertEmail uses correct severity color", () => {
    const critical = riskAlertEmail("Project", "Vuln", "CRITICAL", "Bad");
    expect(critical.html).toContain("#dc2626");
    expect(critical.subject).toContain("CRITICAL");

    const high = riskAlertEmail("Project", "Issue", "HIGH", "Warning");
    expect(high.html).toContain("#ea580c");

    const medium = riskAlertEmail("Project", "Note", "MEDIUM", "Info");
    expect(medium.html).toContain("#d97706");
  });
});
