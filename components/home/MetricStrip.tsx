import MetricTile from "@/components/ui/MetricTile";
import { METRICS } from "@/content/metrics";

export default function MetricStrip() {
  return (
    <section className="grid grid-cols-2 gap-8 border-b border-[var(--glass-border)] py-4 sm:grid-cols-4">
      <MetricTile value={METRICS.engineers.value} label={METRICS.engineers.label} />
      <MetricTile
        value={METRICS.accuracy.value}
        label="predictive accuracy with symbolic regression machine learning"
      />
      <MetricTile value={METRICS.computeHours.value} label={METRICS.computeHours.label} />
      <MetricTile value={METRICS.observables.value} label={METRICS.observables.label} />
    </section>
  );
}
