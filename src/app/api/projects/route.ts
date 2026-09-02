import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { demoProjects, demoUsers } from "@/lib/demo-data";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { owner: { select: { id: true, name: true, email: true } }, _count: { select: { evidence: true, risks: true, contracts: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch {
    const projects = demoProjects.map((p) => ({
      ...p,
      owner: demoUsers.find((u) => u.id === p.ownerId),
      _count: { evidence: 0, risks: 0, contracts: 0 },
    }));
    return NextResponse.json(projects);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({ data: body });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
