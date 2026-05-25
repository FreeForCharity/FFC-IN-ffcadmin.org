import { render, screen, fireEvent } from '@testing-library/react'
import SisterSiteBanner from '@/components/SisterSiteBanner'

describe('SisterSiteBanner', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('renders on first visit', () => {
    render(<SisterSiteBanner />)
    expect(screen.getByRole('region', { name: /sister site routing/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /visit freeforcharity\.org/i })).toHaveAttribute(
      'href',
      'https://freeforcharity.org/'
    )
  })

  test('outbound link uses target=_blank with rel noopener noreferrer', () => {
    render(<SisterSiteBanner />)
    const link = screen.getByRole('link', { name: /visit freeforcharity\.org/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toMatch(/noopener/)
    expect(link.getAttribute('rel')).toMatch(/noreferrer/)
  })

  test('Dismiss button hides the banner and persists across renders', () => {
    const { unmount } = render(<SisterSiteBanner />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(screen.queryByRole('region', { name: /sister site routing/i })).not.toBeInTheDocument()
    expect(window.localStorage.getItem('ffc-sister-site-banner-dismissed-v1')).toBe('1')

    unmount()
    render(<SisterSiteBanner />)
    expect(screen.queryByRole('region', { name: /sister site routing/i })).not.toBeInTheDocument()
  })

  test('still renders when localStorage throws (private browsing)', () => {
    const original = window.localStorage.getItem
    Object.defineProperty(window.localStorage, 'getItem', {
      configurable: true,
      value: () => {
        throw new Error('blocked')
      },
    })

    render(<SisterSiteBanner />)
    expect(screen.getByRole('region', { name: /sister site routing/i })).toBeInTheDocument()

    Object.defineProperty(window.localStorage, 'getItem', {
      configurable: true,
      value: original,
    })
  })
})
