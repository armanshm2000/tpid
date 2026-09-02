import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { demoProjects, demoUsers, demoDNA, demoArchitecture, demoRoadmap, demoContracts, demoEvidence, demoRisks, demoReports } from "@/lib/demo-data";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        dna: true,
        architecture: true,
        roadmapItems: { orderBy: { order: "asc" } },
        contracts: true,
        evidence: { include: { author: { select: { id: true, name: true } } } },
        risks: { include: { author: { select: { id: true, name: true } } } },
        aiReports: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    const p = demoProjects.find((p) => p.slug === params.slug);
    if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const owner = demoUsers.find((u) => u.id === p.ownerId);
    return NextResponse.json({
      ...p, owner: owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
      dna: demoDNA.find((d) => d.projectId === p.id) || null,
      architecture: demoArchitecture.filter((a) => a.projectId === p.id),
      roadmapItems: demoRoadmap.filter((r) => r.projectId === p.id).sort((a, b) => a.order - b.order),
      contracts: demoContracts.filter((c) => c.projectId === p.id),
      evidence: demoEvidence.filter((e) => e.projectId === p.id).map((e) => ({ ...e, author: demoUsers.find((u) => u.id === e.authorId) })),
      risks: demoRisks.filter((r) => r.projectId === p.id).map((r) => ({ ...r, author: demoUsers.find((u) => u.id === r.authorId) })),
      aiReports: demoReports.filter((r) => r.projectId === p.id).map((r) => ({ ...r, author: demoUsers.find((u) => u.id === r.authorId) })),
    });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    const project = await prisma.project.update({ where: { slug: params.slug }, data: body });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
