import type { ReactNode } from "react";

// Framer Motion fade/rise wiring lands in Phase 2 (§8). Pass-through for now
// so route stubs render correctly during scaffolding.
export default function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
