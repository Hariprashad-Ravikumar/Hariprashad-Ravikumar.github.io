import Container from "@/components/layout/Container";
import TalkList from "@/components/content/TalkList";
import { TALKS } from "@/content/talks";
import { buildMetadata } from "@/lib/seo";

// §11 estimated 22; content/talks.ts documents why the real count is
// TALKS.length (the live site's two talk sections don't overlap).
export const metadata = buildMetadata({
  title: "Talks | Hariprashad Ravikumar",
  description: `${TALKS.length} research talks on conformal algebra, lattice QCD, quantum computing, and HAMR modeling.`,
  path: "/talks/",
});

export default function TalksPage() {
  return (
    <Container>
      <div className="py-16">
        <h1 className="text-h1 text-[var(--ink-900)]">Talks</h1>
        <div className="mt-8">
          <TalkList />
        </div>
      </div>
    </Container>
  );
}
