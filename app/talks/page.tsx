import Container from "@/components/layout/Container";
import TalkList from "@/components/content/TalkList";

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
