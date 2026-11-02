"use client";

import { useEffect, useRef } from "react";

// Background-only colors: foreground and glass-material tokens stay unchanged.
const FIELDS = [
  { x: 0.12, y: 0.18, rx: 0.88, ry: 0.78, color: "--background-blue", alpha: 0.32, period: 66, phase: 0 },
  { x: 0.88, y: 0.48, rx: 0.86, ry: 0.94, color: "--background-teal", alpha: 0.3, period: 78, phase: 2.1 },
  { x: 0.3, y: 0.96, rx: 0.95, ry: 0.76, color: "--background-blue", alpha: 0.2, period: 90, phase: 4.2 },
];

export default function FluidMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const base = rootStyle.getPropertyValue("--background-pearl").trim() || "#fbfcfe";
    const fields = FIELDS.map(field => {
      const hex = rootStyle.getPropertyValue(field.color).trim().slice(1);
      const rgb = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
      return { ...field, rgb: rgb.join(",") };
    });

    // A fixed, seeded tile breaks up quantization contours without sparkling.
    // Generate once; no per-pixel work or random changes during animation.
    const tile = document.createElement("canvas");
    tile.width = tile.height = 256;
    const tileCtx = tile.getContext("2d");
    let noise: CanvasPattern | null = null;
    if (tileCtx) {
      const pixels = tileCtx.createImageData(256, 256);
      let seed = 1729;
      for (let i = 0; i < pixels.data.length; i += 4) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const value = seed >>> 24;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
        pixels.data[i + 3] = 255;
      }
      tileCtx.putImageData(pixels, 0, 0);
      noise = ctx.createPattern(tile, "repeat");
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let densityQuery: MediaQueryList;
    let width = 0;
    let height = 0;
    let scale = 1;
    let elapsed = 0;
    let previousTime: number | null = null;
    let lastPaint = 0;
    let frame = 0;
    let disposed = false;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);
      for (const field of fields) {
        const phase = (elapsed / 1000) * (2 * Math.PI / field.period) + field.phase;
        const x = width * (field.x + Math.sin(phase) * 0.025);
        const y = height * (field.y + Math.cos(phase) * 0.025);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(width * field.rx, height * field.ry);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        // Smooth falloff with a gentle center and no abrupt outer boundary.
        for (const [stop, opacity] of [[0, 1], [0.2, 0.9], [0.45, 0.58], [0.7, 0.23], [0.9, 0.035], [1, 0]]) {
          gradient.addColorStop(stop, `rgba(${field.rgb},${field.alpha * opacity})`);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
      }
      if (noise) {
        // Paint in backing pixels, never moving/scaling the noise with a field.
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 0.012;
        ctx.fillStyle = noise;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
    }

    function resize() {
      if (!canvas || disposed) return;
      width = window.innerWidth;
      height = window.innerHeight;
      // Bound the backing store to ~4K pixels, even on Retina ultrawide screens.
      scale = Math.min(2, window.devicePixelRatio || 1, Math.sqrt(8_294_400 / (width * height)));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      // Setting canvas dimensions clears it; repaint synchronously even when paused.
      draw();
    }

    function tick(now: number) {
      frame = 0;
      if (disposed || document.hidden || motionQuery.matches) return;
      if (previousTime !== null) elapsed += now - previousTime;
      previousTime = now;
      // This very slow drift needs only 30 paints/sec, independent of refresh rate.
      if (now - lastPaint >= 1000 / 30) {
        draw();
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = null;
      // Freeze the current composition rather than jumping to another phase.
      draw();
      if (!document.hidden && !motionQuery.matches) frame = requestAnimationFrame(tick);
    }

    function watchDensity() {
      densityQuery?.removeEventListener("change", onDensityChange);
      densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      densityQuery.addEventListener("change", onDensityChange);
    }
    function onDensityChange() {
      resize();
      watchDensity();
    }

    resize();
    watchDensity();
    syncMotion();
    window.addEventListener("resize", resize);
    motionQuery.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", syncMotion);
      densityQuery.removeEventListener("change", onDensityChange);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, []);

  return <canvas ref={canvasRef} data-fluid-background aria-hidden data-ai-exclude className="pointer-events-none absolute inset-0 h-full w-full" />;
}
