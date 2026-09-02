import prisma from "@/lib/prisma";

export async function logAuditEvent(params: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({ data: params });
  } catch {
    // Don't let audit failures break the main flow
    console.error("Failed to write audit log:", params);
  }
}
