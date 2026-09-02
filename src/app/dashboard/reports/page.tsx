"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { cn, formatDate } from "@/lib/utils";

interface Report { id: string; title: string; summary: string; score: number | null; strengths: string | null; risks: string | null; recommendations: string | null; author?: { name: string | null }; createdAt: string; project?: { name: string; slug: string } }

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(async (projects: { id: string; slug: string; name: string }[]) => {
      const all: Report[] = [];
      for (const p of projects) {
        try {
          const res = await fetch(`/api/projects/${p.slug}/reports`);
          const data = await res.json();
          all.push(...data.map((r: Report) => ({ ...r, project: { name: p.name, slug: p.slug } })));
        } catch {}
      }
      setReports(all);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const avgScore = reports.length ? Math.round(reports.reduce((s, r) => s + (r.score || 0), 0) / reports.length) : 0;

  return (
    <>
      <Header title="AI Reports" />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p><p className="text-xs text-gray-500 dark:text-gray-400">Total Reports</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-brand-600">{avgScore}%</p><p className="text-xs text-gray-500 dark:text-gray-400">Average Score</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-green-600">{reports.filter((r) => (r.score || 0) >= 70).length}</p><p className="text-xs text-gray-500 dark:text-gray-400">Above 70%</p></div>
        </div>

        {loading ? <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div> : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{r.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <Link href={`/dashboard/projects/${r.project?.slug}`} className="text-brand-600 hover:text-brand-700">{r.project?.name}</Link>
                      {` • `}{r.author?.name || "Unknown"} • {formatDate(r.createdAt)}
                    </p>
                  </div>
                  {r.score !== null && (
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold", r.score >= 80 ? "bg-green-100 text-green-700" : r.score >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}>{r.score}</div>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{r.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {r.strengths && <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3"><p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Strengths</p><p className="text-xs text-green-600 dark:text-green-300">{r.strengths}</p></div>}
                  {r.risks && <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3"><p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">Risks</p><p className="text-xs text-orange-600 dark:text-orange-300">{r.risks}</p></div>}
                  {r.recommendations && <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"><p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Recommendations</p><p className="text-xs text-blue-600 dark:text-blue-300">{r.recommendations}</p></div>}
                </div>
              </div>
            ))}
            {reports.length === 0 && <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No reports found</div>}
          </div>
        )}
      </div>
    </>
  );
}
