import Container from "@/components/layout/Container";

export default function TalksPage() {
  return (
    <Container>
      <div className="py-24">
        <h1 className="text-h1 text-[var(--ink-900)]">Talks</h1>
        <p className="text-body prose-measure mt-4 text-[var(--ink-500)]">
          Talks list lands in Phase 4 (§10.7).
        </p>
      </div>
    </Container>
  );
}
