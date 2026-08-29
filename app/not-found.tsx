import Link from "next/link";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container>
      <div className="py-24 text-center">
        <p className="text-eyebrow text-[var(--accent-500)]">404</p>
        <h1 className="text-h1 mt-2 text-[var(--ink-900)]">
          This page drifted off the lattice.
        </h1>
        <nav className="mt-8 flex justify-center gap-4 text-sm font-medium text-[var(--brand-500)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <Link href="/publications" className="hover:underline">
            Publications
          </Link>
          <Link href="/cv" className="hover:underline">
            CV
          </Link>
        </nav>
      </div>
    </Container>
  );
}
