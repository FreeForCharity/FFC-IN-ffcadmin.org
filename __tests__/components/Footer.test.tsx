/**
 * Footer Component Tests
 *
 * These tests validate the Footer component behavior and rendering.
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('should render the footer component', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('should display copyright text with current year', () => {
      render(<Footer />)
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
    })

    it('should display organization name', () => {
      render(<Footer />)
      const elements = screen.getAllByText(/Free For Charity/i)
      expect(elements.length).toBeGreaterThan(0)
    })

    it('should display 501(c)(3) nonprofit status', () => {
      render(<Footer />)
      expect(screen.getByText(/501\(c\)\(3\) nonprofit/i)).toBeInTheDocument()
    })

    it('should have "Supported by" attribution linking to Free For Charity', () => {
      render(<Footer />)
      const ffcLink = screen.getByRole('link', { name: /Supported by Free For Charity/i })
      expect(ffcLink).toBeInTheDocument()
      expect(ffcLink).toHaveAttribute('href', 'https://freeforcharity.org')
      expect(ffcLink).toHaveAttribute('target', '_blank')
      expect(ffcLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should have Supported Charity Login link to the FFC hub', () => {
      render(<Footer />)
      const hubLink = screen.getByRole('link', { name: /Supported Charity Login/i })
      expect(hubLink).toBeInTheDocument()
      expect(hubLink).toHaveAttribute('href', 'https://freeforcharity.org/hub/')
      expect(hubLink).toHaveAttribute('target', '_blank')
      expect(hubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should display the FFC EIN block', () => {
      render(<Footer />)
      expect(screen.getByText(/EIN[:\s]*46-2471893/i)).toBeInTheDocument()
    })

    it('should link to the GuideStar profile by EIN', () => {
      render(<Footer />)
      const guidestarLink = screen.getByRole('link', { name: /View Full GuideStar Profile/i })
      expect(guidestarLink).toHaveAttribute('href', 'https://www.guidestar.org/profile/46-2471893')
    })

    it('should display privacy policy link', () => {
      render(<Footer />)
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
      expect(privacyLink).toBeInTheDocument()
      expect(privacyLink).toHaveAttribute('href', '/privacy-policy')
    })

    it('should display cookie policy link', () => {
      render(<Footer />)
      const cookieLink = screen.getByRole('link', { name: /cookie policy/i })
      expect(cookieLink).toBeInTheDocument()
      expect(cookieLink).toHaveAttribute('href', '/cookie-policy')
    })

    it('should display documentation link', () => {
      render(<Footer />)
      const docsLink = screen.getByRole('link', { name: /documentation/i })
      expect(docsLink).toBeInTheDocument()
      expect(docsLink).toHaveAttribute('href', '/documentation')
    })
  })

  describe('External Links', () => {
    it('should have external links with proper security attributes', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')
      const externalLinks = links.filter((link) => link.getAttribute('target') === '_blank')
      expect(externalLinks.length).toBeGreaterThan(0)
      // All external links should at least have noopener for security
      externalLinks.forEach((link) => {
        const rel = link.getAttribute('rel')
        expect(rel).toContain('noopener')
      })
    })
  })

  describe('Social Links', () => {
    it('should have GitHub icon link in social bar', () => {
      render(<Footer />)
      const githubLink = screen.getByRole('link', { name: /on GitHub/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/FreeForCharity')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Styling', () => {
    it('should have appropriate background styling', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-black')
    })
  })
})
