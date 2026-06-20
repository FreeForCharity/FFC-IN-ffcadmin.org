import Link from 'next/link'

/**
 * "What we ask of you" — a friendly, scannable summary of the expectations for
 * a given audience, distilled from the audience-specific Terms of Service
 * sections. The Terms remain the single source of truth; this card surfaces the
 * gist on marketing pages and deep-links back to the authoritative section.
 *
 * Keep the bullets in sync with the matching ToS "In short" callout
 * (volunteers -> Section 17, supported charities -> Section 18).
 */
type Audience = 'volunteer' | 'charity'

const CONTENT: Record<
  Audience,
  { title: string; intro: string; points: string[]; href: string; cta: string }
> = {
  volunteer: {
    title: 'What we ask of volunteers',
    intro: 'A few simple expectations keep our volunteer community safe and effective:',
    points: [
      "It's volunteering — unpaid, at-will, and not employment. You can stop any time.",
      'Use your own account in your real name, secured with multi-factor authentication (MFA).',
      "Keep any FFC or charity data you're given confidential, and use it only for your work.",
      'Use AI responsibly — review its output and never paste secrets or personal data into unapproved tools.',
      "Your contributions are donated under the project's open-source license.",
    ],
    href: '/terms-of-service#section-17',
    cta: 'Read the full Volunteer Terms (Section 17)',
  },
  charity: {
    title: 'What we ask of supported charities',
    intro: 'FFC gives eligible nonprofits a complete technology stack for free. In return:',
    points: [
      'Adopt the complete FFC stack as designed — not just the pieces you want (the “full-stack commitment”).',
      'Secure every account with multi-factor authentication (MFA) and unique passwords.',
      'You keep ownership of your content, data, and brand.',
      'Handle constituent and donor data lawfully and respectfully.',
      'Keep a small “built by Free For Charity” credit on your site.',
      'Stay eligible with a quick ~30-minute annual refresh (e.g., your Candid/GuideStar profile).',
    ],
    href: '/terms-of-service#section-18',
    cta: 'Read the full Supported-Charity Terms (Section 18)',
  },
}

export default function ExpectationsCallout({
  audience,
  className = '',
}: {
  audience: Audience
  className?: string
}) {
  const { title, intro, points, href, cta } = CONTENT[audience]
  return (
    <aside
      aria-label={title}
      className={`rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm mt-1">{intro}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
            <svg
              className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
      >
        {cta}
        <svg
          className="ml-1 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </aside>
  )
}
