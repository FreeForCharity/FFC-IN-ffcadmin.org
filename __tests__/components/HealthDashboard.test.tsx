import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import HealthDashboard from '@/app/sites-list/HealthDashboard'

const mockSites = [
  {
    section: 'Org-WPAdmin',
    domain: 'example.org',
    status: 'Active',
    inWhmcs: 'Yes',
    inCloudflare: 'Yes',
    inWpmudev: 'No',
    serverInUse: 'GitHub Pages',
    oldServerAbandoned: '',
    notes: '',
    cloudflareIp: '',
    repoUrl: '',
    siteHealth: '200 OK',
    priority: 'Standard',
  },
  {
    section: 'Org-NoWP',
    domain: 'redirect.org',
    status: 'Active',
    inWhmcs: 'Yes',
    inCloudflare: 'Yes',
    inWpmudev: 'No',
    serverInUse: 'Hostinger',
    oldServerAbandoned: '',
    notes: '',
    cloudflareIp: '',
    repoUrl: '',
    siteHealth: '301 Redirect',
    priority: 'Standard',
  },
  {
    section: 'Subdomain',
    domain: 'broken.org',
    status: 'Active',
    inWhmcs: 'No',
    inCloudflare: 'Yes',
    inWpmudev: 'No',
    serverInUse: 'Hostinger',
    oldServerAbandoned: '',
    notes: '',
    cloudflareIp: '',
    repoUrl: '',
    siteHealth: '404 Not Found',
    priority: 'Standard',
  },
]

describe('HealthDashboard', () => {
  it('renders the Health Overview heading', () => {
    render(<HealthDashboard sites={mockSites} />)
    expect(screen.getByText('Health Overview')).toBeInTheDocument()
  })

  it('displays total domains count', () => {
    render(<HealthDashboard sites={mockSites} />)
    expect(screen.getByText('3 total domains')).toBeInTheDocument()
  })

  it('renders health category labels', () => {
    render(<HealthDashboard sites={mockSites} />)
    expect(screen.getAllByText(/Live \(200\)/)).toBeTruthy()
    expect(screen.getAllByText(/Redirect \(3xx\)/)).toBeTruthy()
    expect(screen.getAllByText(/Error \(4xx\/5xx\)/)).toBeTruthy()
  })

  it('shows distribution bar', () => {
    render(<HealthDashboard sites={mockSites} />)
    expect(screen.getByText('Health Distribution')).toBeInTheDocument()
  })
})
