import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  getHealthColor,
  getStatusColor,
  getPriorityColor,
  getCategoryLabel,
  truncate,
} from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", null, undefined, false, "b")).toBe("a b");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2024-06-20"));
    expect(result).toContain("Jun");
    expect(result).toContain("20");
  });
});

describe("getHealthColor", () => {
  it("returns green for high scores", () => {
    expect(getHealthColor(85)).toContain("green");
  });

  it("returns yellow for medium scores", () => {
    expect(getHealthColor(65)).toContain("yellow");
  });

  it("returns orange for low scores", () => {
    expect(getHealthColor(45)).toContain("orange");
  });

  it("returns red for very low scores", () => {
    expect(getHealthColor(20)).toContain("red");
  });
});

describe("getStatusColor", () => {
  it("returns correct color for known status", () => {
    expect(getStatusColor("COMPLETED")).toContain("green");
    expect(getStatusColor("IN_PROGRESS")).toContain("blue");
  });

  it("returns default gray for unknown status", () => {
    expect(getStatusColor("UNKNOWN_STATUS")).toContain("gray");
  });
});

describe("getPriorityColor", () => {
  it("returns correct color for priority levels", () => {
    expect(getPriorityColor("CRITICAL")).toContain("red");
    expect(getPriorityColor("HIGH")).toContain("orange");
    expect(getPriorityColor("MEDIUM")).toContain("yellow");
    expect(getPriorityColor("LOW")).toContain("gray");
  });
});

describe("getCategoryLabel", () => {
  it("converts snake_case to Title Case", () => {
    expect(getCategoryLabel("AI_ENGINEERING")).toBe("Ai Engineering");
  });

  it("handles single word", () => {
    expect(getCategoryLabel("SECURITY")).toBe("Security");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello, World!", 5)).toBe("Hello…");
  });

  it("returns string unchanged if within limit", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });

  it("returns exact string if length equals limit", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});
