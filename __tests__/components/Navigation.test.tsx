/**
 * Navigation Component Tests
 *
 * These tests validate the Navigation component behavior and rendering.
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Navigation from '@/components/Navigation'

// Helper to render and flush the queueMicrotask from the pathname effect
async function renderNavigation() {
  render(<Navigation />)
  // Flush the queueMicrotask scheduled by the pathname change effect
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

    it('should render desktop navigation links and dropdown buttons', async () => {
      await renderNavigation()
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /get involved/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sites list/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /training/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /resources/i })).toBeInTheDocument()
    })

    it('should render mobile menu button', async () => {
      await renderNavigation()
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Mobile Menu Interaction', () => {
    it('should toggle mobile menu when button is clicked', async () => {
      await renderNavigation()
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Menu should be closed initially
      expect(screen.queryByText(/close/i)).not.toBeInTheDocument()

      // Open menu
      fireEvent.click(menuButton)

      // Check if menu is open (aria-expanded should be true)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close mobile menu when clicked twice', async () => {
      await renderNavigation()
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Open menu
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Close menu
      fireEvent.click(menuButton)
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Links', () => {
    it('should have correct href for home link', async () => {
      await renderNavigation()
      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should have correct href for get involved link', async () => {
      await renderNavigation()
      const link = screen.getByRole('link', { name: /get involved/i })
      expect(link).toHaveAttribute('href', '/get-involved')
    })

    it('should have correct href for sites list link', async () => {
      await renderNavigation()
      const link = screen.getByRole('link', { name: /sites list/i })
      expect(link).toHaveAttribute('href', '/sites-list')
    })

    it('should render training dropdown items when opened', async () => {
      await renderNavigation()
      const trainingBtn = screen.getByRole('button', { name: /training/i })
      fireEvent.click(trainingBtn)
      // Items have role="menuitem" which overrides the implicit link role
      expect(screen.getByRole('menuitem', { name: /global admin/i })).toHaveAttribute(
        'href',
        '/training-plan'
      )
      expect(screen.getByRole('menuitem', { name: /canva designer/i })).toHaveAttribute(
        'href',
        '/canva-designer-path'
      )
      expect(screen.getByRole('menuitem', { name: /contributor ladder/i })).toHaveAttribute(
        'href',
        '/contributor-ladder'
      )
    })

    it('should render resources dropdown items when opened', async () => {
      await renderNavigation()
      const resourcesBtn = screen.getByRole('button', { name: /resources/i })
      fireEvent.click(resourcesBtn)
      expect(screen.getByRole('menuitem', { name: /tech stack/i })).toHaveAttribute(
        'href',
        '/tech-stack'
      )
      expect(screen.getByRole('menuitem', { name: /documentation/i })).toHaveAttribute(
        'href',
        '/documentation'
      )
      expect(screen.getByRole('menuitem', { name: /testing/i })).toHaveAttribute('href', '/testing')
      expect(screen.getByRole('menuitem', { name: /guides/i })).toHaveAttribute('href', '/guides')
      expect(screen.getByRole('menuitem', { name: /blog/i })).toHaveAttribute('href', '/blog')
    })
  })

  describe('Dropdown Behavior', () => {
    it('should only have one dropdown open at a time', async () => {
      await renderNavigation()
      const trainingBtn = screen.getByRole('button', { name: /training/i })
      const resourcesBtn = screen.getByRole('button', { name: /resources/i })

      fireEvent.click(trainingBtn)
      expect(trainingBtn).toHaveAttribute('aria-expanded', 'true')

      fireEvent.click(resourcesBtn)
      expect(resourcesBtn).toHaveAttribute('aria-expanded', 'true')
      expect(trainingBtn).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close dropdown when clicking the same trigger again', async () => {
      await renderNavigation()
      const trainingBtn = screen.getByRole('button', { name: /training/i })
      fireEvent.click(trainingBtn)
      expect(trainingBtn).toHaveAttribute('aria-expanded', 'true')
      fireEvent.click(trainingBtn)
      expect(trainingBtn).toHaveAttribute('aria-expanded', 'false')
    })

    it('should close dropdown on Escape key', async () => {
      await renderNavigation()
      const trainingBtn = screen.getByRole('button', { name: /training/i })
      fireEvent.click(trainingBtn)
      expect(trainingBtn).toHaveAttribute('aria-expanded', 'true')
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(trainingBtn).toHaveAttribute('aria-expanded', 'false')
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
      expect(screen.getByRole('button', { name: /training/i })).toHaveAttribute(
        'aria-haspopup',
        'true'
      )
      expect(screen.getByRole('button', { name: /resources/i })).toHaveAttribute(
        'aria-haspopup',
        'true'
      )
    })

    it('dropdown menus should have role="menu"', async () => {
      await renderNavigation()
      fireEvent.click(screen.getByRole('button', { name: /training/i }))
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('dropdown items should have role="menuitem"', async () => {
      await renderNavigation()
      fireEvent.click(screen.getByRole('button', { name: /training/i }))
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBe(3)
    })
  })
})
