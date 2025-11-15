/**
 * Configuration Validation Tests
 * 
 * These tests validate the project configuration files.
 */

const fs = require('fs');
const path = require('path');

describe('Configuration Validation Tests', () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');

  describe('Test Case 5.1: Package.json Node Version', () => {
    it('should have package.json file', () => {
      expect(fs.existsSync(packageJsonPath)).toBe(true);
    });

    it('should specify Node.js version requirement', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBeDefined();
    });

    it('should require Node.js version >= 20.0.0', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const nodeVersion = packageJson.engines?.node;
      expect(nodeVersion).toMatch(/>=?\s*20/);
    });

    it('should have pnpm as package manager', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      expect(packageJson.packageManager).toBeDefined();
      expect(packageJson.packageManager).toMatch(/pnpm@/);
    });
  });

  describe('Test Case 5.2: Package Manager Lock File', () => {
    it('should have pnpm-lock.yaml file', () => {
      expect(fs.existsSync(pnpmLockPath)).toBe(true);
    });

    it('should have pnpm-lock.yaml be a file', () => {
      if (fs.existsSync(pnpmLockPath)) {
        const stats = fs.statSync(pnpmLockPath);
        expect(stats.isFile()).toBe(true);
      }
    });

    it('should have pnpm-lock.yaml with valid YAML content', () => {
      if (fs.existsSync(pnpmLockPath)) {
        const content = fs.readFileSync(pnpmLockPath, 'utf-8');
        // Check for lockfile version indicator
        expect(content).toContain('lockfileVersion');
      }
    });

    it('should have dependencies locked in pnpm-lock.yaml', () => {
      if (fs.existsSync(pnpmLockPath)) {
        const content = fs.readFileSync(pnpmLockPath, 'utf-8');
        // Check that it contains package references
        expect(content.length).toBeGreaterThan(1000);
      }
    });
  });
});
