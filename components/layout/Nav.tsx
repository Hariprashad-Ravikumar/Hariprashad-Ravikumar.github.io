"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "./Container";

const LINKS = [
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/talks", label: "Talks" },
  { href: "/cv", label: "CV" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--surface-0)]/85 backdrop-blur-md border-b border-[var(--line)]"
          : "bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-tight text-[var(--brand-900)]"
          >
            Hariprashad Ravikumar
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-[var(--r-sm)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-50)] ${
                    pathname === link.href
                      ? "text-[var(--brand-900)]"
                      : "text-[var(--ink-500)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="ml-2 rounded-[var(--r-sm)] bg-[var(--brand-900)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Contact
              </Link>
            </li>
          </ul>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--r-sm)] md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`h-0.5 w-6 bg-[var(--ink-900)] transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-[var(--ink-900)] transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-[var(--ink-900)] transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </nav>
      </Container>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-[var(--surface-0)] md:hidden">
          <Container>
            <ul className="flex flex-col gap-2 py-8">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-[var(--r-sm)] px-3 py-3 text-lg font-medium text-[var(--ink-900)] hover:bg-[var(--surface-50)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="mt-2 block rounded-[var(--r-sm)] bg-[var(--brand-900)] px-3 py-3 text-center text-lg font-semibold text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
