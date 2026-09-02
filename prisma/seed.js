const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SQLite database...");
  const pw = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({ where: { email: "admin@titan.io" }, update: {}, create: { email: "admin@titan.io", name: "Admin User", password: pw, role: "ADMIN" } });
  const sarah = await prisma.user.upsert({ where: { email: "sarah@titan.io" }, update: {}, create: { email: "sarah@titan.io", name: "Sarah Kim", password: pw, role: "MANAGER" } });
  const marcus = await prisma.user.upsert({ where: { email: "marcus@titan.io" }, update: {}, create: { email: "marcus@titan.io", name: "Marcus Johnson", password: pw, role: "ENGINEER" } });
  console.log("Users:", admin.email, sarah.email, marcus.email);

  const defs = [
    { name: "TitanOS", slug: "titanos", description: "Next-gen AI operating system", mission: "Build the most intelligent enterprise OS", vision: "Autonomous enterprise management", category: "AI_ENGINEERING", status: "DEVELOPMENT", completionPercentage: 72, priority: "HIGH", healthScore: 85, ownerId: admin.id },
    { name: "TitanPropAI", slug: "titanpropai", description: "AI-powered property valuation", mission: "Revolutionize property intelligence", vision: "AI-driven property ecosystem", category: "AI_ENGINEERING", status: "DEVELOPMENT", completionPercentage: 58, priority: "HIGH", healthScore: 72, ownerId: sarah.id },
    { name: "Titan Shield", slug: "titan-shield", description: "Cybersecurity monitoring", mission: "Protect digital assets with AI", vision: "Zero-trust security", category: "SECURITY", status: "TESTING", completionPercentage: 88, priority: "CRITICAL", healthScore: 91, ownerId: marcus.id },
    { name: "DataForge", slug: "dataforge", description: "Real-time data pipeline", mission: "Simplify data engineering", vision: "Universal data infrastructure", category: "DATA_PLATFORM", status: "ARCHITECTURE", completionPercentage: 35, priority: "MEDIUM", healthScore: 65, ownerId: sarah.id },
    { name: "Nexus Research", slug: "nexus-research", description: "Research collaboration platform", mission: "Accelerate scientific discovery", vision: "Open research ecosystem", category: "RESEARCH", status: "PLANNING", completionPercentage: 15, priority: "LOW", healthScore: 45, ownerId: marcus.id },
    { name: "Blockchain Gateway", slug: "blockchain-gateway", description: "Multi-chain bridge", mission: "Connect all blockchains", vision: "Unified Web3", category: "BLOCKCHAIN", status: "COMPLETED", completionPercentage: 100, priority: "MEDIUM", healthScore: 94, ownerId: admin.id },
  ];

  const projects = [];
  for (const d of defs) {
    const p = await prisma.project.upsert({ where: { slug: d.slug }, update: d, create: d });
    projects.push(p);
  }
  console.log("Projects:", projects.length);

  for (const p of projects) {
    await prisma.projectDNA.upsert({ where: { projectId: p.id }, update: {}, create: { projectId: p.id, vision: p.vision, mission: p.mission, coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps" } });
  }
  console.log("DNA created");

  const arch = [
    { projectId: projects[0].id, name: "Frontend", type: "UI", technology: "Next.js + TypeScript", health: "HEALTHY", description: "React SPA with SSR" },
    { projectId: projects[0].id, name: "Backend API", type: "Service", technology: "Node.js + Express", health: "HEALTHY", description: "RESTful API layer" },
    { projectId: projects[0].id, name: "AI Engine", type: "AI", technology: "Python + PyTorch", health: "WARNING", description: "ML inference pipeline" },
    { projectId: projects[0].id, name: "Database", type: "Data", technology: "PostgreSQL + Redis", health: "HEALTHY", description: "Primary data store" },
    { projectId: projects[1].id, name: "Frontend", type: "UI", technology: "React + Vite", health: "HEALTHY", description: "Property dashboard" },
    { projectId: projects[1].id, name: "Backend", type: "Service", technology: "Python FastAPI", health: "HEALTHY", description: "API service" },
    { projectId: projects[1].id, name: "Valuation Engine", type: "AI", technology: "scikit-learn + XGBoost", health: "WARNING", description: "Property valuation ML" },
    { projectId: projects[2].id, name: "Threat Detection", type: "Security", technology: "YARA + Suricata", health: "HEALTHY", description: "Network threat analysis" },
    { projectId: projects[2].id, name: "SIEM Dashboard", type: "UI", technology: "Next.js", health: "HEALTHY", description: "Security event dashboard" },
    { projectId: projects[2].id, name: "Log Aggregator", type: "Data", technology: "Elasticsearch", health: "HEALTHY", description: "Centralized log storage" },
  ];
  for (const a of arch) await prisma.architectureComponent.create({ data: a });
  console.log("Architecture:", arch.length);

  const roads = [
    { projectId: projects[0].id, phase: "Phase 1", title: "Foundation", status: "COMPLETED", progress: 100, order: 1 },
    { projectId: projects[0].id, phase: "Phase 2", title: "AI Intelligence Layer", status: "IN_PROGRESS", progress: 65, order: 2 },
    { projectId: projects[0].id, phase: "Phase 3", title: "Production Deployment", status: "PENDING", progress: 10, order: 3 },
    { projectId: projects[1].id, phase: "Phase 1", title: "Core Platform", status: "COMPLETED", progress: 100, order: 1 },
    { projectId: projects[1].id, phase: "Phase 2", title: "AI Valuation Models", status: "IN_PROGRESS", progress: 45, order: 2 },
    { projectId: projects[1].id, phase: "Phase 3", title: "Market Launch", status: "PENDING", progress: 0, order: 3 },
    { projectId: projects[2].id, phase: "Phase 1", title: "Threat Detection", status: "COMPLETED", progress: 100, order: 1 },
    { projectId: projects[2].id, phase: "Phase 2", title: "SIEM Integration", status: "COMPLETED", progress: 100, order: 2 },
    { projectId: projects[2].id, phase: "Phase 3", title: "Advanced Analytics", status: "IN_PROGRESS", progress: 80, order: 3 },
  ];
  for (const r of roads) await prisma.roadmapItem.create({ data: r });
  console.log("Roadmap:", roads.length);

  const contracts = [
    { projectId: projects[0].id, name: "Architecture Contract", type: "ARCHITECTURE", status: "ACTIVE", verified: true, version: "2.1", description: "Microservices standards" },
    { projectId: projects[0].id, name: "Security Contract", type: "SECURITY", status: "ACTIVE", verified: true, version: "1.5", description: "Zero-trust requirements" },
    { projectId: projects[0].id, name: "Testing Contract", type: "TESTING", status: "ACTIVE", verified: false, version: "1.0", description: "80% code coverage" },
    { projectId: projects[1].id, name: "API Contract", type: "API", status: "ACTIVE", verified: true, version: "1.2", description: "RESTful API standards" },
    { projectId: projects[1].id, name: "Data Contract", type: "DATA", status: "DRAFT", verified: false, version: "0.9", description: "Data governance" },
    { projectId: projects[2].id, name: "Security Contract", type: "SECURITY", status: "ACTIVE", verified: true, version: "3.0", description: "SOC2 compliance" },
    { projectId: projects[2].id, name: "Deployment Contract", type: "DEPLOYMENT", status: "ACTIVE", verified: true, version: "2.0", description: "CI/CD standards" },
    { projectId: projects[5].id, name: "Architecture Contract", type: "ARCHITECTURE", status: "ACTIVE", verified: true, version: "1.0", description: "Smart contract arch" },
  ];
  for (const c of contracts) await prisma.contract.create({ data: c });
  console.log("Contracts:", contracts.length);

  const evidence = [
    { projectId: projects[0].id, authorId: admin.id, title: "Unit Test Suite", type: "TEST_RESULT", verified: true, description: "95% pass rate, 342 tests" },
    { projectId: projects[0].id, authorId: marcus.id, title: "Load Test Results", type: "REPORT", verified: true, description: "10K concurrent users" },
    { projectId: projects[1].id, authorId: sarah.id, title: "Valuation Accuracy Report", type: "REPORT", verified: true, description: "92% accuracy within 5% margin" },
    { projectId: projects[2].id, authorId: marcus.id, title: "Penetration Test", type: "SECURITY_REPORT", verified: true, description: "Zero critical vulnerabilities" },
    { projectId: projects[2].id, authorId: admin.id, title: "SOC2 Audit Report", type: "REPORT", verified: true, description: "Full SOC2 Type II compliance" },
    { projectId: projects[5].id, authorId: admin.id, title: "Mainnet Deployment Proof", type: "DEPLOYMENT_PROOF", verified: true, description: "Deployed to Ethereum mainnet" },
  ];
  for (const e of evidence) await prisma.evidence.create({ data: e });
  console.log("Evidence:", evidence.length);

  const risks = [
    { projectId: projects[0].id, authorId: admin.id, title: "AI Model Drift Risk", severity: "HIGH", status: "OPEN", description: "ML model accuracy may degrade" },
    { projectId: projects[1].id, authorId: sarah.id, title: "Data Source Reliability", severity: "MEDIUM", status: "MITIGATED", description: "Property data feeds downtime", mitigation: "Fallback data sources" },
    { projectId: projects[0].id, authorId: marcus.id, title: "Scalability Bottleneck", severity: "MEDIUM", status: "OPEN", description: "DB connections may max out" },
    { projectId: projects[2].id, authorId: marcus.id, title: "Zero-Day Vulnerability", severity: "CRITICAL", status: "MITIGATED", description: "Potential zero-day in deps", mitigation: "Dependabot scanning" },
  ];
  for (const r of risks) await prisma.risk.create({ data: r });
  console.log("Risks:", risks.length);

  const reports = [
    { projectId: projects[0].id, authorId: admin.id, title: "TitanOS Health Analysis", summary: "Strong architecture. AI layer needs attention.", score: 85, strengths: "Modular architecture, Good documentation", risks: "AI model needs monitoring, Test coverage below target", recommendations: "Add CI/CD pipeline, Implement model monitoring" },
    { projectId: projects[1].id, authorId: sarah.id, title: "TitanPropAI Assessment", summary: "Good progress on core platform.", score: 72, strengths: "Solid data pipeline, Good API design", risks: "Valuation accuracy needs improvement", recommendations: "Improve training data quality" },
  ];
  for (const r of reports) await prisma.aIReport.create({ data: r });
  console.log("Reports:", reports.length);

  console.log("\nSeed complete!");
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
