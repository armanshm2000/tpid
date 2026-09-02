import { describe, it, expect } from "vitest";
import { createTenantFilter, isOrgAdmin, canAccessTenant, TenantContext } from "@/lib/multi-tenant";

describe("multi-tenant", () => {
  it("createTenantFilter returns empty for null orgId", () => {
    const ctx: TenantContext = { orgId: null, userId: "u1", role: "ADMIN" };
    expect(createTenantFilter(ctx)).toEqual({});
  });

  it("createTenantFilter returns orgId filter", () => {
    const ctx: TenantContext = { orgId: "org-1", userId: "u1", role: "ADMIN" };
    expect(createTenantFilter(ctx)).toEqual({ orgId: "org-1" });
  });

  it("isOrgAdmin returns true for ADMIN", () => {
    const ctx: TenantContext = { orgId: "org-1", userId: "u1", role: "ADMIN" };
    expect(isOrgAdmin(ctx)).toBe(true);
  });

  it("isOrgAdmin returns false for non-ADMIN", () => {
    const ctx: TenantContext = { orgId: "org-1", userId: "u1", role: "MANAGER" };
    expect(isOrgAdmin(ctx)).toBe(false);
  });

  it("canAccessTenant allows ADMIN to access any tenant", () => {
    const ctx: TenantContext = { orgId: "org-1", userId: "u1", role: "ADMIN" };
    expect(canAccessTenant(ctx, "org-2")).toBe(true);
  });

  it("canAccessTenant allows same org access", () => {
    const ctx: TenantContext = { orgId: "org-1", userId: "u1", role: "MANAGER" };
    expect(canAccessTenant(ctx, "org-1")).toBe(true);
  });

  it("canAccessTenant blocks different org access for non-admin", () => {
    const ctx: TenantContext = { orgId: "org-1", userId: "u1", role: "MANAGER" };
    expect(canAccessTenant(ctx, "org-2")).toBe(false);
  });
});
