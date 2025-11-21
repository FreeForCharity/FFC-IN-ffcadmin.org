/**
 * Navigation Component Tests
 *
 * These tests validate the Navigation component behavior and rendering.
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '@/app/components/Navigation'

describe('Navigation Component', () => {
  describe('Rendering', () => {
    it('should render the navigation component', () => {
      render(<Navigation />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should render the brand logo and name', () => {
      render(<Navigation />)
      expect(screen.getByText('F')).toBeInTheDocument()
      expect(screen.getByText('Free For Charity')).toBeInTheDocument()
      expect(screen.getByText('Admin Portal')).toBeInTheDocument()
    })

    it('should render desktop navigation links', () => {
      render(<Navigation />)
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /tech stack/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /training plan/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    })

    it('should render mobile menu button', () => {
      render(<Navigation />)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Mobile Menu Interaction', () => {
    it('should toggle mobile menu when button is clicked', () => {
      render(<Navigation />)
      const menuButton = screen.getByRole('button', { name: /menu/i })

      // Menu should be closed initially
      expect(screen.queryByText(/close/i)).not.toBeInTheDocument()

      // Open menu
      fireEvent.click(menuButton)

      // Check if menu is open (aria-expanded should be true)
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close mobile menu when clicked twice', () => {
      render(<Navigation />)
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
    it('should have correct href for home link', () => {
      render(<Navigation />)
      const homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should have correct href for tech stack link', () => {
      render(<Navigation />)
      const techStackLink = screen.getByRole('link', { name: /tech stack/i })
      expect(techStackLink).toHaveAttribute('href', '/tech-stack')
    })

    it('should have correct href for training plan link', () => {
      render(<Navigation />)
      const trainingPlanLink = screen.getByRole('link', { name: /training plan/i })
      expect(trainingPlanLink).toHaveAttribute('href', '/training-plan')
    })

    it('should have external GitHub link with correct attributes', () => {
      render(<Navigation />)
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/FreeForCharity')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on menu button', () => {
      render(<Navigation />)
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toHaveAttribute('aria-expanded')
      expect(menuButton).toHaveAttribute('aria-label')
    })
  })
})
