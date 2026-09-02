import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId } = body as { projectId?: string };

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Fetch project data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        dna: true,
        architecture: true,
        roadmapItems: true,
        contracts: true,
        evidence: true,
        risks: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Mock analysis when OpenAI is not configured
      const mockResult = generateMockAnalysis(project);
      return NextResponse.json(mockResult);
    }

    // Real OpenAI analysis
    const prompt = buildAnalysisPrompt(project);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a project health analyst. Analyze the project data and provide a structured assessment." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const mockResult = generateMockAnalysis(project);
      return NextResponse.json(mockResult);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse AI response
    const analysis = parseAIResponse(content);

    // Save report
    const userId = (session.user as Record<string, unknown>).id as string;
    const report = await prisma.aIReport.create({
      data: {
        projectId,
        authorId: userId,
        title: `AI Analysis: ${project.name}`,
        summary: analysis.summary,
        strengths: analysis.strengths,
        risks: analysis.risks,
        recommendations: analysis.recommendations,
        score: analysis.score,
      },
    });

    return NextResponse.json({ report, raw: content });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

function buildAnalysisPrompt(project: Record<string, unknown>): string {
  const arch = (project.architecture as Array<Record<string, unknown>>)?.map((a) => `${a.name} (${a.type}) - ${a.health}`).join(", ") || "none";    const risks = (project.risks as Array<Record<string, unknown>>)?.map((r) => `${String(r.title)} [${String(r.severity)}] - ${String(r.status)}`).join(", ") || "none";
    const roadmap = (project.roadmapItems as Array<Record<string, unknown>>)?.map((r) => `${String(r.title)}: ${String(r.progress)}%`).join(", ") || "none";

  return `Analyze this project and provide a JSON response with:
- summary (string): brief overall assessment
- strengths (string): comma-separated strengths
- risks (string): comma-separated risks
- recommendations (string): comma-separated recommendations
- score (number 0-100): health score

Project: ${project.name}
Status: ${project.status}
Health Score: ${project.healthScore}
Completion: ${project.completionPercentage}%
Priority: ${project.priority}
Architecture: ${arch}
Risks: ${risks}
Roadmap: ${roadmap}`;
}

function parseAIResponse(content: string) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || "AI analysis completed.",
        strengths: parsed.strengths || "",
        risks: parsed.risks || "",
        recommendations: parsed.recommendations || "",
        score: Math.min(100, Math.max(0, parsed.score || 50)),
      };
    }
  } catch {}
  return {
    summary: content.slice(0, 500) || "Analysis completed.",
    strengths: "",
    risks: "",
    recommendations: "",
    score: 50,
  };
}

function generateMockAnalysis(project: Record<string, unknown>) {
  const score = (project.healthScore as number) || 50;
  const risks = (project.risks as Array<unknown>) || [];
  const arch = (project.architecture as Array<unknown>) || [];

  const riskArr = risks as Array<Record<string, unknown>>;
  return {
    summary: `${project.name} is currently in ${project.status} status with ${project.completionPercentage}% completion. ${riskArr.length} active risks identified across ${arch.length} architecture components.`,
    strengths: `Active development, ${arch.length} components tracked, ${riskArr.filter((r) => String(r.status) === "MITIGATED").length} risks mitigated`,
    risks: `${riskArr.filter((r) => String(r.severity) === "CRITICAL" || String(r.severity) === "HIGH").length} high/critical risks open, completion at ${project.completionPercentage}%`,
    recommendations: "Increase test coverage, monitor critical risks, accelerate roadmap items",
    score,
    mock: true,
  };
}
