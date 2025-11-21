/**
 * Home Page Component Tests
 *
 * These tests validate the Home page component behavior and rendering.
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page Component', () => {
  describe('Rendering', () => {
    it('should render the home page', () => {
      render(<Home />)
      const headings = screen.getAllByText(/Free For Charity/i)
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should display the main heading', () => {
      render(<Home />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Free For Charity/i)
    })

    it('should have navigation links to key sections', () => {
      render(<Home />)
      // Check for common navigation elements that would be present
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Content', () => {
    it('should display introduction content', () => {
      const { container } = render(<Home />)
      // The page should have some descriptive content
      expect(container.querySelector('section')).toBeInTheDocument()
    })
  })
})
