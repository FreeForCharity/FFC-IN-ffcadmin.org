/**
 * Accessibility Tests
 *
 * These tests validate that pages meet WCAG accessibility standards using axe-core.
 */

import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import Home from '@/app/page'
import TechStack from '@/app/tech-stack/page'
import Documentation from '@/app/documentation/page'
import CookiePolicy from '@/app/cookie-policy/page'
import PrivacyPolicy from '@/app/privacy-policy/page'
import TermsOfService from '@/app/terms-of-service/page'
import DonationPolicy from '@/app/donation-policy/page'
import VulnerabilityDisclosurePolicy from '@/app/vulnerability-disclosure-policy/page'
import SecurityAcknowledgements from '@/app/security-acknowledgements/page'
import TrainingPlan from '@/app/training-plan/page'
import ExpectationsCallout from '@/components/ExpectationsCallout'

describe('Accessibility Tests', () => {
  describe('Home Page Accessibility', () => {
    it('should not have accessibility violations on home page', async () => {
      const { container } = render(<Home />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('ExpectationsCallout Accessibility', () => {
    it('should not have accessibility violations (volunteer)', async () => {
      const { container } = render(<ExpectationsCallout audience="volunteer" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
    it('should not have accessibility violations (charity)', async () => {
      const { container } = render(<ExpectationsCallout audience="charity" />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Tech Stack Page Accessibility', () => {
    it('should not have accessibility violations on tech stack page', async () => {
      const { container } = render(<TechStack />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Documentation Page Accessibility', () => {
    it('should not have accessibility violations on documentation page', async () => {
      const { container } = render(<Documentation />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Cookie Policy Page Accessibility', () => {
    it('should not have accessibility violations on cookie policy page', async () => {
      const { container } = render(<CookiePolicy />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Privacy Policy Page Accessibility', () => {
    it('should not have accessibility violations on privacy policy page', async () => {
      const { container } = render(<PrivacyPolicy />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Terms of Service Page Accessibility', () => {
    it('should not have accessibility violations on terms of service page', async () => {
      const { container } = render(<TermsOfService />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Donation Policy Page Accessibility', () => {
    it('should not have accessibility violations on donation policy page', async () => {
      const { container } = render(<DonationPolicy />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Vulnerability Disclosure Policy Page Accessibility', () => {
    it('should not have accessibility violations on vulnerability disclosure policy page', async () => {
      const { container } = render(<VulnerabilityDisclosurePolicy />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Security Acknowledgements Page Accessibility', () => {
    it('should not have accessibility violations on security acknowledgements page', async () => {
      const { container } = render(<SecurityAcknowledgements />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Training Plan Page Accessibility', () => {
    it('should not have accessibility violations on training plan page', async () => {
      const { container } = render(<TrainingPlan />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
