/**
 * Multi-tenant support.
 * Each user belongs to an organization (orgId).
 * Queries are filtered by orgId to isolate tenant data.
 *
 * To enable:
 * 1. Add `orgId String?` to the User model in schema.prisma
 * 2. Add `orgId String?` to Project model
 * 3. Run prisma db push
 *
 * For now this is a structural foundation — the DB schema
 * can be extended when multi-tenancy is actually needed.
 */

export interface TenantContext {
  orgId: string | null;
  userId: string;
  role: string;
}

export function createTenantFilter(ctx: TenantContext) {
  if (!ctx.orgId) return {};
  return { orgId: ctx.orgId };
}

export function isOrgAdmin(ctx: TenantContext): boolean {
  return ctx.role === "ADMIN";
}

export function canAccessTenant(ctx: TenantContext, targetOrgId: string): boolean {
  if (ctx.role === "ADMIN") return true;
  return ctx.orgId === targetOrgId;
}
