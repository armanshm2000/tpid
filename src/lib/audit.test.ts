import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire prisma module
vi.mock("@/lib/prisma", () => {
  return {
    default: {
      auditLog: {
        create: vi.fn(),
      },
    },
  };
});

// Import after mock setup
import { logAuditEvent } from "@/lib/audit";
import prismaMock from "@/lib/prisma";

describe("logAuditEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an audit log entry", async () => {
    (prismaMock.auditLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    await logAuditEvent({
      userId: "user-1",
      action: "CREATE",
      entity: "Project",
      entityId: "proj-1",
      details: "Created project TitanOS",
      ipAddress: "127.0.0.1",
    });

    expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        action: "CREATE",
        entity: "Project",
        entityId: "proj-1",
        details: "Created project TitanOS",
        ipAddress: "127.0.0.1",
      },
    });
  });

  it("handles optional fields", async () => {
    (prismaMock.auditLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    await logAuditEvent({
      userId: "user-2",
      action: "UPDATE",
      entity: "Settings",
    });

    expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: "user-2",
        action: "UPDATE",
        entity: "Settings",
        entityId: undefined,
        details: undefined,
        ipAddress: undefined,
      },
    });
  });

  it("does not throw when prisma fails", async () => {
    (prismaMock.auditLog.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("DB error"));

    // Should not throw
    await expect(
      logAuditEvent({ userId: "u1", action: "DELETE", entity: "Risk" })
    ).resolves.toBeUndefined();
  });
});
