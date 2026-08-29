import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="text-h2 mt-7 mb-2 text-[var(--ink-900)]" {...props} />,
    h3: (props) => <h3 className="text-h3 mt-5 mb-2 text-[var(--ink-900)]" {...props} />,
    p: (props) => (
      <p className="text-body prose-measure mb-3 text-[var(--ink-700)]" {...props} />
    ),
    ul: (props) => <ul className="prose-measure mb-3 list-disc pl-5" {...props} />,
    li: (props) => <li className="text-body mb-1 text-[var(--ink-700)]" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="prose-measure my-3 border-l-2 border-[var(--brand-300)] pl-4 text-[var(--ink-500)]"
        {...props}
      />
    ),
    strong: (props) => <strong className="font-semibold text-[var(--ink-900)]" {...props} />,
    ...components,
  };
}
