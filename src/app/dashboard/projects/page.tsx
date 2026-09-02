"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { HealthBadge } from "@/components/HealthBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { getCategoryLabel, getPriorityColor, cn } from "@/lib/utils";

interface Project {
  id: string; name: string; slug: string; description: string | null; category: string; status: string;
  completionPercentage: number; priority: string; healthScore: number;
  owner?: { name: string | null; email: string } | null;
  _count?: { evidence: number; risks: number; contracts: number };
}

const filters = ["ALL", "COMPLETED", "DEVELOPMENT", "TESTING", "PLANNING", "ARCHITECTURE"] as const;
const PAGE_SIZE = 10;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setProjects).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [filter, search]);

  const filtered = projects.filter((p) => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Header title="Projects" />
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input max-w-sm" placeholder="Search projects…" />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex-wrap">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors", filter === f ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")}>{f === "ALL" ? "All" : f}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No projects found</div>
        ) : (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="table-header">Project</th>
                      <th className="table-header hidden sm:table-cell">Status</th>
                      <th className="table-header hidden md:table-cell">Priority</th>
                      <th className="table-header">Health</th>
                      <th className="table-header hidden lg:table-cell">Progress</th>
                      <th className="table-header hidden md:table-cell">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {paged.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="table-cell">
                          <Link href={`/dashboard/projects/${p.slug}`} className="font-medium text-brand-600 hover:text-brand-700">{p.name}</Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{getCategoryLabel(p.category)}</p>
                        </td>
                        <td className="table-cell hidden sm:table-cell"><StatusBadge status={p.status} /></td>
                        <td className="table-cell hidden md:table-cell"><span className={`badge ${getPriorityColor(p.priority)}`}>{p.priority}</span></td>
                        <td className="table-cell"><HealthBadge score={p.healthScore} /></td>
                        <td className="table-cell hidden lg:table-cell"><div className="w-32"><ProgressBar value={p.completionPercentage} /></div></td>
                        <td className="table-cell text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{p.owner?.name || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">← Prev</button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
