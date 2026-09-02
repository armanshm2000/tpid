"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { formatDate } from "@/lib/utils";

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/audit?page=${page}&limit=20`)
      .then(async (r) => {
        if (r.status === 403) {
          setError("You don't have permission to view audit logs.");
          return [];
        }
        return r.json();
      })
      .then((data) => {
        if (data.logs) {
          setLogs(data.logs);
          setTotalPages(data.totalPages);
          setTotal(data.total);
        }
      })
      .catch(() => setError("Failed to load audit logs."))
      .finally(() => setLoading(false));
  }, [page]);

  const actionColor = (action: string) => {
    if (action.includes("create") || action.includes("CREATE")) return "text-green-600 bg-green-50 dark:bg-green-900/20";
    if (action.includes("update") || action.includes("UPDATE")) return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
    if (action.includes("delete") || action.includes("DELETE")) return "text-red-600 bg-red-50 dark:bg-red-900/20";
    return "text-gray-600 bg-gray-50 dark:bg-gray-800";
  };

  return (
    <>
      <Header title="Audit Log" />
      <div className="p-8 space-y-6">
        <div className="card p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing page {page} of {totalPages} • {total} total entries</p>
        </div>

        {loading ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div>
        ) : error ? (
          <div className="card p-8 text-center text-red-500">{error}</div>
        ) : logs.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No audit entries yet</div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="table-header">Date</th>
                    <th className="table-header">User</th>
                    <th className="table-header">Action</th>
                    <th className="table-header">Entity</th>
                    <th className="table-header hidden md:table-cell">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="table-cell whitespace-nowrap">{formatDate(log.createdAt)}</td>
                      <td className="table-cell text-xs">{log.userId.slice(0, 8)}…</td>
                      <td className="table-cell">
                        <span className={`badge text-xs ${actionColor(log.action)}`}>{log.action}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-xs font-medium">{log.entity}</span>
                        {log.entityId && <span className="text-xs text-gray-400 ml-1">({log.entityId.slice(0, 6)}…)</span>}
                      </td>
                      <td className="table-cell hidden md:table-cell text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{log.details || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">← Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">Next →</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
