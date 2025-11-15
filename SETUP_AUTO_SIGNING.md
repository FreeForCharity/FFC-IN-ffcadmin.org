# Setting Up Auto-Signing for GitHub Actions

This guide will walk you through setting up automatic GPG commit signing for this repository.

## Overview

When GPG keys are properly configured, the `auto-sign-commits.yml` workflow will automatically sign any commits made by GitHub Actions bots (like copilot-swe-agent[bot] or github-actions[bot]).

## Prerequisites

- Repository admin access to configure secrets
- A few minutes to complete the setup

## Step-by-Step Setup

### Step 1: Generate a GPG Key

You have two options:

#### Option A: Use the Pre-Generated Key (Fastest)

I've generated a GPG key specifically for this repository. See the files in the `gpg-keys/` directory:
- `gpg-keys/public-key.asc` - Public key (can be committed to the repo)
- `gpg-keys/private-key.asc` - Private key (DO NOT commit, add to secrets only)
- `gpg-keys/key-info.txt` - Key details

**Important:** The private key file should be kept secure and never committed to the repository.

#### Option B: Generate Your Own Key

Run the interactive script:
```bash
./scripts/setup-gpg-signing.sh
```

Follow the prompts to generate a new key. Use these values:
- **Name:** `github-actions[bot]`
- **Email:** `41898282+github-actions[bot]@users.noreply.github.com`
- **Passphrase:** Leave empty (recommended for automation)

### Step 2: Add the Public Key to GitHub

1. Go to https://github.com/settings/gpg/new
2. Copy the contents of the public key:
   - If using Option A: Copy from `gpg-keys/public-key.asc`
   - If using Option B: Copy from `/tmp/gpg-public-key.asc`
3. Paste into the GitHub GPG key form
4. Click "Add GPG key"

### Step 3: Add Secrets to Repository

1. Go to your repository settings:
   - Navigate to: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions

2. Click "New repository secret"

3. Add `GPG_PRIVATE_KEY`:
   - **Name:** `GPG_PRIVATE_KEY`
   - **Value:** Copy the entire contents of the private key
     - If using Option A: Copy from `gpg-keys/private-key.asc`
     - If using Option B: Copy from `/tmp/gpg-private-key.asc`
   - Click "Add secret"

4. If you used a passphrase, add `GPG_PASSPHRASE`:
   - **Name:** `GPG_PASSPHRASE`
   - **Value:** Your passphrase
   - Click "Add secret"

### Step 4: Test the Setup

To verify the setup works:

1. Create a test branch:
   ```bash
   git checkout -b test-auto-sign
   echo "test" >> test-file.txt
   git add test-file.txt
   git commit -m "Test auto-signing"
   git push origin test-auto-sign
   ```

2. The `auto-sign-commits.yml` workflow will automatically:
   - Detect the commit is from a bot
   - Check if GPG keys are configured
   - Sign the commit if unsigned
   - Force push the signed commit

3. Check the commit on GitHub - it should show as "Verified" ✅

4. Clean up:
   ```bash
   git checkout copilot/fix-verified-signatures
   git branch -D test-auto-sign
   git push origin --delete test-auto-sign
   ```

### Step 5: Clean Up Sensitive Files

If you used Option A (pre-generated key):

```bash
# After adding the private key to GitHub secrets, delete it locally
rm gpg-keys/private-key.asc

# Optionally, remove the entire directory after setup
rm -rf gpg-keys/
```

The public key can remain in the repository for reference.

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
