# Failed Feature Experiments

This document tracks features that were attempted but ultimately abandoned due to technical limitations or insurmountable issues. These are documented to preserve the learning experience and prevent future attempts at the same approaches.

---

## GPG Auto-Signing for Bot Commits

**Status:** ❌ **FAILED** - Abandoned after extensive troubleshooting  
**Attempted:** November 2024 - January 2025  
**Issue:** [#93](https://github.com/FreeForCharity/ffcadmin.org/issues/93)  
**Pull Request:** [#94](https://github.com/FreeForCharity/ffcadmin.org/pull/94)

### The Goal

Automatically sign bot commits (from Copilot, GitHub Actions, etc.) with GPG signatures to satisfy branch protection rules requiring signed commits on the `main` branch.

### What Was Attempted

Over multiple months, the following approaches were tried:

1. **Actor-Based Bot Detection (Initial Approach)**
   - Used hardcoded checks for `github.actor == 'copilot-swe-agent[bot]'`
   - **Problem:** Workflow was consistently skipped; actor context didn't match commit authors

2. **Email Pattern-Based Bot Detection**
   - Switched to regex patterns matching bot email addresses
   - Patterns: `\[bot\]@`, `@.*noreply\.github\.com`, `Copilot@`
   - **Result:** Workflow no longer skipped, but GPG import still failed

3. **GPG Key Import Attempts**
   - Used `crazy-max/ghaction-import-gpg@v6` action
   - Tried with and without passphrase
   - Set `trust_level: 5` (ultimate trust)
   - **Problem:** Action reported success but no keys were imported to keyring

4. **Author Email Mismatch Fix**
   - Reset commit author to match GPG key identity using `--reset-author`
   - Configured Git to use GPG key's name/email
   - **Problem:** Still failed with "No secret key" error

5. **Comprehensive Diagnostics**
   - Added GPG keyring verification
   - Added test signing capability checks
   - Added detailed error messages
   - **Finding:** Import step succeeded with 0s execution time but no keys in keyring

6. **Passphrase Fallback Logic**
   - Implemented dual import (with/without passphrase)
   - Used `continue-on-error` for graceful fallback
   - **Problem:** Both methods failed silently

7. **Strict Verification**
   - Added explicit checks for GPG secret keys existence
   - Added mandatory test signing before commit signing
   - **Result:** Workflow now failed earlier with clear errors, but still couldn't import key

### Root Cause (Best Guess)

The `GPG_PRIVATE_KEY` organization secret appears to have a format issue:

- Not in correct ASCII-armored format, OR
- Corrupted/incomplete key data, OR
- Key format incompatible with the import action

The `crazy-max/ghaction-import-gpg` action would complete successfully (showing checkmarks) but would not actually import any keys into the GPG keyring, causing the signing step to fail with "gpg: signing failed: No secret key".

### Why It Failed

Despite extensive debugging and multiple approaches over several months:

1. Could not determine the exact format issue with the GPG key
2. No clear error messages from the import action
3. Silent failures made debugging extremely difficult
4. Could not access or regenerate the organization-level secret
5. Time investment exceeded the value of the feature

### Lessons Learned

1. **Silent Failures Are Dangerous**
   - The import action reporting success while not actually importing keys wasted significant debugging time
   - Always add explicit verification steps for critical operations

2. **GPG Key Format Matters**
   - ASCII-armored format is required
   - Even small corruption can cause silent failures
   - Test keys locally before using in CI/CD

3. **Organization Secrets Are Hard to Debug**
   - Can't view the actual secret value
   - Can't easily regenerate or update
   - Consider repository-level secrets for easier debugging

4. **Know When to Stop**
   - After 2+ months and 17 commits, the feature wasn't working
   - Sometimes the pragmatic solution is to remove the requirement

### Alternative Approaches Considered

1. **Remove Branch Protection Requirement**
   - Allow unsigned commits from trusted bots
   - Simpler but reduces security posture

2. **Manual Signing Workflow**
   - Have human reviewers sign commits before merge
   - Not scalable for automated workflows

3. **Different GPG Action**
   - Try other GPG import actions
   - Likely to hit the same key format issue

### What We're Doing Instead

**Removing the signed commit requirement from branch protection rules.**

This is the pragmatic solution that:

- Eliminates the blocking issue for bot commits
- Reduces complexity in the CI/CD pipeline
- Allows development to proceed without GPG overhead
- Can be revisited in the future if needed

### Related Documentation (Archived)

The following documents were created during this effort and are preserved for reference:

- `docs/archived/AUTO_SIGN_FIX.md` - Detailed fix documentation
- `docs/archived/GPG_SECRET_ACCESS.md` - GPG secret troubleshooting guide
- `.github/workflows/auto-sign-commits.yml` - The failed workflow (deleted)
- `docs/archived/GPG_SIGNING.md` - GPG signing requirements documentation
- `QUICK_START.md` - GPG setup quick start guide (marked as archived)

These files document the extensive troubleshooting effort and may be useful if attempting similar features in the future.

### Conclusion

Sometimes the best solution is to recognize when a feature isn't working and remove it rather than continuing to invest time in debugging. This experiment taught valuable lessons about CI/CD debugging, GPG key management, and knowing when to cut losses.

---

**Last Updated:** 2026-01-05  
**Decision Made By:** Repository Owner (@clarkemoyer)
