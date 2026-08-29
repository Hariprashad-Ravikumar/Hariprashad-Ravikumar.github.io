import MetricTile from "@/components/ui/MetricTile";
import { METRICS } from "@/content/metrics";

export default function MetricStrip() {
  return (
    <section className="grid grid-cols-2 gap-8 border-y border-[var(--glass-border)] py-8 sm:grid-cols-4">
      <MetricTile value={METRICS.engineers.value} label={METRICS.engineers.label} />
      <MetricTile value={METRICS.speedup.value} label={METRICS.speedup.label} />
      <MetricTile value={METRICS.computeHours.value} label={METRICS.computeHours.label} />
      <MetricTile
        value={METRICS.observables.value}
        label={`observables at ${METRICS.accuracy.value} accuracy`}
      />
    </section>
  );
}
