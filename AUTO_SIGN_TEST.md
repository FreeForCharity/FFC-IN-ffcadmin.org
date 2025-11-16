# Auto-Signing Test Documentation

## Purpose

This file documents the testing procedure for verifying that automatic GPG commit signing is working correctly in this repository.

## What is Auto-Signing?

Auto-signing is a GitHub Actions workflow that automatically adds GPG signatures to commits made by bots (like Copilot) to satisfy branch protection rules that require signed commits.

## Test Record

**Test Date:** 2025-11-16 17:04:55 UTC  
**Branch:** copilot/fix-verified-signatures  
**Actor:** copilot-swe-agent[bot]

## How the Auto-Sign Workflow Works

When a bot creates a commit, the `auto-sign-commits.yml` workflow:

1. **Detects Bot Commits** - Identifies commits made by bot accounts (e.g., copilot-swe-agent[bot])
2. **Checks Configuration** - Verifies that `GPG_PRIVATE_KEY` secret is available
3. **Imports GPG Key** - Loads the Free For Charity GPG key from repository secrets
4. **Signs the Commit** - Adds a GPG signature to the unsigned commit
5. **Updates Repository** - Force pushes the signed commit back to the branch

## Expected Signature Details

When the workflow completes successfully, commits will show:

- **Key ID:** B5C1FBB290F87E9D
- **Signer:** Free For Charity <globaladmin@freeforcharity.org>
- **Status on GitHub:** ✅ Verified

## How to Verify Auto-Signing Works

### Method 1: Check on GitHub Web Interface

1. Navigate to the repository on GitHub
2. Go to the commit history
3. Look for commits made by bots
4. Verify they show a "Verified" badge with the GPG signature

### Method 2: Using Git Command Line

```bash
# View commit signature
git log --show-signature -1 <commit-hash>

# Expected output should include:
# gpg: Signature made [date]
# gpg: Good signature from "Free For Charity <globaladmin@freeforcharity.org>"
```

## Troubleshooting

### Commits Still Show as Unverified

**Possible Causes:**
1. `GPG_PRIVATE_KEY` secret not configured
2. Public key not added to GitHub account
3. Workflow disabled or failing

**Solution:**
1. Check repository secrets: Settings → Secrets and variables → Actions
2. Verify public key added: GitHub Settings → SSH and GPG keys
3. Check workflow runs: Actions tab → Look for "Auto-Sign Commits" workflow

### Workflow Not Running

**Possible Causes:**
1. Workflow file missing or incorrect
2. Branch protection not triggering workflow
3. Bot commits not being detected

**Solution:**
1. Verify `.github/workflows/auto-sign-commits.yml` exists
2. Check workflow trigger conditions match your setup
3. Review workflow logs in Actions tab

## Related Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick setup guide for GPG signing
- **[SETUP_AUTO_SIGNING.md](SETUP_AUTO_SIGNING.md)** - Detailed configuration instructions
- **[GPG_SIGNING.md](GPG_SIGNING.md)** - Technical documentation on GPG signing
- **[gpg-keys/README.md](gpg-keys/README.md)** - GPG key information and management

## For Repository Administrators

To set up or verify auto-signing:

1. **Initial Setup:** Follow [QUICK_START.md](QUICK_START.md) to configure GPG keys
2. **Make Test Commit:** Create a commit using a bot account or GitHub Actions
3. **Verify Signature:** Check that the commit shows as "Verified" on GitHub
4. **Review Logs:** Check Actions tab for workflow execution logs
5. **Validate Branch Protection:** Ensure "Require signed commits" rule is satisfied

## For New Developers

If you encounter unsigned commit errors:

1. **Don't worry** - This is expected if GPG signing isn't set up yet
2. **Contact Repository Admin** - They can configure auto-signing
3. **Alternative:** Set up personal GPG signing following [GPG_SIGNING.md](GPG_SIGNING.md)
4. **Learn More:** Read the documentation linked above to understand the system

