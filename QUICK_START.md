# GPG Commit Signing: Quick Start Guide

This comprehensive guide helps you set up automatic GPG commit signing for the Free For Charity repository.

## Table of Contents

- [Overview](#overview)
- [Key Information](#key-information)
- [Setup (5 Minutes)](#setup-5-minutes)
- [Verification](#verification)
- [How Auto-Signing Works](#how-auto-signing-works)
- [Troubleshooting](#troubleshooting)
- [Advanced Topics](#advanced-topics)

## Overview

This repository requires all commits to `main` to have verified GPG signatures. This guide walks you through enabling automatic signing for GitHub Actions and bot commits.

**What you'll accomplish:**

- ✅ Add the Free For Charity GPG public key to your GitHub account
- ✅ Configure the private key in repository secrets
- ✅ Enable automatic signing for bot commits
- ✅ Verify the setup works correctly

**Time required:** 5 minutes

## Key Information

**Official Free For Charity Signing Key:**

- **Organization:** Free For Charity
- **Email:** globaladmin@freeforcharity.org
- **Key ID:** B5C1FBB290F87E9D
- **Fingerprint:** 0243 BDC3 13EF 38A0 4610 B8D0 B5C1 FBB2 90F8 7E9D
- **Type:** RSA 4096-bit
- **Created With:** Kleopatra on Windows
- **Valid:** 11/16/2025 - 11/16/2028

## Setup (5 Minutes)

### Step 1: Add Public Key to GitHub

1. **View the public key:**

   ```bash
   cat gpg-keys/public-key.asc
   ```

2. **Go to GitHub GPG settings:**
   - Direct link: https://github.com/settings/gpg/new
   - Or navigate: Settings → SSH and GPG keys → New GPG key

3. **Add the key:**
   - Copy the entire public key content (including BEGIN/END lines)
   - Paste into the "Key" field on GitHub
   - Click "Add GPG key"

### Step 2: Add Private Key to Repository Secrets

**Important:** The private key must be obtained from the key owner (not stored in this repository).

1. **Go to repository secrets:**
   - Direct link: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions
   - Or navigate: Repository Settings → Secrets and variables → Actions

2. **Create the `GPG_PRIVATE_KEY` secret:**
   - Click "New repository secret"
   - **Name:** `GPG_PRIVATE_KEY`
   - **Value:** Paste the entire private key (including BEGIN/END lines)
   - Click "Add secret"

3. **Optional: Add passphrase (if key has one):**
   - Click "New repository secret"
   - **Name:** `GPG_PASSPHRASE`
   - **Value:** Your passphrase
   - Click "Add secret"

### Step 3: Secure the Private Key

**After adding to GitHub Secrets:**

- ✅ Delete any local copies of the private key immediately
- ✅ Never commit private keys to any repository
- ✅ Store the private key only in GitHub Secrets or a secure password manager
- ✅ Rotate keys regularly (every 1-2 years)

### Done! 🎉

Auto-signing is now enabled. Future commits from GitHub Actions bots will be automatically signed.

## Verification

### Quick Verification

After setup, test that auto-signing works:

1. Make a test commit via GitHub Actions or Copilot
2. Check the commit on GitHub - it should show a "Verified" badge ✅
3. The signature should show: "Free For Charity <globaladmin@freeforcharity.org>"

### Method 1: GitHub Web Interface

1. Navigate to the repository on GitHub
2. Go to the commit history
3. Look for commits made by bots (copilot-swe-agent[bot] or github-actions[bot])
4. Verify they show a green "Verified" badge with the GPG signature

### Method 2: Command Line Verification

```bash
# View commit signature details
git log --show-signature -1 <commit-hash>

# Expected output:
# gpg: Signature made [date]
# gpg: Good signature from "Free For Charity <globaladmin@freeforcharity.org>"
# gpg: Key ID: B5C1FBB290F87E9D

# Verify a specific commit
git verify-commit <commit-hash>

# View signature for recent commits
git log --show-signature -5
```

### What Success Looks Like

When properly configured, you should see:

- ✅ Commits show "Verified" badge on GitHub
- ✅ Signature from "Free For Charity <globaladmin@freeforcharity.org>"
- ✅ Key ID matches B5C1FBB290F87E9D
- ✅ Branch protection rules are satisfied
- ✅ PRs can be merged without signature errors

## How Auto-Signing Works

The `auto-sign-commits.yml` workflow automatically signs bot commits:

1. **Detects Bot Commits** - Identifies commits from any bot or automated tool by checking the commit author/committer email for bot patterns (bot, noreply.github.com, copilot, etc.)
2. **Checks Configuration** - Verifies `GPG_PRIVATE_KEY` secret is available
3. **Imports GPG Key** - Loads the Free For Charity GPG key from secrets
4. **Signs the Commit** - Adds a GPG signature to the unsigned commit
5. **Updates Repository** - Force pushes the signed commit back to the branch

**Workflow File:** `.github/workflows/auto-sign-commits.yml`

**Key Features:**

- Automatically detects bot commits based on email patterns (no manual actor list needed)
- Provides detailed debugging information in workflow logs
- Skips signing for human commits to avoid conflicts
- Works with any bot: Copilot, GitHub Actions, Dependabot, etc.

**When it runs:**

- Triggered on pushes to any branch (except main)
- Only processes commits from bot accounts
- Skips commits that are already signed

## Troubleshooting

### Commits Still Show as Unsigned

**Possible Causes:**

1. `GPG_PRIVATE_KEY` secret not configured
2. Public key not added to GitHub account
3. Workflow disabled or failing
4. Commit author email doesn't match key

**Solutions:**

1. **Check repository secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Verify `GPG_PRIVATE_KEY` exists

2. **Verify public key on GitHub:**
   - Go to https://github.com/settings/gpg
   - Confirm your key is listed with Key ID: B5C1FBB290F87E9D

3. **Check workflow runs:**
   - Go to Actions tab
   - Look for "Auto-Sign Commits" workflow
   - Review logs for error messages

4. **Verify key matches:**
   - Ensure the private key matches the public key
   - Check that the key hasn't expired

### Workflow Not Running

**Possible Causes:**

1. Workflow file missing or disabled
2. Branch protection not configured
3. Commits not from bot accounts

**Solutions:**

1. **Verify workflow file exists:**
   - Check `.github/workflows/auto-sign-commits.yml` exists
   - Ensure it's enabled in repository settings

2. **Check trigger conditions:**
   - Workflow only runs for bot commits
   - Manual commits won't trigger the workflow

3. **Review workflow permissions:**
   - Go to Settings → Actions → General
   - Ensure workflows have write permissions

### "No GPG Key Configured" Error

This means the `GPG_PRIVATE_KEY` secret is not set. Complete Step 2 above to add it.

### Invalid Signature Error

**Possible Causes:**

1. Private key doesn't match public key
2. Key has expired
3. Wrong passphrase (if key requires one)

**Solutions:**

1. Verify you have the correct private key
2. Check key expiration date (should be valid until 11/16/2028)
3. If using a passphrase, ensure `GPG_PASSPHRASE` secret is correct

### Permission Denied Errors

The workflow needs write permissions to push signed commits. Ensure:

1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

## Advanced Topics

### For Repository Administrators

**Initial Setup Checklist:**

- [ ] Public key added to a GitHub account with repository access
- [ ] Private key stored in `GPG_PRIVATE_KEY` repository secret
- [ ] Passphrase stored in `GPG_PASSPHRASE` secret (if applicable)
- [ ] Workflow file exists and is enabled
- [ ] Repository has write permissions for workflows
- [ ] Branch protection requires signed commits

**Monitoring:**

- Check Actions tab regularly for workflow failures
- Verify all merged commits show "Verified" status
- Review security alerts for key expiration

**Key Rotation:**

- Current key expires: 11/16/2028
- Plan to generate new key before expiration
- Update all secrets and documentation when rotating

### For Developers

**Personal GPG Signing:**

If you want to sign your own commits (not just bot commits):

1. Generate your personal GPG key:

   ```bash
   gpg --full-generate-key
   # Choose RSA and RSA, 4096 bits
   # Use your GitHub email
   ```

2. Export and add to GitHub:

   ```bash
   gpg --armor --export YOUR_KEY_ID
   # Copy output and add to GitHub settings
   ```

3. Configure git:
   ```bash
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   ```

**See Also:**

- [GPG_SIGNING.md](GPG_SIGNING.md) - Detailed technical documentation
- [ISSUE_RESOLUTION.md](ISSUE_RESOLUTION.md) - Additional troubleshooting
- [gpg-keys/README.md](gpg-keys/README.md) - Key management details

### Alternative Solutions

If the automatic signing setup doesn't work for your needs, see [GPG_SIGNING.md](GPG_SIGNING.md) for five alternative approaches including:

1. Adjusting branch protection rules
2. Using GitHub Apps for signing
3. Configuring bot account keys
4. Manual workflow signing
5. Using GitHub API for signed commits

### Security Best Practices

- **Never** commit private keys to repositories
- Store private keys only in GitHub Secrets or secure password managers
- Use keys without passphrases for automation, or store passphrase securely
- Rotate keys every 1-2 years
- Audit key access regularly
- Delete local copies after adding to secrets
- Use separate keys for different purposes (automation vs personal)

---

**Need Help?**

- Technical documentation: [GPG_SIGNING.md](GPG_SIGNING.md)
- Issue resolution: [ISSUE_RESOLUTION.md](ISSUE_RESOLUTION.md)
- Key management: [gpg-keys/README.md](gpg-keys/README.md)
- GitHub's documentation: [Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
