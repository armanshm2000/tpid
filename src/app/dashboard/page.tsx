"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { HealthBadge } from "@/components/HealthBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { getCategoryLabel, formatDate } from "@/lib/utils";

interface Project {
  id: string; name: string; slug: string; description: string | null; category: string; status: string;
  completionPercentage: number; priority: string; healthScore: number;
  owner?: { name: string | null; email: string } | null;
  _count?: { evidence: number; risks: number; contracts: number };
}

interface Activity {
  id: string; action: string; entity: string; entityId: string | null; details: string | null; createdAt: string;
}

const actionIcons: Record<string, string> = {
  CREATE: "➕",
  UPDATE: "✏️",
  DELETE: "🗑️",
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/audit/activity").then((r) => r.json()).catch(() => []),
    ]).then(([p, a]) => {
      setProjects(p);
      setActivities(Array.isArray(a) ? a : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const avgHealth = projects.length ? Math.round(projects.reduce((s, p) => s + p.healthScore, 0) / projects.length) : 0;
  const totalRisks = projects.reduce((s, p) => s + (p._count?.risks || 0), 0);
  const totalEvidence = projects.reduce((s, p) => s + (p._count?.evidence || 0), 0);

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={projects.length} sub={`${projects.filter((p) => p.status === "COMPLETED").length} completed`} />
          <StatCard label="Average Health" value={`${avgHealth}%`} sub={avgHealth >= 70 ? "Healthy" : avgHealth >= 50 ? "Needs attention" : "At risk"} />
          <StatCard label="Open Risks" value={totalRisks} sub="Across all projects" />
          <StatCard label="Evidence Items" value={totalEvidence} sub="Verified documentation" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h3>
              <Link href="/dashboard/projects" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
            </div>
            {loading ? (
              <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading projects…</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 6).map((p) => (
                  <Link key={p.id} href={`/dashboard/projects/${p.slug}`} className="card p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{p.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{getCategoryLabel(p.category)}</p>
                      </div>
                      <HealthBadge score={p.healthScore} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                    <ProgressBar value={p.completionPercentage} />
                    <div className="flex items-center justify-between mt-3">
                      <StatusBadge status={p.status} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{p.owner?.name || "Unknown"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <Link href="/dashboard/audit" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
            </div>
            <div className="card divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading…</div>
              ) : activities.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No recent activity</div>
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="p-3 flex items-start gap-3">
                    <span className="text-sm mt-0.5">{actionIcons[a.action] || "📋"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{a.action}</span>{" "}
                        <span className="text-gray-500 dark:text-gray-400">{a.entity}</span>
                      </p>
                      {a.details && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.details}</p>}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(a.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
