"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { HealthBadge } from "@/components/HealthBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { formatDate, getCategoryLabel, getPriorityColor, getSeverityColor, getHealthStatus, cn } from "@/lib/utils";

interface Project {
  id: string; name: string; slug: string; description: string | null; mission: string | null; vision: string | null;
  category: string; status: string; completionPercentage: number; priority: string; healthScore: number;
  owner?: { id: string; name: string | null; email: string } | null;
  dna?: { vision: string | null; mission: string | null; coreObjectives: string | null; targetUsers: string | null; businessModel: string | null; technicalPhilosophy: string | null; architecturePrinciples: string | null; securityPrinciples: string | null; futureExpansion: string | null } | null;
  architecture?: { id: string; name: string; type: string; technology: string; health: string; description: string | null }[];
  roadmapItems?: { id: string; phase: string; title: string; status: string; progress: number; order: number; description: string | null }[];
  contracts?: { id: string; name: string; type: string; status: string; verified: boolean; version: string; description: string | null }[];
  evidence?: { id: string; title: string; type: string; verified: boolean; description: string | null; author?: { name: string | null }; createdAt: string }[];
  risks?: { id: string; title: string; severity: string; status: string; description: string | null; mitigation: string | null; author?: { name: string | null }; createdAt: string }[];
  aiReports?: { id: string; title: string; summary: string; score: number | null; strengths: string | null; risks: string | null; recommendations: string | null; author?: { name: string | null }; createdAt: string }[];
}

const tabs = ["Overview", "DNA", "Roadmap", "Architecture", "Contracts", "Evidence", "Risks", "Reports"] as const;

function DNAField({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("Overview");

  useEffect(() => {
    fetch(`/api/projects/${slug}`).then((r) => r.json()).then(setProject).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <><Header title="Loading…" /><div className="p-8"><div className="card p-8 text-center text-gray-500">Loading project…</div></div></>;
  if (!project) return <><Header title="Not Found" /><div className="p-8"><div className="card p-8 text-center text-gray-500">Project not found</div></div></>;

  return (
    <>
      <Header title={project.name} />
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <HealthBadge score={project.healthScore} />
          <StatusBadge status={project.status} />
          <span className={`badge ${getPriorityColor(project.priority)}`}>{project.priority}</span>
          <span className="text-sm text-gray-500">{getCategoryLabel(project.category)}</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">Owner: {project.owner?.name || "Unknown"}</span>
        </div>
        <ProgressBar value={project.completionPercentage} label="Completion" />

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap", tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>{t}</button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Project Info</h3>
              <dl className="space-y-1">
                <DNAField label="Description" value={project.description} />
                <DNAField label="Mission" value={project.mission} />
                <DNAField label="Vision" value={project.vision} />
              </dl>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{project.architecture?.length || 0}</p><p className="text-xs text-gray-500">Components</p></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{project.roadmapItems?.length || 0}</p><p className="text-xs text-gray-500">Roadmap Items</p></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{project.contracts?.length || 0}</p><p className="text-xs text-gray-500">Contracts</p></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{project.risks?.length || 0}</p><p className="text-xs text-gray-500">Risks</p></div>
              </div>
            </div>
          </div>
        )}

        {tab === "DNA" && (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Project DNA</h3>
            {project.dna ? (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <DNAField label="Vision" value={project.dna.vision} />
                <DNAField label="Mission" value={project.dna.mission} />
                <DNAField label="Core Objectives" value={project.dna.coreObjectives} />
                <DNAField label="Target Users" value={project.dna.targetUsers} />
                <DNAField label="Business Model" value={project.dna.businessModel} />
                <DNAField label="Technical Philosophy" value={project.dna.technicalPhilosophy} />
                <DNAField label="Architecture Principles" value={project.dna.architecturePrinciples} />
                <DNAField label="Security Principles" value={project.dna.securityPrinciples} />
                <DNAField label="Future Expansion" value={project.dna.futureExpansion} />
              </dl>
            ) : <p className="text-sm text-gray-500">No DNA configured</p>}
          </div>
        )}

        {tab === "Roadmap" && (
          <div className="space-y-4">
            {(project.roadmapItems || []).map((item) => (
              <div key={item.id} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.phase}</span>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <ProgressBar value={item.progress} />
              </div>
            ))}
            {(!project.roadmapItems || project.roadmapItems.length === 0) && <div className="card p-8 text-center text-gray-500">No roadmap items</div>}
          </div>
        )}

        {tab === "Architecture" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(project.architecture || []).map((comp) => (
              <div key={comp.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{comp.name}</h4>
                    <p className="text-xs text-gray-500">{comp.type}</p>
                  </div>
                  <span className={`badge ${getHealthStatus(comp.health)}`}>{comp.health}</span>
                </div>
                <p className="text-sm text-gray-600">{comp.technology}</p>
                {comp.description && <p className="text-xs text-gray-500 mt-1">{comp.description}</p>}
              </div>
            ))}
            {(!project.architecture || project.architecture.length === 0) && <div className="card p-8 text-center text-gray-500 col-span-3">No architecture components</div>}
          </div>
        )}

        {tab === "Contracts" && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Version</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(project.contracts || []).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="table-cell"><p className="font-medium">{c.name}</p><p className="text-xs text-gray-500">{c.description}</p></td>
                    <td className="table-cell"><span className="badge bg-gray-100 text-gray-700">{c.type}</span></td>
                    <td className="table-cell">{c.version}</td>
                    <td className="table-cell"><StatusBadge status={c.status} /></td>
                    <td className="table-cell">{c.verified ? <span className="badge bg-green-100 text-green-700">✓ Verified</span> : <span className="badge bg-gray-100 text-gray-500">Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!project.contracts || project.contracts.length === 0) && <div className="p-8 text-center text-gray-500">No contracts</div>}
          </div>
        )}

        {tab === "Evidence" && (
          <div className="space-y-3">
            {(project.evidence || []).map((e) => (
              <div key={e.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm", e.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>{e.verified ? "✓" : "○"}</div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{e.title}</h4>
                    <p className="text-xs text-gray-500">{e.description} • by {e.author?.name || "Unknown"} • {formatDate(e.createdAt)}</p>
                  </div>
                </div>
                <span className="badge bg-gray-100 text-gray-700">{e.type.replace(/_/g, " ")}</span>
              </div>
            ))}
            {(!project.evidence || project.evidence.length === 0) && <div className="card p-8 text-center text-gray-500">No evidence</div>}
          </div>
        )}

        {tab === "Risks" && (
          <div className="space-y-3">
            {(project.risks || []).map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-gray-900">{r.title}</h4>
                    <span className={`badge ${getSeverityColor(r.severity)}`}>{r.severity}</span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-gray-600 mb-1">{r.description}</p>
                {r.mitigation && <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">Mitigation: {r.mitigation}</p>}
                <p className="text-xs text-gray-400 mt-1">Reported by {r.author?.name || "Unknown"}</p>
              </div>
            ))}
            {(!project.risks || project.risks.length === 0) && <div className="card p-8 text-center text-gray-500">No risks</div>}
          </div>
        )}

        {tab === "Reports" && (
          <div className="space-y-4">
            {(project.aiReports || []).map((r) => (
              <div key={r.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{r.title}</h4>
                    <p className="text-xs text-gray-500">by {r.author?.name || "Unknown"} • {formatDate(r.createdAt)}</p>
                  </div>
                  {r.score !== null && (
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold", r.score >= 80 ? "bg-green-100 text-green-700" : r.score >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}>{r.score}</div>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3">{r.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {r.strengths && <div className="bg-green-50 rounded-lg p-3"><p className="text-xs font-medium text-green-700 mb-1">Strengths</p><p className="text-xs text-green-600">{r.strengths}</p></div>}
                  {r.risks && <div className="bg-orange-50 rounded-lg p-3"><p className="text-xs font-medium text-orange-700 mb-1">Risks</p><p className="text-xs text-orange-600">{r.risks}</p></div>}
                  {r.recommendations && <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-medium text-blue-700 mb-1">Recommendations</p><p className="text-xs text-blue-600">{r.recommendations}</p></div>}
                </div>
              </div>
            ))}
            {(!project.aiReports || project.aiReports.length === 0) && <div className="card p-8 text-center text-gray-500">No reports</div>}
          </div>
        )}
      </div>
    </>
  );
}
