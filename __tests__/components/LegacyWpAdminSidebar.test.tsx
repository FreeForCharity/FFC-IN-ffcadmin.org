import { render, screen } from '@testing-library/react'
import Sidebar from '@/components/legacy-wordpress-administration/Sidebar'
import { LEGACY_WP_ADMIN_PAGES } from '@/data/legacy-wordpress-administration'

const mockUsePathname = jest.fn<string, []>()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('Legacy WordPress Administration Sidebar', () => {
  afterEach(() => {
    mockUsePathname.mockReset()
  })

  test('renders the section-hub link and all category headings', () => {
    mockUsePathname.mockReturnValue('/legacy-wordpress-administration')
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /section hub/i })).toBeInTheDocument()
    expect(screen.getByText('WordPress Operations')).toBeInTheDocument()
    expect(screen.getByText('Charity Onboarding')).toBeInTheDocument()
    expect(screen.getByText('Volunteer Programs')).toBeInTheDocument()
  })

  test('renders every leaf as a link (all leaves + hub)', () => {
    mockUsePathname.mockReturnValue('/legacy-wordpress-administration')
    render(<Sidebar />)
    const nav = screen.getByRole('navigation', { name: /legacy wordpress administration/i })
    expect(nav.querySelectorAll('a').length).toBe(LEGACY_WP_ADMIN_PAGES.length + 1)
  })

  test('marks only the current leaf as aria-current="page"', () => {
    mockUsePathname.mockReturnValue('/legacy-wordpress-administration/wordpress-domains')
    render(<Sidebar />)
    const current = screen.getAllByText('Domain Admin')[0]
    expect(current.closest('a')).toHaveAttribute('aria-current', 'page')
    const hubLink = screen.getByRole('link', { name: /section hub/i })
    expect(hubLink).not.toHaveAttribute('aria-current')
  })

  test('marks the hub as current only on the hub page itself', () => {
    mockUsePathname.mockReturnValue('/legacy-wordpress-administration')
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /section hub/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  test('does NOT mark anything current on a sibling path that shares the prefix', () => {
    // A path like /legacy-wordpress-administration-archive must not activate the section hub.
    mockUsePathname.mockReturnValue('/legacy-wordpress-administration-archive')
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /section hub/i })).not.toHaveAttribute('aria-current')
  })
})
