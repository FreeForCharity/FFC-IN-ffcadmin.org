import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import FilterableHostingSection from '@/app/sites-list/FilterableHostingSection'

const baseSite = {
  section: 'Org-WPAdmin',
  status: 'Active',
  inWhmcs: 'Yes',
  inCloudflare: 'Yes',
  inWpmudev: 'No',
  serverInUse: 'GitHub Pages',
  oldServerAbandoned: 'No',
  notes: '',
  cloudflareIp: '',
  siteHealth: '200',
  priority: 'Standard',
}

const sites = [
  { ...baseSite, domain: 'withrepo.org', repoUrl: 'https://github.com/FreeForCharity/withrepo' },
  { ...baseSite, domain: 'norepo.org', repoUrl: '' },
]

const providers = [
  { name: 'GitHub Pages', colorClass: 'bg-green-100 text-green-900', description: 'GH Pages.' },
]

describe('FilterableHostingSection — Links column (#187)', () => {
  it('renders the Links column header', () => {
    render(<FilterableHostingSection sites={sites} providers={providers} />)
    expect(screen.getAllByText('Links').length).toBeGreaterThan(0)
  })

  it('renders Site + Repo quick links with correct hrefs when repoUrl is present', () => {
    render(<FilterableHostingSection sites={sites} providers={providers} />)
    const repoLink = screen.getByRole('link', {
      name: /Open the GitHub repository for withrepo\.org/i,
    })
    expect(repoLink).toHaveAttribute('href', 'https://github.com/FreeForCharity/withrepo')
    const siteLink = screen.getByRole('link', { name: /Open the live site withrepo\.org/i })
    expect(siteLink).toHaveAttribute('href', 'https://withrepo.org')
  })

  it('renders a placeholder (no Repo link) when repoUrl is missing', () => {
    render(<FilterableHostingSection sites={sites} providers={providers} />)
    expect(
      screen.queryByRole('link', { name: /Open the GitHub repository for norepo\.org/i })
    ).not.toBeInTheDocument()
    // The live-site link is still present for that row.
    expect(
      screen.getByRole('link', { name: /Open the live site norepo\.org/i })
    ).toBeInTheDocument()
  })
})
