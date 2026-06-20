import Link from 'next/link'

/**
 * The full set of FFC legal / policy / security pages. Rendered at the bottom of
 * each policy page so the whole stack is cross-linked and can stand on its own.
 * Keep this list in sync when adding or removing a policy page.
 */
export const POLICY_PAGES = [
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/donation-policy', label: 'Donation Policy' },
  { href: '/vulnerability-disclosure-policy', label: 'Vulnerability Disclosure Policy' },
  { href: '/security-acknowledgements', label: 'Security Acknowledgements' },
] as const

/** Cross-link block for the legal/policy/security pages. */
export default function PolicyCrossLinks({ current }: { current?: string }) {
  return (
    <nav aria-label="Policies and security" className="mt-10 border-t border-gray-200 pt-6 text-sm">
      <h2 className="text-base font-bold text-gray-900 mb-3">Policies &amp; security</h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {POLICY_PAGES.map((p) =>
          p.href === current ? (
            <li key={p.href} aria-current="page" className="font-semibold text-gray-900">
              {p.label}
            </li>
          ) : (
            <li key={p.href}>
              <Link href={p.href} className="text-blue-600 hover:underline">
                {p.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}
