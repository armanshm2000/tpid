/**
 * Simple Prometheus-style metrics collector.
 * Exposes /metrics endpoint for Prometheus scraping.
 */

interface MetricEntry {
  name: string;
  help: string;
  type: "counter" | "gauge" | "histogram";
  values: Map<string, number>;
}

class MetricsCollector {
  private metrics = new Map<string, MetricEntry>();

  private getOrCreate(name: string, help: string, type: MetricEntry["type"]): MetricEntry {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { name, help, type, values: new Map() });
    }
    return this.metrics.get(name)!;
  }

  inc(name: string, help: string, labels: Record<string, string> = {}, value = 1) {
    const metric = this.getOrCreate(name, help, "counter");
    const key = Object.entries(labels).sort().map(([k, v]) => `${k}="${v}"`).join(",");
    const current = metric.values.get(key) || 0;
    metric.values.set(key, current + value);
  }

  gauge(name: string, help: string, value: number, labels: Record<string, string> = {}): void {
    const metric = this.getOrCreate(name, help, "gauge");
    const key = Object.entries(labels).sort().map(([k, v]) => `${k}="${v}"`).join(",") || "";
    metric.values.set(key, value);
  }

  render(): string {
    const lines: string[] = [];
    for (const metric of this.metrics.values()) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);
      for (const [labels, value] of metric.values) {
        const labelStr = labels ? `{${labels}}` : "";
        lines.push(`${metric.name}${labelStr} ${value}`);
      }
    }
    return lines.join("\n") + "\n";
  }
}

// Singleton
export const metrics = new MetricsCollector();

// Auto-collect basic metrics
let startTime = Date.now();

export function collectBasicMetrics() {
  metrics.gauge("tpid_uptime_seconds", "Process uptime", Math.floor((Date.now() - startTime) / 1000));
  metrics.gauge("tpid_memory_usage_bytes", "Heap memory used", process.memoryUsage().heapUsed);
  metrics.gauge("tpid_memory_total_bytes", "Heap memory total", process.memoryUsage().heapTotal);
}
