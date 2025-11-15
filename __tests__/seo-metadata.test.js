/**
 * SEO and Metadata Tests
 * 
 * These tests verify that SEO-related files are properly generated.
 */

const fs = require('fs');
const path = require('path');

describe('SEO and Metadata Tests', () => {
  const outDir = path.join(process.cwd(), 'out');

  describe('Test Case 3.1: robots.txt Exists', () => {
    it('should have robots.txt in output directory', () => {
      const robotsPath = path.join(outDir, 'robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);
    });

    it('should have robots.txt be a file', () => {
      const robotsPath = path.join(outDir, 'robots.txt');
      if (fs.existsSync(robotsPath)) {
        const stats = fs.statSync(robotsPath);
        expect(stats.isFile()).toBe(true);
      }
    });

    it('should have robots.txt with content', () => {
      const robotsPath = path.join(outDir, 'robots.txt');
      if (fs.existsSync(robotsPath)) {
        const content = fs.readFileSync(robotsPath, 'utf-8');
        expect(content.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Test Case 3.2: sitemap.xml Exists', () => {
    it('should have sitemap.xml in output directory', () => {
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);
    });

    it('should have sitemap.xml be a file', () => {
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      if (fs.existsSync(sitemapPath)) {
        const stats = fs.statSync(sitemapPath);
        expect(stats.isFile()).toBe(true);
      }
    });

    it('should have sitemap.xml with XML content', () => {
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      if (fs.existsSync(sitemapPath)) {
        const content = fs.readFileSync(sitemapPath, 'utf-8');
        expect(content).toContain('<?xml');
        expect(content).toContain('<urlset');
      }
    });
  });
});
