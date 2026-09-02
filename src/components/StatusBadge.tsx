"use client";

import { getStatusColor } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${getStatusColor(status)}`}>{status.replace(/_/g, " ")}</span>;
}
