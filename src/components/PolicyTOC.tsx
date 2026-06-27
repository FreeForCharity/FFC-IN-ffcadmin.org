/**
 * Clickable table of contents for a long policy page. Each entry links to a
 * `#section-N` anchor, so the page must give its top-level sections matching
 * `id="section-N"` ids (add `scroll-mt-20` for a comfortable scroll offset).
 */
export type TocItem = { n: number; label: string; note?: string }

export default function PolicyTOC({ items }: { items: readonly TocItem[] }) {
  return (
    <nav aria-label="Table of contents" className="rounded-lg border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-3">Contents</h2>
      <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2 text-sm">
        {items.map((item) => (
          <li key={item.n}>
            <a href={`#section-${item.n}`} className="text-blue-600 hover:underline">
              {item.n}. {item.label}
            </a>
            {item.note && <span className="ml-1 text-xs text-gray-500">({item.note})</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
