/**
 * Contributor Ladder Page Tests
 *
 * These tests verify the contributor ladder page structure, content, and responsive behavior.
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ContributorLadderPage from '../../app/contributor-ladder/page'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockedLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockedLink.displayName = 'Link'
  return MockedLink
})

describe('Contributor Ladder Page', () => {
  describe('Page Structure', () => {
    it('should render the page without crashing', () => {
      render(<ContributorLadderPage />)
    })

    it('should have a main heading', () => {
      render(<ContributorLadderPage />)
      const heading = screen.getByRole('heading', { level: 1, name: /Contributor Ladder/i })
      expect(heading).toBeInTheDocument()
    })

    it('should have a page description', () => {
      render(<ContributorLadderPage />)
      const description = screen.getByText(/A clear path from contributor to maintainer/i)
      expect(description).toBeInTheDocument()
    })
  })

  describe('Ladder Levels', () => {
    it('should display all 5 contributor levels', () => {
      render(<ContributorLadderPage />)

      // Check for all level headings (exact match to avoid matching "Next Level" text)
      expect(screen.getAllByRole('heading', { level: 3, name: 'Contributor' })).toHaveLength(2) // Desktop and mobile
      expect(screen.getAllByRole('heading', { level: 3, name: 'Unpaid Intern' })).toHaveLength(2)
      expect(screen.getAllByRole('heading', { level: 3, name: 'Paid Intern' })).toHaveLength(2)
      expect(screen.getAllByRole('heading', { level: 3, name: 'Mentor' })).toHaveLength(2)
      expect(screen.getAllByRole('heading', { level: 3, name: 'Maintainer' })).toHaveLength(2)
    })

    it('should display requirements for Contributor level', () => {
      render(<ContributorLadderPage />)
      expect(screen.getAllByText(/Make your first pull request/i)).toHaveLength(2)
      expect(screen.getAllByText(/Follow our code of conduct/i)).toHaveLength(2)
    })

    it('should display requirements for Unpaid Intern level', () => {
      render(<ContributorLadderPage />)
      expect(screen.getAllByText(/Complete 5\+ merged contributions/i)).toHaveLength(2)
      expect(screen.getAllByText(/Participate in code reviews/i)).toHaveLength(2)
    })

    it('should display requirements for Paid Intern level', () => {
      render(<ContributorLadderPage />)
      expect(screen.getAllByText(/Lead development of at least 2 major features/i)).toHaveLength(2)
      expect(screen.getAllByText(/Obtain relevant certification/i)).toHaveLength(2)
    })

    it('should display requirements for Mentor level', () => {
      render(<ContributorLadderPage />)
      expect(screen.getAllByText(/Complete at least 6 months as Paid Intern/i)).toHaveLength(2)
      expect(screen.getAllByText(/Mentor 2\+ contributors/i)).toHaveLength(2)
    })

    it('should display requirements for Maintainer level', () => {
      render(<ContributorLadderPage />)
      expect(screen.getAllByText(/Demonstrated excellence as Mentor for 1\+ year/i)).toHaveLength(2)
      expect(screen.getAllByText(/Deep expertise in multiple areas/i)).toHaveLength(2)
    })
  })

  describe('Requirements Labels', () => {
    it('should have Requirements heading for each level', () => {
      render(<ContributorLadderPage />)
      const requirementsHeadings = screen.getAllByRole('heading', {
        level: 4,
        name: /Requirements/i,
      })
      // 5 levels × 2 (desktop and mobile layouts) = 10 total
      expect(requirementsHeadings).toHaveLength(10)
    })
  })

  describe('Next Level Information', () => {
    it('should show next level information for Contributor', () => {
      render(<ContributorLadderPage />)
      // Check for "Next Level" label
      const nextLevelLabels = screen.getAllByText(/Next Level/i)
      expect(nextLevelLabels.length).toBeGreaterThan(0)

      // Check that Unpaid Intern is listed as next level
      expect(screen.getAllByText('Unpaid Intern')).toHaveLength(4) // Heading + next level × 2 layouts
    })

    it('should show next level information for intermediate levels', () => {
      render(<ContributorLadderPage />)
      // Paid Intern appears as: heading (2x) + next level from Unpaid Intern (2x) = 4 total
      expect(screen.getAllByText('Paid Intern')).toHaveLength(4)
      // Mentor appears as: heading (2x) + next level from Paid Intern (2x) = 4 total
      expect(screen.getAllByText('Mentor')).toHaveLength(4)
      // Maintainer appears as: heading (2x) + next level from Mentor (2x) = 4 total
      expect(screen.getAllByText('Maintainer')).toHaveLength(4)
    })
  })

  describe('Timeframe Information', () => {
    it('should display timeframe for Unpaid Intern level', () => {
      render(<ContributorLadderPage />)
      expect(screen.getAllByText(/3-6 months commitment/i)).toHaveLength(2)
    })
  })

  describe('Call to Action Section', () => {
    it('should have a call to action section', () => {
      render(<ContributorLadderPage />)
      expect(
        screen.getByRole('heading', { level: 2, name: /Ready to Start Your Journey/i })
      ).toBeInTheDocument()
    })

    it('should have links to training programs', () => {
      render(<ContributorLadderPage />)
      const globalAdminLinks = screen.getAllByRole('link', { name: /Global Admin Track/i })
      const canvaDesignerLinks = screen.getAllByRole('link', { name: /Canva Designer Track/i })

      expect(globalAdminLinks.length).toBeGreaterThan(0)
      expect(canvaDesignerLinks.length).toBeGreaterThan(0)
    })

    it('should have correct URLs for training program links', () => {
      render(<ContributorLadderPage />)
      const globalAdminLinks = screen.getAllByRole('link', { name: /Global Admin Track/i })
      const canvaDesignerLinks = screen.getAllByRole('link', { name: /Canva Designer Track/i })

      expect(globalAdminLinks[0]).toHaveAttribute('href', '/training-plan')
      expect(canvaDesignerLinks[0]).toHaveAttribute('href', '/canva-designer-path')
    })
  })

  describe('GitHub CTA', () => {
    it('should have a GitHub call-to-action button', () => {
      render(<ContributorLadderPage />)
      const githubLink = screen.getByRole('link', { name: /View Our Repositories/i })
      expect(githubLink).toBeInTheDocument()
    })

    it('should link to GitHub organization', () => {
      render(<ContributorLadderPage />)
      const githubLink = screen.getByRole('link', { name: /View Our Repositories/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/FreeForCharity')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Responsive Design Elements', () => {
    it('should render both mobile and desktop layouts', () => {
      const { container } = render(<ContributorLadderPage />)

      // Mobile/tablet layout (lg:hidden)
      const mobileLayouts = container.querySelectorAll('.lg\\:hidden')
      expect(mobileLayouts.length).toBeGreaterThan(0)

      // Desktop layout (hidden lg:block)
      const desktopLayouts = container.querySelectorAll('.lg\\:block')
      expect(desktopLayouts.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ContributorLadderPage />)

      // h1 for page title
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

      // h2 for call to action section
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()

      // h3 for each level (× 2 for mobile and desktop)
      const h3Headings = screen.getAllByRole('heading', { level: 3 })
      expect(h3Headings.length).toBe(10) // 5 levels × 2 layouts

      // h4 for requirements sections (× 2 for mobile and desktop)
      const h4Headings = screen.getAllByRole('heading', { level: 4 })
      expect(h4Headings.length).toBe(10) // 5 levels × 2 layouts
    })

    it('should have descriptive links with proper attributes', () => {
      render(<ContributorLadderPage />)

      // Check external links have proper security attributes
      const githubLink = screen.getByRole('link', { name: /View Our Repositories/i })
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
      expect(githubLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('Content Quality', () => {
    it('should have meaningful descriptions for each level', () => {
      render(<ContributorLadderPage />)

      // Check that each level has a substantial description
      expect(screen.getAllByText(/Anyone can contribute to Free For Charity/i)).toHaveLength(2)
      expect(
        screen.getAllByText(/Deepen your involvement with a structured learning path/i)
      ).toHaveLength(2)
      expect(
        screen.getAllByText(/Take on significant responsibilities with compensation/i)
      ).toHaveLength(2)
      expect(screen.getAllByText(/Guide the next generation of contributors/i)).toHaveLength(2)
      expect(screen.getAllByText(/Own core components of the platform/i)).toHaveLength(2)
    })

    it('should mention key program features in descriptions', () => {
      render(<ContributorLadderPage />)

      // Check for mentions of certifications
      expect(screen.getAllByText(/MS-900/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/GitHub Foundations/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Canva Design School/i).length).toBeGreaterThan(0)
    })
  })
})
