import { vi } from "vitest";

// Mock prisma for API tests
export function mockPrisma() {
  const prismaMock = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    auditLog: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
    contract: {
      findMany: vi.fn(),
    },
    evidence: {
      findMany: vi.fn(),
    },
    risk: {
      findMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  };

  return prismaMock;
}

// Mock session for API tests
export function mockSession(user: { id: string; email: string; name: string; role: string } | null) {
  return {
    user,
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}
