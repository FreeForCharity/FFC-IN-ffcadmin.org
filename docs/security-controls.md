# Security Controls (Public Acknowledgment)

> Status note (#272): this documents the security controls FFC operates for its
> privileged administrator identity. It is a public acknowledgment of practice,
> not a configuration export. Some items are confirmed in place; one is flagged
> as a target/gap and tracked for remediation.

## Privileged identity: `globaladmin@freeforcharity.org`

| Control                                      | Status           | Notes                                                                                                                                            |
| -------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Multi-factor authentication (MFA)**        | ✅ Enforced      | Enforced for the global administrator identity.                                                                                                  |
| **Conditional Access — Azure / Entra level** | ✅ Enforced      | Conditional Access policies are enforced at the Azure (Microsoft Entra) level.                                                                   |
| **Conditional Access — Microsoft 365 level** | ⚠️ Target / gap  | Not yet enforced at the M365 workload level. Tracked for remediation; until then, MFA + Entra-level Conditional Access provide the primary gate. |
| **Single sign-on (SSO) only access**         | ◻️ Not confirmed | Whether admin access is restricted to SSO-only is not yet confirmed; to be reviewed and documented. Tracked with #272.                           |
| **Least privilege**                          | ✅ Practice      | Global Administrator access is limited to the personnel who require it; volunteers receive narrowly scoped access.                               |
| **Auditability**                             | ✅ Practice      | Administrative actions are auditable through Microsoft 365 / Entra sign-in and audit logs.                                                       |

## Why this matters

The global administrator identity can manage tenant-wide settings, so it is the
highest-value account to protect. MFA plus Conditional Access materially reduce
the risk of credential compromise.

## Remediation tracking

- **M365-level Conditional Access:** extend Conditional Access coverage to the
  Microsoft 365 workload level so policy is enforced consistently across both
  Entra and M365. Tracked in issue #272.
- **SSO-only admin access:** confirm whether privileged access is restricted to
  single sign-on only, and document the result. Tracked in issue #272.

## Related

- Repository security rules: [`.claude/rules/01-security.md`](../.claude/rules/01-security.md)
- Project security policy: [`SECURITY.md`](../SECURITY.md)

_Last reviewed: June 6, 2026._
