# GPG Commit Signing Configuration

## Problem

This repository has branch protection rules that require all commits to have verified GPG signatures before they can be merged into `main`. This prevents unsigned commits from automated tools like GitHub Copilot from being merged.

## Understanding Verified Signatures on GitHub

GitHub marks commits as "Verified" when:
1. The commit is signed with a GPG or SSH key
2. The public key is registered with the GitHub account that made the commit
3. The commit author email matches an email in that GitHub account

## Solutions

### Option 1: Configure Repository Settings (Recommended for Bot Commits)

Repository administrators can adjust branch protection rules to work with bot commits:

1. Go to **Settings → Branches → Branch protection rules** for `main`
2. Under "Require signed commits", consider one of these approaches:
   - Uncheck "Require signed commits" to allow unsigned commits from trusted bots
   - Use "Rulesets" to create exceptions for specific bot accounts
   - Configure "Required status checks" but allow bot commits without signatures

**Trade-offs**: This reduces security for automated commits but maintains it for human commits.

### Option 2: Use GitHub App with Web-Based Signing

For automated commits that need signatures:

1. Create a GitHub App with commit signing capabilities
2. Configure the app to sign commits on behalf of the repository
3. Use the GitHub API to create signed commits programmatically

**Trade-offs**: More complex setup but maintains full signature requirements.

### Option 3: Configure GPG Signing for the Bot Account

For bot accounts (like copilot-swe-agent[bot]):

1. Generate a GPG key for the bot
2. Export the public key
3. Add it to the bot's GitHub account settings (requires admin access to the bot account)

**Important**: Regular users cannot add GPG keys to GitHub's bot accounts (like `copilot-swe-agent[bot]`). This must be configured by GitHub or the bot infrastructure.

### Option 4: Manual Commit Signing in Workflows

For GitHub Actions workflows that create commits:

```yaml
- name: Import GPG key
  uses: crazy-max/ghaction-import-gpg@v6
  with:
    gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
    passphrase: ${{ secrets.GPG_PASSPHRASE }}
    git_user_signingkey: true
    git_commit_gpgsign: true

- name: Make signed commit
  run: |
    git add .
    git commit -S -m "Your commit message"
```

**Requirements**:
- Store GPG private key in repository secrets
- Configure the corresponding public key in the GitHub account

### Option 5: Use Signed Commits via GitHub API

When using the GitHub API to create commits (e.g., in custom actions):

```javascript
await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
  owner: 'FreeForCharity',
  repo: 'ffcadmin.org',
  message: 'Commit message',
  tree: treeSha,
  parents: [parentSha],
  signature: gpgSignature  // Requires GPG signature
})
```

## Current Repository Configuration

This repository requires:
- ✅ Signed commits for all branches merging into `main`
- ✅ At least 1 approving review from users with write access
- ⚠️ Approvals from users who collaborated with Copilot don't count toward review requirements

## Recommendations for This Repository

Given that this is an open-source project using GitHub Copilot and automated workflows:

1. **Short-term**: Repository admins should either:
   - Adjust branch protection to allow unsigned commits from `copilot-swe-agent[bot]`
   - Manually sign and push commits after Copilot creates them

2. **Long-term**: 
   - Set up a GitHub App with signing capabilities for automated commits
   - OR use GitHub Actions workflows with GPG signing for all automated changes
   - Maintain signed commit requirements for human contributors

## Verifying Commit Signatures

To check if commits are signed:

```bash
# View signature info for recent commits
git log --show-signature -5

# Verify a specific commit
git verify-commit <commit-sha>

# Check current git signing configuration
git config --list | grep sign
```

## Resources

- [GitHub Docs: Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [GitHub Docs: About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- [GitHub Docs: Branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
