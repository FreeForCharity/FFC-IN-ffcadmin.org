# GPG Secret Access Troubleshooting Guide

## Issue

The auto-sign commits workflow is now running correctly (no longer being skipped), but it's failing to sign commits because the `GPG_PRIVATE_KEY` secret cannot be accessed.

## Diagnosis

Based on the workflow output and repository settings:

✅ **Working:** Workflow triggers on bot commits
✅ **Working:** Bot detection logic identifies Copilot commits  
❌ **Not Working:** GPG key import fails with "No secret key" error

### Root Cause

The `GPG_PRIVATE_KEY` secret exists at the **organization level** but is not accessible to this repository's workflows. GitHub Actions workflows can only access:

1. Repository-level secrets (always accessible)
2. Organization-level secrets (only if explicitly enabled for the repository)

## Current Configuration

Looking at your screenshots:

- **Organization secrets:** `GPG_PRIVATE_KEY` exists ✅
- **Repository secrets:** None (empty) ❌
- **Error message:** `gpg: skipped "B5C1FBB290F87E9D": No secret key`

This indicates the workflow cannot access the organization-level secret.

## Solutions

### Solution 1: Enable Organization Secret for This Repository (Recommended)

This approach keeps the secret at the organization level, making it easier to manage across multiple repositories.

**Steps:**

1. **Navigate to organization secrets:**
   - Go to: https://github.com/organizations/FreeForCharity/settings/secrets/actions
   - Or: GitHub → Settings (your profile) → Organizations → FreeForCharity → Settings → Secrets and variables → Actions

2. **Find the GPG_PRIVATE_KEY secret:**
   - Look under "Organization secrets"
   - Click on `GPG_PRIVATE_KEY` to edit

3. **Enable for this repository:**
   - Click "Update" or "Repository access"
   - Select "Selected repositories"
   - Add `FreeForCharity/ffcadmin.org` to the list
   - Save changes

4. **Verify the change:**
   - The repository should now appear in the list of repositories with access
   - The next workflow run should be able to access the secret

**Advantages:**

- Single source of truth for the secret
- Easy to manage across multiple repositories
- Updates propagate automatically to all enabled repositories

### Solution 2: Copy Secret to Repository Level

This approach duplicates the secret at the repository level, giving the repository direct access.

**Steps:**

1. **Get the private key value:**
   - You'll need access to the original GPG private key
   - It should be in the format:

     ```
     -----BEGIN PGP PRIVATE KEY BLOCK-----

     [key data here]

     -----END PGP PRIVATE KEY BLOCK-----
     ```

2. **Navigate to repository secrets:**
   - Go to: https://github.com/FreeForCharity/ffcadmin.org/settings/secrets/actions
   - Or: Repository → Settings → Secrets and variables → Actions

3. **Create new repository secret:**
   - Click "New repository secret"
   - **Name:** `GPG_PRIVATE_KEY`
   - **Value:** Paste the entire private key (including BEGIN/END lines)
   - Click "Add secret"

4. **Optional: Add passphrase:**
   - If the key has a passphrase, add another secret:
   - **Name:** `GPG_PASSPHRASE`
   - **Value:** The passphrase for the key

5. **Verify the change:**
   - The secret should now appear under "Repository secrets"
   - The next workflow run should be able to access it

**Advantages:**

- Repository has direct access to the secret
- No dependency on organization-level configuration
- Easier to troubleshoot

**Disadvantages:**

- Secret is duplicated (harder to manage)
- Updates must be made in multiple places

## How to Verify the Fix

After implementing either solution:

1. **Make a new commit** (or push an existing unsigned commit)

2. **Check the workflow run:**
   - Go to: https://github.com/FreeForCharity/ffcadmin.org/actions/workflows/auto-sign-commits.yml
   - Look for the latest run

3. **Verify success:**
   - The "Check if GPG key is configured" step should show: ✅ GPG_PRIVATE_KEY secret is available
   - The "Import GPG key" step should succeed
   - The "Verify GPG import" step should show key details (ID, name, email, fingerprint)
   - The "Sign last commit" step should successfully sign the commit
   - The "Push signed commit" step should push the signed commit back

4. **Check the commit:**
   - On GitHub, the commit should show a "Verified" badge ✅
   - The signature should be from: "Free For Charity <globaladmin@freeforcharity.org>"
   - Key ID: B5C1FBB290F87E9D

## Understanding the Error Message

The error you saw:

```
error: gpg failed to sign the data:
gpg: skipped "B5C1FBB290F87E9D": No secret key
```

This means:

- GPG found the key ID `B5C1FBB290F87E9D` in Git configuration
- But the actual private key was not available in the GPG keyring
- This happens when the `ghaction-import-gpg` action cannot access the secret

## Troubleshooting After Applying Fix

If the workflow still fails after enabling the secret:

### Check 1: Secret Value is Correct

The private key must be in the correct format:

```
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: GnuPG v2

[base64 encoded key data]
[multiple lines]
[...]
-----END PGP PRIVATE KEY BLOCK-----
```

Common mistakes:

- Missing BEGIN/END lines
- Extra whitespace or newlines at start/end
- Copying only part of the key
- Using the public key instead of private key

### Check 2: Key Matches the Public Key

The private key must match the public key that's registered with the GitHub account:

- Public key is in: `gpg-keys/public-key.asc`
- Key ID should be: B5C1FBB290F87E9D
- Key email: globaladmin@freeforcharity.org

### Check 3: Passphrase is Correct

If the key has a passphrase:

- Ensure `GPG_PASSPHRASE` secret is also set
- The passphrase must match the one used when the key was created

## Additional Resources

- [QUICK_START.md](../QUICK_START.md) - Quick setup guide for GPG signing
- [GPG_SIGNING.md](../GPG_SIGNING.md) - Detailed GPG configuration documentation
- [AUTO_SIGN_FIX.md](AUTO_SIGN_FIX.md) - Documentation of the workflow fix
- [GitHub Docs: Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Docs: Using secrets in workflows](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

## Summary

The workflow fix was successful - the workflow is no longer being skipped and bot detection is working correctly. The remaining issue is purely a secret access configuration problem that can be solved by either:

1. Enabling the organization secret for this repository (recommended), or
2. Copying the secret to repository level

Once the secret is accessible, the workflow will automatically sign all future bot commits with the organization's GPG key.

---

**Last Updated:** 2025-11-21
**Related Issue:** #93
**Related PR:** copilot/fix-auto-sign-commits-issue
