import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { demoProjects, demoContracts } from "@/lib/demo-data";

async function getProjectId(slug: string): Promise<string | null> {
  try {
    const p = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
    return p?.id || null;
  } catch {
    return demoProjects.find((p) => p.slug === slug)?.id || null;
  }
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const pid = await getProjectId(params.slug);
  if (!pid) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const contracts = await prisma.contract.findMany({ where: { projectId: pid } });
    return NextResponse.json(contracts);
  } catch {
    return NextResponse.json(demoContracts.filter((c) => c.projectId === pid));
  }
}
