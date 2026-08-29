"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });
    
    if (ref.current) {
      mermaid.run({ nodes: [ref.current] }).catch((e) => console.error(e));
    }
  }, [children]);

  return (
    <div className="flex justify-center my-10 overflow-x-auto w-full max-w-full" ref={ref}>
      {children}
    </div>
  );
}
