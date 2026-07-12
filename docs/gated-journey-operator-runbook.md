# Gated Charity Journey — Operator Runbook

The end-to-end admin runbook for the **gated charity journey**: what an FFC operator does at each
gate, in order, with the exact workflows, scripts, and pages for each step. The journey itself
(policy, rationale, applicant view) is defined in
[application-prerequisites-inventory.md](./application-prerequisites-inventory.md) Sections 4a/4b;
this runbook is the **back-office companion** — the operator actions that move a charity from
approved application to live domain.

Systems split (keep this straight at every gate):

- **WHMCS** (<https://freeforcharity.org/hub>) is the **system of record** — every gate is an
  approved application or order there.
- **GitHub issues** in this repo are **website-provisioning work orders only** (`kind:intake`),
  auto-created after Gate-1 approval.
- **FFC-Cloudflare-Automation** hosts the operational workflows (WHMCS reads/writes, DNS, cutover).
  Workflow numbers below are the `NN.` display-name prefixes in its Actions UI.

---

## 1. The four gates at a glance

| Gate  | Stage                                                         | WHMCS product                              | Proof the order form requires                                                                                                                                               | Operator verifies before approving                                               |
| ----- | ------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **1** | Charity application fully approved                            | pid 16 (pre-501(c)(3)), pid 33 (501(c)(3)) | Hardened mandatory fields: org Facebook + LinkedIn Page URLs, ToS certification, US attestation, AI-usage answers                                                           | Data complete and validated (social pages live, Candid/EIN check out)            |
| **2** | Website application approved                                  | pid 40 (website)                           | Approved-application reference + "fully approved" attestation checkbox                                                                                                      | The referenced Gate-1 application really is approved in WHMCS                    |
| **3** | Website built + **validated** on its GitHub Pages default URL | — (GitHub work order, no new order)        | The objective 8-item checklist ([Section 4b](./application-prerequisites-inventory.md#4b-the-website-validated-checklist-gate-3-definition)) ticked on the work-order issue | Every checklist box ticked; charity ticked the final content-review box          |
| **4** | Domain registered/transferred — FFC's first real spend        | pid 39 (register), pid 41 (transfer)       | Live GitHub Pages URL of the validated site + "provisioned, working, and validated" attestation                                                                             | URL-verify report PASS; Gate-3 checklist complete; then cutover via workflow 120 |

Email (pids 42/43) follows the domain and stays gated on 501(c)(3) status — see Section 6.

WHMCS has no native cross-product prerequisite, so the gates are enforced **dual**: written (product
copy states the gate) plus technical (required proof fields + attestation checkboxes that an admin
validates before accepting the order). See epic
[FreeForCharity/FFC-Cloudflare-Automation#669](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/669)
(the re-sequencing) and
[#676](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/676) (validation +
mechanical enforcement).

---

## 2. Gate 1 — Reviewing and approving applications in WHMCS

### What the hardened forms collect

Both onboarding forms (pid 16 pre-501(c)(3), pid 33 501(c)(3)) were hardened per
[#670](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/670) and now require:

- **Charity Facebook Page URL** — required (the social-page litmus test, applicant-created)
- **Charity LinkedIn organization Page URL** — required
- **Terms of Service certification** — required checkbox (Section 18 — Supported Charities,
  including the full-stack commitment)
- **US-based attestation** — required checkbox (legally established and operating in the US;
  territories count)
- **AI tools used** — dropdown (ChatGPT / Claude / Gemini / Microsoft Copilot / Perplexity / Grok /
  Meta AI / Several / None / Other)
- **AI plan type** — dropdown (Free tier only / Paid subscription / Mix of free & paid / Not
  applicable)

These are intake **filters** — the forms are deliberately comprehensive and hard. The validated
data also feeds the footer bridge (Section 4), so incomplete data blocks Gate 3 later; send gaps
back to the applicant rather than approving around them.

### Review steps

1. Find pending applications: run **210. WHMCS - Orders Triage** (read-only; scheduled weekdays) in
   FFC-Cloudflare-Automation, or review Pending orders in the WHMCS admin portal directly.
2. Identify the application **by domain or org name first** with **221. WHMCS - Application
   Search**, then pull the full per-client view with **219. WHMCS - Application Detail**. Do not
   match applications from the masked triage tables — they show the applicant's personal first
   name, not the org.
3. Verify the prerequisite data: organization Facebook and LinkedIn Pages actually exist at the
   submitted URLs, the Candid/GuideStar profile checks out, the EIN matches, and the ToS/US
   attestations are checked. The wider validation-check set is
   [inventory Section 5](./application-prerequisites-inventory.md#5-validation-checks-ffc-run-after-submission).
4. Approve by **accepting the order** so the onboarding service goes **Active**: WHMCS admin
   portal, or **211. WHMCS - Order Update** (`action=accept`, `dry_run=true` first, then a live run
   under the `whmcs-prod` approval gate). There is deliberately **no bulk accept** — one explicit
   order per dispatch.

### What approval triggers — the work-order sync

The daily **WHMCS Intake (local)** workflow in this repo
([`.github/workflows/whmcs-intake.yml`](../.github/workflows/whmcs-intake.yml), 08:00 UTC +
manual dispatch) runs [`scripts/whmcs-applications.mjs`](../scripts/whmcs-applications.mjs), which
reads WHMCS (read-only, via the APIM gateway) and opens one `kind:intake` **website-provisioning
work order** per newly approved application. The mechanics an operator must know:

- **Statuses.** Only services with status **Active** (approved) generate issues
  (`INTAKE_STATUSES`, override `WHMCS_INTAKE_STATUSES`). **Pending** (still under review) never
  creates an issue.
- **Cutoff (flood guard).** WHMCS holds hundreds of historical Active services that predate the
  work-order model. Only services whose **application date** is on/after the cutover date
  (`INTAKE_SINCE`, default `2026-07-11`, override `WHMCS_INTAKE_SINCE`) create **new** issues.
- **pendingSeen.** Each run records currently-Pending service ids in the sync state
  (`automation/applications-sync-state.json`, field `pendingSeenIds`). Because the cutoff compares
  the **application** date, not the approval date, a charity that applied before the cutoff but was
  observed Pending after it still gets its work order when it turns Active — the pendingSeen id
  bypasses the date check.
- The new issue is labelled `kind:intake` + `status:needs-admin` ("approved; waiting for a
  sponsoring admin") and appears on the public [roadmap](https://ffcadmin.org/roadmap) and
  [pipeline](https://ffcadmin.org/pipeline) pages. Existing issues get their data fields refreshed
  daily unless a human has edited them (Section 4).

---

## 3. Gate 2 — Website orders (pid 40)

The website product order form carries the Gate-2 proof fields
([#671](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/671)):

- **Required field:** approved onboarding application reference (WHMCS service/order ID, or the
  charity name exactly as approved)
- **Required checkbox:** "Our charity onboarding application has been fully approved by Free For
  Charity"

Before accepting a pid 40 order:

1. Resolve the reference: **221. WHMCS - Application Search** (domain/org name → client id) or the
   service/order id directly.
2. Confirm the referenced onboarding service (pid 16/33) is **Active** — i.e. Gate 1 genuinely
   passed. The checkbox is the charity's attestation; the operator check is what enforces it.
3. Accept the order (WHMCS admin or workflow **211**, dry-run first).

Acceptance at Gate 2 clears the sponsoring admin to execute the website build (Gate 3) against the
work-order issue that Gate 1 already created.

> Note: pid 40 doubles as the "Hosted by GitHub Pages" status-marker product. Workflow **224. WHMCS
>
> - GitHub Pages Product Align** back-fills it as a $0 order onto clients whose sites are already
>   GitHub-hosted — those automation-placed marker orders are not Gate-2 applications and need no
>   gate review.

---

## 4. Gate 3 — The work order and validation

### The work-order issue

The sync-created stub (built by [`scripts/lib/intake-issues.mjs`](../scripts/lib/intake-issues.mjs))
contains, in order: a welcome preamble with the hidden `ffc-application-id` dedup marker; the
structured intake fields pre-filled from the application (charity name, status, mission category,
mission, EIN, Candid URL); and **last**, the volunteer-owned validation block:

- **Validation checklist (Gate 3)** — the 8 objective items of
  [Section 4b](./application-prerequisites-inventory.md#4b-the-website-validated-checklist-gate-3-definition),
  unticked. The **sponsoring admin ticks each box** as it passes; the **charity ticks the final
  content-review box**.
- **`Live site:` line** — the admin pastes the `https://…github.io/…` GitHub Pages URL here once
  the site loads. This exact format is what the roadmap generator greps
  (`liveUrlFrom()`), so the pipeline's "validated" stage lights up only when a real URL replaces
  the placeholder.

**Checklist semantics — safe to work in.** The daily refresh never clobbers human work: any ticked
checkbox, a filled `Live site:` URL, or any structural edit marks the issue as human-edited
(`hasHumanEdits()`), and from then on only humans change it. All 8 boxes ticked = **validated** →
the charity may order its domain (Gate 4). Partial completion is not validated.

**Auto-validation workflow:** an automated Gate-3 checker
(`.github/workflows/gate3-validate.yml`) is **in progress** — it is not on `main` yet. Until it
lands, the checklist is verified by hand exactly as in the pilot (Section 7).

### Footer-config bridge (the checklist's footer item)

The footer must be **generated from validated application data, not hand-typed**. Use
[`scripts/generate-footer-config.mjs`](../scripts/generate-footer-config.mjs) per
[footer-bridge.md](./footer-bridge.md):

1. Note the application id from the work order (`ffc-<clientId>`).
2. Get the application record (WHMCS Intake workflow dry-run output, or a saved JSON array).
3. `node scripts/generate-footer-config.mjs --input applications.json --id ffc-<clientId>` — it
   validates `charityName`, `ein`, `candidUrl`, and `charityStage` (`501c3`) and **exits non-zero
   listing every gap** rather than emitting a partial footer. Gaps are onboarding gaps: send the
   application back for completion in WHMCS, never guess values.
4. Fill the listed `manualFields`, then transcribe the emitted `siteConfig` partial into the
   charity repo's `src/lib/site.config.ts` (key names match one-for-one). No template consumes the
   JSON directly yet. Never change or drop `supportedBy`.

### Two-template choice

The build uses one of the two FFC site templates, both converging on the shared `SiteConfig` shape
([FreeForCharity/FFC-Cloudflare-Automation#693](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/693)):

- **[FFC-IN-FFC_Single_Page_Template](https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template)**
  — the full single-page charity site; its `src/lib/site.config.ts` defines the canonical shape the
  footer bridge emits.
- **[FFC-IN-Footer_Only_Template](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template)**
  — the compliant-footer wrapper for sites whose content is built another way (e.g. a localized
  clone of an existing site); adopting the shared shape is in progress under #693.

Pick per charity: full template for new builds, footer-only when preserving an existing site's
content. Either way, the validated footer data comes from the bridge.

For retrofitting the **already-live** FFC-EX fleet (sites that predate the standard), follow
[footer-standard-adoption-checklist.md](./footer-standard-adoption-checklist.md).

---

## 5. Gate 4 — Domain orders (pids 39/41)

The first real money FFC spends (~$16.50/yr per domain), so this gate is the most defended.

### The order forms

Both domain products carry the Gate-4 proof fields
([#672](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/672)):

- **Required field:** live GitHub Pages URL of the validated website (custom field id **171** on
  pid 39 register, **173** on pid 41 transfer)
- **Required checkbox:** "Our website is fully provisioned, working, and validated at the GitHub
  Pages URL above" (field id 172)

### Coupon handling

At checkout the charity sees a small **$1 verification charge**; the discount code that brings the
total to $0 arrives in the **onboarding acceptance email**. The code is **never posted publicly**
— emails only. In this runbook and anywhere public, refer to it as "the code from the acceptance
email"; the banned-phrase CI guards (see the
[architecture doc](./intake-automation-architecture.md)) exist partly because old public-coupon
copy kept contradicting this.

### Accepting a domain order

1. **Run the URL-verify report:** **225. WHMCS - Domain Order URL Verify** in
   FFC-Cloudflare-Automation (scheduled + dispatchable; read-only under `whmcs-prod-read`). For
   every Pending pid 39/41 order it pulls the URL field and checks liveness: host must be
   `*.github.io` and HTTP GET must return 200 → PASS/FAIL per order, with a WARN-only
   footer-marker column (cut-over sites legitimately lack the literal footer text). It **never
   accepts or cancels** an order; the Gate-3 checklist and the attestation field are not
   machine-read yet.
2. **Cross-check Gate 3:** open the charity's work order and confirm the validation checklist is
   8/8 (including the charity's content-review tick).
3. Accept the order (WHMCS admin or workflow **211**, dry-run first) and register/transfer the
   domain in Cloudflare: **113. Domain - Registrar Search / Check / Register** for new
   registrations (live registration needs `mode=execute-register` plus a typed `confirm_domain`
   match), or the transfer chain for transfers-in.

### Cutover — workflow 120

Pointing the domain at the validated site is **120. DNS + GH Pages - Bulk Cutover staging → Apex
(FFC-EX)** in FFC-Cloudflare-Automation:

1. **Dry-run first** — `dry_run` defaults to `true`; read the preview.
2. Re-run with `dry_run=false`; the run pauses at the **`cloudflare-prod-write` / `github-prod`
   approval gates** for the required reviewer.
3. Runs are **serialized** — parallel dispatches would race on the same FFC-EX CNAMEs / Cloudflare
   DNS. One cutover at a time.

### Holding the gate — the Catnip deferral

Gate 4 is a decision point, not a conveyor belt. In the pilot
([FreeForCharity/FFC-IN-ffcadmin.org#584](https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/584)),
Gate-3 validation completed 8/8 and the cutover was staged — and then **deferred by operator
decision**: the staged run was cancelled, nothing was flipped, and the site simply stayed live on
its GitHub Pages URL. That is the gate working. One side effect to watch when deferring: if the
charity repo's CNAME PR merged before the deferral, the Pages deploy builds for the custom domain
(empty `basePath`) while DNS still points elsewhere, so the `github.io` staging URL may serve with
root-path assets until cutover; revert the CNAME commit if the staging URL must stay fully
browsable.

---

## 6. Email stage (after the domain)

Organizational email (pids 42/43) is provisioned **after** the domain exists and remains gated on
501(c)(3) status per existing policy. Operationally (FFC-Cloudflare-Automation): **305. M365 - Add
Tenant Domain**, **304. M365 - Enable DKIM**, verified with **301. M365 - Domain Preflight** /
**303. M365 - Domain Status + DKIM**; the standard MX/SPF/DMARC records ride along with **103.
Domain - Enforce Standard**. The /pipeline page shows an Email column for the full journey, but the
sync data cannot derive that stage yet (future work).

---

## 7. Troubleshooting + the pilot walkthrough

### Common operator questions

| Symptom                                         | Cause / fix                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Approved charity has no work-order issue        | Service not Active yet; or it applied **before** the `2026-07-11` cutoff and was never observed Pending since (flood guard). Fix: dispatch WHMCS Intake manually; for a pre-cutoff approval, set `WHMCS_INTAKE_SINCE` for one run or create the issue by hand with the intake form. |
| Sync ran but nothing happened                   | Missing credentials or a WHMCS error is a deliberate **no-op** (state unchanged). Check the run log.                                                                                                                                                                                |
| Issue edits keep disappearing                   | They don't — any ticked box, filled `Live site:` URL, or structural edit stops the daily refresh (`hasHumanEdits`). If a stub was refreshed, no human edit had been made yet.                                                                                                       |
| Charity shows at the wrong /pipeline stage      | Stage derives from the `status:*` label + `Live site:` URL (`github.io` = validated; custom domain = domain live). Fix the label or the URL line; the roadmap data rebuilds daily (Build Roadmap Data workflow).                                                                    |
| Pipeline "validated" won't light up             | The `Live site:` line must contain a real `https://…` URL — the placeholder deliberately has none.                                                                                                                                                                                  |
| URL-verify FAILs an order                       | Non-`github.io` host or non-200 response. Fix the site (or the URL the charity typed) and re-run 225; the report never touches the order itself.                                                                                                                                    |
| CI fails on a content PR with a "banned phrase" | The copy re-asserts the old domain-first journey order. Rewrite to the gated order; the guard's failure message includes the reason per phrase.                                                                                                                                     |

### The pilot, end to end (#584 — Catnip & Cattitude)

The first charity through the gated flow, and the worked example of every section above:

1. **Legacy triage** — the issue predated the gated journey and was re-labelled: the application
   was tracked in WHMCS and not yet approved, so no approval wording applied.
2. **Work order activated** — application `ffc-433` (Approved 501(c)(3), EIN and Candid profile on
   record); build proceeded on the GitHub Pages URL with the Gate-3 checklist embedded in the
   issue.
3. **Validation caught the missing footer** — the checklist run found no FFC attribution, no
   freeforcharity.org link, no EIN block on the live site. The item was ticked ❌ FAIL, and the
   staged DNS-cutover PR was explicitly held DO-NOT-MERGE: **the funding gate did its job before
   cutover, not after**.
4. **Fix → re-validate** — the footer PR merged and was live-verified (attribution, EIN, hub
   login link, Candid link, ToS page); the checklist item flipped to PASS.
5. **Human items closed out** — browser pass for console errors and the 375 px mobile spot-check;
   then the last human gate, the charity's content approval → **Gate 3 complete, 8/8**.
6. **Gate 4 held by choice** — the staged cutover was cancelled by operator decision; the site
   stayed on its GitHub Pages URL with validation intact (see Section 5).

The pilot exercised the full loop: application → work order → build → validation catch → fix →
re-validation → deliberate gate hold.
