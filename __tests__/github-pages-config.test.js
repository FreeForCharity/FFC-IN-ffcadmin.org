/**
 * GitHub Pages Configuration Tests
 * 
 * These tests ensure the site is properly configured for GitHub Pages deployment.
 */

const fs = require('fs');
const path = require('path');

describe('GitHub Pages Configuration Tests', () => {
  const outDir = path.join(process.cwd(), 'out');
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');

  describe('Test Case 2.1: .nojekyll File Exists', () => {
    it('should have .nojekyll file in output directory', () => {
      const nojekyllPath = path.join(outDir, '.nojekyll');
      expect(fs.existsSync(nojekyllPath)).toBe(true);
    });

    it('should have .nojekyll file be a file (not directory)', () => {
      const nojekyllPath = path.join(outDir, '.nojekyll');
      if (fs.existsSync(nojekyllPath)) {
        const stats = fs.statSync(nojekyllPath);
        expect(stats.isFile()).toBe(true);
      }
    });
  });

  describe('Test Case 2.2: Next.js Export Configuration', () => {
    it('should have next.config.js file', () => {
      expect(fs.existsSync(nextConfigPath)).toBe(true);
    });

    it('should have output set to "export"', () => {
      const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
      expect(configContent).toMatch(/output:\s*['"]export['"]/);
    });

    it('should have images.unoptimized set to true', () => {
      const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
      expect(configContent).toMatch(/unoptimized:\s*true/);
    });

    it('should have trailingSlash set to true', () => {
      const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
      expect(configContent).toMatch(/trailingSlash:\s*true/);
    });

    it('should be configured for custom domain (no basePath)', () => {
      const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
      // Should NOT have basePath since we're using custom domain
      expect(configContent).not.toMatch(/basePath:/);
    });
  });
});
