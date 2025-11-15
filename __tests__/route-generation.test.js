/**
 * Route Generation Tests
 * 
 * These tests verify that all defined routes are properly generated as static pages.
 */

const fs = require('fs');
const path = require('path');

describe('Route Generation Tests', () => {
  const outDir = path.join(process.cwd(), 'out');

  describe('Test Case 4.1: Home Page Generation', () => {
    const indexPath = path.join(outDir, 'index.html');

    it('should generate index.html for home page', () => {
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('should have home page with HTML content', () => {
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        expect(content).toContain('<!DOCTYPE html>');
        expect(content).toContain('<html');
      }
    });

    it('should have home page with expected content', () => {
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        // Check for some expected content from the home page
        expect(content.length).toBeGreaterThan(1000);
      }
    });
  });

  describe('Test Case 4.2: Tech Stack Page Generation', () => {
    const techStackPath = path.join(outDir, 'tech-stack', 'index.html');

    it('should generate index.html for tech stack page', () => {
      expect(fs.existsSync(techStackPath)).toBe(true);
    });

    it('should have tech stack page with HTML content', () => {
      if (fs.existsSync(techStackPath)) {
        const content = fs.readFileSync(techStackPath, 'utf-8');
        expect(content).toContain('<!DOCTYPE html>');
        expect(content).toContain('<html');
      }
    });

    it('should have tech stack directory', () => {
      const techStackDir = path.join(outDir, 'tech-stack');
      expect(fs.existsSync(techStackDir)).toBe(true);
      if (fs.existsSync(techStackDir)) {
        const stats = fs.statSync(techStackDir);
        expect(stats.isDirectory()).toBe(true);
      }
    });
  });
});
