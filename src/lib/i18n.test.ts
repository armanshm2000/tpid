import { describe, it, expect, beforeEach } from "vitest";
import { setLocale, getLocale, t, getDirection, getTranslations } from "@/lib/i18n";

describe("i18n", () => {
  beforeEach(() => {
    setLocale("en");
  });

  it("defaults to English", () => {
    expect(getLocale()).toBe("en");
  });

  it("switches locale", () => {
    setLocale("fa");
    expect(getLocale()).toBe("fa");
  });

  it("returns English translations by default", () => {
    expect(t("dashboard")).toBe("Dashboard");
    expect(t("projects")).toBe("Projects");
    expect(t("settings")).toBe("Settings");
  });

  it("returns Farsi translations when set", () => {
    setLocale("fa");
    expect(t("dashboard")).toBe("داشبورد");
    expect(t("projects")).toBe("پروژه‌ها");
    expect(t("settings")).toBe("تنظیمات");
  });

  it("returns key if translation missing", () => {
    expect(t("nonexistent_key")).toBe("nonexistent_key");
  });

  it("supports parameter interpolation", () => {
    setLocale("en");
    expect(t("page_of", { current: 1, total: 5 })).toBe("Page 1 of 5");
  });

  it("returns LTR for English", () => {
    setLocale("en");
    expect(getDirection()).toBe("ltr");
  });

  it("returns RTL for Farsi", () => {
    setLocale("fa");
    expect(getDirection()).toBe("rtl");
  });

  it("getTranslations returns correct locale data", () => {
    const en = getTranslations("en");
    expect(en.dashboard).toBe("Dashboard");
    const fa = getTranslations("fa");
    expect(fa.dashboard).toBe("داشبورد");
  });
});
