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
import TrainingPlan from '@/app/training-plan/page'

describe('Accessibility Tests', () => {
  describe('Home Page Accessibility', () => {
    it('should not have accessibility violations on home page', async () => {
      const { container } = render(<Home />)
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

  describe('Training Plan Page Accessibility', () => {
    it('should not have accessibility violations on training plan page', async () => {
      const { container } = render(<TrainingPlan />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
