"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FluidMesh = dynamic(() => import("./FluidMesh"), { ssr: false });

/**
 * Mounts the fluid-mesh canvas only after first paint (guardrail 2, §6) —
 * scheduled via requestIdleCallback so it never competes with initial
 * content render or LCP.
 */
export default function FluidMeshBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 200);
    const cancel =
      "cancelIdleCallback" in window ? window.cancelIdleCallback : clearTimeout;

    const handle = idle(() => setReady(true));
    return () => cancel(handle as never);
  }, []);

  if (!ready) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--surface-50)]"
      />
    );
  }

  return <FluidMesh />;
}
