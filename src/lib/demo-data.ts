export const demoUsers = [
  { id: "u1", email: "admin@titan.io", name: "Admin User", password: "$2a$10$hash", role: "ADMIN", avatar: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "u2", email: "sarah@titan.io", name: "Sarah Kim", password: "$2a$10$hash", role: "MANAGER", avatar: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "u3", email: "marcus@titan.io", name: "Marcus Johnson", password: "$2a$10$hash", role: "ENGINEER", avatar: null, createdAt: new Date(), updatedAt: new Date() },
];

export const demoProjects = [
  { id: "p1", name: "TitanOS", slug: "titanos", description: "Next-gen AI operating system", mission: "Build the most intelligent enterprise OS", vision: "Autonomous enterprise management", category: "AI_ENGINEERING", status: "DEVELOPMENT", completionPercentage: 72, priority: "HIGH", healthScore: 85, ownerId: "u1", createdAt: new Date(), updatedAt: new Date() },
  { id: "p2", name: "TitanPropAI", slug: "titanpropai", description: "AI-powered property valuation", mission: "Revolutionize property intelligence", vision: "AI-driven property ecosystem", category: "AI_ENGINEERING", status: "DEVELOPMENT", completionPercentage: 58, priority: "HIGH", healthScore: 72, ownerId: "u2", createdAt: new Date(), updatedAt: new Date() },
  { id: "p3", name: "Titan Shield", slug: "titan-shield", description: "Cybersecurity monitoring", mission: "Protect digital assets with AI", vision: "Zero-trust security", category: "SECURITY", status: "TESTING", completionPercentage: 88, priority: "CRITICAL", healthScore: 91, ownerId: "u3", createdAt: new Date(), updatedAt: new Date() },
  { id: "p4", name: "DataForge", slug: "dataforge", description: "Real-time data pipeline", mission: "Simplify data engineering", vision: "Universal data infrastructure", category: "DATA_PLATFORM", status: "ARCHITECTURE", completionPercentage: 35, priority: "MEDIUM", healthScore: 65, ownerId: "u2", createdAt: new Date(), updatedAt: new Date() },
  { id: "p5", name: "Nexus Research", slug: "nexus-research", description: "Research collaboration platform", mission: "Accelerate scientific discovery", vision: "Open research ecosystem", category: "RESEARCH", status: "PLANNING", completionPercentage: 15, priority: "LOW", healthScore: 45, ownerId: "u3", createdAt: new Date(), updatedAt: new Date() },
  { id: "p6", name: "Blockchain Gateway", slug: "blockchain-gateway", description: "Multi-chain bridge", mission: "Connect all blockchains", vision: "Unified Web3", category: "BLOCKCHAIN", status: "COMPLETED", completionPercentage: 100, priority: "MEDIUM", healthScore: 94, ownerId: "u1", createdAt: new Date(), updatedAt: new Date() },
];

export const demoDNA = [
  { id: "d1", projectId: "p1", vision: "Autonomous enterprise management", mission: "Build the most intelligent enterprise OS", coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps", createdAt: new Date(), updatedAt: new Date() },
  { id: "d2", projectId: "p2", vision: "AI-driven property ecosystem", mission: "Revolutionize property intelligence", coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps", createdAt: new Date(), updatedAt: new Date() },
  { id: "d3", projectId: "p3", vision: "Zero-trust security", mission: "Protect digital assets with AI", coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps", createdAt: new Date(), updatedAt: new Date() },
  { id: "d4", projectId: "p4", vision: "Universal data infrastructure", mission: "Simplify data engineering", coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps", createdAt: new Date(), updatedAt: new Date() },
  { id: "d5", projectId: "p5", vision: "Open research ecosystem", mission: "Accelerate scientific discovery", coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps", createdAt: new Date(), updatedAt: new Date() },
  { id: "d6", projectId: "p6", vision: "Unified Web3", mission: "Connect all blockchains", coreObjectives: "Innovation, Quality, Scalability, Security", targetUsers: "Enterprise teams, developers", businessModel: "SaaS with enterprise licensing", technicalPhilosophy: "Build for scale, deploy with confidence", architecturePrinciples: "Microservices, event-driven, DDD", securityPrinciples: "Zero-trust, encryption, RBAC", futureExpansion: "Multi-tenant cloud, mobile apps", createdAt: new Date(), updatedAt: new Date() },
];

export const demoArchitecture = [
  { id: "a1", projectId: "p1", name: "Frontend", type: "UI", technology: "Next.js + TypeScript", health: "HEALTHY", description: "React SPA with SSR", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a2", projectId: "p1", name: "Backend API", type: "Service", technology: "Node.js + Express", health: "HEALTHY", description: "RESTful API layer", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a3", projectId: "p1", name: "AI Engine", type: "AI", technology: "Python + PyTorch", health: "WARNING", description: "ML inference pipeline", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a4", projectId: "p1", name: "Database", type: "Data", technology: "PostgreSQL + Redis", health: "HEALTHY", description: "Primary data store", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a5", projectId: "p2", name: "Frontend", type: "UI", technology: "React + Vite", health: "HEALTHY", description: "Property dashboard", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a6", projectId: "p2", name: "Backend", type: "Service", technology: "Python FastAPI", health: "HEALTHY", description: "API service", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a7", projectId: "p2", name: "Valuation Engine", type: "AI", technology: "scikit-learn + XGBoost", health: "WARNING", description: "Property valuation ML", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a8", projectId: "p3", name: "Threat Detection", type: "Security", technology: "YARA + Suricata", health: "HEALTHY", description: "Network threat analysis", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a9", projectId: "p3", name: "SIEM Dashboard", type: "UI", technology: "Next.js", health: "HEALTHY", description: "Security event dashboard", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "a10", projectId: "p3", name: "Log Aggregator", type: "Data", technology: "Elasticsearch", health: "HEALTHY", description: "Centralized log storage", dependencies: null, metadata: null, createdAt: new Date(), updatedAt: new Date() },
];

export const demoRoadmap = [
  { id: "r1", projectId: "p1", phase: "Phase 1", title: "Foundation", status: "COMPLETED", progress: 100, deadline: null, startDate: null, dependencies: null, order: 1, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r2", projectId: "p1", phase: "Phase 2", title: "AI Intelligence Layer", status: "IN_PROGRESS", progress: 65, deadline: null, startDate: null, dependencies: null, order: 2, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r3", projectId: "p1", phase: "Phase 3", title: "Production Deployment", status: "PENDING", progress: 10, deadline: null, startDate: null, dependencies: null, order: 3, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r4", projectId: "p2", phase: "Phase 1", title: "Core Platform", status: "COMPLETED", progress: 100, deadline: null, startDate: null, dependencies: null, order: 1, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r5", projectId: "p2", phase: "Phase 2", title: "AI Valuation Models", status: "IN_PROGRESS", progress: 45, deadline: null, startDate: null, dependencies: null, order: 2, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r6", projectId: "p2", phase: "Phase 3", title: "Market Launch", status: "PENDING", progress: 0, deadline: null, startDate: null, dependencies: null, order: 3, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r7", projectId: "p3", phase: "Phase 1", title: "Threat Detection", status: "COMPLETED", progress: 100, deadline: null, startDate: null, dependencies: null, order: 1, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r8", projectId: "p3", phase: "Phase 2", title: "SIEM Integration", status: "COMPLETED", progress: 100, deadline: null, startDate: null, dependencies: null, order: 2, description: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "r9", projectId: "p3", phase: "Phase 3", title: "Advanced Analytics", status: "IN_PROGRESS", progress: 80, deadline: null, startDate: null, dependencies: null, order: 3, description: null, createdAt: new Date(), updatedAt: new Date() },
];

export const demoContracts = [
  { id: "c1", projectId: "p1", name: "Architecture Contract", type: "ARCHITECTURE", status: "ACTIVE", verified: true, version: "2.1", description: "Microservices standards", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c2", projectId: "p1", name: "Security Contract", type: "SECURITY", status: "ACTIVE", verified: true, version: "1.5", description: "Zero-trust requirements", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c3", projectId: "p1", name: "Testing Contract", type: "TESTING", status: "ACTIVE", verified: false, version: "1.0", description: "80% code coverage", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c4", projectId: "p2", name: "API Contract", type: "API", status: "ACTIVE", verified: true, version: "1.2", description: "RESTful API standards", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c5", projectId: "p2", name: "Data Contract", type: "DATA", status: "DRAFT", verified: false, version: "0.9", description: "Data governance", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c6", projectId: "p3", name: "Security Contract", type: "SECURITY", status: "ACTIVE", verified: true, version: "3.0", description: "SOC2 compliance", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c7", projectId: "p3", name: "Deployment Contract", type: "DEPLOYMENT", status: "ACTIVE", verified: true, version: "2.0", description: "CI/CD standards", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "c8", projectId: "p6", name: "Architecture Contract", type: "ARCHITECTURE", status: "ACTIVE", verified: true, version: "1.0", description: "Smart contract arch", content: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
];

export const demoEvidence = [
  { id: "e1", projectId: "p1", authorId: "u1", title: "Unit Test Suite", type: "TEST_RESULT", verified: true, description: "95% pass rate, 342 tests", fileUrl: null, metadata: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "e2", projectId: "p1", authorId: "u3", title: "Load Test Results", type: "REPORT", verified: true, description: "10K concurrent users", fileUrl: null, metadata: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "e3", projectId: "p2", authorId: "u2", title: "Valuation Accuracy Report", type: "REPORT", verified: true, description: "92% accuracy within 5% margin", fileUrl: null, metadata: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "e4", projectId: "p3", authorId: "u3", title: "Penetration Test", type: "SECURITY_REPORT", verified: true, description: "Zero critical vulnerabilities", fileUrl: null, metadata: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "e5", projectId: "p3", authorId: "u1", title: "SOC2 Audit Report", type: "REPORT", verified: true, description: "Full SOC2 Type II compliance", fileUrl: null, metadata: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "e6", projectId: "p6", authorId: "u1", title: "Mainnet Deployment Proof", type: "DEPLOYMENT_PROOF", verified: true, description: "Deployed to Ethereum mainnet", fileUrl: null, metadata: null, verifiedAt: null, createdAt: new Date(), updatedAt: new Date() },
];

export const demoRisks = [
  { id: "rs1", projectId: "p1", authorId: "u1", title: "AI Model Drift Risk", severity: "HIGH", status: "OPEN", description: "ML model accuracy may degrade", mitigation: null, detectedAt: new Date(), resolvedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "rs2", projectId: "p2", authorId: "u2", title: "Data Source Reliability", severity: "MEDIUM", status: "MITIGATED", description: "Property data feeds downtime", mitigation: "Fallback data sources", detectedAt: new Date(), resolvedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "rs3", projectId: "p1", authorId: "u3", title: "Scalability Bottleneck", severity: "MEDIUM", status: "OPEN", description: "DB connections may max out", mitigation: null, detectedAt: new Date(), resolvedAt: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "rs4", projectId: "p3", authorId: "u3", title: "Zero-Day Vulnerability", severity: "CRITICAL", status: "MITIGATED", description: "Potential zero-day in deps", mitigation: "Dependabot scanning", detectedAt: new Date(), resolvedAt: null, createdAt: new Date(), updatedAt: new Date() },
];

export const demoReports = [
  { id: "ar1", projectId: "p1", authorId: "u1", title: "TitanOS Health Analysis", summary: "Strong architecture. AI layer needs attention.", score: 85, strengths: "Modular architecture, Good documentation", risks: "AI model needs monitoring, Test coverage below target", recommendations: "Add CI/CD pipeline, Implement model monitoring", metadata: null, createdAt: new Date() },
  { id: "ar2", projectId: "p2", authorId: "u2", title: "TitanPropAI Assessment", summary: "Good progress on core platform.", score: 72, strengths: "Solid data pipeline, Good API design", risks: "Valuation accuracy needs improvement", recommendations: "Improve training data quality", metadata: null, createdAt: new Date() },
];
