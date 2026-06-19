/**
 * Navigation Component Tests
 *
 * These tests validate the Navigation component behavior and rendering for the
 * audience-first mega-menu structure: Home · Manage My Site · Volunteer ▾ ·
 * Operate ▾ · For Charities ↗.
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Navigation from '@/components/Navigation'
import { volunteerMenu, menuItems } from '@/data/navigation'

// Helper to render and flush the queueMicrotask from the pathname effect
async function renderNavigation() {
  render(<Navigation />)
  await act(async () => {})
}

describe('Navigation Component', () => {
  describe('Rendering', () => {
    it('should render the navigation component', async () => {
      await renderNavigation()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should render the brand logo and name', async () => {
      await renderNavigation()
      expect(screen.getByAltText('Free For Charity Logo')).toBeInTheDocument()
      expect(screen.getByText('Admin Portal')).toBeInTheDocument()
    })

    it('should render the top-level links and the two mega-menu buttons', async () => {
      await renderNavigation()
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      // Both desktop and mobile render a Manage My Site link
      expect(screen.getAllByRole('link', { name: /manage my site/i }).length).toBeGreaterThan(0)
      expect(screen.getByRole('button', { name: /volunteer/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /operate/i })).toBeInTheDocument()
    })

    it('should render mobile menu button', async () => {
      await renderNavigation()
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
    })
  })

  describe('Mobile Menu Interaction', () => {
    it('should toggle mobile menu when button is clicked', async () => {
      await renderNavigation()
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close mobile menu when clicked twice', async () => {
      await renderNavigation()
      const menuButton = screen.getByRole('button', { name: /menu/i })
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Links', () => {
    it('should have correct href for home link', async () => {
      await renderNavigation()
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    })

    it('should point Manage My Site at the site-owner landing', async () => {
      await renderNavigation()
      const links = screen.getAllByRole('link', { name: /manage my site/i })
      links.forEach((l) => expect(l).toHaveAttribute('href', '/site-owner'))
    })

    it('should render volunteer mega-menu items (incl. nested training) when opened', async () => {
      await renderNavigation()
      fireEvent.click(screen.getByRole('button', { name: /volunteer/i }))
      expect(screen.getByRole('menuitem', { name: /get involved/i })).toHaveAttribute(
        'href',
        '/get-involved'
      )
      expect(screen.getByRole('menuitem', { name: /contributor ladder/i })).toHaveAttribute(
        'href',
        '/contributor-ladder'
      )
      // Training tracks now live under Volunteer
      expect(screen.getByRole('menuitem', { name: /web developer/i })).toHaveAttribute(
        'href',
        '/training/web-developer'
      )
      expect(screen.getByRole('menuitem', { name: /canva designer/i })).toHaveAttribute(
        'href',
        '/canva-designer-path'
      )
    })

    it('should render operate mega-menu items (incl. nested resources) when opened', async () => {
      await renderNavigation()
      fireEvent.click(screen.getByRole('button', { name: /operate/i }))
      expect(screen.getByRole('menuitem', { name: /sites list/i })).toHaveAttribute(
        'href',
        '/sites-list'
      )
      expect(screen.getByRole('menuitem', { name: /testing/i })).toHaveAttribute('href', '/testing')
      // Resources now live under Operate
      expect(screen.getByRole('menuitem', { name: /guides/i })).toHaveAttribute('href', '/guides')
      expect(screen.getByRole('menuitem', { name: /what ffc delivers/i })).toHaveAttribute(
        'href',
        '/what-ffc-delivers'
      )
    })
  })

  describe('Dropdown Behavior', () => {
    it('should only have one dropdown open at a time', async () => {
      await renderNavigation()
      const volunteerBtn = screen.getByRole('button', { name: /volunteer/i })
      const operateBtn = screen.getByRole('button', { name: /operate/i })

      fireEvent.click(volunteerBtn)
      expect(volunteerBtn).toHaveAttribute('aria-expanded', 'true')

      fireEvent.click(operateBtn)
      expect(operateBtn).toHaveAttribute('aria-expanded', 'true')
      expect(volunteerBtn).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close dropdown when clicking the same trigger again', async () => {
      await renderNavigation()
      const volunteerBtn = screen.getByRole('button', { name: /volunteer/i })
      fireEvent.click(volunteerBtn)
      expect(volunteerBtn).toHaveAttribute('aria-expanded', 'true')
      fireEvent.click(volunteerBtn)
      expect(volunteerBtn).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close dropdown on Escape key', async () => {
      await renderNavigation()
      const volunteerBtn = screen.getByRole('button', { name: /volunteer/i })
      fireEvent.click(volunteerBtn)
      expect(volunteerBtn).toHaveAttribute('aria-expanded', 'true')
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(volunteerBtn).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on menu button', async () => {
      await renderNavigation()
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded')
      expect(menuButton).toHaveAttribute('aria-label')
    })

    it('dropdown buttons should have aria-haspopup', async () => {
      await renderNavigation()
      expect(screen.getByRole('button', { name: /volunteer/i })).toHaveAttribute(
        'aria-haspopup',
        'true'
      )
      expect(screen.getByRole('button', { name: /operate/i })).toHaveAttribute(
        'aria-haspopup',
        'true'
      )
    })

    it('dropdown menus should have role="menu"', async () => {
      await renderNavigation()
      fireEvent.click(screen.getByRole('button', { name: /volunteer/i }))
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('dropdown items should have role="menuitem" for every item across sections', async () => {
      await renderNavigation()
      fireEvent.click(screen.getByRole('button', { name: /volunteer/i }))
      expect(screen.getAllByRole('menuitem').length).toBe(menuItems(volunteerMenu).length)
    })
  })
})
