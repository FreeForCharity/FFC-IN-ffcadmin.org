/**
 * Owner / assignee mapping for FFC-managed sites (#422).
 *
 * Keyed by apex domain (exactly as it appears in docs/sites_list.csv).
 * Values are GitHub usernames (preferred — rendered as a profile link)
 * or a plain display name.
 *
 * To claim or assign a site, add a line here and open a PR.
 */
export const SITE_OWNERS: Record<string, string> = {
  'ffcadmin.org': 'clarkemoyer',
  'freeforcharity.org': 'clarkemoyer',
}

/** Looks like a GitHub handle (no spaces) — linkable to a profile. */
export function isGithubHandle(owner: string): boolean {
  return /^[A-Za-z0-9-]+$/.test(owner)
}
