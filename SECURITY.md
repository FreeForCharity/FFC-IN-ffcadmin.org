# Security Policy

## Supported Versions

We actively maintain and apply security updates to the following versions:

| Version | Supported          | Notes                                   |
| ------- | ------------------ | --------------------------------------- |
| Latest  | :white_check_mark: | Deployed at https://ffcadmin.org        |
| Main    | :white_check_mark: | Active development branch               |
| Others  | :x:                | Older versions are not actively patched |

This project follows a continuous deployment model where the latest `main` branch is automatically deployed to production after passing all security and quality checks.

## Security Features

### Automated Security Scanning

**CodeQL Analysis**

We use GitHub's CodeQL security scanning to automatically detect vulnerabilities in our JavaScript/TypeScript codebase:

- **Frequency**: Weekly (every Monday at 6:00 AM UTC) + on every PR and push to main
- **Scope**: JavaScript/TypeScript security vulnerabilities
- **Results**: Available in the [Security tab](https://github.com/FreeForCharity/ffcadmin.org/security)

**Dependency Monitoring**

Dependabot is configured to monitor and automatically update dependencies:

- **Frequency**: Weekly checks (Mondays at 9:00 AM UTC)
- **Scope**: npm packages and GitHub Actions
- **Groups**: Separates production vs. development dependencies, major vs. minor/patch updates
- **Configuration**: See `.github/dependabot.yml`

### Code Quality and Security Controls

**GPG Commit Signing**

All commits to the `main` branch must be GPG-signed:

- Ensures commit authenticity and integrity
- Automated signing configured via GitHub Actions
- See [GPG_SIGNING.md](GPG_SIGNING.md) for technical details
- See [QUICK_START.md](QUICK_START.md) for setup instructions

**CI/CD Security Gates**

Code cannot be deployed without passing:

1. ✅ Code formatting validation (Prettier)
2. ✅ Linting checks (ESLint with security rules)
3. ✅ TypeScript strict mode compilation
4. ✅ Build verification
5. ✅ Comprehensive test suite (218+ tests)
6. ✅ CodeQL security analysis

See [.github/workflows/README.md](.github/workflows/README.md) for detailed CI/CD documentation.

### Architecture Security

**Static Site Design**

This project is a static Next.js site with no server-side components, which provides inherent security benefits:

- ✅ No API endpoints or server-side code to exploit
- ✅ No database connections or data persistence
- ✅ No user authentication or session management
- ✅ Deployed as static HTML/CSS/JS files to GitHub Pages
- ✅ CDN delivery through GitHub Pages and CloudFlare

**Content Security**

- All content is embedded at build time
- No dynamic data fetching or external API calls
- No user-generated content or form submissions
- Analytics via Google Tag Manager with GDPR-compliant cookie consent

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues, as this could put users at risk before a fix is available.

### 2. Report via GitHub Security Advisories

The preferred method is to use GitHub's private security advisory feature:

1. Go to the [Security tab](https://github.com/FreeForCharity/ffcadmin.org/security)
2. Click "Advisories"
3. Click "New draft security advisory"
4. Fill in the details about the vulnerability

### 3. Alternative: Email Report

If you prefer, you can email security reports to the repository maintainers:

- Include a detailed description of the vulnerability
- Provide steps to reproduce the issue
- Suggest a potential fix if you have one
- Allow reasonable time for a response (we aim for 48 hours)

### 4. What to Include

When reporting a vulnerability, please include:

- **Description**: Clear explanation of the vulnerability
- **Impact**: What could an attacker do with this vulnerability?
- **Affected Components**: Which files, routes, or features are affected?
- **Steps to Reproduce**: Detailed steps to demonstrate the issue
- **Suggested Fix**: If you have ideas for remediation
- **Disclosure Timeline**: When you plan to publicly disclose (if at all)

### 5. What to Expect

After you submit a vulnerability report:

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: We'll assess the severity and impact (typically within 1 week)
- **Fix Development**: We'll develop and test a fix
- **Disclosure**: We'll coordinate public disclosure with you
- **Credit**: We'll credit you in the security advisory (unless you prefer to remain anonymous)

### Severity Guidelines

We use the following criteria to assess vulnerability severity:

- **Critical**: Direct exploitation leading to data breach, XSS, or code execution
- **High**: Significant security impact requiring immediate attention
- **Medium**: Security issues with limited scope or requiring user interaction
- **Low**: Minor security concerns with minimal impact

## Security Update Policy

### Dependency Updates

- **Critical vulnerabilities**: Patched within 24-48 hours
- **High severity**: Patched within 1 week
- **Medium/Low severity**: Addressed in next scheduled update (typically weekly)

### Deployment Process

When a security update is required:

1. Security fix is developed and tested
2. All CI/CD checks must pass (including CodeQL)
3. Automated deployment to GitHub Pages
4. Changes are live at https://ffcadmin.org within 5 minutes
5. Security advisory published (if applicable)

### Communication

- Security updates are documented in commit messages
- Significant vulnerabilities are announced via GitHub Security Advisories
- Check the [Security tab](https://github.com/FreeForCharity/ffcadmin.org/security) for all advisories

## Known Security Considerations

### Current Status

As of the last security review:

- ✅ No known critical or high severity vulnerabilities
- ✅ All dependencies are up to date
- ✅ CodeQL scanning shows no active alerts
- ✅ Static site architecture minimizes attack surface

### Dependency Vulnerabilities

Current dependency status is tracked in [CODE_QUALITY.md](CODE_QUALITY.md). Any known vulnerabilities in transitive dependencies are documented there with acceptance criteria or remediation plans.

### Third-Party Services

This site uses the following third-party services:

- **GitHub Pages**: Static hosting and CDN
- **CloudFlare**: DNS and additional CDN layer (proxy mode)
- **Google Tag Manager** (GTM-WMZH965Q): Analytics with cookie consent
- **Microsoft Clarity**: User behavior analytics (via GTM)

All third-party integrations follow GDPR-compliant cookie consent practices.

## Security Best Practices for Contributors

If you're contributing to this project, please follow these security guidelines:

### Code Review Checklist

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No direct DOM manipulation that could lead to XSS
- [ ] No use of `dangerouslySetInnerHTML` without sanitization
- [ ] Dependencies are added via `pnpm add` (not manual edits)
- [ ] New dependencies checked against npm audit
- [ ] Follow TypeScript strict mode (no `any` types without justification)
- [ ] All external links use `rel="noopener noreferrer"` for security

### Development Environment

- Use `pnpm` (not npm or yarn) for consistency
- Run `pnpm audit` before adding new dependencies
- Keep local dependencies up to date
- Use Node.js 20 LTS (as specified in `.nvmrc` or package.json)

### Testing Security Changes

When making security-related changes:

```bash
# 1. Format code
pnpm run format

# 2. Run linter (includes security rules)
pnpm run lint

# 3. Build the project
pnpm run build

# 4. Run tests
pnpm test

# 5. Check for vulnerabilities
pnpm audit
```

### Commit Guidelines

- GPG signing is handled automatically by CI/CD
- Write clear commit messages explaining security implications
- Reference security advisories or CVEs when applicable
- Use conventional commit format (enforced by commitlint)

## Additional Security Resources

### Project Documentation

- [CODE_QUALITY.md](CODE_QUALITY.md) - Code quality and security scanning details
- [GPG_SIGNING.md](GPG_SIGNING.md) - Commit signing technical documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [.github/workflows/README.md](.github/workflows/README.md) - CI/CD security gates

### External Resources

- [GitHub Security Advisories](https://github.com/advisories)
- [npm Security Advisories](https://www.npmjs.com/advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)

## Security Contact

For security inquiries that are not vulnerability reports:

- Review the [Security tab](https://github.com/FreeForCharity/ffcadmin.org/security)
- Check [existing issues](https://github.com/FreeForCharity/ffcadmin.org/issues)
- Contact repository maintainers via GitHub

## License and Legal

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for details.

Security-related contributions are subject to the same license terms as the main project.

---

**Last Updated**: 2025-11-21  
**Document Version**: 1.0  
**Maintained By**: Free For Charity Development Team
