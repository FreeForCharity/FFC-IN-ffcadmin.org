/**
 * /search results page (client half) tests — deep-link query parsing,
 * refinement, and empty states.
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchResults from '@/app/search/SearchResults'

let mockQuery = ''
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockQuery),
}))

describe('SearchResults', () => {
  beforeEach(() => {
    mockQuery = ''
  })

  it('prompts for input with no query', () => {
    render(<SearchResults />)
    expect(screen.getByText(/Type above to search all/)).toBeInTheDocument()
  })

  it('renders deep-linked ?q= results with a count', () => {
    mockQuery = 'q=methodology'
    render(<SearchResults />)
    expect(screen.getByRole('searchbox')).toHaveValue('methodology')
    expect(screen.getByRole('status')).toHaveTextContent(/result/)
    expect(screen.getByRole('link', { name: /Readiness methodology/ })).toHaveAttribute(
      'href',
      '/roadmap/methodology'
    )
  })

  it('refines results as the visitor types', () => {
    render(<SearchResults />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'intake help' } })
    expect(screen.getByRole('link', { name: /Intake Help/ })).toBeInTheDocument()
  })

  it('shows the no-match state for gibberish', () => {
    mockQuery = 'q=zzzznotapage'
    render(<SearchResults />)
    expect(screen.getByText(/No pages match/)).toBeInTheDocument()
  })
})
