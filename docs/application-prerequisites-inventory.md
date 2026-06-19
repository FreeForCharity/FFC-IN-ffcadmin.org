# Application & Prerequisites — Reference Inventory

> **Status: Draft for verification.** This document inventories the application
> and prerequisite steps that the FFC site currently describes, assembled from
> the existing pages and data files in this repository. The FFC founder should
> verify, add, or remove steps before this is treated as authoritative.

## Purpose

Supporting a charity's **application** is one of the core functions of the FFC
site. The application process is intentionally a **filter**: by the time a
charity reaches service delivery, the prerequisite steps have demonstrated two
things at once —

1. **Charity legitimacy** — the organization is a real, US-based 501(c)(3)
   that is what it claims to be (validated against independent authorities).
2. **Technical readiness** — the people running the charity were able to
   complete a sequence of technical onboarding tasks (claim a Candid profile,
   stand up a real email mailbox, create vendor accounts, etc.), which signals
   they can actually operate the site FFC delivers.

This dual purpose is described on the site as the **"filter out" philosophy**:
charities demonstrate readiness through the validation steps before
service-delivery resources commit, protecting volunteer time and ensuring every
shipped site lands at a charity that can run it.

## Where this lives in the codebase

| Topic                                    | Source                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| End-to-end lifecycle + eligibility floor | `src/app/legacy-wordpress-administration/wordpress-service-delivery-stages/page.tsx`   |
| External + internal validation checks    | `src/app/legacy-wordpress-administration/wordpress-charity-validation/page.tsx`        |
| Candid/GuideStar seal progression        | `src/app/legacy-wordpress-administration/wordpress-guidestar-guide/page.tsx`           |
| Onboarding prerequisites + accounts      | `src/app/legacy-wordpress-administration/wordpress-online-impacts-onboarding/page.tsx` |
| What the charity receives in return      | `src/app/what-ffc-delivers/page.tsx`                                                   |
| Public application entry point           | `https://freeforcharity.org/submit-information/` (linked from What FFC Delivers)       |

---

## 1. Eligibility floor (hard gates)

A charity must clear these before any application is meaningful. Failing one of
these generally results in a polite decline rather than a fix-and-retry.

1. **US-based charity** with a **US-citizen point of contact**. (International
   charities are politely declined — US-only restriction.)
2. **501(c)(3) status active** — or on the **pre-501(c)(3) track** for
   organizations not yet recognized.
3. **At minimum a Gold Candid (GuideStar) seal** (see Section 4).
4. **Priority criterion:** revenue **under $1M** and **not federally
   grant-funded**. (Drives prioritization/offer, not an absolute bar.)

---

## 2. Application intake steps (charity-driven)

These are the steps the applicant actively performs. They double as the first
technical-competence signals.

1. **Create a WHMCS portal account** at the FFC Hub.
2. **Select the "Charity Onboarding & Validation" product** and submit the
   **intake form** (no cost).
3. **Acknowledge the FFC Acceptable Use Policy (AUP).**
4. **Provide Candid/GuideStar profile links** (Public Profile + Full Profile).
5. **Provide board contact information** — President/Chair, Secretary,
   Treasurer (optionally Vice and Member-At-Large).
6. **Designate primary + technical contacts**, including timezone and preferred
   contact hours.

**Exit gate (Stage 1):** WHMCS account exists, intake form is fully completed,
AUP acknowledged.

### Prerequisite materials the charity must have in hand

(From the onboarding playbook — "missing prereqs are the single biggest source
of stuck onboardings.")

- IRS 501(c)(3) determination letter
- EIN (Employer Identification Number)
- Board member names, titles, contact info, LinkedIn profiles, and bios
- Mission statement
- Most recent Form 990
- Annual report (if available)
- Programs and services list
- Financial statements (past 2 years)
- Current operating budget
- Strategic plan (if available)
- Current website URL
- Social media links
- High-resolution logo files
- Brand guidelines

---

## 3. Validation checks (FFC-run, Stage 2)

All checks must resolve to a **documented pass or documented exception** before
an offer is made.

### 3a. External validation checks (six third-party signals)

| #   | Check                                                                        | Demonstrates                                                     |
| --- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | **501(c)(3) status via Candid / GuideStar** (record NTEE code)               | Legitimacy; mission-alignment scoring                            |
| 2   | **TechSoup legal-entity confirmation** ("Validated", not "Pending")          | Independent vetting; unlocks discounted-software pipeline        |
| 3   | **VolunteerMatch engagement check**                                          | Charity can receive and act on volunteer work                    |
| 4   | **Verified Facebook page** (cross-checked vs. intake form)                   | Identity/branding consistency                                    |
| 5   | **Email on a reputable provider** (Microsoft 365 preferred; not Gmail/Yahoo) | Technical readiness; enables SPF/DKIM/DMARC under charity domain |
| 6   | **WHMCS account + PayPal donor flow**                                        | KYC step; donor funding path                                     |

### 3b. Internal validation checks (three FFC reviews)

| #   | Check                                                                    | Purpose                                                  |
| --- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | **Cost-and-funding analysis** (size via Form 990: micro/small/mid/large) | Scopes engagement; drives template selection             |
| 2   | **Existing website + intake-form content review**                        | Mission/leadership consistency across all public sources |
| 3   | **Target-demographic assessment**                                        | Foundation for copy, imagery, accessibility              |

> The site refers to "**all nine validation checks**" (six external + three
> internal) resolving before exit.

---

## 4. Candid / GuideStar seal progression

FFC requires **at minimum the Gold seal**, plus a **board roster + IRS
determination letter** uploaded on top of the Candid baseline. Below Gold, the
charity is routed back to "complete your GuideStar Gold seal first" instead of
to scheduling.

| Seal         | FFC stance              | Charity must supply                                                                                                                                         |
| ------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bronze**   | Starting                | Mission statement; address/contact; EIN; leadership names & titles                                                                                          |
| **Silver**   | Starting                | Program names & descriptions; geographic service areas; goals & beneficiary populations                                                                     |
| **Gold**     | **Minimum requirement** | Most recent Form 990; audited financials (when available); fiscal-year financial data; DEI data; **+ board roster + IRS determination letter (FFC add-on)** |
| **Platinum** | Preferred               | Quantitative impact metrics; strategic planning documents / board reports                                                                                   |

Charity also supplies three artifacts after publishing: **Full Profile link**,
**Public Profile link**, and **Seal Code** (embed snippet). Annual ~30-minute
refresh expected (Q1 convention).

---

## 5. External accounts the charity establishes

Each maps to a validation check above. FFC helps create any that are missing.

- Charity-named **Outlook mailbox** (Microsoft 365 nonprofit tenant)
- **Candid (GuideStar) profile at Gold or higher**
- Verified **Nonprofit Facebook page**
- Verified **Nonprofit LinkedIn page**
- **VolunteerMatch** profile (even if dormant)
- **TechSoup** validated account
- **PayPal Nonprofits** account

---

## 6. Where the application hands off to service delivery

Once validation passes and the charity accepts the written offer (signed WHMCS
quote), the prerequisite/application phase is complete and the engagement moves
into provisioning. The full lifecycle (for reference) is an eight-stage flow:

1. Initial Contact & Onboarding
2. **FFC Validation Checks** ← prerequisite gate (Sections 3–4)
3. FFC Offers Services
4. Basic Services Package (domain + Microsoft 365)
5. Charity System & Website Setup (branches by 501(c)(3) status)
6. Technical Stack Assignment
7. Plugin & Theme Deployment
8. Initial Site Launch & Configuration

---

## Open questions for verification

- Is the **public application** still `freeforcharity.org/submit-information/`,
  or has it moved into a WHMCS-only flow?
- Is **"under $1M and not federally grant-funded"** a hard gate or only a
  prioritization signal? (Currently documented as priority criterion.)
- Are the **six external / three internal** checks still the current set, or
  have any been added/retired (e.g., Instagram, Google for Nonprofits)?
- Does the **pre-501(c)(3) track** have its own prerequisite list distinct from
  the 501(c)(3) track?
- Should **AUP acknowledgment** and a **conflict-of-interest / data-handling**
  agreement be explicit prerequisite line items?
