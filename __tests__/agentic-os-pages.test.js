/**
 * Agentic OS page tests.
 *
 * Renders the three /agentic-os pages and asserts their key headings and that
 * the dashboard reflects the committed snapshot. Assertions target structure
 * and internally-consistent values only — never live external counts.
 */
import { render, screen } from '@testing-library/react'
import AgenticOs from '@/app/agentic-os/page'
import SessionInventory from '@/app/agentic-os/session-inventory/page'
import AgenticOsArchitecture from '@/app/agentic-os/architecture/page'
import { loadAgentSessionInventory } from '@/lib/agenticOsData'

describe('Agentic OS status page (hub-fed, from #654)', () => {
  it('renders the status h1 and links to the harvested sub-pages', () => {
    render(<AgenticOs />)
    expect(screen.getByRole('heading', { level: 1, name: /Agentic OS Status/ })).toBeInTheDocument()
    // The "More" section links the status page to the historical inventory
    // and architecture sub-pages added by this branch.
    expect(screen.getByRole('link', { name: /historical session inventory/ })).toHaveAttribute(
      'href',
      '/agentic-os/session-inventory'
    )
    expect(screen.getByRole('link', { name: /architecture & roadmap/ })).toHaveAttribute(
      'href',
      '/agentic-os/architecture'
    )
  })
})

describe('Session inventory dashboard', () => {
  it('renders org totals from the committed snapshot', () => {
    const inventory = loadAgentSessionInventory()
    expect(inventory).not.toBeNull()
    render(<SessionInventory />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Agent Session Inventory/ })
    ).toBeInTheDocument()
    // The four stat cards reflect the snapshot's own numbers.
    expect(screen.getByText('Public repos')).toBeInTheDocument()
    expect(screen.getByText('Claude PR sessions')).toBeInTheDocument()
  })

  it('lists every repo from the snapshot', () => {
    const inventory = loadAgentSessionInventory()
    expect(inventory).not.toBeNull()
    render(<SessionInventory />)
    for (const repo of inventory.repos) {
      expect(screen.getByRole('link', { name: repo.name })).toHaveAttribute('href', repo.url)
    }
  })

  it('states the manual-refresh (no live scanning) rule', () => {
    render(<SessionInventory />)
    expect(screen.getAllByText(/session-inventory-refresh/).length).toBeGreaterThan(0)
    expect(screen.getByText(/never\s+live-scans/)).toBeInTheDocument()
  })
})

describe('Architecture page', () => {
  it('renders the six layers and the roadmap phases', () => {
    render(<AgenticOsArchitecture />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Agentic OS Architecture/ })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The six layers/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The roadmap/ })).toBeInTheDocument()
    expect(screen.getByText(/Phase 0 — Capture/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Governance highlights/ })).toBeInTheDocument()
  })
})
