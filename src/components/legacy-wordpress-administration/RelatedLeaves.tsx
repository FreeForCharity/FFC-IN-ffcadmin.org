import {
  getLegacyWpAdminHref,
  getLegacyWpAdminPageBySlug,
  type LegacyWpAdminPage,
  type LegacyWpAdminSlug,
} from '@/data/legacy-wordpress-administration'

interface RelatedLeavesProps {
  /** The page being rendered — its `relatedLeaves` field drives the list. */
  page: LegacyWpAdminPage
  /** Heading text; defaults to "Cross-references". */
  heading?: string
}

/**
 * Renders a data-driven "Cross-references" list from
 * `LegacyWpAdminPage.relatedLeaves`. Replaces hardcoded prose lists in
 * leaf pages.
 *
 * If `page.relatedLeaves` is undefined or empty, renders nothing.
 *
 * Refs issue #271.
 */
export default function RelatedLeaves({ page, heading = 'Cross-references' }: RelatedLeavesProps) {
  if (!page.relatedLeaves || page.relatedLeaves.length === 0) return null

  return (
    <section>
      <h2>{heading}</h2>
      <ul>
        {page.relatedLeaves.map((rel) => {
          const target = getLegacyWpAdminPageBySlug(rel.slug as LegacyWpAdminSlug)
          return (
            <li key={rel.slug}>
              <a href={`${getLegacyWpAdminHref(rel.slug as LegacyWpAdminSlug)}/`}>
                {target.shortLabel}
              </a>{' '}
              — {rel.note}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
