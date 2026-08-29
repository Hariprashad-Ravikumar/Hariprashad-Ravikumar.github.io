"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  accent: boolean;
};

const MAX_NODES_DESKTOP = 90;
const MAX_NODES_MOBILE = 45;
const MOBILE_BREAKPOINT = 768;
const REPEL_RADIUS = 120;
const LINK_DISTANCE = 140;
const FRAME_BUDGET_MS = 2;

function nodeCountFor(w: number, h: number) {
  const cap = w < MOBILE_BREAKPOINT ? MAX_NODES_MOBILE : MAX_NODES_DESKTOP;
  return Math.min(cap, Math.floor((w * h) / 16000));
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

function rgba([r, g, b]: [number, number, number], alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeNodes(count: number, w: number, h: number): Node[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    accent: Math.random() < 0.15,
  }));
}

export default function LatticeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = prefersReducedMotion();

    // Canvas fillStyle/strokeStyle can't resolve var()/color-mix() — they only
    // work inside the DOM style cascade. Resolve the actual hex once instead.
    const rootStyle = getComputedStyle(document.documentElement);
    const auroraRgb = hexToRgb(rootStyle.getPropertyValue("--aurora-1") || "#7dd3d8");
    const nodeRgb = hexToRgb(rootStyle.getPropertyValue("--aurora-2") || "#a5b4fc");
    const accentRgb = hexToRgb(rootStyle.getPropertyValue("--accent-500") || "#00c2b2");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let nodes = makeNodes(nodeCountFor(width, height), width, height);

    const cursor = { x: -9999, y: -9999 };
    let rafId = 0;
    let running = true;
    let overBudgetStreak = 0;

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
      nodes = makeNodes(nodeCountFor(width, height), width, height);
    }
    resize();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };
    window.addEventListener("resize", onResize);

    const onPointerMove = (e: PointerEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    if (!coarsePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Guardrail 4: parallax via transform only, no layout properties.
    const onScroll = () => {
      canvas.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    function drawFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!reducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          const dx = n.x - cursor.x;
          const dy = n.y - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 0.6;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }
      }

      // Links first (under the nodes).
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.22;
            ctx.strokeStyle = rgba(auroraRgb, alpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.accent ? rgba(accentRgb, 0.7) : rgba(nodeRgb, 0.55);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.accent ? 2.2 : 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Guardrail 3: reduced motion renders one static frame, no loop.
    if (reducedMotion) {
      drawFrame();
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        if (!coarsePointer) window.removeEventListener("pointermove", onPointerMove);
      };
    }

    function loop() {
      if (!running) return;
      const start = performance.now();
      drawFrame();
      const elapsed = performance.now() - start;

      // Guardrail 5: if scripting exceeds budget twice in a row, cut node count 30%.
      if (elapsed > FRAME_BUDGET_MS) {
        overBudgetStreak += 1;
        if (overBudgetStreak >= 2 && nodes.length > 10) {
          nodes = nodes.slice(0, Math.ceil(nodes.length * 0.7));
          overBudgetStreak = 0;
        }
      } else {
        overBudgetStreak = 0;
      }

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    // Guardrail 1: pause when tab hidden or canvas off-screen.
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
