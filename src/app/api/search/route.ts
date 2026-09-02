import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { demoProjects, demoContracts, demoEvidence, demoRisks, demoUsers } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  if (!q) return NextResponse.json({ projects: [], contracts: [], evidence: [], risks: [] });

  try {
    const [projects, contracts, evidence, risks] = await Promise.all([
      prisma.project.findMany({ where: { OR: [{ name: { contains: q } }, { description: { contains: q } }, { mission: { contains: q } }] } }),
      prisma.contract.findMany({ where: { OR: [{ name: { contains: q } }, { description: { contains: q } }] } }),
      prisma.evidence.findMany({ where: { OR: [{ title: { contains: q } }, { description: { contains: q } }] } }),
      prisma.risk.findMany({ where: { OR: [{ title: { contains: q } }, { description: { contains: q } }] } }),
    ]);
    return NextResponse.json({ projects, contracts, evidence, risks });
  } catch {
    const projects = demoProjects.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.mission?.toLowerCase().includes(q));
    const contracts = demoContracts.filter((c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    const evidence = demoEvidence.filter((e) => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q));
    const risks = demoRisks.filter((r) => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    return NextResponse.json({ projects, contracts, evidence, risks });
  }
}
