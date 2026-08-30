"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Blob = {
  baseX: number; // fraction of viewport width, 0-1
  baseY: number; // fraction of viewport height, 0-1
  radius: number; // fraction of viewport max dimension
  color: string; // CSS var name to resolve, e.g. "--aurora-1"
  alpha: number;
  driftAmp: number; // px
  driftFreq: number; // radians/sec
  phase: number;
  pull: number; // 0-1, how strongly it leans toward the pointer
};

const BLOBS: Array<Omit<Blob, "color"> & { colorVar: string }> = [
  { baseX: 0.18, baseY: 0.22, radius: 0.42, colorVar: "--aurora-1", alpha: 0.16, driftAmp: 70, driftFreq: (2 * Math.PI) / 26, phase: 0, pull: 0.05 },
  { baseX: 0.82, baseY: 0.18, radius: 0.38, colorVar: "--aurora-2", alpha: 0.15, driftAmp: 90, driftFreq: (2 * Math.PI) / 32, phase: 2.1, pull: 0.08 },
  { baseX: 0.28, baseY: 0.82, radius: 0.4, colorVar: "--brand-300", alpha: 0.12, driftAmp: 80, driftFreq: (2 * Math.PI) / 24, phase: 4.2, pull: 0.06 },
  { baseX: 0.78, baseY: 0.78, radius: 0.36, colorVar: "--aurora-3", alpha: 0.15, driftAmp: 60, driftFreq: (2 * Math.PI) / 30, phase: 1.3, pull: 0.09 },
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

export default function FluidMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = prefersReducedMotion();

    // Canvas gradient stops can't resolve var() — resolve actual hex once.
    const rootStyle = getComputedStyle(document.documentElement);
    const blobs: Blob[] = BLOBS.map(({ colorVar, ...b }) => {
      const hex = rootStyle.getPropertyValue(colorVar).trim() || "#a5b4fc";
      const [r, g, b2] = hexToRgb(hex);
      return { ...b, color: `${r}, ${g}, ${b2}` };
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    // Smoothed pointer target — lerped toward the raw pointer each frame so
    // the mesh leans, it doesn't snap (a gentle "nudge," not direct tracking).
    const pointer = { x: width / 2, y: height / 2 };
    const pointerTarget = { x: width / 2, y: height / 2 };
    let rafId = 0;
    let running = true;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!canvas) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };
    window.addEventListener("resize", onResize);

    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.x = e.clientX;
      pointerTarget.y = e.clientY;
    };
    if (!coarsePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Baked into the draw call (not a DOM transform) so the canvas element
    // itself always stays glued to inset:0 — a CSS transform on a
    // viewport-sized fixed canvas would slide it off-bounds and expose the
    // flat body background as a visible seam.
    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    function drawFrame(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      if (!reducedMotion) {
        pointer.x += (pointerTarget.x - pointer.x) * 0.02;
        pointer.y += (pointerTarget.y - pointer.y) * 0.02;
      }

      const maxDim = Math.max(width, height);
      for (const blob of blobs) {
        const baseX = blob.baseX * width;
        const baseY = blob.baseY * height;

        let cx = baseX;
        let cy = baseY;
        if (!reducedMotion) {
          const driftX = Math.sin(t * blob.driftFreq + blob.phase) * blob.driftAmp;
          const driftY = Math.cos(t * blob.driftFreq * 0.85 + blob.phase) * blob.driftAmp;
          const pullX = (pointer.x - baseX) * blob.pull;
          const pullY = (pointer.y - baseY) * blob.pull;
          cx = baseX + driftX + pullX;
          cy = baseY + driftY + pullY + scrollY * 0.06;
        }

        const radius = blob.radius * maxDim;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`);
        gradient.addColorStop(1, `rgba(${blob.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Reduced motion: one static frame, no rAF loop, no pointer response.
    if (reducedMotion) {
      drawFrame(0);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        if (!coarsePointer) window.removeEventListener("pointermove", onPointerMove);
      };
    }

    const start = performance.now();
    function loop(now: number) {
      if (!running) return;
      drawFrame((now - start) / 1000);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!running && !document.hidden) {
          running = true;
          rafId = requestAnimationFrame(loop);
        }
      } else {
        running = false;
        cancelAnimationFrame(rafId);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (!coarsePointer) window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
