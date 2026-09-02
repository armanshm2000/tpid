"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

interface Contract { id: string; name: string; type: string; status: string; verified: boolean; version: string; description: string | null; projectId: string; project?: { name: string; slug: string } }

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(async (projects: { id: string; slug: string; name: string }[]) => {
      const all: Contract[] = [];
      for (const p of projects) {
        try {
          const res = await fetch(`/api/projects/${p.slug}/contracts`);
          const data = await res.json();
          all.push(...data.map((c: Contract) => ({ ...c, project: { name: p.name, slug: p.slug } })));
        } catch {}
      }
      setContracts(all);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const verified = contracts.filter((c) => c.verified).length;

  return (
    <>
      <Header title="Contracts" />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-gray-900 dark:text-white">{contracts.length}</p><p className="text-xs text-gray-500 dark:text-gray-400">Total</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-green-600">{verified}</p><p className="text-xs text-gray-500 dark:text-gray-400">Verified</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-orange-600">{contracts.length - verified}</p><p className="text-xs text-gray-500 dark:text-gray-400">Pending</p></div>
        </div>
        {loading ? <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div> : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="table-header">Contract</th>
                  <th className="table-header">Project</th>
                  <th className="table-header hidden sm:table-cell">Type</th>
                  <th className="table-header hidden md:table-cell">Version</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="table-cell"><p className="font-medium">{c.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{c.description}</p></td>
                    <td className="table-cell"><Link href={`/dashboard/projects/${c.project?.slug}`} className="text-brand-600 hover:text-brand-700 text-sm">{c.project?.name || "—"}</Link></td>
                    <td className="table-cell hidden sm:table-cell"><span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{c.type}</span></td>
                    <td className="table-cell hidden md:table-cell">{c.version}</td>
                    <td className="table-cell"><StatusBadge status={c.status} /></td>
                    <td className="table-cell">{c.verified ? <span className="badge bg-green-100 text-green-700">✓</span> : <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-500">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contracts.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400">No contracts found</div>}
          </div>
        )}
      </div>
    </>
  );
}
