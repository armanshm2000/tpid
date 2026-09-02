import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { demoProjects, demoEvidence, demoUsers } from "@/lib/demo-data";

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
    const evidence = await prisma.evidence.findMany({ where: { projectId: pid }, include: { author: { select: { id: true, name: true } } } });
    return NextResponse.json(evidence);
  } catch {
    return NextResponse.json(demoEvidence.filter((e) => e.projectId === pid).map((e) => ({ ...e, author: demoUsers.find((u) => u.id === e.authorId) })));
  }
}
