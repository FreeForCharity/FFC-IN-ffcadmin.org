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

### The social-page litmus test (technical-readiness gate)

> **Emphasis:** An applicant must be able to **create a Facebook Page and a
> LinkedIn Page for the organization themselves.** This is deliberate. Creating
> these pages is a highly structured, well-documented, free task — there is an
> _extreme_ amount of step-by-step guidance, official tutorials, and walk-through
> resources publicly available for both platforms. If an applicant cannot
> complete a task this scaffolded, it is **unlikely they will be successful
> operating the more advanced digital infrastructure** FFC delivers (a website,
> Microsoft 365, DNS/email, analytics, etc.).
>
> FFC therefore treats self-service creation of these two organization pages as a
> baseline competency gate, not just a marketing nicety. The same expectation
> applies to the **pre-501(c)(3) track** — the organization Facebook and LinkedIn
> pages are required there as well.

## Where this lives in the codebase

| Topic                                    | Source                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| End-to-end lifecycle + eligibility floor | `src/app/legacy-wordpress-administration/wordpress-service-delivery-stages/page.tsx`   |
| External + internal validation checks    | `src/app/legacy-wordpress-administration/wordpress-charity-validation/page.tsx`        |
| Candid/GuideStar seal progression        | `src/app/legacy-wordpress-administration/wordpress-guidestar-guide/page.tsx`           |
| Onboarding prerequisites + accounts      | `src/app/legacy-wordpress-administration/wordpress-online-impacts-onboarding/page.tsx` |
| What the charity receives in return      | `src/app/what-ffc-delivers/page.tsx`                                                   |
| Public application entry point           | `https://freeforcharity.org/submit-information/` (linked from What FFC Delivers)       |
| 501(c)(3) onboarding entry point         | `https://freeforcharity.org/501c3/`                                                    |
| Pre-501(c)(3) onboarding entry point     | `https://freeforcharity.org/pre501c3/`                                                 |
| Recommended tools + setup order          | `https://freeforcharity.org/free-for-charitys-tools-for-success/`                      |

---

## 1. Eligibility floor (hard gates)

A charity must clear these before any application is meaningful. Failing one of
these generally results in a polite decline rather than a fix-and-retry.

1. **US-based charity** with a **US-citizen point of contact**. (International
   charities are politely declined — US-only restriction.)
2. **501(c)(3) status active** — or on the **pre-501(c)(3) track** for
   organizations not yet recognized (see Section 1a; this track has its own
   application form on freeforcharity.org).
3. **At minimum a Gold Candid (GuideStar) seal** (see Section 4).
4. **Priority criterion:** revenue **under $1M** and **not federally
   grant-funded**. (Drives prioritization/offer, not an absolute bar.)

### 1a. The pre-501(c)(3) track

Organizations that are not yet IRS-recognized 501(c)(3)s can still apply through
a **separate pre-501(c)(3) application form on freeforcharity.org**. The track
carries its own prerequisite expectations:

- The organization **Facebook Page and LinkedIn Page must still be created** (see
  the social-page litmus test above) — these are not waived for pre-501(c)(3)
  applicants.
- Because there is not yet a confirmed board, the applicant supplies the
  **personal LinkedIn profiles of the planned board members** in place of a
  seated board roster.
- The applicant's **own personal LinkedIn profile** is required (this applies to
  every applicant — see Section 2).

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
- **Applicant's personal LinkedIn profile** (required for every applicant)
- Board member names, titles, contact info, **personal LinkedIn profiles**, and
  bios — for the **pre-501(c)(3) track**, supply the personal LinkedIn profiles
  of the **planned board members**
- **Organization Facebook Page and LinkedIn Page** the applicant created
  themselves (see the social-page litmus test in Purpose)
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

## 3. Validation checks (FFC-run, intake/validation stage)

All checks must resolve to a **documented pass or documented exception** before
an offer is made.

> **Note on stage numbering:** the source pages disagree on the exact number.
> `wordpress-service-delivery-stages` calls validation **Stage 2** of the
> eight-stage lifecycle, while `wordpress-charity-validation` says validation
> runs during **"Stage 1 — Intake."** They describe the same phase; the
> discrepancy is in the source material and is flagged for the founder to
> reconcile.

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

Most of these map to a validation check in Section 3a; the LinkedIn page is an
additional onboarding requirement (used for board-bio cross-references) rather
than one of the six external validation checks. The applicant is expected to
**create the Facebook and LinkedIn organization pages themselves** (the
technical-readiness litmus test). For the remaining accounts (M365 tenant,
Candid profile, TechSoup, PayPal), FFC provides guidance and admin support where
the charity gets stuck.

- Charity-named **Outlook mailbox** (Microsoft 365 nonprofit tenant) — _check 5_
- **Candid (GuideStar) profile at Gold or higher** — _check 1_
- Verified **Nonprofit Facebook page** — _check 4_
- **VolunteerMatch** profile (even if dormant) — _check 3_
- **TechSoup** validated account — _check 2_
- **PayPal Nonprofits** account — _check 6_
- Verified **Nonprofit LinkedIn page** — _onboarding requirement, not a Section 3a check; required on the pre-501(c)(3) track too_

The Facebook Page and LinkedIn Page must be **created by the applicant
themselves** — this doubles as the technical-readiness litmus test described in
Purpose, and applies on the pre-501(c)(3) track as well.

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

## 7. Track-agnostic minimum prerequisites (both 501(c)(3) and pre-501(c)(3))

This is the **intersection** — the prerequisites and onboarding steps that are
the **same regardless of track**, assembled from the totality of the FFC
guidance on this repo and the freeforcharity.org main site (`/501c3`,
`/pre501c3`, the tools-for-success guide, the validation guide, and the
onboarding guide). Track-specific items (e.g., GuideStar **Gold** + Form 990 for
501(c)(3); IRS 1023 / state-formation work for pre-501(c)(3)) are **not** listed
here — only what both must do.

### 7a. Personal qualifications of the applicant

- **US-based**, with a **US-citizen point of contact** (eligibility floor).
- A named **primary contact** and a named **technical contact** (may be the same
  person), with timezone and preferred contact hours.
- The applicant's **own personal LinkedIn profile** (required on both tracks).
- **Personal LinkedIn profiles of the board members** — or, on the
  pre-501(c)(3) track, of the **planned board members**.
- Practical ability to **self-serve account creation** — demonstrated by
  standing up the organization's own Facebook and LinkedIn pages (the
  technical-readiness litmus test in Purpose).

### 7b. Core organizational profiles & accounts (common to both tracks)

| Account / profile                                      | Track-agnostic? | Notes                                                                                                            |
| ------------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Password manager** (LastPass)                        | Yes             | Tools-for-success says set this up **first**, before any other account, so the rest are created securely.        |
| **Organizational Microsoft 365 / Outlook email**       | Yes             | FFC-recommended productivity + email suite; `<charityname>@outlook.com` to start, then charity-domain mailboxes. |
| **Organization Facebook Page**                         | Yes             | Applicant creates it themselves.                                                                                 |
| **Organization LinkedIn Page**                         | Yes             | Applicant creates it themselves.                                                                                 |
| **Domain** (`yourcharityname.org`)                     | Yes             | Registered/transferred via FFC.                                                                                  |
| **WordPress website**                                  | Yes             | The delivered site (legacy track) / FFC template.                                                                |
| **Charity email routing** (`info@yourcharityname.org`) | Yes             | Professional addressing under the charity domain.                                                                |
| **Board structure** (mandatory officers)               | Yes             | Seated board for 501(c)(3); planned/elected board for pre-501(c)(3).                                             |
| **Mission statement**                                  | Yes             | Required by both.                                                                                                |

> **Track-specific (not part of the common minimum):** GuideStar/Candid **Gold**
> seal, Form 990, audited financials, IRS determination letter (501(c)(3) only);
> IRS 1023 application, state nonprofit formation, charitable-solicitation
> registration (pre-501(c)(3) only); TechSoup, VolunteerMatch, and PayPal are
> emphasized on the 501(c)(3) path.

### 7c. Common onboarding steps

1. Establish the **password manager** first (LastPass).
2. Stand up **organizational email** (Microsoft 365 / Outlook).
3. Create the **organization LinkedIn Page** and **Facebook Page** (applicant-run).
4. Register/transfer the **domain** through FFC and set up `info@` routing.
5. Provide **board + primary/technical contact** information, including the
   personal LinkedIn profiles described in 7a.
6. Receive and configure the **WordPress website / FFC template**.

---

## 8. Proposed additions — the personal-to-organizational technical-literacy ladder

> **Status: Proposal for the founder.** The items below are **not** yet stated
> as formal prerequisites. They are recommended because every organizational
> account FFC requires is technically **built on top of a personal account**,
> and making that dependency explicit closes the most common "the applicant got
> stuck" gaps. The guiding principle: _before_ an applicant can create
> organizational infrastructure, they must prove they can establish and secure
> **their own** accounts. **LinkedIn is the first rung** — you cannot create a
> LinkedIn organization Page without a qualifying personal LinkedIn profile.

### 8a. The dependency chain (why this matters)

| Organizational account FFC requires         | Personal prerequisite it depends on                                                                                                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LinkedIn organization Page**              | A **personal LinkedIn profile** that meets LinkedIn's Page-creation bar (real name, profile photo, an established set of connections, and the person listed in a current position). Without it, the Page literally cannot be created. |
| **Facebook organization Page**              | A **personal Facebook account** to create and administer the Page.                                                                                                                                                                    |
| **Microsoft 365 / Google Workspace tenant** | A **personal Microsoft/Google account** + a monitored email and a phone number to receive verification.                                                                                                                               |
| **Every account above**                     | A **password manager** and **MFA/authenticator** habit to store credentials and pass 2-factor challenges.                                                                                                                             |

### 8b. Recommended applicant-level checklist (the literacy ladder)

Proposed order — each rung proves a competency the next one needs:

1. **Personal password manager** set up first (LastPass/Bitwarden) — credential
   hygiene before anything else. _(Already the stated #1 in tools-for-success;
   recommend promoting it into the formal prerequisites.)_
2. **A monitored personal email** the applicant controls (for verification
   links).
3. **A phone number** for SMS/authenticator-app 2-factor verification.
4. **MFA / authenticator app** enabled on their personal accounts — basic
   security literacy.
5. **Personal LinkedIn profile** (applicant + each board / planned board
   member), meeting the LinkedIn Page-creation criteria. **← first social rung.**
6. **Personal Facebook account** capable of creating/administering a Page.

Only after these does the applicant attempt the **organizational** accounts in
Section 7b. An applicant who completes rungs 1–6 unaided has demonstrated the
technical literacy to operate the infrastructure FFC delivers; one who cannot is
the case the "filter out" philosophy is designed to catch early.

### 8c. Suggested formal-prerequisite changes for the founder to weigh

- **Promote LinkedIn to the first explicit prerequisite**, stated as
  _personal-profile-then-Company-Page_, so applicants don't hit the
  can't-create-a-Page wall.
- **Add the password manager (LastPass)** as a named prerequisite, not just a
  tools-for-success recommendation.
- **Add an MFA/2-factor requirement** as a literacy checkpoint.
- Consider an explicit **"can you do this yourself?" self-check gate** at the top
  of the application that lists rungs 1–6.

---

## Open questions for verification

- Is the **public application** still `https://freeforcharity.org/submit-information/`,
  or has it moved into a WHMCS-only flow?
- Is **"under $1M and not federally grant-funded"** a hard gate or only a
  prioritization signal? (Currently documented as priority criterion.)
- Are the **six external / three internal** checks still the current set, or
  have any been added/retired (e.g., Instagram, Google for Nonprofits)?
- Should the **organization Facebook Page and LinkedIn Page** (and the personal
  LinkedIn profiles) be promoted into the formal Section 3a validation checks,
  given they are now hard requirements on both tracks?
- Should **AUP acknowledgment** and a **conflict-of-interest / data-handling**
  agreement be explicit prerequisite line items?
