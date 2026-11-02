"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { aiProviderUrl, extractAIContext } from "@/lib/ai-context";
import { SITE_URL } from "@/lib/seo";

const actionClass = "rounded-md border border-[var(--glass-border)] px-3 py-2 text-sm hover:bg-[var(--surface-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-500)]";

export default function AIShare() {
  const pathname = usePathname();
  const path = pathname === "/" ? "/" : `${pathname.replace(/\/$/, "")}/`;
  const url = `${SITE_URL}${path}`;
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const [copying, setCopying] = useState(false);

  function track(action: "copy" | "open", provider: "clipboard" | "chatgpt" | "claude") {
    const analytics = window as Window & { gtag?: (command: string, event: string, params: Record<string, string>) => void };
    analytics.gtag?.("event", "ai_share", { action, provider, page_path: path });
  }

  async function copy() {
    const root = document.querySelector("[data-ai-content]");
    if (!root) return;
    const title = root.querySelector("h1")?.innerText?.replace(/\s+/g, " ").trim() || document.title;
    const context = extractAIContext(root, title, url);
    setCopying(true);
    setFallback("");
    try {
      await navigator.clipboard.writeText(context);
      setStatus("Copied. Paste into your preferred AI assistant.");
      track("copy", "clipboard");
    } catch {
      setFallback(context);
      setStatus("Clipboard access is unavailable. Select and copy the text below.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <details data-ai-exclude className="my-3 max-w-2xl text-[var(--ink-700)]">
      <summary className="w-fit cursor-pointer rounded text-sm font-medium text-[var(--brand-500)] focus-visible:outline-2 focus-visible:outline-offset-4">
        Use with AI
      </summary>
      <div className="mt-2 rounded-lg border border-[var(--glass-border)] bg-[var(--surface-50)] p-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copy} disabled={copying} className={actionClass}>{copying ? "Copying…" : "Copy for AI"}</button>
          <a className={actionClass} href={aiProviderUrl("chatgpt", url)} target="_blank" rel="noopener noreferrer" onClick={() => track("open", "chatgpt")}>Open in ChatGPT</a>
          <a className={actionClass} href={aiProviderUrl("claude", url)} target="_blank" rel="noopener noreferrer" onClick={() => track("open", "claude")}>Open in Claude</a>
        </div>
        <p className="mt-2 text-xs">Opens the assistant with a link to this page. If it cannot read the page, use Copy for AI and paste the text.</p>
        <p role="status" aria-live="polite" className="mt-2 text-xs">{status}</p>
        {fallback && <label className="mt-2 block text-sm">Page context
          <textarea readOnly value={fallback} onFocus={event => event.target.select()} rows={10} className="mt-1 w-full rounded border border-[var(--glass-border)] bg-white p-2 text-sm text-[var(--ink-900)]" />
        </label>}
      </div>
    </details>
  );
}
