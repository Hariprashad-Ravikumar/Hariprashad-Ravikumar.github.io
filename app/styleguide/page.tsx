import Container from "@/components/layout/Container";
import { Button, LinkButton } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Chip from "@/components/ui/Chip";
import Tag from "@/components/ui/Tag";
import MetricTile from "@/components/ui/MetricTile";
import ProjectCover from "@/components/media/ProjectCover";
import FigureCluster from "@/components/media/FigureCluster";

// TEMPORARY — delete before Phase 6 cutover (§14, Phase 2).
export default function StyleguidePage() {
  return (
    <Container>
      <div className="flex flex-col gap-16 py-16">
        <section>
          <p className="text-eyebrow text-[var(--accent-700)]">Styleguide</p>
          <h1 className="text-display mt-2">Component review</h1>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Type scale</h2>
          <div className="flex flex-col gap-2">
            <p className="text-display">Display</p>
            <p className="text-h1">Heading 1</p>
            <p className="text-h2">Heading 2</p>
            <p className="text-h3">Heading 3</p>
            <p className="text-body">Body text, left-aligned, never justified.</p>
            <p className="text-small">Small / caption text.</p>
            <p className="text-mono-metric">30+</p>
            <p className="text-eyebrow">Eyebrow label</p>
          </div>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost →</Button>
            <LinkButton href="#" variant="primary">
              Link button
            </LinkButton>
          </div>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Chips / Tags</h2>
          <div className="flex flex-wrap gap-2">
            <Chip>● Graduating December 2026</Chip>
            <Tag>Python</Tag>
            <Tag>CUDA</Tag>
          </div>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Cards</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>Plain card content.</Card>
            <SpotlightCard className="p-6">
              Hover me — spotlight + lift.
            </SpotlightCard>
          </div>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Metric tiles</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <MetricTile value="30+" label="engineers using NIMBLE" />
            <MetricTile value="10×" label="faster simulation sweeps" />
            <MetricTile value="75,000+" label="CPU/GPU hours" />
            <MetricTile value="30,000+" label="observables" />
          </div>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Project cover — split mode</h2>
          <SpotlightCard className="max-w-md overflow-hidden">
            <ProjectCover
              mode="split"
              photo="/images/wd/simulator-demo"
              photoAlt="Demonstrating the NIMBLE HAMR DCSNR simulator to engineers"
              n="01 / PROJECT"
              title="NIMBLE"
              sub="HAMR DCSNR Simulator · Western Digital"
              tags={["Python", "Dash", "Plotly"]}
            />
          </SpotlightCard>
        </section>

        <section>
          <h2 className="text-h2 mb-4">Figure cluster (empty — renders nothing)</h2>
          <FigureCluster figures={[]} />
          <p className="text-small text-[var(--ink-500)]">
            ↑ nothing rendered above, as intended (§16.1).
          </p>
        </section>
      </div>
    </Container>
  );
}
