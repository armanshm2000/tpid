import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List versions for a contract
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get("contractId");

    if (!contractId) {
      return NextResponse.json({ error: "contractId is required" }, { status: 400 });
    }

    const versions = await prisma.contractVersion.findMany({
      where: { contractId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(versions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}

// POST: Create new version for a contract
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as Record<string, unknown>).role as string;
    if (!["ADMIN", "MANAGER"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await request.json();
    const { contractId, content, changeNote } = body as {
      contractId?: string;
      content?: string;
      changeNote?: string;
    };

    if (!contractId) {
      return NextResponse.json({ error: "contractId is required" }, { status: 400 });
    }

    // Get current contract
    const contract = await prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Save current version
    await prisma.contractVersion.create({
      data: {
        contractId,
        version: contract.version,
        content: contract.content,
        changedBy: userId,
        changeNote: changeNote || "Version saved",
      },
    });

    // Update contract
    const newVersion = incrementVersion(contract.version);
    const updated = await prisma.contract.update({
      where: { id: contractId },
      data: {
        content: content ?? contract.content,
        version: newVersion,
      },
    });

    return NextResponse.json({ contract: updated, previousVersion: contract.version });
  } catch {
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 });
  }
}

function incrementVersion(version: string): string {
  const parts = version.split(".").map(Number);
  if (parts.length < 2) parts.push(0);
  parts[1] = (parts[1] || 0) + 1;
  return parts.join(".");
}
