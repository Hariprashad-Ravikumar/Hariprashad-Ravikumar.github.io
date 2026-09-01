"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { Connector, Fanout, Icon, PipelineNode, TierBox, pickWeighted } from "@/components/content/RouterDiagramPrimitives";

/**
 * v1's architecture, in the same visual language as RouterArchitectureDiagram
 * (v2) — but v1's real pipeline: an n8n workflow hands the prompt to a
 * Groq-hosted LLM that rates its own difficulty (a real "AI Agent" judgment
 * call, not a trained statistical model), then routes to one of two tiers.
 * Looping forever, weighted on v1's actual measured split (results/
 * comparison_table.md: 144/150 cheap, 6/150 capable).
 */

type NodeKey = "prompt" | "n8n" | "classifier" | "decision";
type TierKey = "capable" | "cheap";

const GROQ_COLOR = "#F43E01";
const N8N_COLOR = "#EA4B71";
const DECISION_COLOR = "#22d3ee";
const PROMPT_COLOR = "#5b8cff";
const GEMINI_COLOR = "#4285f4";

const N8N_ICON_PATH =
  "M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632";
const GROQ_ICON_PATH = "M18.445 4.406-9.468 13.74 7.341.665-1.69 9.578 9.469-13.74-7.342-.664 1.69-9.579Z";
const GROQ_VIEWBOX = "0 0 33 33";
const PROMPT_ICON_PATH = "M12 2 3 7v10l9 5 9-5V7Zm0 2.31L18.5 8 12 11.7 5.5 8Zm-7 4.4 6 3.34v6.64l-6-3.34Zm8 9.98v-6.64l6-3.34v6.64Z";
const DECISION_ICON_PATH = "M12 2 2 12l10 10 10-10Zm0 3.83L18.17 12 12 18.17 5.83 12Z";
const GEMINI_ICON_PATH =
  "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81";

const NODES: { key: NodeKey; label: string; sub?: string; color: string }[] = [
  { key: "prompt", label: "Prompt", color: PROMPT_COLOR },
  { key: "n8n", label: "n8n", sub: "workflow", color: N8N_COLOR },
  { key: "classifier", label: "Classifier", sub: "AI Agent · Groq", color: GROQ_COLOR },
  { key: "decision", label: "Decision", sub: "score 1-5", color: DECISION_COLOR },
];

const CASCADE_DELAY_MS: Record<NodeKey, number> = {
  prompt: 0,
  n8n: 150,
  classifier: 300,
  decision: 450,
};

const TIERS: {
  key: TierKey;
  label: string;
  sub: string;
  color: string;
  weight: number;
  fanoutPath: string;
  iconPath: string;
  iconViewBox?: string;
}[] = [
  {
    key: "capable",
    label: "capable",
    sub: "Gemini 3.1 Flash-Lite",
    color: GEMINI_COLOR,
    weight: 0.04,
    fanoutPath: "M50,0 L20,40",
    iconPath: GEMINI_ICON_PATH,
  },
  {
    key: "cheap",
    label: "cheap",
    sub: "gpt-oss-120b",
    color: GROQ_COLOR,
    weight: 0.96,
    fanoutPath: "M50,0 L80,40",
    iconPath: GROQ_ICON_PATH,
    iconViewBox: GROQ_VIEWBOX,
  },
];

const T_DECIDE_MS = 1100;
const T_HOLD_MS = 2000;
const T_FADE_MS = 800;
const T_PAUSE_MS = 900;
const T_CYCLE_MS = T_DECIDE_MS + T_HOLD_MS + T_FADE_MS + T_PAUSE_MS;

export default function RouterV1ArchitectureDiagram() {
  const [reduced] = useState(() => prefersReducedMotion());
  const [cycleId, setCycleId] = useState(0);
  const [won, setWon] = useState<TierKey | null>(reduced ? "cheap" : null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduced) return;

    function runCycle() {
      const decide = setTimeout(() => setWon(pickWeighted(TIERS) as TierKey), T_DECIDE_MS);
      const reset = setTimeout(() => setWon(null), T_DECIDE_MS + T_HOLD_MS);
      const next = setTimeout(() => {
        setCycleId((c) => c + 1);
        runCycle();
      }, T_CYCLE_MS);
      timeouts.current.push(decide, reset, next);
    }

    runCycle();
    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [reduced]);

  return (
    <div className="material-surface overflow-hidden rounded-xl">
      <div className="flex flex-col gap-2 px-3 py-6 sm:px-8" key={reduced ? "reduced" : cycleId}>
        <div className="mx-auto flex w-full max-w-xs flex-col items-stretch gap-0">
          {NODES.map((node, i) => (
            <div key={node.key}>
              <PipelineNode
                label={node.label}
                sub={node.sub}
                color={node.color}
                delayMs={CASCADE_DELAY_MS[node.key]}
                reduced={reduced}
              >
                {node.key === "prompt" && <Icon path={PROMPT_ICON_PATH} size={22} color={node.color} />}
                {node.key === "n8n" && <Icon path={N8N_ICON_PATH} size={22} color={node.color} />}
                {node.key === "classifier" && (
                  <Icon path={GROQ_ICON_PATH} viewBox={GROQ_VIEWBOX} size={20} color={node.color} />
                )}
                {node.key === "decision" && <Icon path={DECISION_ICON_PATH} size={22} color={node.color} />}
              </PipelineNode>
              {i < NODES.length - 1 && (
                <Connector color={NODES[i + 1].color} delayMs={CASCADE_DELAY_MS[NODES[i + 1].key]} reduced={reduced} />
              )}
            </div>
          ))}
        </div>

        <Fanout tiers={TIERS} won={won} />

        <div className="mx-auto flex justify-center gap-1.5 sm:gap-3">
          {TIERS.map((tier) => (
            <TierBox
              key={tier.key}
              label={tier.label}
              sub={tier.sub}
              color={tier.color}
              iconPath={tier.iconPath}
              iconViewBox={tier.iconViewBox}
              isWon={won === tier.key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
