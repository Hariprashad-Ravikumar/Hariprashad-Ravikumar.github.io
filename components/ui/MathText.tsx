import katex from "katex";

/**
 * Renders `\(...\)` inline math with KaTeX, server-side, into static HTML —
 * replaces MathJax (§10.4/§10.7), which was rendering with a visible gap
 * bug and shipped a much heavier runtime. No client JS needed since this
 * runs in server components at build time.
 */
export default function MathText({ text }: { text: string }) {
  const parts = text.split(/(\\\([^)]*\\\))/g);

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\\\((.*)\\\)$/);
        if (!match) return <span key={i}>{part}</span>;
        const html = katex.renderToString(match[1], { throwOnError: false });
        // eslint-disable-next-line react/no-danger
        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </>
  );
}
