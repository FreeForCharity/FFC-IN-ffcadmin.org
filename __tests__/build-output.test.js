/**
 * Build Output Tests
 * 
 * These tests verify that the build process produces the correct output structure
 * for deployment to GitHub Pages.
 */

const fs = require('fs');
const path = require('path');

describe('Build Output Tests', () => {
  const outDir = path.join(process.cwd(), 'out');

  describe('Test Case 1.1: Build Creates Output Directory', () => {
    it('should have an out directory after build', () => {
      expect(fs.existsSync(outDir)).toBe(true);
    });

    it('should have out directory be a directory', () => {
      if (fs.existsSync(outDir)) {
        const stats = fs.statSync(outDir);
        expect(stats.isDirectory()).toBe(true);
      }
    });
  });

  describe('Test Case 1.2: Build Output Contains Required Files', () => {
    it('should contain index.html (home page)', () => {
      const indexPath = path.join(outDir, 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('should contain tech-stack/index.html (tech stack page)', () => {
      const techStackPath = path.join(outDir, 'tech-stack', 'index.html');
      expect(fs.existsSync(techStackPath)).toBe(true);
    });

    it('should contain _next directory (Next.js assets)', () => {
      const nextDir = path.join(outDir, '_next');
      expect(fs.existsSync(nextDir)).toBe(true);
      if (fs.existsSync(nextDir)) {
        const stats = fs.statSync(nextDir);
        expect(stats.isDirectory()).toBe(true);
      }
    });

    it('should contain 404.html (error page)', () => {
      const errorPage = path.join(outDir, '404.html');
      expect(fs.existsSync(errorPage)).toBe(true);
    });

    it('should have _next directory with static assets', () => {
      const nextStaticDir = path.join(outDir, '_next', 'static');
      expect(fs.existsSync(nextStaticDir)).toBe(true);
    });
  });
});
