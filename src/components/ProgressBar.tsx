"use client";

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const color = value >= 80 ? "bg-green-500" : value >= 50 ? "bg-blue-500" : value >= 25 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{value}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
