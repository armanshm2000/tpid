export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-yellow-600 bg-yellow-50";
  if (score >= 40) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    COMPLETED: "text-green-700 bg-green-100",
    IN_PROGRESS: "text-blue-700 bg-blue-100",
    TESTING: "text-purple-700 bg-purple-100",
    DEVELOPMENT: "text-indigo-700 bg-indigo-100",
    PLANNING: "text-gray-700 bg-gray-100",
    ARCHITECTURE: "text-cyan-700 bg-cyan-100",
    PENDING: "text-gray-700 bg-gray-100",
    ACTIVE: "text-green-700 bg-green-100",
    DRAFT: "text-gray-700 bg-gray-100",
    OPEN: "text-orange-700 bg-orange-100",
    MITIGATED: "text-green-700 bg-green-100",
    RESOLVED: "text-green-700 bg-green-100",
  };
  return map[status] || "text-gray-700 bg-gray-100";
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    CRITICAL: "text-red-700 bg-red-100",
    HIGH: "text-orange-700 bg-orange-100",
    MEDIUM: "text-yellow-700 bg-yellow-100",
    LOW: "text-gray-700 bg-gray-100",
  };
  return map[priority] || "text-gray-700 bg-gray-100";
}

export function getSeverityColor(severity: string): string {
  return getPriorityColor(severity);
}

export function getHealthStatus(status: string): string {
  const map: Record<string, string> = {
    HEALTHY: "text-green-700 bg-green-100",
    WARNING: "text-yellow-700 bg-yellow-100",
    CRITICAL: "text-red-700 bg-red-100",
    UNKNOWN: "text-gray-700 bg-gray-100",
  };
  return map[status] || "text-gray-700 bg-gray-100";
}

export function getCategoryLabel(cat: string): string {
  return cat.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "…" : str;
}
