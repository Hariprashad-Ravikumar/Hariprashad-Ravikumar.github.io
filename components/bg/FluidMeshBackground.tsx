"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FluidMesh = dynamic(() => import("./FluidMesh"), { ssr: false });

/**
 * Mounts the fluid-mesh canvas only after first paint (guardrail 2, §6) —
 * scheduled via requestIdleCallback so it never competes with initial
 * content render or LCP. Cross-fades in rather than popping in place of the
 * flat placeholder, so the swap itself doesn't read as a visual glitch.
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

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--surface-50)] transition-opacity duration-300"
        style={{ opacity: ready ? 0 : 1 }}
      />
      {ready && (
        <div className="fixed inset-0 -z-10 animate-[fluid-mesh-fade-in_300ms_ease-out]">
          <FluidMesh />
        </div>
      )}
    </>
  );
}
