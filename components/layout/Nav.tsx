"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import Container from "./Container";
import Picture from "@/components/ui/Picture";
import { springDefault, springPress } from "@/lib/springs";
import { useSpotlight } from "@/lib/useSpotlight";

const LINKS = [
  { href: "/projects/wd-internship-2026", label: "Work Experience" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/talks", label: "Talks" },
  { href: "/resume", label: "Résumé" },
  { href: "/contact", label: "Contact" },
];

// Scroll distance (px) over which the nav ramps from transparent to full
// chrome material — a continuous interpolation, not a hard step.
const SCROLL_RAMP = 80;

const MotionLink = motion.create(Link);

/** A glass-tinted nav link — always has its own tint+border so it stays
 * legible regardless of what's behind Nav's own (near-transparent) chrome.
 * Hover deepens the tint and shifts the border to the accent hue, with the
 * existing pointer-driven spotlight glow layered on top; the active page
 * gets a brand-tinted border instead. */
function NavPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  const ref = useSpotlight<HTMLAnchorElement>();
  return (
    <MotionLink
      ref={ref}
      href={href}
      aria-current={active ? "page" : undefined}
      whileTap={{ scale: 0.96 }}
      transition={springPress}
      className={`nav-pill material-trim spotlight text-vibrant inline-block rounded-[var(--r-sm)] px-3 py-2 text-sm transition-colors ${
        active ? "text-[var(--brand-900)]" : "text-[var(--ink-500)]"
      }`}
    >
      {label}
    </MotionLink>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, [0, SCROLL_RAMP], [0, 1], { clamp: true });
  const progress = useSpring(rawProgress, springDefault);

  const backdropBlur = useTransform(progress, (v) => `blur(${v * 40}px) saturate(180%)`);
  const backgroundOpacity = useTransform(progress, [0, 1], [0, 0.05]);
  const borderOpacity = useTransform(progress, [0, 1], [0, 0.55]);
  const shadowOpacity = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className="material-chrome sticky top-0 z-50 border-t-0"
      style={{
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        backgroundColor: useTransform(backgroundOpacity, (o) => `rgba(255,255,255,${o})`),
        borderBottom: useTransform(borderOpacity, (o) => `1px solid rgba(255,255,255,${o})`),
        boxShadow: useTransform(shadowOpacity, (o) =>
          o > 0.05 ? "var(--glass-chrome-shadow)" : "none",
        ),
      }}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <div className="relative h-14 w-14 shrink-0">
            <span className="avatar-ring absolute inset-0 rounded-full" aria-hidden="true" />
            <MotionLink
              href="/"
              aria-label="Home"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={springPress}
              className="material-trim absolute inset-[3px] block overflow-hidden rounded-full shadow-[var(--shadow-sm)]"
            >
              <Picture
                src="/images/hero/headshot"
                alt="Hariprashad Ravikumar — Home"
                width={96}
                height={96}
                sizes="56px"
                className="h-full w-full object-cover"
              />
            </MotionLink>
          </div>

          <ul className="hidden items-center gap-1.5 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <NavPill href={link.href} label={link.label} active={pathname === link.href} />
              </li>
            ))}
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
                className={`h-0.5 w-6 bg-[var(--ink-900)] transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-[var(--ink-900)] transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-[var(--ink-900)] transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, scale: 0.98, backdropFilter: "blur(0px) saturate(100%)" }}
            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(40px) saturate(180%)" }}
            exit={{ opacity: 0, scale: 0.98, backdropFilter: "blur(0px) saturate(100%)" }}
            transition={springDefault}
            style={{ transformOrigin: "top", WebkitBackdropFilter: "blur(40px) saturate(180%)" }}
            className="material-chrome fixed inset-0 top-16 z-40 bg-[var(--glass-chrome-bg)] md:hidden"
          >
            <Container>
              <ul className="flex flex-col gap-2 py-6">
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
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
