/**
 * Canonical customer-facing wording shared with freeforcharity.org and the
 * WHMCS application forms/emails (approved by Clarke Moyer, 2026-11-13).
 *
 * Use these constants rather than retyping the sentences, so ffcadmin.org,
 * freeforcharity.org and WHMCS cannot drift apart again. Small grammatical
 * fitting at a call site is fine; new claims are not.
 */

export const FFC_CONTACT_NAME = 'Clarke Moyer'
export const FFC_CONTACT_PHONE = '520-222-8104'
export const FFC_CONTACT_SMS_HREF = 'sms:520-222-8104'
export const FFC_CONTACT_TEL_HREF = 'tel:520-222-8104'

/** WHMCS client area — where charities apply and open support tickets. */
export const FFC_CLIENT_AREA_URL = 'https://freeforcharity.org/hub/'
export const FFC_CLIENT_AREA_LABEL = 'freeforcharity.org/hub'

/** Public help for charities on freeforcharity.org (replaces ffcadmin /intake-help/). */
export const FFC_HELP_FOR_CHARITIES_URL = 'https://freeforcharity.org/help-for-charities/'

/** Focus statement. Render "food, water or shelter" in bold (see FOCUS_EMPHASIS). */
export const FOCUS_STATEMENT =
  'Free For Charity welcomes every kind of charity. Our priority is organizations that provide food, water or shelter, such as food pantries, clean water projects and shelters, and we focus our volunteer time on them first. If your charity does other good work, please still apply; we’d love to help.'

/** Short form, for space-constrained places (form field descriptions). */
export const FOCUS_STATEMENT_SHORT =
  'Every kind of charity is welcome; our priority is organizations that provide food, water or shelter.'

/** The phrase that is bolded wherever the focus statement renders as rich text. */
export const FOCUS_EMPHASIS = 'food, water or shelter'

export const VETERANS_WELCOME =
  'Veterans organizations are our next priority after food, water and shelter, and every other kind of charity is welcome.'

export const FOOTER_ADDRESS_GUIDANCE =
  'Your footer always shows your city and state. If you give a public street address on the application, we add it too. Use an office, commercial mailbox or registered-agent address, never a volunteer’s home.'

export const PUBLIC_LINK_GUIDANCE =
  'Give the public link anyone can open, not an admin, editor or dashboard link. Test it in a private (incognito) window.'

export const GITHUB_USERNAME_GUIDANCE =
  'Enter only the username, for example jane-doe: letters, numbers and single hyphens, up to 39 characters. Not a link and not an email address.'

export const GITHUB_INVITE_GUIDANCE =
  'The invitation comes from GitHub, not from us, and expires after 7 days, so accept it promptly.'

export const ACCEPT_INVITATION_PATH = '/site-owner/accept-invitation/'

export const REVIEW_TIME = 'usually within a few days'

/** Full support line. */
export const SUPPORT_LINE =
  'Already applied? Open a ticket in your client area at freeforcharity.org/hub. A volunteer replies by email, usually within 3 days. Tickets are not watched around the clock, so if your site is down or something is urgent, text or call Clarke Moyer at 520-222-8104.'

/** Short escalation form — replaces every older "48 hours" promise. */
export const SUPPORT_ESCALATION =
  'No reply after 3 days, or something urgent? Text or call Clarke Moyer at 520-222-8104.'

/** For site owners who gave their GitHub username on the WHMCS application. */
export const APPLICANT_INVITE_SKIP =
  'Applied through the application with your GitHub username? Skip this step: your invitation arrives after we approve your application.'
