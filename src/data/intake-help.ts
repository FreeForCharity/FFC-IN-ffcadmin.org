/**
 * The /intake-help/ section is retired. Its help topics now live on
 * freeforcharity.org at /<track>/help/<slug>/ (tracks: 501c3, pre501c3), next
 * to the WHMCS application they explain. Each old ffcadmin.org URL renders a
 * small noindex redirect page (see IntakeHelpRedirect) pointing at the nearest
 * freeforcharity.org equivalent, so bookmarks and old links keep working.
 *
 * Mapping mirrors FFC-IN-freeforcharity.org src/data/application-help.ts
 * (HELP_TOPICS and FOLDED_HELP_TOPICS). Topics offered on both tracks point
 * at the 501(c)(3) track; the help pages there link across to pre-501(c)(3).
 */

import { FFC_HELP_FOR_CHARITIES_URL } from './charity-messaging'

export const INTAKE_HELP_BASE = '/intake-help'

const FFC_ORG = 'https://freeforcharity.org'

export interface IntakeHelpRedirect {
  slug: string
  title: string
  /** Absolute freeforcharity.org URL that replaces this page. */
  target: string
}

/** Where the retired /intake-help/ hub now lives. */
export const INTAKE_HELP_HUB_TARGET = FFC_HELP_FOR_CHARITIES_URL

export const INTAKE_HELP_REDIRECTS: IntakeHelpRedirect[] = [
  {
    slug: 'mission-statement',
    title: 'Writing a strong mission statement',
    target: `${FFC_ORG}/501c3/help/mission-statement/`,
  },
  {
    slug: 'getting-501c3',
    title: 'Getting to 501(c)(3)',
    target: `${FFC_ORG}/pre501c3/help/getting-501c3/`,
  },
  {
    slug: 'board-requirements',
    title: 'Board requirements',
    target: `${FFC_ORG}/501c3/help/board-requirements/`,
  },
  {
    slug: 'public-contact-info',
    title: 'Public contact information',
    target: `${FFC_ORG}/501c3/help/public-contact-info/`,
  },
  {
    slug: 'mailing-address',
    title: 'Choosing a mailing address',
    target: `${FFC_ORG}/501c3/help/mailing-address/`,
  },
  {
    slug: 'social-media',
    title: 'Setting up social media',
    target: `${FFC_ORG}/501c3/help/social-media/`,
  },
  {
    slug: 'guidestar-candid',
    title: 'Candid / GuideStar transparency',
    target: `${FFC_ORG}/501c3/help/guidestar-candid/`,
  },
  // Folded topics: no page of their own on freeforcharity.org.
  {
    slug: '501c3-application',
    title: 'Form 1023 vs. 1023-EZ',
    target: `${FFC_ORG}/pre501c3/help/getting-501c3/#form-1023`,
  },
  {
    slug: 'fiscal-sponsorship',
    title: 'Fiscal sponsorship policy',
    target: `${FFC_ORG}/pre501c3/help/getting-501c3/#fiscal-sponsorship`,
  },
  {
    // The "never send" list (bank details, passwords, donor/beneficiary data,
    // security problems) lives in this section on freeforcharity.org.
    slug: 'supporting-documents',
    title: 'What’s public and what stays private',
    target: `${FFC_ORG}/501c3/help/public-contact-info/#public-and-private`,
  },
  {
    slug: 'policy-pages',
    title: 'Policy pages',
    target: `${FFC_ORG}/501c3/#template`,
  },
]

export function getIntakeHelpRedirect(slug: string): IntakeHelpRedirect {
  const r = INTAKE_HELP_REDIRECTS.find((p) => p.slug === slug)
  if (!r) throw new Error(`Unknown intake-help slug: ${slug}`)
  return r
}

/** Replacement URL for an intake-help slug, for in-repo links. */
export function intakeHelpTarget(slug: string): string {
  return getIntakeHelpRedirect(slug).target
}
