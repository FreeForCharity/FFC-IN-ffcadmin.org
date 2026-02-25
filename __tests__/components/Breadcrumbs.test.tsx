import { render, screen } from '@testing-library/react'
import Breadcrumbs from '@/components/Breadcrumbs'

describe('Breadcrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Test Post' },
  ]

  test('renders all breadcrumb items', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  test('renders links for items with href', () => {
    render(<Breadcrumbs items={items} />)
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('href', '/')
    const blogLink = screen.getByRole('link', { name: 'Blog' })
    expect(blogLink).toHaveAttribute('href', '/blog')
  })

  test('renders plain text for the current page (no href)', () => {
    render(<Breadcrumbs items={items} />)
    const currentPage = screen.getByText('Test Post')
    expect(currentPage).toHaveAttribute('aria-current', 'page')
    expect(currentPage.tagName).toBe('SPAN')
  })

  test('has aria-label for accessibility', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument()
  })

  test('includes BreadcrumbList JSON-LD schema', () => {
    const { container } = render(<Breadcrumbs items={items} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const jsonLd = JSON.parse(script!.textContent!)
    expect(jsonLd['@type']).toBe('BreadcrumbList')
    expect(jsonLd.itemListElement).toHaveLength(3)
    expect(jsonLd.itemListElement[0].name).toBe('Home')
    expect(jsonLd.itemListElement[2].name).toBe('Test Post')
  })
})
