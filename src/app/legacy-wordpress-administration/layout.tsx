import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const SITE_URL = 'https://ffcadmin.org'

export const metadata: Metadata = {
  // Leaf titles use the short "FFC Admin" brand suffix (not the root
  // layout's longer "Free For Charity Admin") so the longest leaf
  // title stays under Google's ~60-char SERP cutoff while still
  // carrying brand identity. The root template does not apply here
  // because this template is the closest one to the leaf segments.
  title: {
    default: 'Legacy WordPress Administration | FFC Admin',
    template: '%s | FFC Admin',
  },
  description:
    'Operations and SOP reference for FFC volunteers, admins, and supported charities still running their own WordPress.',
  alternates: {
    canonical: `${SITE_URL}/legacy-wordpress-administration/`,
  },
}

export default function LegacyWordPressAdministrationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
