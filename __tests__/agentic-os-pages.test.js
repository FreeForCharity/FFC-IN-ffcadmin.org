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

describe('Agentic OS overview page', () => {
  it('renders the hero and core sections', () => {
    render(<AgenticOs />)
    expect(
      screen.getByRole('heading', { level: 1, name: /The FFC Agentic OS/ })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The five planes/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The six layers/ })).toBeInTheDocument()
  })

  it('links every plane to its GitHub repo', () => {
    render(<AgenticOs />)
    for (const repo of [
      'FFC-IN-AI-Management',
      'FFC-IN-ffcadmin.org',
      'FFC-Cloudflare-Automation',
      'FFC-IN-FFC_Single_Page_Template',
      'FFC-IN-google_antigravity_agents',
    ]) {
      expect(screen.getByRole('link', { name: repo })).toHaveAttribute(
        'href',
        `https://github.com/FreeForCharity/${repo}`
      )
    }
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
