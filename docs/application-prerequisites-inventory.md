# Application & Prerequisites — Reference Inventory

> **Status: Draft for verification.** This document inventories the application
> and prerequisite steps that the FFC site currently describes, assembled from
> the existing pages and data files in this repository **and from the
> freeforcharity.org onboarding pages** (`/501c3`, `/pre501c3`,
> `/free-for-charitys-tools-for-success`)
> referenced throughout. The FFC founder should verify, add, or remove steps
> before this is treated as authoritative.

> **Two kinds of content (read this first).** This document now contains both:
> (1) an **inventory of existing guidance** already in the repo, and (2) **new
> founder-directed policy decisions** made while drafting it — specifically the
> **Phase 0 baseline** (Section 8), the **three approved providers** (Section
> 8a), **Microsoft Teams as the first install**, the **Chrome/Edge-only browser
> policy**, **LastPass** as the password manager, and the **GitHub-only
> application flow** (Section 2). The new policies are **not
> yet implemented in the rendered guides/site** (e.g. `src/data/setup-guides.ts`
> still allows **either** Google or Microsoft Authenticator, and **either**
> LastPass or Bitwarden). New-policy items are tagged inline. **Implementing them
> is exactly
> the site update we will make once this flow is accepted.**

> **Source precedence (sources differ by age).** The repo blends two eras. The
> **current** model is captured by `src/data/setup-guides.ts` and the
> freeforcharity.org `/501c3`, `/pre501c3`, and
> `/free-for-charitys-tools-for-success` pages. The
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
| Public application entry point           | <https://freeforcharity.org/submit-information/> (linked from What FFC Delivers)                |
| 501(c)(3) onboarding entry point         | <https://freeforcharity.org/501c3/>                                                             |
| Pre-501(c)(3) onboarding entry point     | <https://freeforcharity.org/pre501c3/>                                                          |
| Recommended tools + setup order          | <https://freeforcharity.org/free-for-charitys-tools-for-success/>                               |

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
   _Legacy discrepancy: the older `wordpress-service-delivery-stages` page lists
   Gold as an **unqualified** eligibility floor; per the current two-track model
   it is 501(c)(3)-only. The legacy page is the one that needs reconciling._
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

> **Application channel — moving to GitHub-only** _(new FFC policy)_. FFC is
> moving to a **GitHub-only application flow**: the applicant applies through
> **GitHub** using the **personal GitHub account** created in Phase 0 (Group D).
> The legacy **WHMCS portal product checkout** is **retired** as an application
> mechanism, and the freeforcharity.org web forms (`/submit-information`,
> `/501c3`, `/pre501c3`) are informational landing pages that point into the
> GitHub flow. This is exactly why a personal GitHub account is a Phase 0
> requirement.

1. **Apply through GitHub** with your personal GitHub account (Phase 0, Group D).
2. **Acknowledge the FFC Acceptable Use Policy (AUP).**
3. _(501(c)(3) track)_ **Provide Candid/GuideStar profile links** (Public Profile
   - Full Profile).
4. **Provide board contact information** — President/Chair, Secretary, Treasurer
   (optionally Vice and Member-At-Large); on the pre-501(c)(3) track, the
   **planned** board.
5. **Designate primary + technical contacts**, including timezone and preferred
   contact hours.

**Exit gate:** application submitted through GitHub, all fields completed, AUP
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

| #   | Check                                                                                                                        | Demonstrates                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | **501(c)(3) status via Candid / GuideStar** (record NTEE code)                                                               | Legitimacy; mission-alignment scoring                            |
| 2   | **TechSoup legal-entity confirmation** ("Validated", not "Pending")                                                          | Independent vetting; unlocks discounted-software pipeline        |
| 3   | **VolunteerMatch engagement check**                                                                                          | Charity can receive and act on volunteer work                    |
| 4   | **Verified Facebook page** (cross-checked vs. intake form)                                                                   | Identity/branding consistency                                    |
| 5   | **Email on a reputable provider** (Microsoft 365 preferred; not Gmail/Yahoo)                                                 | Technical readiness; enables SPF/DKIM/DMARC under charity domain |
| 6   | **WHMCS account + PayPal donor flow** _(WHMCS is **legacy** — retired with the GitHub-only intake; PayPal donor flow stays)_ | KYC step; donor funding path                                     |

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

Once validation passes and the charity accepts the written offer (historically a
signed WHMCS quote — **legacy/pending replacement** under the GitHub-only intake),
the prerequisite/application phase is complete and the engagement moves into
provisioning. The full lifecycle (for reference) is an eight-stage flow:

1. Initial Contact & Onboarding
2. **FFC Validation Checks** ← prerequisite gate (Sections 3–4)
3. FFC Offers Services
4. Basic Services Package (domain + Microsoft 365)
5. Charity System & Website Setup (branches by 501(c)(3) status)
6. Technical Stack Assignment
7. Plugin & Theme Deployment
8. Initial Site Launch & Configuration

---

## 7. Track-agnostic minimum prerequisites (both tracks)

The authoritative, track-agnostic prerequisite list is **Phase 0 (Section 8)** —
every item there applies identically to both the 501(c)(3) and pre-501(c)(3)
tracks, up to and including the organizational LinkedIn and Facebook Pages. See
Section 8 for the grouped items and the applicant self-check.

**Track-specific items (not part of the common minimum)** are detailed in
Section 8d: the GuideStar/Candid **Gold** seal, Form 990, audited financials, and
the IRS determination letter (501(c)(3) only); IRS Form 1023, state nonprofit
formation, and charitable-solicitation registration (pre-501(c)(3) only); with
TechSoup, VolunteerMatch, and PayPal emphasized on the 501(c)(3) path.

---

## 8. The individual-applicant flow (up to and including the social Pages)

This is the **single, logical, end-to-end sequence** an individual applicant
follows — from the baseline devices and accounts in Phase 0, to having the
organization's **LinkedIn Page and Facebook Page** live. It encapsulates every
step the person must take and is ordered so that **each step depends only on
steps already completed**.

> **This flow is identical for both the 501(c)(3) and the pre-501(c)(3)
> tracks.** The track is _chosen_ early (Section 1 / Phase 0) because it
> determines which documents and which application form come later — but the
> prerequisite **work** below (Phase 0 plus the organization-page steps) is **the
> same for both**. The two
> tracks **diverge only after this common flow**, at the legal-documentation &
> validation stage (Section 8d). Everything up to and including the organization
> Facebook Page is common ground.

The whole flow rests on the principle from Section "organizing principle": **an
account is a person, not an entity.** The applicant signs up as themselves,
secures the account, then creates the organization's Page _from_ that personal
account.

### 8a. The three approved free providers (founder-directed policy — pending implementation)

> **Policy note.** The three-provider rule below is a **founder-directed policy
> set while drafting this document** — treat it as the **intended policy, pending
> implementation**, not as existing repo guidance. It is **not yet reflected in
> `src/data/setup-guides.ts`** (which labels itself the "single source of truth"
> and currently allows **either** Google or Microsoft Authenticator and **either**
> LastPass or Bitwarden). Implementing this policy means **updating those rendered
> guides** (a tracked action in Open Questions); until that change ships, the live
> guides still show the older options.

Under this policy, FFC requires **all three** free providers per person — they
are **not interchangeable**. A generic TOTP app (including LastPass) can produce
the 6-digit codes, **but the native Google and Microsoft authenticators unlock
provider-specific features that generic apps cannot** — notably **automatic
account recovery** and **passwordless sign-in** — when used with their own
ecosystems. That is why each native app is required for its matching ecosystem:

1. **Google Authenticator** — the **native** authenticator for **Google**
   services (Google Analytics and other Google products). Using the native app
   enables Google's automatic recovery and passwordless sign-in.
2. **Microsoft Authenticator** — the **native** authenticator for **Microsoft
   365** (the charity's email/productivity suite). Using the native app enables
   Microsoft's automatic recovery and phone/passwordless sign-in.
3. **LastPass** — the **password manager**. It can also generate TOTP codes, but
   the **native apps above are used for the Google and Microsoft accounts** so
   those accounts get their native recovery and passwordless features — LastPass
   is **not** a fourth tool.

Under this policy:

- **Each person sets up all three** — Google Authenticator, Microsoft
  Authenticator, and LastPass — not just one. They cover different ecosystems the
  charity depends on, so all three are needed per person.
- **Every** FFC-related account has **MFA turned on**, using the authenticator
  for that ecosystem (no SMS where an app is offered).
- The **password manager is LastPass.** (Google Authenticator and Microsoft
  Authenticator are authenticators, not password managers — LastPass is the
  single password manager in the approved set.)
- No other tool is introduced (no Bitwarden, Authy, 1Password, etc.). Being able
  to set up these three is also part of the technical-literacy bar.

> **Dependency chain (why the order matters):** a **LinkedIn organization Page**
> can only be created from a **personal LinkedIn profile**; a **Facebook
> organization Page** can only be created from a **personal Facebook account**.
> The person always comes first, and the personal account must be secured with an
> authenticator app (and a passkey where offered) before it is used to create
> anything.

#### Passkeys (vendor-aligned; increasingly the default)

Passkeys are a newer, **phishing-resistant** sign-in that replaces the password
with your device's biometric or PIN (the FIDO2 / WebAuthn standard). Like the
authenticators above, passkeys are **vendor-aligned** — each one is generally
tied to an ecosystem:

- **Google** passkeys (Android / Google account)
- **Apple** passkeys (iCloud Keychain on iPhone / Mac)
- **Microsoft** passkeys
- **Device passkeys** such as **Windows Hello** on the computer

Passkeys are becoming the default sign-in across Google, Microsoft, Apple,
LinkedIn, and Facebook, and they reinforce the same vendor-alignment behind the
three-provider policy and the "account is a person" principle.

- _FFC stance:_ **enable passkeys where offered** — Windows Hello on the computer
  and the platform passkey on the phone — **alongside** the authenticator-app MFA
  above (not instead of it).
- _You:_ faster, phishing-resistant sign-in that's hard to steal.
- _FFC:_ stronger account security with less password risk to clean up.

### 8b. The flow — Phase 0, then the organizational pages

**Phase 0 — Baseline capabilities (mandatory; the floor under everything)**

Each item below is **mandatory** and defined by **what it is / why it benefits
you / why it benefits FFC** — a prerequisite belongs here only if it serves both
sides. If any item is missing, the applicant **cannot proceed** and should be
routed to **Contact us for help** (offered at every step). The items are grouped
into the categories below.

#### Group A — Devices & connectivity (the hardware floor)

- **A smartphone you own — app-capable and on a supported OS**
  - _What:_ A modern iPhone or Android with Apple App Store / Google Play access,
    **still receiving OS/security updates** (not an abandoned, end-of-life
    device). A tablet or desktop is **not** a substitute.
  - _You:_ It runs the authenticator apps that protect every account, so your
    charity's identity, inbox, money, and donor data are far harder to steal; you
    can also use Outlook, LinkedIn, and Facebook on the go.
  - _FFC:_ Phone-based MFA is the only way we can be confident the accounts we
    help you create aren't trivially compromised — a hijacked charity account
    becomes our cleanup; an unsupported phone is a security hole that undermines
    that MFA. It also gives each person one verifiable identity.
- **A US-based mobile phone number (on that smartphone)**
  - _What:_ An active US cell number that can send and receive SMS.
  - _You:_ Receives sign-in and account-recovery codes, and lets FFC reach you
    quickly by text during setup.
  - _FFC:_ Confirms the US-based eligibility requirement (Section 1), gives us a
    direct line for time-sensitive verification, and provides an SMS fallback
    before an authenticator app is set up.
- **A desktop or laptop computer you own — install-capable and still supported**
  - _What:_ A Windows or Mac computer on which **you have administrator rights to
    install applications and browser extensions**, **still receiving OS updates**
    (e.g. Windows 11, or a macOS version Apple still supports) with **at least
    8 GB of RAM**. This OS/spec floor is part of the requirement.
  - _You:_ This is where the real work happens — editing your website, designing
    in Canva, and using the **AI tools** that maintain your content. A supported,
    install-capable machine means those tools and connectors actually run.
  - _FFC:_ Several AI tools and **connectors we use later must be installed on a
    desktop**; an unsupported or underpowered machine can't run them, and the
    work falls back onto our volunteers.
- **Reliable internet access**
  - _What:_ A stable broadband / Wi-Fi connection for both the computer and phone.
  - _You:_ Everything FFC provides is cloud-based — email, site, design,
    analytics.
  - _FFC:_ Reduces stalled, half-finished onboardings we'd have to chase.
- **A webcam and microphone**
  - _What:_ A working camera and microphone — on the computer **or** the
    smartphone (with Teams installed on whichever you join from).
  - _You:_ Lets you take part in live onboarding/training calls and get
    face-to-face help.
  - _FFC:_ Lets us run efficient guided sessions, confirm who we're working with,
    and resolve issues faster than email.

#### Group B — Required software on your devices

- **An approved web browser — Chrome or Edge only** _(new FFC support policy —
  not yet in the rendered guides)_
  - _What:_ A current **Google Chrome or Microsoft Edge** on the computer.
    **Firefox, Safari, and any other browser are not approved or supported.**
  - _You:_ Chrome/Edge run the web apps, the password-manager extension, and the
    AI-tool integrations exactly the way the guides expect.
  - _FFC:_ A single supported browser pair means our guides and screenshots match
    your screen, with no time lost to browser-specific quirks.
- **Google Authenticator (MFA app)** _(one of the three required providers — see
  Section 8a)_
  - _What:_ Install from the phone's app store. You scan QR codes into it to turn
    on app-based two-factor authentication.
  - _You:_ Secures your Google-ecosystem accounts (e.g. Google Analytics) with
    2FA so a stolen password alone can't get in.
  - _FFC:_ MFA on every account is how we keep the charity's accounts from being
    trivially compromised.
- **Microsoft Authenticator (MFA app)** _(one of the three required providers —
  see Section 8a)_
  - _What:_ Install from the phone's app store. Required for Microsoft 365
    two-factor authentication.
  - _You:_ Secures your Microsoft 365 sign-in.
  - _FFC:_ Extends MFA coverage across the Microsoft ecosystem the charity runs
    on.
- **LastPass (password manager)** _(the third required provider — see Section
  8a)_
  - _What:_ Create an account with a strong **master password**; turn on
    LastPass's own MFA; use it to generate/store a unique password for every
    account and to store your **MFA recovery codes**. (Not a fourth tool — it is
    the password manager of the three.)
  - _You:_ One vault for every credential and recovery code, so a new or lost
    phone never locks you out.
  - _FFC:_ Credential hygiene that keeps the charity's accounts both secure and
    recoverable.
- **Microsoft Teams (desktop application + mobile app) — the first mandatory
  install** _(new FFC policy — not yet in the rendered setup guides)_
  - _What:_ The **Teams desktop application** on the computer (not just the web
    version) **and** the Teams app on the phone. The **first install** every
    applicant completes. For now, sign in with a **free/personal Microsoft
    account**; the charity `@org` identity is added later, once FFC provisions
    Microsoft 365.
  - _You:_ Teams is how you meet with FFC — screen sharing, live walkthroughs, and
    real-time help; on your phone you can join from anywhere.
  - _FFC:_ Our standard meeting/screen-share channel, so we can guide you live.
    Installing it also **proves your computer can install software** — the first
    connector test, and the verification for the computer requirement above.
- **A calendar app (Google Calendar or Outlook Calendar)**
  - _What:_ A working calendar on the phone/computer.
  - _You:_ Schedule and keep onboarding and training sessions.
  - _FFC:_ We can book time with you reliably instead of chasing scheduling.
- **A documents app (Microsoft Word or Google Docs)**
  - _What:_ The ability to write and share documents.
  - _You:_ Draft your mission, board bios, and page/site content in editable form.
  - _FFC:_ Content arrives editable, so we can help refine and publish it quickly.
- **Cloud file storage (Google Drive or Microsoft OneDrive) + scanning**
  - _What:_ A **Google Drive or Microsoft OneDrive** account, plus the ability to
    **scan documents** (a phone scan app counts), to store the charity's **core
    files** — state formation/incorporation papers, the IRS determination memo,
    board documents.
  - _You:_ One secure, backed-up home for documents you reuse constantly; scanning
    the IRS memo the moment it arrives means it's never lost.
  - _FFC:_ Clean, organized documents make validation fast, and shared storage
    lets us help without emailing sensitive files around.
  - _Action:_ **New guide needed** — using Drive/OneDrive to store core charity
    files and how to scan documents such as the IRS memo. (Tracked in Open
    Questions.)

#### Group C — Personal identity, email & recovery

- **A primary personal email account (on your phone)**
  - _What:_ A working personal email you control and monitor (Android →
    Google/Gmail; iPhone → iCloud/Apple, or Gmail if that's your main address).
  - _You:_ The identity and recovery address behind every account; resets and
    security alerts land somewhere you always have.
  - _FFC:_ One stable identity per person to attach roles and work emails to (the
    "account is a person" principle) and a reliable verification channel.
- **A secondary recovery email / backup contact**
  - _What:_ A second email (or a second trusted person's address) usable for
    account recovery.
  - _You:_ A lost device or inaccessible primary email never means permanent
    lockout.
  - _FFC:_ A fallback channel if the primary contact goes dark, so accounts don't
    become orphaned.

#### Group D — Personal accounts (you, the human — MFA-secured where available)

> Each is a **personal** account in your own name (the "account is a person, not
> an entity" principle). The **organizational** pages built on top of them are
> created later (Section 8b). Turn on **MFA where the platform offers it**, using
> the Phase 0 authenticators.

- **A personal GitHub account**
  - _What:_ Your own GitHub account in your real name (e.g. `@FirstnameLastname`),
    MFA on. You add your charity email to it later — you do **not** create a
    separate "charity" login.
  - _You:_ It is **how you apply** (FFC's application flow is GitHub-only — see
    Section 2) and how you'll later review and approve changes to your website;
    one personal account works across every charity and role you hold.
  - _FFC:_ The application arrives through GitHub and we add your account to the
    charity's repository as a writer; a real, secured personal identity keeps the
    application and contribution history accountable.
- **A personal LinkedIn profile — applicant and every board / planned-board
  member**
  - _What:_ A personal LinkedIn profile (real name, photo, headline, current
    role), MFA on, for the applicant **and each legal or planned board member**.
    Detail level is up to the individual; the account itself is the requirement.
  - _You:_ Your professional identity, and the only way to create the
    organization's LinkedIn Page later.
  - _FFC:_ Confirms real, accountable people behind the charity, and supports the
    board volunteering-linkage governance signal (Section 8b).
- **A personal Facebook account**
  - _What:_ Your own Facebook account in your real name, MFA on. (Never create a
    fake "charity person" account — Facebook removes those.)
  - _You:_ Required to create and administer the organization's Facebook Page.
  - _FFC:_ Keeps the eventual Page behind a real, secured human admin.
- **A personal Canva account**
  - _What:_ Your own Canva account, MFA on; you later join the charity's Canva
    team.
  - _You:_ Access the charity's brand kit and templates to make on-brand graphics.
  - _FFC:_ Brand-consistent materials without FFC doing the design.
- **A personal Idealist account** (idealist.org)
  - _What:_ Your own account on **Idealist**, the nonprofit volunteer/jobs
    platform. You'll create the organization's listing later.
  - _You:_ Learn how volunteers find and connect with charities by experiencing
    the platform from the volunteer side first.
  - _FFC:_ You already know the tool when it's time to post the charity's
    opportunities — one fewer account to teach during delivery.
- **A personal Candid account** (candid.org)
  - _What:_ Your own **Candid** (formerly GuideStar) account. The organization's
    Candid profile and transparency seal come later (Section 4).
  - _You:_ See how donors and funders research charities on the canonical
    nonprofit registry before you build your own profile — and use it to **find
    other charities in your area of the same type and mission** (feeds the
    comparable-charities prerequisite in Group F).
  - _FFC:_ Familiarity with Candid before the org-profile/seal work speeds that
    step and reduces what we teach later.
- **A personal Taproot account** (taprootfoundation.org / Taproot Plus)
  - _What:_ Your own **Taproot** account, the skills-based (pro-bono) volunteering
    marketplace. Organizational variations come later.
  - _You:_ Understand how pro-bono and skills-based volunteering is sourced and
    requested.
  - _FFC:_ Another standard nonprofit tool learned during prerequisites, not
    during delivery.

#### Group E — Skills, AI & commitment

- **Basic digital literacy**
  - _What:_ Comfort opening websites, completing forms, scanning a QR code, and
    installing an app or extension.
  - _You:_ The self-service model — and your ongoing independence — depends on it.
  - _FFC:_ The core signal that the charity can operate what we build (the heart
    of the "filter out" philosophy).
- **Willingness to use AI tools — required assistant matches your email
  ecosystem**
  - _What:_ A willingness to use AI assistants, now **remarkably good at walking
    people through complex technical steps — even the free versions.** The
    required first assistant depends on your primary email:
    - **Gmail or iCloud → Google Gemini is required.**
    - **Outlook.com → Microsoft Copilot is required.**
    - Once you've mastered it, **Claude** is the recommended next tool.
  - _You:_ The assistant matching your ecosystem is already built into your
    phone/accounts, so it's easiest to adopt and can guide you through nearly
    every step.
  - _FFC:_ The self-service maintenance model depends on it; confident AI users
    need far less hands-on support.
- **A dedicated time commitment**
  - _What:_ A realistic block of focused time to work through the ladder, plus
    ongoing time to maintain the site.
  - _You:_ Setting time aside up front means you finish instead of stalling with
    half-secured accounts.
  - _FFC:_ Reduces abandoned, half-finished onboardings.

#### Group F — Organization basics the charity brings

- **A settled organization name, checked on Cloudflare**
  - _What:_ Decide the organization's exact name and **check the matching `.org`
    availability at cloudflare.com**, which offers a domain name-checking service.
  - _You:_ Consistent naming across pages, email, and domain, with no rework
    later.
  - _FFC:_ FFC uses **Cloudflare for secure provisioning of domain names once we
    purchase them**, so checking there now matches where the domain will live.
- **A drafted mission statement**
  - _What:_ A short written mission statement for the organization.
  - _You:_ Needed for the LinkedIn/Facebook About sections, GuideStar, and the
    site — write it once, reuse everywhere.
  - _FFC:_ Validation and page setup go faster when the mission is articulated.
- **Three comparable charities identified (exact or near-exact mission)**
  - _What:_ Find and note **at least three other charities** — ideally in your
    area — doing the **exact or near-exact mission**, using your personal Candid
    account (Group D) plus Idealist.
  - _You:_ You learn the landscape and your peers, sharpen what makes your
    organization distinct, and see proven examples to model.
  - _FFC:_ Confirms a real, well-understood need (not duplicative), gives the
    mission a clear frame, and provides comparables for design and benchmarking.
- **A public organization phone number**
  - _What:_ A phone number for the organization that can be listed publicly. A
    free **Google Voice** number works well — it's what the FFC founder uses
    personally and publicly for the charity. Many people use their **direct cell
    number** instead, which is also fine — but as a **public charity** it means
    you must be comfortable being **publicly found and contacted in support of
    your mission**.
  - _You:_ A listed contact number for donors, partners, and the people you serve.
  - _FFC:_ Satisfies the contact number GuideStar and public listings expect.
- **A US mailing address you accept will be public**
  - _What:_ A US mailing address for the organization. A **PO box is fine**, and
    many use their **home address** — but you must **understand and accept that it
    becomes public** and associated with the nonprofit's activity.
  - _You:_ Incorporation, the IRS, GuideStar, Microsoft 365 nonprofit validation,
    and domain records all require a real address.
  - _FFC:_ Confirms a real US-based entity and the public contact point that
    transparency and the donor flow depend on.

#### Group G — Governance & agreement

- **At least two accountable people**
  - _What:_ A primary contact **and** at least one other real person who can be a
    backup administrator (typically a board member).
  - _You:_ No page, mailbox, or account dies with a single login.
  - _FFC:_ Continuity — we never end up with an orphaned page/account behind one
    unreachable person.
- **Up-front acknowledgment of the FFC Acceptable Use Policy**
  - _What:_ Read and **accept the FFC AUP** and the "credit FFC" expectation
    before any work begins.
  - _You:_ You know exactly what's expected (and that the service is free) before
    investing time.
  - _FFC:_ Consent and expectations recorded before volunteer effort is committed.

> **Verification (light-touch):** we do not formally audit each item — **having
> installed the required apps is the proof.** The **first mandatory install is
> Microsoft Teams (desktop)**; completing it demonstrates the computer's
> software-install capability (Group A) and readiness for screen-sharing and
> meetings. Later AI-tool connectors are treated the same way.

**After Phase 0 — the organizational pages (applicant-run)**

Everything **personal** — devices, the three security tools, email, and the
applicant's own GitHub / LinkedIn / Facebook accounts (all MFA-secured) — is
completed in **Phase 0**. What remains before applying is creating the
**organizational pages** from those personal accounts. This is the hard gate, and
it is identical for both tracks.

**Organization LinkedIn Page**

1. From the applicant's **personal LinkedIn profile** (Phase 0, Group D): **For
   Business → Create a Company Page**, choose **Company / Nonprofit**, enter the
   organization name, website, and logo, and confirm authorization to act on its
   behalf.
2. **Add at least one other admin** (Admin tools → Manage admins) — typically the
   other officers — complete the About section, add logo + banner, and publish a
   first post so the Page looks active.
3. **Each legal/planned board member links the charity under their personal
   LinkedIn "Volunteering" section, pointing to the Page.** This is a governance
   signal: it shows the member has **accepted the position and therefore the
   liability** for the nonprofit's actions.

**Organization Facebook Page**

1. From the applicant's **personal Facebook account** (Phase 0, Group D): **Create
   → Page**, enter the organization name, choose category **Nonprofit
   Organization**, add a short description, set the logo as the profile picture
   and a banner as the cover.
2. **Add at least one more admin** (Settings → Page access) so the Page survives
   any single account being lost, and publish a welcome post.

> The **organizational** GitHub (the charity's repo/org), **Microsoft 365** email,
> the **domain**, and the **website** are provisioned by **FFC after acceptance** —
> they are services, not applicant prerequisites.

**End state:** the applicant has, unaided — a secured personal identity (devices,
the three tools, and personal GitHub / LinkedIn / Facebook), and the
organization's **LinkedIn Page and Facebook Page** live with a backup admin on
each. An applicant who completes this unaided has demonstrated the technical
literacy to operate the infrastructure FFC delivers next; one who cannot is
exactly the case the "filter out" philosophy catches early.

### 8c. Applicant self-check (everything you must complete to be accepted)

Show this checklist at the **start** of the application so applicants know the
full commitment before investing time, and so the **acceptance expectation** is
unambiguous: **every box must be checked before FFC provides any other service.**
If you get stuck on any item, use **Contact us for help**.

**Baseline (mandatory floor):**

- [ ] I have a **smartphone** that can install apps (not just a tablet/desktop),
      on a **supported, up-to-date OS**.
- [ ] It has a **US-based mobile phone number** that can send/receive texts.
- [ ] I have a **desktop/laptop I can install software on** (admin rights), still
      getting **OS updates**, with **8 GB+ RAM**.
- [ ] I have **reliable internet**, **Chrome or Edge** (Firefox/Safari not
      supported), and a **primary email** on the phone.
- [ ] **Microsoft Teams** installed on my computer **and** phone (first install).
- [ ] A working **webcam + microphone** (on the computer or phone).
- [ ] **Google Drive or Microsoft OneDrive** set up, and I can **scan documents**.
- [ ] A **calendar app** and a **documents app** (Word/Google Docs).
- [ ] A **secondary recovery email** / backup contact.
- [ ] I'm **willing to use AI tools** — the required one matches my email
      (Gmail/iCloud → **Gemini**; Outlook.com → **Copilot**), then Claude.
- [ ] **Passkeys enabled where offered** (e.g., Windows Hello), alongside MFA.
- [ ] I've set aside **dedicated time** to finish the ladder and maintain the site.

**The three approved tools (all three, per person):**

- [ ] **Google Authenticator** installed.
- [ ] **Microsoft Authenticator** installed.
- [ ] **LastPass** set up, with its own MFA on, storing my passwords + recovery
      codes.

**Personal accounts (mine, in my real name, secured with MFA):**

- [ ] My **personal GitHub** account.
- [ ] My **personal LinkedIn** profile.
- [ ] A **personal LinkedIn** profile for **each board / planned-board member**.
- [ ] My **personal Facebook** account.
- [ ] My **personal Canva** account.
- [ ] My **personal Idealist** account (volunteer/charity search).
- [ ] My **personal Candid** account (nonprofit registry).
- [ ] My **personal Taproot** account (skills-based volunteering).
- [ ] Each board / planned-board member has linked the charity under their
      LinkedIn **"Volunteering"** section (accepting the position & liability).

**Organization basics:**

- [ ] Our **organization name** is settled and the `.org` **checked on Cloudflare**.
- [ ] A **drafted mission statement**.
- [ ] **Three comparable charities** (exact/near-exact mission) identified.
- [ ] A **public org phone number** (e.g., Google Voice).

**Organization pages (the hard gate — required before applying):**

- [ ] Our **organization LinkedIn Page** (with a backup admin).
- [ ] Our **organization Facebook Page** (with a backup admin).

**Governance, eligibility & materials:**

- [ ] US-based, with a **US-citizen point of contact**.
- [ ] A **US mailing address** I accept will be public (PO box or home is fine).
- [ ] At least **two accountable people** (primary + backup admin).
- [ ] I've **acknowledged the FFC AUP** and the "credit FFC" expectation.
- [ ] Track chosen (**501(c)(3)** or **pre-501(c)(3)**) and its documents gathered
      (see the materials list in Section 2 and the track branches in Section 8d).

### 8d. Where the tracks diverge (after the common flow)

Phase 0 and the organizational-page steps above are identical for both tracks.
Once the social Pages exist and the self-check is complete, the applicant submits
the application (the intake
steps in Section 2) — and **this is where the two tracks diverge**, on **legal
status and documentation**:

|                | **501(c)(3) track**                                                   | **pre-501(c)(3) track**                                                                                          |
| -------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Landing page   | <https://freeforcharity.org/501c3/>                                   | <https://freeforcharity.org/pre501c3/>                                                                           |
| How you apply  | **GitHub-only flow** (see Section 2)                                  | **GitHub-only flow** (see Section 2)                                                                             |
| Legal status   | Already IRS-recognized; has EIN + **IRS determination letter**        | Not yet recognized; working **IRS Form 1023** + state nonprofit formation + charitable-solicitation registration |
| Board          | **Seated** legal board (officers)                                     | **Planned** board members                                                                                        |
| Transparency   | **Candid/GuideStar to Gold** (Form 990, financials); see Sections 3–4 | No 990 yet; GuideStar deferred until recognized                                                                  |
| Extra accounts | TechSoup, VolunteerMatch, PayPal emphasized                           | Deferred / as-available                                                                                          |

After acceptance, FFC then provides the **services** (not prerequisites):
organizational email on Microsoft 365 by default, domain + `info@` routing, and
the website/template, plus — on the 501(c)(3) track — the validation work in
Sections 3–4.

---

## Open questions for verification

- **Application channel: GitHub-only** — founder-directed policy, **pending
  implementation** (same status as the other new policies; see the disclaimer at
  the top). The freeforcharity.org pages
  (<https://freeforcharity.org/submit-information/>, `/501c3`, `/pre501c3`) become
  informational landing pages that point into the GitHub flow, and the legacy
  WHMCS checkout is retired. Remaining work: build/define the actual GitHub
  application entry point (repo + issue template or form).
- Is **"under $1M and not federally grant-funded"** a hard gate or only a
  prioritization signal? (Currently documented as priority criterion.)
- Are the **six external / three internal** checks still the current set, or
  have any been added/retired (e.g., Instagram, Google for Nonprofits)?
- Should the **organization Facebook Page and LinkedIn Page** (and the personal
  LinkedIn profiles) be promoted into the formal Section 3a validation checks,
  given they are now hard requirements on both tracks?
- Should **AUP acknowledgment** and a **conflict-of-interest / data-handling**
  agreement be explicit prerequisite line items?
- **New guide to create: cloud storage + document scanning.** A walkthrough on
  using **Google Drive or Microsoft OneDrive** to store the charity's core files
  (state formation / incorporation papers, board documents) and how to **scan**
  documents such as the IRS determination memo into either provider. Would be a
  new entry in `src/data/setup-guides.ts`.
- **Confirm the three-provider policy, then update `src/data/setup-guides.ts` to
  match.** The current code recommends **one** authenticator app (Google _or_
  Microsoft) and allows **LastPass _or_ Bitwarden**. The founder-directed policy
  in Section 8a is stricter: **all three** of Google Authenticator, Microsoft
  Authenticator, and LastPass, per person, with no other tools. This document
  records that policy as authoritative; the **live setup guide has not yet been
  updated** to remove Bitwarden / require all three. Confirm the policy and I'll
  make that site change.
