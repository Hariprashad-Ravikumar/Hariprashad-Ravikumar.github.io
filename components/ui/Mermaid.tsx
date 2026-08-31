"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { prefersReducedMotion } from "@/lib/motion";
import { ICONS, type IconKey } from "@/components/ui/brand-icons";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Node key (as used in the graph text) -> icon to badge it with. */
const NODE_ICONS: Record<string, IconKey> = {
  M: "user",
  IDB: "indexeddb",
  Dash: "plotly",
  Engine: "python",
  Plotly: "plotly",
  K8s: "kubernetes",
  Jenkins: "jenkins",
};

/** Every edge already drawn in the diagram, as [source, target] node keys. */
const EDGES: Array<[string, string]> = [
  ["A", "IDB"],
  ["IDB", "Dash"],
  ["Dash", "Fit"],
  ["U", "Fit"],
  ["Fit", "UI"],
  ["M", "UI"],
  ["UI", "Engine"],
  ["Engine", "Parallel"],
  ["Parallel", "Plotly"],
  ["Plotly", "Export"],
  ["Jenkins", "K8s"],
  ["K8s", "Backend"],
  ["K8s", "ClientSide"],
];

function appendIconBadge(g: SVGGElement, iconKey: IconKey, x: number, y: number) {
  const icon = ICONS[iconKey];
  const badge = document.createElementNS(SVG_NS, "g");
  badge.setAttribute("transform", `translate(${x}, ${y})`);
  badge.setAttribute("aria-hidden", "true");

  const bg = document.createElementNS(SVG_NS, "circle");
  bg.setAttribute("r", "11");
  bg.setAttribute("fill", "white");
  bg.setAttribute("stroke", icon.color);
  bg.setAttribute("stroke-width", "1.25");
  badge.appendChild(bg);

  const scale = 14 / Math.max(...icon.viewBox.split(" ").slice(2).map(Number));
  const iconGroup = document.createElementNS(SVG_NS, "g");
  iconGroup.setAttribute("transform", `translate(${-7}, ${-7}) scale(${scale})`);
  iconGroup.setAttribute("fill", icon.color);
  for (const p of icon.paths) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", p.d);
    if (p.fillRule) path.setAttribute("fill-rule", p.fillRule);
    if (p.clipRule) path.setAttribute("clip-rule", p.clipRule);
    iconGroup.appendChild(path);
  }
  badge.appendChild(iconGroup);
  g.appendChild(badge);
}

function enhanceDiagram(container: HTMLDivElement) {
  const svg = container.querySelector("svg");
  if (!svg) return;
  const svgId = svg.id;

  // Bolder pipelines — text boldness is handled via themeCSS (see
  // mermaid.initialize) so it's applied before layout, not after.
  svg.querySelectorAll<SVGPathElement>(".flowchart-link").forEach((el) => {
    el.style.strokeWidth = "1.75px";
  });

  for (const [nodeKey, iconKey] of Object.entries(NODE_ICONS)) {
    const node = svg.querySelector<SVGGElement>(`[id*="${svgId}-flowchart-${nodeKey}-"]`);
    if (!node) continue;
    const bbox = node.getBBox();
    appendIconBadge(node, iconKey, bbox.x + 6, bbox.y + 6);
  }

  const clientSideCluster = svg.querySelector<SVGGElement>(`[id$="${svgId}-ClientSide"]`);
  const clientSideLabel = clientSideCluster?.parentElement?.querySelector<SVGGElement>(".cluster-label");
  if (clientSideCluster) {
    const bbox = clientSideCluster.getBBox();
    appendIconBadge(clientSideCluster, "browser", bbox.x + 16, bbox.y);
  } else if (clientSideLabel) {
    // Fallback if the cluster rect itself isn't directly queryable.
    const bbox = clientSideLabel.getBBox();
    appendIconBadge(clientSideLabel, "browser", bbox.x - 14, bbox.y + bbox.height / 2);
  }

  if (prefersReducedMotion()) return;

  let delay = 0;
  for (const [source, target] of EDGES) {
    const path = svg.querySelector<SVGPathElement>(`[id*="${svgId}-L_${source}_${target}_"]`);
    if (!path) continue;

    const dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("r", "3");
    dot.setAttribute("fill", "var(--accent-500)");
    const animateMotion = document.createElementNS(SVG_NS, "animateMotion");
    animateMotion.setAttribute("dur", "3s");
    animateMotion.setAttribute("begin", `${delay}s`);
    animateMotion.setAttribute("repeatCount", "indefinite");
    const mpath = document.createElementNS(SVG_NS, "mpath");
    mpath.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${path.id}`);
    mpath.setAttribute("href", `#${path.id}`);
    animateMotion.appendChild(mpath);
    dot.appendChild(animateMotion);
    svg.appendChild(dot);

    delay += 0.4;
  }
}

export default function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      // Sized to sit in a narrower column (beside the "How it works" text)
      // rather than the full content width — smaller intrinsic font/spacing
      // so shrinking the column doesn't scale it down further into
      // illegibility (the rendered SVG is width:100% + viewBox, so the
      // whole diagram scales with its container).
      themeVariables: { fontSize: "13px" },
      flowchart: {
        nodeSpacing: 20,
        rankSpacing: 28,
        padding: 10,
        curve: "basis",
        // Guarantees clearance between a subgraph's title and its first
        // node regardless of the compacted rankSpacing above, so corner
        // icon badges on a subgraph's top node never overlap the title.
        subGraphTitleMargin: { top: 10, bottom: 8 },
      },
      // Applied before mermaid measures label bounding boxes for layout, so
      // node/cluster boxes size themselves to fit the *bold* text width —
      // bolding after render (via post-hoc CSS) would overflow the boxes
      // mermaid already sized for the unbolded measurement.
      themeCSS: ".nodeLabel, .edgeLabel, .cluster-label { font-weight: 700; }",
    });

    if (!ref.current) return;
    const container = ref.current;
    // Reset to the raw diagram source before each run: if this effect
    // fires more than once for the same container (React Strict Mode's
    // dev-only double-invoke, or Fast Refresh), the container already
    // holds the previous run's rendered SVG rather than mermaid syntax,
    // and re-parsing that throws a bare (message-less) object.
    // mermaid.run() also stamps data-processed="true" on the container
    // itself once it starts, and silently skips any container that
    // already carries it — textContent alone doesn't clear that
    // attribute, so without removing it a second effect invocation
    // no-ops forever, leaving the raw source text visible with no error.
    container.removeAttribute("data-processed");
    container.textContent = children;

    // Strict Mode's double-invoke fires two overlapping mermaid.run() calls
    // on the same container; the run whose effect gets cleaned up first
    // must not touch the DOM once its promise resolves, or it races the
    // second (live) run and throws (e.g. "Cannot read properties of null
    // (reading 'firstChild')").
    let cancelled = false;
    mermaid
      .run({ nodes: [container] })
      .then(() => {
        if (!cancelled) enhanceDiagram(container);
      })
      .catch((e) => {
        if (!cancelled) console.error(e);
      });

    return () => {
      cancelled = true;
    };
  }, [children]);

  return (
    <div
      className="flex justify-center overflow-x-auto w-full max-w-full [&>svg]:min-w-[480px] sm:[&>svg]:min-w-0"
      ref={ref}
    >
      {children}
    </div>
  );
}
