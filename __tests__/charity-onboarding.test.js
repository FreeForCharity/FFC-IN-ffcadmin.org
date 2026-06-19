/**
 * Charity onboarding journey (#site-owner): the high-fidelity invitation
 * walkthrough and its discoverability across nav, footer, homepage, and the
 * site-owner landing.
 */
const fs = require('fs')
const path = require('path')

const read = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8')

describe('Accept-invitation walkthrough page', () => {
  const page = read('src/app/site-owner/accept-invitation/page.tsx')

  it('exists and is self-canonical', () => {
    expect(page).toContain('https://ffcadmin.org/site-owner/accept-invitation/')
  })

  it('identifies who the email is from and its subject', () => {
    expect(page).toContain('notifications@github.com')
    expect(page).toContain('invited you to collaborate')
  })

  it('documents github.com/notifications as a place to accept', () => {
    expect(page).toContain('github.com/notifications')
    expect(page).toContain('Accept from your GitHub notifications')
  })

  it('documents all three acceptance routes', () => {
    expect(page).toContain('Accept from the email')
    expect(page).toContain('Accept from your GitHub notifications')
    expect(page).toContain('/invitations')
  })

  it('warns about being signed in as the right account', () => {
    expect(page.toLowerCase()).toContain('right')
    expect(page.toLowerCase()).toContain('account')
    expect(page).toContain('top-right')
  })
})

describe('Onboarding discoverability', () => {
  it('is a prominent nav button (desktop + mobile)', () => {
    const nav = read('src/components/Navigation.tsx')
    expect(nav).toContain('/site-owner')
    // CTA button styling, not a plain text link
    expect(nav).toContain('from-emerald-500 to-teal-600')
  })

  it('has a footer CTA linking the landing and the invitation walkthrough', () => {
    const footer = read('src/components/Footer.tsx')
    expect(footer).toContain('/site-owner/accept-invitation')
    expect(footer).toContain('/site-owner')
  })

  it('is spotlighted on the homepage', () => {
    const home = read('src/app/page.tsx')
    expect(home).toContain('/site-owner/accept-invitation')
  })

  it('the site-owner landing shows the complete linear path and links the walkthrough', () => {
    const landing = read('src/app/site-owner/page.tsx')
    expect(landing).toContain('Your complete path, in order')
    expect(landing).toContain('/site-owner/accept-invitation')
    expect(landing).toContain('/guides/github-account')
    expect(landing).toContain('/guides/multi-factor-authentication')
  })

  it('is registered in the sitemap', () => {
    const sitemap = read('src/app/sitemap.ts')
    expect(sitemap).toContain('/site-owner/accept-invitation/')
  })
})
