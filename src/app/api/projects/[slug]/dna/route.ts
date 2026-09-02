import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { demoProjects, demoDNA } from "@/lib/demo-data";

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
    const dna = await prisma.projectDNA.findUnique({ where: { projectId: pid } });
    return NextResponse.json(dna || null);
  } catch {
    return NextResponse.json(demoDNA.find((d) => d.projectId === pid) || null);
  }
}
