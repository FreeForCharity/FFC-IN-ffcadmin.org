# Quick Start: Enable Auto-Signing

This guide helps you set up automatic commit signing using the Free For Charity GPG key.

**Key Information:**

- Organization: Free For Charity
- Email: globaladmin@freeforcharity.org
- Key ID: B5C1FBB290F87E9D
- Type: RSA 4096-bit
- Valid: 11/16/2025 - 11/16/2028

## Step 1: Add Public Key to GitHub (2 minutes)

1. **View the public key:**

   ```bash
   cat gpg-keys/public-key.asc
   ```

2. **Go to GitHub GPG settings:**
   - Open: https://github.com/settings/gpg/new
   - Or navigate: Settings → SSH and GPG keys → New GPG key

3. **Add the key:**
   - Copy the entire public key (including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`)
   - Paste into the "Key" field
   - Click "Add GPG key"

## Step 2: Add Private Key to Repository Secrets

**Important:** You need to obtain the private key from the key owner (created with Kleopatra).

1. **Go to repository secrets:**
   - Open: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions
   - Or navigate: Repository Settings → Secrets and variables → Actions

2. **Create the secret:**
   - Click "New repository secret"
   - **Name:** `GPG_PRIVATE_KEY`
   - **Value:** Paste the entire private key (including `-----BEGIN PGP PRIVATE KEY BLOCK-----` and `-----END PGP PRIVATE KEY BLOCK-----`)
   - Click "Add secret"

## Step 3: Secure the Private Key

**After adding to GitHub Secrets:**

- Delete any local copies of the private key
- Never commit private keys to any repository
- Store the private key only in GitHub Secrets or a secure password manager

## Done! 🎉

Auto-signing is now enabled. Future commits from GitHub Actions bots will be automatically signed.

## Test It

Create a test to verify it works:

```bash
# The auto-sign-commits workflow will run on bot commits
# Next time Copilot or GitHub Actions makes a commit, it will be signed
# Check the commit on GitHub - it should show "Verified" ✅
```

## What Just Happened?

1. ✅ GitHub now recognizes commits signed with this key as "Verified"
2. ✅ The `auto-sign-commits.yml` workflow can access the private key
3. ✅ When bots push commits, the workflow automatically signs them
4. ✅ Branch protection "require signed commits" is satisfied

## Next Steps

- The private key is now safely stored in GitHub Secrets
- You can optionally delete the entire `gpg-keys/` directory:
  ```bash
  rm -rf gpg-keys/
  ```
- The public key will remain in your GitHub account settings

## Need More Details?

- Full guide: [SETUP_AUTO_SIGNING.md](SETUP_AUTO_SIGNING.md)
- Technical docs: [GPG_SIGNING.md](GPG_SIGNING.md)
- Issue resolution: [ISSUE_RESOLUTION.md](ISSUE_RESOLUTION.md)

## Troubleshooting

**Q: I accidentally deleted the private key before adding to secrets**

- A: Run `./scripts/setup-gpg-signing.sh` to generate a new key pair

**Q: Commits still showing as unsigned**

- A: Check that `GPG_PRIVATE_KEY` secret exists in repository settings
- A: Check GitHub Actions logs for the "Auto-Sign Commits" workflow

**Q: How do I verify it's working?**

- A: Make a test commit via GitHub Actions or Copilot
- A: Check if it shows "Verified" badge on GitHub
- A: Or run locally: `git verify-commit <commit-hash>`
