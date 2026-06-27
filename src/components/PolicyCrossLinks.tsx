import Link from 'next/link'

/**
 * The full set of FFC legal / policy / security pages. Rendered at the bottom of
 * each policy page so the whole stack is cross-linked and can stand on its own.
 * Keep this list in sync when adding or removing a policy page.
 */
export const POLICY_PAGES = [
  {
    href: '/terms-of-service',
    label: 'Terms of Service',
    blurb:
      'The agreement that governs use of FFC, with sections for visitors, volunteers, and charities.',
  },
  {
    href: '/privacy-policy',
    label: 'Privacy Policy',
    blurb: 'What data we collect, how we use it, and your privacy rights (GDPR, CCPA/CPRA).',
  },
  {
    href: '/cookie-policy',
    label: 'Cookie Policy',
    blurb: 'The cookies we use and how to manage your cookie preferences.',
  },
  {
    href: '/donation-policy',
    label: 'Donation Policy',
    blurb: 'The donations we accept and how they are evaluated and acknowledged.',
  },
  {
    href: '/vulnerability-disclosure-policy',
    label: 'Vulnerability Disclosure Policy',
    blurb: 'How to report a security issue, our safe harbor, and our response commitment.',
  },
  {
    href: '/security-acknowledgements',
    label: 'Security Acknowledgements',
    blurb: 'Thanks to the researchers who responsibly disclose vulnerabilities.',
  },
] as const

/** The href of any page in the policy stack (e.g. '/privacy-policy'). */
export type PolicyHref = (typeof POLICY_PAGES)[number]['href']

/** Strip a single trailing slash so '/privacy-policy/' matches '/privacy-policy'. */
function normalize(href: string): string {
  return href !== '/' && href.endsWith('/') ? href.slice(0, -1) : href
}

/** Cross-link block for the legal/policy/security pages. */
export default function PolicyCrossLinks({ current }: { current?: PolicyHref }) {
  const currentHref = current ? normalize(current) : undefined
  return (
    <nav aria-label="Policies and security" className="mt-10 border-t border-gray-200 pt-6 text-sm">
      <h2 className="text-base font-bold text-gray-900 mb-2">Policies &amp; security</h2>
      <p className="text-gray-600 mb-4">
        The complete Free For Charity policy stack. The page you are on is highlighted.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {POLICY_PAGES.map((p) =>
          p.href === currentHref ? (
            <li
              key={p.href}
              aria-current="page"
              className="rounded-lg border border-blue-200 bg-blue-50 p-3"
            >
              <span className="font-semibold text-gray-900">{p.label}</span>
              <span className="block text-gray-600">{p.blurb}</span>
            </li>
          ) : (
            <li key={p.href} className="rounded-lg border border-gray-200 p-3">
              <Link href={p.href} className="font-semibold text-blue-600 hover:underline">
                {p.label}
              </Link>
              <span className="block text-gray-600">{p.blurb}</span>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}
