# Azure Key Vault for GitHub Actions (OIDC)

FFCadmin's automation reads every API credential from **Azure Key Vault** at
runtime, authenticating with **GitHub OIDC** (workload-identity federation). No
long-lived cloud credential or API key is stored in GitHub Secrets — Actions
exchanges its short-lived OIDC token for an Azure token, reads the secret, and
the token expires when the job ends.

This powers:

- **`whmcs-intake.yml`** — local WHMCS intake; reads the WHMCS API credentials.
- **`verify-assignment.yml`** and **`trigger-provisioning.yml`** — read the
  cross-repo `GH_PAT`.

All three **skip cleanly** until the variables below are set, so CI stays green
before setup. A `secrets.GH_PAT` still works as a fallback for the latter two.

## What you configure (one time)

### 1. An Entra identity with a federated credential

Create an Entra **app registration** (or user-assigned managed identity) and add
a **federated credential** trusting this repo's OIDC token. For scheduled +
`workflow_dispatch` runs (which run on the default branch), use subject:

```
repo:FreeForCharity/FFC-IN-ffcadmin.org:ref:refs/heads/main
```

(Issuer `https://token.actions.githubusercontent.com`, audience
`api://AzureADTokenExchange`.) The `issues.assigned` / `issues.labeled` triggers
also run on the default branch, so this one subject covers all three workflows.

### 2. Grant it read access to the vault

Give the identity the **Key Vault Secrets User** role on the vault (RBAC), or a
get/list **access policy** if the vault uses the legacy access-policy model.

### 3. Store the secrets in the vault

| Default secret name    | Holds                                           |
| ---------------------- | ----------------------------------------------- |
| `whmcs-api-identifier` | WHMCS API identifier                            |
| `whmcs-api-secret`     | WHMCS API secret                                |
| `whmcs-api-access-key` | WHMCS API access key (optional)                 |
| `ffc-gh-pat`           | Cross-repo PAT (`repo`, `workflow`, `read:org`) |

Names are overridable — see the `KV_SECRET_*` variables below.

### 4. Set GitHub Actions **variables** (repo → Settings → Variables)

These are non-secret identifiers, so they are **variables**, not secrets:

| Variable                     | Required | Example / default                  |
| ---------------------------- | -------- | ---------------------------------- |
| `AZURE_CLIENT_ID`            | yes      | Entra app/identity client ID       |
| `AZURE_TENANT_ID`            | yes      | Entra tenant ID                    |
| `AZURE_SUBSCRIPTION_ID`      | yes      | Azure subscription ID              |
| `AZURE_KEY_VAULT_NAME`       | yes      | Vault name, e.g. `ffc-kv`          |
| `WHMCS_API_URL`              | no       | defaults to the FFC WHMCS endpoint |
| `WHMCS_ONBOARDING_PIDS`      | no       | defaults to `16,33`                |
| `KV_SECRET_WHMCS_IDENTIFIER` | no       | defaults to `whmcs-api-identifier` |
| `KV_SECRET_WHMCS_SECRET`     | no       | defaults to `whmcs-api-secret`     |
| `KV_SECRET_WHMCS_ACCESS_KEY` | no       | defaults to `whmcs-api-access-key` |
| `KV_SECRET_GH_PAT`           | no       | defaults to `ffc-gh-pat`           |

Setting `AZURE_CLIENT_ID` + `AZURE_KEY_VAULT_NAME` is what flips the guards from
"skip" to "run".

## How it works in a workflow

The reusable composite action `.github/actions/azure-kv-secrets` does the login
and secret load, exporting each secret as a **masked** environment variable:

```yaml
permissions:
  id-token: write # required for OIDC
steps:
  - uses: actions/checkout@v6
  - uses: ./.github/actions/azure-kv-secrets
    with:
      client-id: ${{ vars.AZURE_CLIENT_ID }}
      tenant-id: ${{ vars.AZURE_TENANT_ID }}
      subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}
      vault-name: ${{ vars.AZURE_KEY_VAULT_NAME }}
      secrets: |
        WHMCS_API_SECRET=whmcs-api-secret
  - run: node scripts/whmcs-applications.mjs # WHMCS_API_SECRET now in env
```

## Local intake vs. the published feed

With this in place, FFCadmin queries WHMCS **directly** for charity applicants
(`whmcs-intake.yml` → `scripts/whmcs-applications.mjs`), so the public roadmap no
longer depends on the Cloudflare repo publishing `applications.json`. The
feed-based path (`sync-applications.yml`) remains as an optional fallback and
dedups against the same `automation/applications-sync-state.json`, so running
either — or both — is safe and idempotent.

## Security notes

- Secrets are masked (`::add-mask::`) the instant they leave the vault and are
  never written to disk or logs.
- The federated credential is scoped to this repo (and branch); no other repo
  can mint a token for this identity.
- WHMCS access is read-only (`GetClientsProducts`, `GetClientsDetails`), and the
  intake record is built from an allowlist — no applicant PII is published.
