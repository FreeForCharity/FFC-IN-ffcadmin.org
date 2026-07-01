/**
 * GlobalSearch (command-palette) tests.
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import GlobalSearch, { openGlobalSearch } from '@/components/GlobalSearch'

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: jest.fn(), prefetch: jest.fn() }),
}))

describe('GlobalSearch', () => {
  beforeEach(() => push.mockReset())

  it('is closed until opened', () => {
    render(<GlobalSearch />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens via openGlobalSearch(), filters results, and navigates on click', async () => {
    render(<GlobalSearch />)
    await act(async () => {
      openGlobalSearch()
    })
    expect(screen.getByRole('dialog', { name: 'Search the site' })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'methodology' } })
    fireEvent.click(screen.getByRole('button', { name: /Readiness methodology/ }))

    expect(push).toHaveBeenCalledWith('/roadmap/methodology')
    // Navigating closes the modal.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('toggles open on Ctrl+K and closes on Escape', async () => {
    render(<GlobalSearch />)
    await act(async () => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    })
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    await act(async () => {
      fireEvent.keyDown(dialog, { key: 'Escape' })
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an empty state for a query with no matches', async () => {
    render(<GlobalSearch />)
    await act(async () => {
      openGlobalSearch()
    })
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzznotapage' } })
    expect(screen.getByText(/No pages match/)).toBeInTheDocument()
  })
})
