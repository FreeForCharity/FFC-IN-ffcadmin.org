# Setting Up Auto-Signing for GitHub Actions

This guide will walk you through setting up automatic GPG commit signing for this repository.

## Overview

When GPG keys are properly configured, the `auto-sign-commits.yml` workflow will automatically sign any commits made by GitHub Actions bots (like copilot-swe-agent[bot] or github-actions[bot]).

**Key Information:**
- Organization: Free For Charity
- Email: globaladmin@freeforcharity.org
- Key ID: B5C1FBB290F87E9D
- Fingerprint: 0243 BDC3 13EF 38A0 4610 B8D0 B5C1 FBB2 90F8 7E9D
- Type: RSA 4096-bit
- Created with: Kleopatra on Windows
- Valid: 11/16/2025 - 11/16/2028

## Prerequisites

- Repository admin access to configure secrets
- Access to the Free For Charity private GPG key
- A few minutes to complete the setup

## Step-by-Step Setup

### Step 1: Use the Official Free For Charity GPG Key

The repository uses the official Free For Charity GPG key:
- `gpg-keys/public-key.asc` - Public key (included in repository)
- `gpg-keys/key-info.txt` - Key details

**Important:** The private key must be obtained from the key owner (created with Kleopatra on Windows).

### Step 2: Add the Public Key to GitHub

1. Go to https://github.com/settings/gpg/new
2. Copy the contents of the public key from `gpg-keys/public-key.asc`
3. Paste into the GitHub GPG key form
4. Click "Add GPG key"

### Step 3: Add Private Key to Repository Secrets

**Important:** Obtain the private key from the key owner.

1. Go to your repository settings:
   - Navigate to: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions

2. Click "New repository secret"

3. Add `GPG_PRIVATE_KEY`:
   - **Name:** `GPG_PRIVATE_KEY`
   - **Value:** Copy the entire contents of the private key (including BEGIN/END lines)
     - If using Option B: Copy from `/tmp/gpg-private-key.asc`
   - Click "Add secret"

4. If you used a passphrase, add `GPG_PASSPHRASE`:
   - **Name:** `GPG_PASSPHRASE`
   - **Value:** Your passphrase
   - Click "Add secret"

### Step 4: Secure the Private Key

**After adding to GitHub Secrets:**

- Delete any local copies of the private key
- Never commit private keys to any repository
- Store the private key only in GitHub Secrets or a secure password manager
- The public key can remain in the repository for reference

### Step 5: Test the Setup

To verify the setup works:

1. The `auto-sign-commits.yml` workflow will automatically sign commits from GitHub Actions bots
2. Check that commits show as "Verified" on GitHub with the "Free For Charity" signature
3. Verify the signature matches Key ID: B5C1FBB290F87E9D

## Verification

After setup, all future commits from GitHub Actions bots will be automatically signed. You can verify by:

1. Checking that commits show "Verified" badge on GitHub
2. Running locally: `git verify-commit <commit-hash>`

## Troubleshooting

### Commits still showing as unsigned

1. Check that secrets are properly configured:
   - Go to repository Settings → Secrets and variables → Actions
   - Verify `GPG_PRIVATE_KEY` exists

2. Check workflow logs:
   - Go to Actions tab
   - Look for "Auto-Sign Commits" workflow runs
   - Check for error messages

3. Verify the public key is added to GitHub:
   - Go to https://github.com/settings/gpg
   - Confirm your key is listed

### "No GPG key configured" warning

This means the `GPG_PRIVATE_KEY` secret is not set. Complete Step 3 above.

### Workflow doesn't run

The `auto-sign-commits.yml` workflow only runs for:
- Pushes to branches (not main)
- Commits made by bots (copilot-swe-agent[bot] or github-actions[bot])

If you're testing with your own commits, the workflow won't trigger.

## Security Notes

- **Never** commit private keys to the repository
- Store private keys only in GitHub Secrets
- Use keys without passphrases for full automation
- If using a passphrase, store it in `GPG_PASSPHRASE` secret
- Regularly rotate keys (every 1-2 years)
- Delete local copies of private keys after adding to secrets

## What Happens Next

Once configured:
1. ✅ Future Copilot PRs will have signed commits
2. ✅ GitHub Actions workflows can commit with signatures
3. ✅ Branch protection rules will be satisfied
4. ✅ PRs can be merged without signature verification errors

## Need Help?

- See `GPG_SIGNING.md` for detailed documentation
- See `ISSUE_RESOLUTION.md` for alternative solutions
- Check GitHub's [commit signature verification docs](https://docs.github.com/en/authentication/managing-commit-signature-verification)
