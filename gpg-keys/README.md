# Pre-Generated GPG Keys for Auto-Signing

This directory contains a pre-generated GPG key pair for setting up automatic commit signing.

## ⚠️ SECURITY WARNING

**The `private-key.asc` file contains sensitive cryptographic material.**

- ✅ DO: Add the private key to GitHub Secrets immediately
- ✅ DO: Delete the private key file after adding to secrets
- ❌ DON'T: Commit the private key to the repository
- ❌ DON'T: Share the private key with anyone
- ❌ DON'T: Store the private key in plain text anywhere

## Files in This Directory

| File | Description | Safe to Commit? |
|------|-------------|-----------------|
| `public-key.asc` | Public GPG key | ✅ Yes - can be public |
| `private-key.asc` | Private GPG key | ❌ NO - must be secret |
| `key-info.txt` | Key details | ✅ Yes |
| `README.md` | This file | ✅ Yes |

## Quick Setup

### 1. Add Public Key to GitHub

```bash
# Copy the public key
cat gpg-keys/public-key.asc

# Go to: https://github.com/settings/gpg/new
# Paste the key and click "Add GPG key"
```

### 2. Add Private Key to Repository Secrets

```bash
# Copy the private key (the entire content)
cat gpg-keys/private-key.asc

# Go to: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions
# Click "New repository secret"
# Name: GPG_PRIVATE_KEY
# Value: [paste the entire private key]
# Click "Add secret"
```

### 3. Delete the Private Key

```bash
# After adding to GitHub Secrets, immediately delete the local copy
rm gpg-keys/private-key.asc

# Verify it's gone
ls gpg-keys/
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

## Key Details

- **Key ID:** 8E3672A3D791FFFD
- **Algorithm:** RSA 4096-bit
- **Identity:** github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
- **Passphrase:** None (optimized for automation)
- **Expiration:** Never

## Cleanup After Setup

After successfully adding the keys to GitHub:

```bash
# Remove the private key
rm gpg-keys/private-key.asc

# Optionally remove the entire directory
rm -rf gpg-keys/
```

The public key in your GitHub account settings will remain active and usable.

## Need Help?

See the main setup guide: [SETUP_AUTO_SIGNING.md](../SETUP_AUTO_SIGNING.md)
