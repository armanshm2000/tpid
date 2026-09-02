"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { getHealthStatus } from "@/lib/utils";

interface Component { id: string; name: string; type: string; technology: string; health: string; description: string | null; project?: { name: string; slug: string } }

export default function ArchitecturePage() {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(async (projects: { id: string; slug: string; name: string }[]) => {
      const all: Component[] = [];
      for (const p of projects) {
        try {
          const res = await fetch(`/api/projects/${p.slug}/architecture`);
          const data = await res.json();
          all.push(...data.map((c: Component) => ({ ...c, project: { name: p.name, slug: p.slug } })));
        } catch {}
      }
      setComponents(all);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const healthy = components.filter((c) => c.health === "HEALTHY").length;
  const warning = components.filter((c) => c.health === "WARNING").length;

  const types = Array.from(new Set(components.map((c) => c.type)));

  return (
    <>
      <Header title="Architecture" />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-gray-900 dark:text-white">{components.length}</p><p className="text-xs text-gray-500 dark:text-gray-400">Total</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-green-600">{healthy}</p><p className="text-xs text-gray-500 dark:text-gray-400">Healthy</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{warning}</p><p className="text-xs text-gray-500 dark:text-gray-400">Warning</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-gray-600">{types.length}</p><p className="text-xs text-gray-500 dark:text-gray-400">Types</p></div>
        </div>

        {loading ? <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div> : (
          <div className="space-y-4">
            {types.map((type) => {
              const items = components.filter((c) => c.type === type);
              return (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">{type}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((c) => (
                      <div key={c.id} className="card p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{c.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{c.technology}</p>
                          </div>
                          <span className={`badge ${getHealthStatus(c.health)}`}>{c.health}</span>
                        </div>
                        {c.description && <p className="text-xs text-gray-600 dark:text-gray-400">{c.description}</p>}
                        <Link href={`/dashboard/projects/${c.project?.slug}`} className="text-xs text-brand-600 hover:text-brand-700 mt-2 inline-block">{c.project?.name}</Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {components.length === 0 && <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No components found</div>}
          </div>
        )}
      </div>
    </>
  );
}
