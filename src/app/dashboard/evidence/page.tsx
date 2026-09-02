"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { cn, formatDate } from "@/lib/utils";

interface Evidence { id: string; title: string; type: string; verified: boolean; description: string | null; fileUrl: string | null; author?: { name: string | null }; createdAt: string; project?: { name: string; slug: string; id: string } }

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(async (allProjects: { id: string; slug: string; name: string }[]) => {
      setProjects(allProjects);
      const all: Evidence[] = [];
      for (const p of allProjects) {
        try {
          const res = await fetch(`/api/projects/${p.slug}/evidence`);
          const data = await res.json();
          all.push(...data.map((e: Evidence) => ({ ...e, project: { name: p.name, slug: p.slug, id: p.id } })));
        } catch {}
      }
      setEvidence(all);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const verified = evidence.filter((e) => e.verified).length;

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !selectedProject) {
      setUploadErr("Select a project and file.");
      return;
    }

    setUploading(true);
    setUploadMsg("");
    setUploadErr("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", selectedProject);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadMsg(`Uploaded: ${data.filename}`);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setUploadErr(data.error || "Upload failed");
      }
    } catch {
      setUploadErr("Upload failed");
    }
    setUploading(false);
  }

  return (
    <>
      <Header title="Evidence" />
      <div className="p-8 space-y-6">
        {/* Upload Section */}
        <section className="card p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Upload Evidence File</h3>
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Project</label>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="input">
                <option value="">Select project…</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">File</label>
              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.csv,.json,.zip" className="input text-sm" />
            </div>
            <button type="submit" disabled={uploading} className="btn-primary">
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </form>
          {uploadMsg && <p className="text-sm text-green-600 mt-2">{uploadMsg}</p>}
          {uploadErr && <p className="text-sm text-red-600 mt-2">{uploadErr}</p>}
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-gray-900 dark:text-white">{evidence.length}</p><p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-green-600">{verified}</p><p className="text-xs text-gray-500 dark:text-gray-400">Verified</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold text-gray-600">{evidence.length - verified}</p><p className="text-xs text-gray-500 dark:text-gray-400">Pending</p></div>
        </div>

        {/* List */}
        {loading ? <div className="card p-8 text-center text-gray-500 dark:text-gray-400">Loading…</div> : (
          <div className="space-y-3">
            {evidence.map((e) => (
              <div key={e.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm", e.verified ? "bg-green-100 text-green-700" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400")}>{e.verified ? "✓" : "○"}</div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">{e.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{e.description} • by {e.author?.name || "Unknown"} • {formatDate(e.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {e.fileUrl && <a href={e.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:text-brand-700">📎 File</a>}
                  <Link href={`/dashboard/projects/${e.project?.slug}`} className="text-xs text-brand-600 hover:text-brand-700">{e.project?.name}</Link>
                  <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{e.type.replace(/_/g, " ")}</span>
                </div>
              </div>
            ))}
            {evidence.length === 0 && <div className="card p-8 text-center text-gray-500 dark:text-gray-400">No evidence found</div>}
          </div>
        )}
      </div>
    </>
  );
}
