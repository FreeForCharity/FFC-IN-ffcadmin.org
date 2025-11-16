# Auto-Signing Test

This file was created to test the auto-signing functionality with the Free For Charity GPG key.

Test Date: 2025-11-16 17:04:55 UTC
Branch: copilot/fix-verified-signatures
Actor: copilot-swe-agent[bot]

The auto-sign-commits.yml workflow should:
1. Detect this commit is from a bot (copilot-swe-agent[bot])
2. Check if GPG_PRIVATE_KEY secret is configured (should be at org level)
3. Import the Free For Charity GPG key
4. Sign this commit if unsigned
5. Force push the signed commit

Expected Signature:
- Key ID: B5C1FBB290F87E9D
- Signer: Free For Charity <globaladmin@freeforcharity.org>

