import { describe, it, expect } from "vitest";
import { hasPermission, requireRole } from "@/lib/rbac";

describe("hasPermission", () => {
  it("ADMIN has all permissions", () => {
    expect(hasPermission("ADMIN", "projects:read")).toBe(true);
    expect(hasPermission("ADMIN", "projects:write")).toBe(true);
    expect(hasPermission("ADMIN", "projects:delete")).toBe(true);
    expect(hasPermission("ADMIN", "users:write")).toBe(true);
    expect(hasPermission("ADMIN", "audit:read")).toBe(true);
  });

  it("MANAGER has project write but not delete", () => {
    expect(hasPermission("MANAGER", "projects:read")).toBe(true);
    expect(hasPermission("MANAGER", "projects:write")).toBe(true);
    expect(hasPermission("MANAGER", "projects:delete")).toBe(false);
    expect(hasPermission("MANAGER", "audit:read")).toBe(false);
  });

  it("ENGINEER has limited permissions", () => {
    expect(hasPermission("ENGINEER", "projects:read")).toBe(true);
    expect(hasPermission("ENGINEER", "projects:write")).toBe(false);
    expect(hasPermission("ENGINEER", "evidence:write")).toBe(true);
    expect(hasPermission("ENGINEER", "reports:read")).toBe(true);
    expect(hasPermission("ENGINEER", "reports:write")).toBe(false);
  });

  it("VIEWER has read-only permissions", () => {
    expect(hasPermission("VIEWER", "projects:read")).toBe(true);
    expect(hasPermission("VIEWER", "settings:read")).toBe(true);
    expect(hasPermission("VIEWER", "projects:write")).toBe(false);
    expect(hasPermission("VIEWER", "evidence:write")).toBe(false);
  });

  it("defaults to VIEWER for unknown role", () => {
    expect(hasPermission("UNKNOWN", "projects:read")).toBe(true);
    expect(hasPermission("UNKNOWN", "projects:write")).toBe(false);
  });

  it("handles lowercase role input", () => {
    expect(hasPermission("admin", "projects:write")).toBe(true);
    expect(hasPermission("viewer", "projects:write")).toBe(false);
  });

  it("returns false for nonexistent permission", () => {
    expect(hasPermission("ADMIN", "nonexistent:perm")).toBe(false);
  });
});

describe("requireRole", () => {
  it("returns true when role is in allowed list", () => {
    const check = requireRole(["ADMIN", "MANAGER"]);
    expect(check("ADMIN")).toBe(true);
    expect(check("MANAGER")).toBe(true);
  });

  it("returns false when role is not in allowed list", () => {
    const check = requireRole(["ADMIN"]);
    expect(check("ENGINEER")).toBe(false);
    expect(check("VIEWER")).toBe(false);
  });

  it("handles lowercase role input", () => {
    const check = requireRole(["ADMIN"]);
    expect(check("admin")).toBe(true);
  });
});
