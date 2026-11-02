"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { aiProviderUrl, extractAIContext } from "@/lib/ai-context";
import { SITE_URL } from "@/lib/seo";

const actionClass = "material-trim inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--ink-700)] transition-colors hover:bg-[var(--glass-trim-bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-500)] disabled:opacity-60";

export default function AIShare() {
  const pathname = usePathname();
  const path = pathname === "/" ? "/" : `${pathname.replace(/\/$/, "")}/`;
  const url = `${SITE_URL}${path}`;
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const [copying, setCopying] = useState(false);

  function track(action: "copy" | "open", provider: "clipboard" | "chatgpt" | "claude" | "gemini") {
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
    <div data-ai-exclude data-ai-share className="my-5 min-w-0 text-[var(--ink-700)]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="w-full text-sm text-[var(--ink-500)] sm:w-auto">Explore my work with</span>
        <div className="flex flex-wrap items-center gap-2">
          <a className={actionClass} aria-label="ChatGPT (opens in a new tab)" href={aiProviderUrl("chatgpt", url)} target="_blank" rel="noopener noreferrer" onClick={() => track("open", "chatgpt")}>
            <Image src="/images/brands/openai-blossom.svg" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            ChatGPT
          </a>
          <a className={actionClass} aria-label="Claude (opens in a new tab)" href={aiProviderUrl("claude", url)} target="_blank" rel="noopener noreferrer" onClick={() => track("open", "claude")}>
            <Image src="/images/brands/claude-spark.svg" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            Claude
          </a>
          <a className={actionClass} aria-label="Gemini (opens in a new tab; paste copied page text)" href={aiProviderUrl("gemini", url)} target="_blank" rel="noopener noreferrer" onClick={() => { track("open", "gemini"); setStatus("Gemini opened in a new tab. Choose Copy page, then paste the text into Gemini."); }}>
            <Image src="/images/brands/gemini-sparkle.svg" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            Gemini
          </a>
          <button type="button" onClick={copy} disabled={copying} className={actionClass}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
            </svg>
            {copying ? "Copying…" : "Copy page"}
          </button>
        </div>
      </div>
      <details className="mt-1 max-w-2xl text-xs text-[var(--ink-500)]">
        <summary className="flex min-h-11 w-fit cursor-pointer items-center gap-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-500)]">
          How it works <span aria-hidden="true">⌄</span>
        </summary>
        <p className="pb-2 leading-relaxed">ChatGPT and Claude open in a new tab with this page’s link and a summary prompt. For Gemini, choose Copy page and paste the text into the new tab. You can also paste the text if another assistant cannot read the page.</p>
      </details>
      <p role="status" aria-live="polite" className="text-xs empty:hidden">{status}</p>
      {fallback && <label className="mt-3 block max-w-2xl text-sm">Page context
        <textarea readOnly value={fallback} onFocus={event => event.target.select()} rows={10} className="material-trim mt-2 w-full rounded-lg p-3 text-sm text-[var(--ink-900)] focus-visible:outline-2 focus-visible:outline-[var(--brand-500)]" />
      </label>}
    </div>
  );
}
