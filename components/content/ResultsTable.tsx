/**
 * Raw <table> tags inside .mdx are parsed as CommonMark HTML blocks (table is
 * on that tag list) rather than JSX, so mdx-components.tsx overrides never
 * apply to them — this component sidesteps that by taking data as props.
 */
export default function ResultsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="prose-measure mb-4 overflow-x-auto rounded-lg border border-[var(--line)]">
      <table className="w-full min-w-[480px] border-collapse text-left">
        <thead className="border-b border-[var(--line)] bg-[var(--surface-50)]">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-small px-4 py-2.5 font-semibold whitespace-nowrap text-[var(--ink-900)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--line)] last:border-0 even:bg-[var(--surface-50)]"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="text-small px-4 py-2.5 font-mono whitespace-nowrap text-[var(--ink-700)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
