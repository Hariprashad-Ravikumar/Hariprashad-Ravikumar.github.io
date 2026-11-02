/** Convert the rendered main content, not MDX source or a second copy of the prose. */
export function extractAIContext(root: Element, title: string, url: string): string {
  const text = (node: Node): string => {
    if (node.nodeType === 3) return (node.textContent ?? "").replace(/\s+/g, " ");
    if (!(node instanceof Element)) return "";
    if (node.matches('script, style, nav, aside, button, textarea, input, select, h1, [data-ai-exclude], [aria-hidden="true"], [hidden]')) return "";
    const tag = node.tagName.toLowerCase();
    const display = getComputedStyle(node).display;
    const content = () => Array.from(node.childNodes).map(text).join(/flex|grid/.test(display) ? " " : "");
    const explicit = node.getAttribute("data-ai-text");
    if (explicit) return `\n\n${explicit}\n\n`;
    if (node.classList.contains("katex")) {
      const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
      return tex ? `$${tex}$` : (node.querySelector("math")?.textContent ?? "");
    }
    if (tag === "svg") {
      const label = node.getAttribute("aria-label") || node.querySelector("title")?.textContent;
      return label ? `\n\nDiagram: ${label}\n\n` : "";
    }
    if (tag === "img") {
      const alt = node.getAttribute("alt");
      return alt ? ` [Image: ${alt}] ` : "";
    }
    if (tag === "a") {
      const label = content().trim();
      const href = node.getAttribute("href");
      if (!label || !href) return label;
      const target = new URL(href, url);
      return ["https:", "http:", "mailto:"].includes(target.protocol)
        ? `[${label}](${target.href})` : label;
    }
    if (tag === "table") {
      const rows = Array.from(node.querySelectorAll("tr")).map(row =>
        Array.from(row.children).map(cell => text(cell).trim().replace(/\s+/g, " ").replace(/\|/g, "\\|")),
      );
      if (!rows.length) return "";
      const width = Math.max(...rows.map(row => row.length));
      const line = (row: string[]) => `| ${Array.from({ length: width }, (_, i) => row[i] ?? "").join(" | ")} |`;
      const hasHeader = !!node.querySelector("tr th");
      const header = hasHeader ? rows.shift()! : Array(width).fill("");
      return `\n\n${[line(header), line(Array(width).fill("---")), ...rows.map(line)].join("\n")}\n\n`;
    }
    if (tag === "pre") return `\n\n\`\`\`\n${node.textContent?.trim()}\n\`\`\`\n\n`;
    if (tag === "code") return `\`${content()}\``;
    if (/^h[2-6]$/.test(tag)) return `\n\n${"#".repeat(Number(tag[1]))} ${content().trim()}\n\n`;
    if (tag === "br") return "\n";
    if (tag === "li") {
      const marker = node.parentElement?.tagName === "OL"
        ? `${Array.from(node.parentElement.children).indexOf(node) + 1}.` : "-";
      return `\n${marker} ${content().trim()}\n`;
    }
    if (tag === "strong" || tag === "b") return `**${content()}**`;
    if (tag === "em" || tag === "i") return `*${content()}*`;
    if (tag === "blockquote") return `\n\n> ${content().trim().replace(/\n/g, "\n> ")}\n\n`;
    if (display === "block" || ["p", "div", "section", "article", "figure", "figcaption", "ul", "ol", "dl", "dt", "dd"].includes(tag)) return `\n\n${content().trim()}\n\n`;
    return content();
  };
  const body = text(root).replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return `# ${title}\n\nAuthor: Hariprashad Ravikumar\nSource: ${url}\n\n${body}`;
}

export function aiPrompt(url: string) {
  return `Read this page by Hariprashad Ravikumar: ${url}. Summarize the experience or work it describes, cite the page, and distinguish stated evidence from inference. If you cannot access it, ask me to paste the page text.`;
}

export function aiProviderUrl(provider: "chatgpt" | "claude" | "gemini", url: string) {
  // Gemini has no verified prompt-prefill contract; use the copy-page fallback.
  if (provider === "gemini") return "https://gemini.google.com/app";
  const target = new URL(provider === "chatgpt" ? "https://chatgpt.com/" : "https://claude.ai/new");
  target.searchParams.set("q", aiPrompt(url));
  return target.href;
}
