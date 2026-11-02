"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FluidMesh = dynamic(() => import("./FluidMesh"), { ssr: false });

/**
 * Defer canvas initialization until idle, then fade it over a permanent pearl
 * base. The base remains visible if Canvas 2D or the dynamic import is unavailable.
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
    <div aria-hidden data-ai-exclude className="pointer-events-none fixed inset-0 -z-10 bg-[var(--background-pearl)]">
      {ready && (
        <div className="absolute inset-0 motion-safe:animate-[fluid-mesh-fade-in_300ms_ease-out]">
          <FluidMesh />
        </div>
      )}
    </div>
  );
}
