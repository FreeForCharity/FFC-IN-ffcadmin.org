/**
 * Emits schema.org HowTo or Article JSON-LD for a leaf page.
 *
 * Used by SOP-flavored leaves under /legacy-wordpress-administration/
 * to qualify for Google rich-result eligibility (per SEO review on
 * issue #254).
 *
 * Render once per leaf, near the top of the JSX body. Next.js inlines
 * the `<script type="application/ld+json">` into the static HTML.
 */

interface HowToStep {
  /** Short step name; shows in search-result rich snippets. */
  name: string
  /** Longer step text; one paragraph is the sweet spot. */
  text: string
}

interface HowToSchemaProps {
  /** Page name — usually `page.title`. */
  name: string
  /** One-sentence description — usually `page.summary`. */
  description: string
  /** Canonical URL for the page — usually the leaf's canonical. */
  url: string
  /** Ordered step list. */
  steps: HowToStep[]
}

export default function HowToSchema({ name, description, url, steps }: HowToSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
