import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const SITE_URL = 'https://ffcadmin.org'

export const metadata: Metadata = {
  title: {
    default: 'Legacy WordPress Administration',
    template: '%s | Legacy WordPress Administration',
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
