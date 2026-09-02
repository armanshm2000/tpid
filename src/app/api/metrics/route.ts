import { NextResponse } from "next/server";
import { metrics, collectBasicMetrics } from "@/lib/prometheus";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Collect current metrics
    collectBasicMetrics();

    // Project counts
    const projectCount = await prisma.project.count();
    metrics.gauge("tpid_projects_total", "Total projects", projectCount);

    // Evidence counts
    const evidenceCount = await prisma.evidence.count();
    metrics.gauge("tpid_evidence_total", "Total evidence items", evidenceCount);

    // Risk counts
    const riskCount = await prisma.risk.count({ where: { status: "OPEN" } });
    metrics.gauge("tpid_risks_open", "Open risks", riskCount);

    // User count
    const userCount = await prisma.user.count();
    metrics.gauge("tpid_users_total", "Total users", userCount);

    const body = metrics.render();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      },
    });
  } catch {
    return new NextResponse("# Error collecting metrics\n", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
