import { render, screen } from '@testing-library/react'
import NonprofitCallout from '@/components/NonprofitCallout'

describe('NonprofitCallout', () => {
  test('renders the callout heading', () => {
    render(<NonprofitCallout />)
    expect(screen.getByText('Are you a nonprofit looking for a free website?')).toBeInTheDocument()
  })

  test('renders the description text', () => {
    render(<NonprofitCallout />)
    expect(screen.getByText(/FFC provides free websites and domain management/)).toBeInTheDocument()
  })

  test('has a link to freeforcharity.org', () => {
    render(<NonprofitCallout />)
    const link = screen.getByRole('link', { name: /apply at freeforcharity\.org/i })
    expect(link).toHaveAttribute('href', 'https://freeforcharity.org')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
