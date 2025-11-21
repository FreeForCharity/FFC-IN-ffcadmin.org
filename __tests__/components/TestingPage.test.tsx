/**
 * Testing Page Component Tests
 *
 * These tests validate the Testing documentation page component behavior and rendering.
 */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import TestingPage from '@/app/testing/page'

describe('Testing Page Component', () => {
  describe('Rendering', () => {
    it('should render the testing page', () => {
      render(<TestingPage />)
      const heading = screen.getByRole('heading', { name: /Test Documentation/i })
      expect(heading).toBeInTheDocument()
    })

    it('should display the main heading', () => {
      render(<TestingPage />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/Test Documentation/i)
    })

    it('should display the about testing section', () => {
      render(<TestingPage />)
      const aboutSection = screen.getByRole('heading', { name: /About Testing/i })
      expect(aboutSection).toBeInTheDocument()
    })
  })

  describe('Test Suite Information', () => {
    it('should display test suite count', () => {
      render(<TestingPage />)
      expect(screen.getByText('16')).toBeInTheDocument()
    })

    it('should display total test count', () => {
      render(<TestingPage />)
      expect(screen.getByText('166')).toBeInTheDocument()
    })

    it('should display all test suite categories', () => {
      render(<TestingPage />)
      expect(screen.getByText(/Configuration & Build/i)).toBeInTheDocument()
      expect(screen.getByText(/Build & Deployment/i)).toBeInTheDocument()
      expect(screen.getByText(/Design & Responsiveness/i)).toBeInTheDocument()
      expect(screen.getByText(/Component Tests/i)).toBeInTheDocument()
    })
  })

  describe('Test Suite Details', () => {
    it('should display configuration validation test suite', () => {
      render(<TestingPage />)
      expect(screen.getByText(/Configuration Validation/i)).toBeInTheDocument()
    })

    it('should display build output test suite', () => {
      render(<TestingPage />)
      const elements = screen.getAllByText(/Build Output/i)
      expect(elements.length).toBeGreaterThan(0)
    })

    it('should display responsive design test suite', () => {
      render(<TestingPage />)
      const elements = screen.getAllByText(/Responsive Design/i)
      expect(elements.length).toBeGreaterThan(0)
    })

    it('should display navigation component test suite', () => {
      render(<TestingPage />)
      const elements = screen.getAllByText(/Navigation Component/i)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  describe('Running Tests Section', () => {
    it('should display running tests section', () => {
      render(<TestingPage />)
      expect(screen.getByRole('heading', { name: /Running Tests/i })).toBeInTheDocument()
    })

    it('should display developer testing instructions', () => {
      render(<TestingPage />)
      expect(screen.getByText(/For Developers: Local Testing/i)).toBeInTheDocument()
    })

    it('should display contributor instructions', () => {
      render(<TestingPage />)
      expect(screen.getByText(/For Contributors: Before Committing/i)).toBeInTheDocument()
    })

    it('should display CI/CD pipeline information', () => {
      render(<TestingPage />)
      expect(screen.getByText(/For Administrators: CI\/CD Pipeline/i)).toBeInTheDocument()
    })
  })

  describe('Test Results Section', () => {
    it('should display understanding test results section', () => {
      render(<TestingPage />)
      expect(
        screen.getByRole('heading', { name: /Understanding Test Results/i })
      ).toBeInTheDocument()
    })
  })

  describe('Additional Resources', () => {
    it('should display additional resources section', () => {
      render(<TestingPage />)
      expect(screen.getByRole('heading', { name: /Additional Resources/i })).toBeInTheDocument()
    })

    it('should have links to testing frameworks', () => {
      render(<TestingPage />)
      const jestLinks = screen.getAllByRole('link', { name: /Jest/i })
      expect(jestLinks.length).toBeGreaterThan(0)
      expect(jestLinks[0]).toHaveAttribute('href', 'https://jestjs.io/docs/getting-started')
    })
  })

  describe('Content Completeness', () => {
    it('should display test count information', () => {
      render(<TestingPage />)
      expect(screen.getByText(/16 comprehensive test suites/i)).toBeInTheDocument()
      expect(screen.getByText(/166 automated tests/i)).toBeInTheDocument()
    })

    it('should display CI/CD integration information', () => {
      render(<TestingPage />)
      expect(
        screen.getByText(/Testing is integrated into the CI\/CD pipeline/i)
      ).toBeInTheDocument()
    })
  })
})
