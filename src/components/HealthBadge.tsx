"use client";

import { getHealthColor } from "@/lib/utils";

export function HealthBadge({ score }: { score: number }) {
  return (
    <span className={`badge ${getHealthColor(score)}`}>
      {score >= 80 ? "●" : score >= 60 ? "●" : score >= 40 ? "●" : "●"} {score}%
    </span>
  );
}
