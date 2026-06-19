# Application & Prerequisites — Reference Inventory

> **Status: Draft for verification.** This document inventories the application
> and prerequisite steps that the FFC site currently describes, assembled from
> the existing pages and data files in this repository. The FFC founder should
> verify, add, or remove steps before this is treated as authoritative.

> **Source precedence (sources differ by age).** The repo blends two eras. The
> **current** model is captured by `src/data/setup-guides.ts` and the
> freeforcharity.org `/501c3`, `/pre501c3`, and tools-for-success pages. The
> **legacy** WordPress / Online Impacts era is captured by the
> `legacy-wordpress-administration/*` pages (WHMCS product checkout, InterServer
> hosting, GuideStar-as-universal-gate, the eight-stage WordPress lifecycle).
> Where they conflict, **the current model governs the individual-applicant flow
> in Section 8**; legacy details are retained for the operations history but are
> flagged as legacy.

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

> **Prerequisite-first framing & acceptance expectation.** This guide is
> organized around the **prerequisite steps** and a **self-check** (Section 8c)
> so an applicant can see, up front, **everything they will need to do**. The
> expectation is explicit: a charity completes the prerequisite ladder
> (Section 8) **before FFC provides any other service**. Completing it is what
> moves the organization from "interested" to **accepted** — no domain, email,
> website, or other service is provisioned until the prerequisites are met. The
> only thing always available before then is the **Contact us for help** path.

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
>
> **In-repo source:** the actual walkthroughs live in `src/data/setup-guides.ts`
> (the `linkedin` and `facebook` guides), which explicitly describe creating each
> organization Page **from the applicant's own personal account**. See the full
> applicant flow in Section 8.

### The organizing principle: an account is a person, not an entity

The `src/data/setup-guides.ts` guides are built on one repeated rule: **you sign
up as yourself** (the identity on your phone), turn on multi-factor
authentication, and then **add your work persona** (e.g. an `@yourcharity.org`
email) to that one personal account. The login is always the **person**, never
the organization. Every organizational asset — a GitHub org, a LinkedIn Page, a
Facebook Page — is something a real person's secured account is given control
of. This principle is what makes the flow in Section 8 logical and ordered.

## Where this lives in the codebase

| Topic                                    | Source                                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| End-to-end lifecycle + eligibility floor | `src/app/legacy-wordpress-administration/wordpress-service-delivery-stages/page.tsx`            |
| External + internal validation checks    | `src/app/legacy-wordpress-administration/wordpress-charity-validation/page.tsx`                 |
| Candid/GuideStar seal progression        | `src/app/legacy-wordpress-administration/wordpress-guidestar-guide/page.tsx`                    |
| Onboarding prerequisites + accounts      | `src/app/legacy-wordpress-administration/wordpress-online-impacts-onboarding/page.tsx`          |
| **Step-by-step account setup guides**    | **`src/data/setup-guides.ts`** (GitHub, MFA, LinkedIn, Facebook, M365, password manager, Canva) |
| What the charity receives in return      | `src/app/what-ffc-delivers/page.tsx`                                                            |
| Public application entry point           | `https://freeforcharity.org/submit-information/` (linked from What FFC Delivers)                |
| 501(c)(3) onboarding entry point         | `https://freeforcharity.org/501c3/`                                                             |
| Pre-501(c)(3) onboarding entry point     | `https://freeforcharity.org/pre501c3/`                                                          |
| Recommended tools + setup order          | `https://freeforcharity.org/free-for-charitys-tools-for-success/`                               |

---

## 1. Eligibility floor (hard gates)

A charity must clear these before any application is meaningful. Failing one of
these generally results in a polite decline rather than a fix-and-retry.

1. **US-based charity** with a **US-citizen point of contact**. (International
   charities are politely declined — US-only restriction.)
2. **501(c)(3) status active** — or on the **pre-501(c)(3) track** for
   organizations not yet recognized (see Section 1a; this track has its own
   application form on freeforcharity.org).
3. **(501(c)(3) track only)** at minimum a Gold Candid (GuideStar) seal (see
   Section 4). This is **not** a universal gate — a pre-501(c)(3) organization
   cannot yet hold a Gold seal (no Form 990), and instead works the IRS 1023 /
   state-formation track. Listed here as track-specific, not track-agnostic.
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

> **Current entry point:** the public application form at
> `https://freeforcharity.org/submit-information/`, plus the track-specific
> `/501c3` and `/pre501c3` pages. The **WHMCS portal product checkout**
> (below, items 1–2) is the **legacy** Online Impacts-era mechanism; it is
> retained here because parts of the back office still run on it, but new
> applicants start at the web form.

1. _(Legacy)_ Create a **WHMCS portal account** and select the **"Charity
   Onboarding & Validation" product** — or, in the current model, submit the
   **public application form** (no cost).
2. **Acknowledge the FFC Acceptable Use Policy (AUP).**
3. _(501(c)(3) track)_ **Provide Candid/GuideStar profile links** (Public Profile
   - Full Profile).
4. **Provide board contact information** — President/Chair, Secretary, Treasurer
   (optionally Vice and Member-At-Large); on the pre-501(c)(3) track, the
   **planned** board.
5. **Designate primary + technical contacts**, including timezone and preferred
   contact hours.

**Exit gate:** application submitted, intake form fully completed, AUP
acknowledged.

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

| Account / profile                                      | Track-agnostic? | Notes                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Password manager** (LastPass)                        | Recommended     | A password manager is "the safety net behind every other account." Per the **founder-directed policy in Section 8a** it must be one of the three approved providers — FFC uses **LastPass**. (This supersedes `setup-guides.ts`, which still lists Bitwarden; the guide is pending update.) |
| **Organizational Microsoft 365 / Outlook email**       | Yes             | FFC-recommended productivity + email suite; `<charityname>@outlook.com` to start, then charity-domain mailboxes.                                                                                                                                                                            |
| **Organization Facebook Page**                         | Yes             | Applicant creates it themselves.                                                                                                                                                                                                                                                            |
| **Organization LinkedIn Page**                         | Yes             | Applicant creates it themselves.                                                                                                                                                                                                                                                            |
| **Domain** (`yourcharityname.org`)                     | Yes             | Registered/transferred via FFC.                                                                                                                                                                                                                                                             |
| **WordPress website**                                  | Yes             | The delivered site (legacy track) / FFC template.                                                                                                                                                                                                                                           |
| **Charity email routing** (`info@yourcharityname.org`) | Yes             | Professional addressing under the charity domain.                                                                                                                                                                                                                                           |
| **Board structure** (mandatory officers)               | Yes             | Seated board for 501(c)(3); planned/elected board for pre-501(c)(3).                                                                                                                                                                                                                        |
| **Mission statement**                                  | Yes             | Required by both.                                                                                                                                                                                                                                                                           |

> **Track-specific (not part of the common minimum):** GuideStar/Candid **Gold**
> seal, Form 990, audited financials, IRS determination letter (501(c)(3) only);
> IRS 1023 application, state nonprofit formation, charitable-solicitation
> registration (pre-501(c)(3) only); TechSoup, VolunteerMatch, and PayPal are
> emphasized on the 501(c)(3) path.

### 7c. Common onboarding steps (suggested order)

This order is **assembled across multiple guides**, not a single stated policy
sequence — treat it as a sensible default, not a mandated checklist:

- Set up a **password manager** (recommended early so later credentials are
  captured securely).
- Stand up **organizational email** (Microsoft 365 by default, or Google
  Workspace).
- Create the **organization LinkedIn Page** and **Facebook Page** (applicant-run).
- Register/transfer the **domain** through FFC and set up `info@` routing.
- Provide **board + primary/technical contact** information, including the
  personal LinkedIn profiles described in 7a.
- Receive and configure the **website / FFC template**.

For the precise, step-by-step **individual-applicant** sequence up to and
including the social Pages, see **Section 8**.

---

## 8. The individual-applicant flow (up to and including the social Pages)

This is the **single, logical, end-to-end sequence** an individual applicant
follows — from owning nothing but a smartphone, to having the organization's
**LinkedIn Page and Facebook Page** live. It encapsulates every step the person
must take and is ordered so that **each step depends only on steps already
completed**.

> **This flow is identical for both the 501(c)(3) and the pre-501(c)(3)
> tracks.** The track is _chosen_ early (Section 1 / Phase 0) because it
> determines which documents and which application form come later — but the
> prerequisite **work** below (Phases 0–E) is **the same for both**. The two
> tracks **diverge only after this common flow**, at the legal-documentation &
> validation stage (Section 8d). Everything up to and including the organization
> Facebook Page is common ground.

The whole flow rests on the principle from Section "organizing principle": **an
account is a person, not an entity.** The applicant signs up as themselves,
secures the account, then creates the organization's Page _from_ that personal
account.

### 8a. The three approved free providers (founder-directed policy)

> **Policy note — supersedes the current code.** The three-provider rule below is
> **current founder-directed policy** (set in review of this document). It
> **supersedes** `src/data/setup-guides.ts`, which still reads "Google _or_
> Microsoft Authenticator" and "LastPass _or_ Bitwarden." Those guides are
> **pending an update** to match this policy (tracked in Open Questions). Where
> the document and the older guide differ, **this policy governs.**

FFC standardizes on **exactly three** free providers for multi-factor
authentication and password management. **All three are required for every
person** — they are not interchangeable options, because each one is the
authenticator for an ecosystem the charity will actually use:

1. **Google Authenticator** — required because the charity sets up **Google
   services** (e.g. Google Analytics and other Google products), which use it for
   MFA.
2. **Microsoft Authenticator** — required because the charity runs **Microsoft
   365 Enterprise**, which requires it for MFA.
3. **LastPass** — required as the **password manager** (and LastPass Authenticator
   for MFA).

Rules that follow from this:

- **Each person sets up all three** — Google Authenticator, Microsoft
  Authenticator, and LastPass — not just one. They cover different ecosystems the
  charity depends on, so all three are needed per person.
- **Every** FFC-related account has **MFA turned on**, using the authenticator
  for that ecosystem (no SMS where an app is offered).
- The **password manager must be from one of these three providers** — FFC uses
  **LastPass**.
- Do **not** introduce any other tool (no Bitwarden, Authy, 1Password, etc.).
  Being able to set up these three is also part of the technical-literacy bar.

> **Dependency chain (why the order matters):** a **LinkedIn organization Page**
> can only be created from a **personal LinkedIn profile**; a **Facebook
> organization Page** can only be created from a **personal Facebook account**.
> The person always comes first, and the personal account must be secured with
> one of the three authenticators before it is used to create anything.

### 8b. The flow, step by step

**Phase 0 — Baseline capabilities (mandatory; the floor under everything)**

Each item below is **mandatory**. Every item is defined by **what it is**, **why
it benefits the applicant/charity**, and **why it benefits FFC** — because a
prerequisite only belongs here if it serves both sides. If any item is missing,
the applicant **cannot proceed** and should be routed to **Contact us for help**
(the help path is offered at every step).

1. **A smartphone you own, able to install apps**
   - _What:_ A modern iPhone or Android with Apple App Store / Google Play
     access. A tablet or desktop is **not** a substitute.
   - _Why it benefits you:_ It runs the authenticator apps that protect every
     account, so your charity's identity, inbox, money, and donor data are far
     harder to steal; you can also use Outlook, LinkedIn, and Facebook on the go.
   - _Why it benefits FFC:_ Phone-based MFA is the only way we can be confident
     the accounts we help you create aren't trivially compromised — a hijacked
     charity account becomes our cleanup. It also gives each person one
     verifiable identity.

2. **A US-based mobile phone number (on that smartphone)**
   - _What:_ An active US cell number that can send and receive SMS.
   - _Why it benefits you:_ Receives sign-in and account-recovery codes, and lets
     FFC reach you quickly by text during setup.
   - _Why it benefits FFC:_ Confirms the US-based eligibility requirement
     (Section 1), gives us a direct line for time-sensitive verification, and
     provides an SMS fallback before an authenticator app is set up.

3. **A desktop or laptop computer you own, with the ability to install software**
   - _What:_ A Windows or Mac computer on which **you have administrator rights
     to install applications and browser extensions**.
   - _Why it benefits you:_ This is where the real work happens — editing your
     website, designing in Canva, and using the **AI tools** that let you
     maintain your own content. Install rights let you add the AI-tool
     connectors and helpers used later in the process.
   - _Why it benefits FFC:_ Several AI tools and **connectors we use later must
     be installed on a desktop**; without an install-capable computer the charity
     cannot self-serve and the work falls back onto our volunteers. It keeps you
     self-sufficient and our support load low.

4. **Reliable internet access**
   - _What:_ A stable broadband / Wi-Fi connection for both the computer and the
     phone.
   - _Why it benefits you:_ Everything FFC provides is cloud-based — email, site,
     design, analytics — so you need to reach it dependably.
   - _Why it benefits FFC:_ Reduces stalled, half-finished onboardings that we
     would otherwise have to chase.

5. **A primary personal email account (on your phone)**
   - _What:_ A working personal email you control and monitor (Android →
     Google/Gmail; iPhone → iCloud/Apple, or Gmail if that's your main address).
   - _Why it benefits you:_ It is the identity and recovery address behind every
     account; password resets and security alerts land somewhere you always have.
   - _Why it benefits FFC:_ Gives each person one stable identity to attach roles
     and work emails to (the "account is a person" principle) and a reliable
     channel for verification links.

6. **A modern web browser**
   - _What:_ A current **Chrome or Edge** on the computer.
   - _Why it benefits you:_ Runs the web apps and the password-manager extension
     smoothly, with the fewest surprises.
   - _Why it benefits FFC:_ Standardizes the environment so the steps in our
     guides match what you actually see on screen.

7. **Basic digital literacy**
   - _What:_ Comfort opening websites, completing forms, scanning a QR code, and
     installing an app or extension.
   - _Why it benefits you:_ The entire self-service model — and your ongoing
     independence — depends on it.
   - _Why it benefits FFC:_ It is the core signal that the charity can operate
     what we build; this is the heart of the "filter out" philosophy.

**Phase A — Establish the three approved security/credential tools**

1. Install **Google Authenticator** from the phone's app store.
2. Install **Microsoft Authenticator** from the phone's app store.
3. Create a **LastPass** account (the password manager). Choose a strong,
   memorable **master password**, and **turn on MFA for LastPass itself** using
   one of the authenticators. Use LastPass to **generate and store** a unique
   strong password for every account from here on, and to **store MFA recovery
   codes**.

**Phase B — Personal LinkedIn profile (first social rung)**

4. Create the applicant's **personal LinkedIn profile** at linkedin.com using the
   phone's email and the applicant's **real name**; add a photo, headline, and
   current role at the organization.
5. Turn on LinkedIn **two-step verification** (Me → Settings & Privacy → Sign in
   & security) with an authenticator app; save the recovery codes in LastPass.
6. **Every person who is a legal board member — or planned to be one on the
   pre-501(c)(3) track — must have a personal LinkedIn account.** Repeat steps
   4–5 for each of them. How much detail they put on the profile is **up to the
   individual**; the account itself is the requirement.

**Phase C — Create the organization LinkedIn Page (first organizational account)**

7. From the applicant's personal profile: **For Business → Create a Company
   Page**, choose **Company / Nonprofit**, enter the organization name, website,
   and logo, and confirm authorization to act on its behalf.
8. **Add at least one other admin** (Admin tools → Manage admins) — typically the
   other officers — complete the About section, add logo + banner, and publish a
   first post so the Page looks active.
9. **Each legal/planned board member links the charity under their personal
   LinkedIn "Volunteering" section, pointing to the organization's Page.** This
   is a governance signal: it shows the member has **accepted the position and
   therefore the liability** for the nonprofit's actions. (Requires the Page from
   step 7 to exist first.)

**Phase D — Personal Facebook account**

10. Create the applicant's **personal Facebook account** at facebook.com using
    the device email/phone and the applicant's **real name**. (Never create a
    fake "charity person" account — Facebook removes those.)
11. Turn on Facebook **two-factor authentication** (Settings → Accounts Center →
    Password and security → Two-factor authentication → Authentication app); save
    recovery codes in LastPass.

**Phase E — Create the organization Facebook Page (final step of the common flow)**

12. From the personal account: **Create → Page**, enter the organization name,
    choose category **Nonprofit Organization**, add a short description, set the
    logo as the profile picture and a banner as the cover.
13. **Add at least one more admin** (Settings → Page access) so the Page survives
    any single account being lost, and publish a welcome post.

**End state:** the applicant has, unaided — a secured personal identity with all
three approved tools, a qualifying personal LinkedIn, a personal Facebook, and
the organization's **LinkedIn Page and Facebook Page** live with a backup admin
on each. An applicant who completes this unaided has demonstrated the technical
literacy to operate the infrastructure FFC delivers next (email, domain,
website); one who cannot is exactly the case the "filter out" philosophy catches
early.

### 8c. Applicant self-check (everything you must complete to be accepted)

Show this checklist at the **start** of the application so applicants know the
full commitment before investing time, and so the **acceptance expectation** is
unambiguous: **every box must be checked before FFC provides any other service.**
If you get stuck on any item, use **Contact us for help**.

**Baseline (mandatory floor):**

- [ ] I have a **smartphone** that can install apps (not just a tablet/desktop).
- [ ] It has a **US-based mobile phone number** that can send/receive texts.
- [ ] I have a **desktop/laptop I can install software on** (admin rights).
- [ ] I have **reliable internet**, a **modern browser** (Chrome/Edge), and a
      **primary email** on the phone.

**The three approved tools (all three, per person):**

- [ ] **Google Authenticator** installed.
- [ ] **Microsoft Authenticator** installed.
- [ ] **LastPass** set up, with its own MFA on, storing my passwords + recovery
      codes.

**Personal accounts (secured with MFA):**

- [ ] My **personal LinkedIn** profile.
- [ ] A **personal LinkedIn** profile for **each board / planned-board member**.
- [ ] My **personal Facebook** account.
- [ ] Each board / planned-board member has linked the charity under their
      LinkedIn **"Volunteering"** section (accepting the position & liability).

**Organization pages (the hard gate — required before applying):**

- [ ] Our **organization name** is settled (and the matching `.org` checked).
- [ ] Our **organization LinkedIn Page** (with a backup admin).
- [ ] Our **organization Facebook Page** (with a backup admin).

**Eligibility & materials:**

- [ ] US-based, with a **US-citizen point of contact**.
- [ ] Track chosen (**501(c)(3)** or **pre-501(c)(3)**) and its documents gathered
      (see the materials list in Section 2 and the track branches in Section 8d).

### 8d. Where the tracks diverge (after the common flow)

Phases 0–E above are identical for both tracks. Once the social Pages exist and
the self-check is complete, the applicant submits the application (the intake
steps in Section 2) — and **this is where the two tracks diverge**, on **legal
status and documentation**:

|                  | **501(c)(3) track**                                                   | **pre-501(c)(3) track**                                                                                          |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Application form | `freeforcharity.org/501c3`                                            | `freeforcharity.org/pre501c3`                                                                                    |
| Legal status     | Already IRS-recognized; has EIN + **IRS determination letter**        | Not yet recognized; working **IRS Form 1023** + state nonprofit formation + charitable-solicitation registration |
| Board            | **Seated** legal board (officers)                                     | **Planned** board members                                                                                        |
| Transparency     | **Candid/GuideStar to Gold** (Form 990, financials); see Sections 3–4 | No 990 yet; GuideStar deferred until recognized                                                                  |
| Extra accounts   | TechSoup, VolunteerMatch, PayPal emphasized                           | Deferred / as-available                                                                                          |

After acceptance, FFC then provides the **services** (not prerequisites):
organizational email on Microsoft 365 by default, domain + `info@` routing, and
the website/template (Section 7b), plus — on the 501(c)(3) track — the
validation work in Sections 3–4.

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
- **Confirm the three-provider policy, then update `src/data/setup-guides.ts` to
  match.** The current code recommends **one** authenticator app (Google _or_
  Microsoft) and allows **LastPass _or_ Bitwarden**. The founder-directed policy
  in Section 8a is stricter: **all three** of Google Authenticator, Microsoft
  Authenticator, and LastPass, per person, with no other tools. This document
  records that policy as authoritative; the **live setup guide has not yet been
  updated** to remove Bitwarden / require all three. Confirm the policy and I'll
  make that site change.
