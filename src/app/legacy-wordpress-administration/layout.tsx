import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const SITE_URL = 'https://ffcadmin.org'

export const metadata: Metadata = {
  // Use just the page title on leaves (no section suffix) so the
  // global '%s | Free For Charity Admin' template from layout.tsx
  // applies once — keeps titles within Google's ~60-char cutoff.
  title: {
    default: 'Legacy WordPress Administration',
    template: '%s',
  },
  description:
    'Operations and SOP reference for FFC volunteers, admins, and partner charities still running their own WordPress.',
  alternates: {
    canonical: `${SITE_URL}/legacy-wordpress-administration/`,
  },
}

export default function LegacyWordPressAdministrationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
