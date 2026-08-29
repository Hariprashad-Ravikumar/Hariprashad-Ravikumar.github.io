import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <Container>
      <div className="py-24">
        <h1 className="text-display text-[var(--ink-900)]">
          Hariprashad Ravikumar
        </h1>
        <p className="text-body prose-measure mt-4 text-[var(--ink-500)]">
          Home page content lands in Phase 4 (§10.2).
        </p>
      </div>
    </Container>
  );
}
