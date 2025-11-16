# Free For Charity GPG Key for Auto-Signing

This directory contains the official Free For Charity GPG key for signing automated commits.

## Key Information

- **Organization:** Free For Charity
- **Email:** globaladmin@freeforcharity.org  
- **Key ID:** B5C1FBB290F87E9D
- **Fingerprint:** 0243 BDC3 13EF 38A0 4610 B8D0 B5C1 FBB2 90F8 7E9D
- **Type:** RSA 4096-bit
- **Valid:** 11/16/2025 - 11/16/2028
- **Created With:** Kleopatra on Windows

## ⚠️ SECURITY WARNING

**The private key must be kept secure.**

- ✅ DO: Add the private key to GitHub Secrets immediately
- ✅ DO: Delete the private key file after adding to secrets
- ❌ DON'T: Commit the private key to the repository (it's gitignored)
- ❌ DON'T: Share the private key with anyone
- ❌ DON'T: Store the private key in plain text anywhere except GitHub Secrets

## Files in This Directory

| File | Description | Safe to Commit? |
|------|-------------|-----------------|
| `public-key.asc` | Public GPG key | ✅ Yes - can be public |
| `private-key.asc` | Private GPG key | ❌ NO - must be secret (gitignored) |
| `key-info.txt` | Key details | ✅ Yes |
| `README.md` | This file | ✅ Yes |

**Note:** The private key file is not included in this repository. You must obtain it separately from the key owner.

## Quick Setup

### 1. Add Public Key to GitHub

```bash
# Copy the public key
cat gpg-keys/public-key.asc

# Go to: https://github.com/settings/gpg/new
# Paste the key and click "Add GPG key"
```

### 2. Add Private Key to Repository Secrets

**Important:** You need to obtain the private key from the key owner.

```bash
# Once you have the private key file:
# Go to: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions
# Click "New repository secret"
# Name: GPG_PRIVATE_KEY
# Value: [paste the entire private key including BEGIN/END lines]
# Click "Add secret"
```

### 3. Secure the Private Key

```bash
# After adding to GitHub Secrets, immediately delete any local copies
rm /path/to/private-key-file

# Never commit private keys to any repository
```

## Verification

After setup, test that auto-signing works:

```bash
# Create a test commit (as a bot or via GitHub Actions)
# The auto-sign-commits workflow will automatically sign it
# Check that the commit shows "Verified" on GitHub
```

## What This Enables

Once configured:
- ✅ GitHub Actions workflows can make signed commits
- ✅ Copilot PRs will have verified signatures
- ✅ Branch protection "require signed commits" is satisfied
- ✅ No more "commits must have verified signatures" errors

## Technical Details

- **Key ID:** B5C1FBB290F87E9D
- **Fingerprint:** 0243 BDC3 13EF 38A0 4610 B8D0 B5C1 FBB2 90F8 7E9D
- **Algorithm:** RSA 4096-bit
- **Identity:** Free For Charity <globaladmin@freeforcharity.org>
- **Valid From:** 11/16/2025 10:45 AM
- **Expires:** 11/16/2028 12:00 PM
- **Created With:** Kleopatra on Windows

## After Setup

Once the public key is added to GitHub and the private key is in GitHub Secrets:

- The auto-sign-commits workflow will automatically sign commits from GitHub Actions bots
- Commits will show as "Verified" on GitHub with the Free For Charity signature
- Branch protection rules requiring signed commits will be satisfied

## Need Help?

See the main setup guide: [SETUP_AUTO_SIGNING.md](../SETUP_AUTO_SIGNING.md)
