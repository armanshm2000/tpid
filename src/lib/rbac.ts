export type Role = "ADMIN" | "MANAGER" | "ENGINEER" | "VIEWER";

const permissions: Record<Role, string[]> = {
  ADMIN: [
    "projects:read",
    "projects:write",
    "projects:delete",
    "users:read",
    "users:write",
    "settings:read",
    "settings:write",
    "contracts:write",
    "evidence:write",
    "risks:write",
    "reports:write",
    "audit:read",
  ],
  MANAGER: [
    "projects:read",
    "projects:write",
    "users:read",
    "settings:read",
    "settings:write",
    "contracts:write",
    "evidence:write",
    "risks:write",
    "reports:write",
  ],
  ENGINEER: [
    "projects:read",
    "settings:read",
    "settings:write",
    "evidence:write",
    "risks:write",
    "reports:read",
  ],
  VIEWER: ["projects:read", "settings:read"],
};

export function hasPermission(role: string, permission: string): boolean {
  const r = (role?.toUpperCase() as Role) || "VIEWER";
  const perms = permissions[r] ?? permissions.VIEWER;
  return perms.includes(permission);
}

export function requireRole(allowedRoles: Role[]) {
  return (role: string): boolean => {
    return allowedRoles.includes(role.toUpperCase() as Role);
  };
}
