"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { HealthBadge } from "@/components/HealthBadge";

interface Results { projects: { id: string; name: string; slug: string; description: string | null; status: string; healthScore: number }[]; contracts: { id: string; name: string; type: string; projectId: string; status: string; description: string | null }[]; evidence: { id: string; title: string; type: string; description: string | null }[]; risks: { id: string; title: string; severity: string; status: string; description: string | null }[] }

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query.trim())}`).then((r) => r.json()).then(setResults).catch(() => setResults(null)).finally(() => setLoading(false));
  }

  const total = results ? results.projects.length + results.contracts.length + results.evidence.length + results.risks.length : 0;

  return (
    <>
      <Header title="Search" />
      <div className="p-8 space-y-6">
        <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="input flex-1" placeholder="Search projects, contracts, evidence, risks…" />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "…" : "Search"}</button>
        </form>

        {results && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{total} result{total !== 1 ? "s" : ""} found</p>

            {results.projects.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Projects ({results.projects.length})</h3>
                <div className="space-y-2">
                  {results.projects.map((p) => (
                    <Link key={p.id} href={`/dashboard/projects/${p.slug}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div><h4 className="font-medium text-gray-900 dark:text-white">{p.name}</h4><p className="text-xs text-gray-500 dark:text-gray-400">{p.description}</p></div>
                      <div className="flex items-center gap-2"><StatusBadge status={p.status} /><HealthBadge score={p.healthScore} /></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.contracts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contracts ({results.contracts.length})</h3>
                <div className="space-y-2">
                  {results.contracts.map((c) => (
                    <div key={c.id} className="card p-4 flex items-center justify-between">
                      <div><h4 className="font-medium text-gray-900 dark:text-white">{c.name}</h4><p className="text-xs text-gray-500 dark:text-gray-400">{c.description}</p></div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.evidence.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Evidence ({results.evidence.length})</h3>
                <div className="space-y-2">
                  {results.evidence.map((e) => (
                    <div key={e.id} className="card p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">{e.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{e.description}</p>
                      <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mt-1">{e.type.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.risks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Risks ({results.risks.length})</h3>
                <div className="space-y-2">
                  {results.risks.map((r) => (
                    <div key={r.id} className="card p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">{r.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.description}</p>
                      <span className={`badge mt-1 ${r.severity === "CRITICAL" ? "bg-red-100 text-red-700" : r.severity === "HIGH" ? "bg-orange-100 text-orange-700" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>{r.severity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {total === 0 && <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No results found for &quot;{query}&quot;</div>}
          </div>
        )}
      </div>
    </>
  );
}
