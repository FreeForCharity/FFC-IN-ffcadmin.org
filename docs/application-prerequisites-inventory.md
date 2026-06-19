# Application & Prerequisites — Reference Inventory

> **Status: Draft for verification.** This document inventories the application
> and prerequisite steps that the FFC site currently describes, assembled from
> the existing pages and data files in this repository **and from the
> freeforcharity.org onboarding pages** (<https://freeforcharity.org/501c3/>, <https://freeforcharity.org/pre501c3/>,
> <https://freeforcharity.org/free-for-charitys-tools-for-success/>)
> referenced throughout. The FFC founder should verify, add, or remove steps
> before this is treated as authoritative.

> **Two kinds of content (read this first).** This document now contains both:
> (1) an **inventory of existing guidance** already in the repo, and (2) **new
> founder-directed policy decisions** made while drafting it — specifically the
> **Phase 0 baseline** (Section 2), the **three approved providers**
> (Section 2a), **Microsoft Teams as the first install**, the **Chrome/Edge-only browser
> policy**, **LastPass** as the password manager, and the **GitHub-only
> application flow** (Section 3). The new policies are **not
> yet implemented in the rendered guides/site** (e.g. `src/data/setup-guides.ts`
> still allows **either** Google or Microsoft Authenticator, and **either**
> LastPass or Bitwarden). New-policy items are tagged inline. **Implementing them
> is exactly
> the site update we will make once this flow is accepted.**

> **Source precedence (sources differ by age).** The repo blends two eras. The
> **current** model is captured by `src/data/setup-guides.ts` and the
> freeforcharity.org <https://freeforcharity.org/501c3/>, <https://freeforcharity.org/pre501c3/>, and
> <https://freeforcharity.org/free-for-charitys-tools-for-success/> pages. The
> **legacy** WordPress / Online Impacts era is captured by the
> `legacy-wordpress-administration/*` pages (WHMCS product checkout, InterServer
> hosting, GuideStar-as-universal-gate, the eight-stage WordPress lifecycle).
> Where they conflict, **the current model governs the individual-applicant flow
> in Section 2**; legacy details are retained for the operations history but are
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
> organized around the **prerequisite steps** and a **self-check** (Section 2c)
> so an applicant can see, up front, **everything they will need to do**. The
> expectation is explicit: a charity completes the prerequisite ladder
> (Section 2) **before FFC provides any other service**. Completing it is what
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
> applies to the **pre-501(c)(3) track** — the organization's Facebook and
> LinkedIn pages are required there as well.
>
> **In-repo source:** the actual walkthroughs live in `src/data/setup-guides.ts`
> (the `linkedin` and `facebook` guides), which explicitly describe creating each
> organization Page **from the applicant's own personal account**. See the full
> applicant flow in Section 2.

### The organizing principle: an account is a person, not an entity

The `src/data/setup-guides.ts` guides are built on one repeated rule: **you sign
up as yourself** (the identity on your phone), turn on multi-factor
authentication, and then **add your work persona** (e.g. an `@yourcharity.org`
email) to that one personal account. The login is always the **person**, never
the organization. Every organizational asset — a GitHub org, a LinkedIn Page, a
Facebook Page — is something a real person's secured account is given control
of. This principle is what makes the flow in Section 2 logical and ordered.

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

## At a glance — the journey, in order

_Who reads what:_ a **charity applicant** follows Sections 1–4 (their journey);
**FFC volunteers/admins** also use Sections 5–8 (the back-office that runs after
submission). The **Glossary** at the end defines the terms.

1. **Eligibility floor** (Section 1) — US-based, with a US-citizen contact; an
   active 501(c)(3) **or** the pre-501(c)(3) track.
2. **Phase 0 prerequisites** (Section 2) — devices, the three security tools +
   passkeys, the applicant's personal accounts, and org basics; then create the
   organization **LinkedIn + Facebook Pages**. Ends with the **self-check** (2c).
   _Nothing else is provisioned until Phase 0 is complete._
3. **Submit** (Section 3) — apply through **GitHub**.
4. **Tracks diverge** (Section 4) — 501(c)(3) vs pre-501(c)(3) legal documentation.
5. **FFC-side, after submission** — validation checks (Section 5), the
   GuideStar/Candid seal (Section 6), and FFC-supported org accounts (Section 7).
6. **Service-delivery lifecycle** (Section 8) — legacy WordPress-era flow, kept
   for reference.

---

## 1. Eligibility floor (hard gates)

A charity must clear these before any application is meaningful. Failing one of
these generally results in a polite decline rather than a fix-and-retry.

1. **US-based charity** with a **US-citizen point of contact**. (International
   charities are politely declined — US-only restriction.)
2. **501(c)(3) status active** — or on the **pre-501(c)(3) track** for
   organizations not yet recognized (see Section 1a; this track has its own
   landing page on freeforcharity.org that points into the GitHub-only
   application flow — see Section 3).
3. **(501(c)(3) track only)** at minimum a Gold Candid (GuideStar) seal (see
   Section 6). This is **not** a universal gate — a pre-501(c)(3) organization
   cannot yet hold a Gold seal (no Form 990), and instead works the IRS 1023 /
   state-formation track. Listed here as track-specific, not track-agnostic.
   _Legacy discrepancy: the older `wordpress-service-delivery-stages` page lists
   Gold as an **unqualified** eligibility floor; per the current two-track model
   it is 501(c)(3)-only. The legacy page is the one that needs reconciling._
4. **Annual revenue under $1 million — a HARD gate.** Measured **per year** (e.g.
   the most recent Form 990). Organizations at or above $1M/year are declined.
5. **Priority criterion:** not federally grant-funded. (Drives prioritization,
   not an absolute bar.)

### 1a. The pre-501(c)(3) track

Organizations that are not yet IRS-recognized 501(c)(3)s can still apply through
the **pre-501(c)(3) track** (its <https://freeforcharity.org/pre501c3/> landing page points into the
GitHub-only application flow — Section 3). The track carries its own prerequisite
expectations:

- The organization **Facebook Page and LinkedIn Page must still be created** (see
  the social-page litmus test above) — these are not waived for pre-501(c)(3)
  applicants.
- Because there is not yet a confirmed board, the applicant supplies the
  **personal LinkedIn profiles of the planned board members** in place of a
  seated board roster.
- The applicant's **own personal LinkedIn profile** is required (this applies to
  every applicant — see Section 3).

---

## 2. The applicant flow — Phase 0 through the organizational pages

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
> validation stage (Section 4). Everything up to and including the organization
> Facebook Page is common ground.

The whole flow rests on the principle from Section "organizing principle": **an
account is a person, not an entity.** The applicant signs up as themselves,
secures the account, then creates the organization's Page _from_ that personal
account.

### 2a. Approved authenticators & password management (founder-directed policy)

> **Policy note.** This is **founder-directed policy**, now reflected in the
> setup guides (`src/data/setup-guides.ts`): the MFA guide requires **both**
> authenticators, the password-manager guide is reframed around the built-in
> managers, and there are **Chrome** and **Edge** guides. The remaining
> not-yet-shipped pieces are tracked in Open Questions §A.

Every person sets up **both native authenticators** and keeps a **holistic
approach to password management** (with at least one manager tied to the mobile
device they carry).

**Authenticators — both required:**

1. **Google Authenticator** — native for the **Google** ecosystem (Google
   Analytics and other Google products). Cloud backup of codes. _(Google's
   one-tap "Google Prompt" comes from the Google app, not the authenticator.)_
2. **Microsoft Authenticator** — native for **Microsoft 365**. Cloud backup
   **and** Microsoft's app-based approval / phone sign-in.

A generic TOTP app (including LastPass) can produce the 6-digit codes, but the
**native** apps unlock these provider features, so the matching native app is
used for each ecosystem. Use an authenticator app, not SMS, where offered. (True
**passwordless** sign-in via **passkeys** is separate — see below.)

**Password management — holistic; at least one tied to your mobile device:**

- **Mobile-tied (the one closest to the phone you carry):** **Apple Passwords /
  iCloud Keychain** on **iPhone / Mac**, or **Google Password Manager** (built
  into **Android**). Everyone should have the one for their device.
- **Browser-profile (on the computer):** **Chrome** signed into your **Google**
  account, or **Edge** signed into your **Microsoft** account — each saves
  passwords and backs up bookmarks. **Browsers: Chrome or Edge only.** (Guides:
  <https://ffcadmin.org/guides/chrome/>, <https://ffcadmin.org/guides/edge/>.)
- **LastPass (advanced / organizational phase):** a third-party, cross-platform
  manager. Being third-party it has some native-support limitations, but it
  works **universally** and supports **credential sharing** across a team — most
  applicants adopt it only once they reach the organizational phase.

**Baseline per person:** both authenticators **+** at least one password manager
(the one tied to their mobile device, plus the browser-profile manager on their
computer). **LastPass is added later** for cross-platform use and team credential
sharing.

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
- _Guide:_ <https://ffcadmin.org/guides/passkeys/>

### 2b. The flow — Phase 0, then the organizational pages

**Phase 0 — Baseline capabilities (mandatory; the floor under everything)**

Each item below is **mandatory** and defined by **what it is / why it benefits
you / why it benefits FFC** — a prerequisite belongs here only if it serves both
sides. If any item is missing, the applicant **cannot proceed** and should be
routed to **Contact us for help** (offered at every step). The items are grouped
into the categories below.

> **Mixed status:** Phase 0 combines **existing guidance** (e.g. the GitHub, MFA,
> LinkedIn, Facebook, password-manager, and Canva setup guides already in
> `src/data/setup-guides.ts`) with **new founder-directed policy** items that are
> **pending implementation** (the three-provider rule, Microsoft Teams as the
> first install, Chrome/Edge-only, passkeys, and the Idealist/Candid/Taproot and
> cloud-storage requirements). New-policy items are tagged inline; don't read the
> whole list as already-shipped guidance.

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

- **An approved web browser — Chrome or Edge only** _(new FFC support policy)_
  - _What:_ A current **Google Chrome or Microsoft Edge** on the computer,
    **signed into your Google (Chrome) or Microsoft (Edge) account**. **Firefox,
    Safari, and any other browser are not approved or supported.**
  - _You:_ Your browser profile becomes your **built-in password manager** and
    backs up your bookmarks; Chrome/Edge also run the web apps and AI-tool
    integrations the way the guides expect.
  - _FFC:_ A single supported browser pair means our guides and screenshots match
    your screen, with no time lost to browser-specific quirks.
  - _Guide:_ <https://ffcadmin.org/guides/chrome/> ·
    <https://ffcadmin.org/guides/edge/>
- **Google Authenticator (MFA app)** _(required — set up both authenticators; see
  Section 2a)_
  - _What:_ Install from the phone's app store. You scan QR codes into it to turn
    on app-based two-factor authentication.
  - _You:_ Secures your Google-ecosystem accounts (e.g. Google Analytics) with
    2FA so a stolen password alone can't get in.
  - _FFC:_ MFA on every account is how we keep the charity's accounts from being
    trivially compromised.
  - _Guide:_ <https://ffcadmin.org/guides/multi-factor-authentication/>
- **Microsoft Authenticator (MFA app)** _(required — set up both authenticators;
  see Section 2a)_
  - _What:_ Install from the phone's app store. Required for Microsoft 365
    two-factor authentication.
  - _You:_ Secures your Microsoft 365 sign-in.
  - _FFC:_ Extends MFA coverage across the Microsoft ecosystem the charity runs
    on.
  - _Guide:_ <https://ffcadmin.org/guides/multi-factor-authentication/>
- **A password manager (holistic — mobile + browser)** _(see Section 2a)_
  - _What:_ At least one manager **tied to your phone** — **Apple Passwords /
    iCloud Keychain** (iPhone/Mac) or **Google Password Manager** (Android) —
    plus your **browser-profile** manager (Chrome → Google, Edge → Microsoft).
    Store your **MFA recovery codes** here too.
  - _You:_ A unique strong password for every account and a safe home for
    recovery codes, so a new or lost phone never locks you out.
  - _FFC:_ Credential hygiene that keeps the charity's accounts secure and
    recoverable.
  - _Advanced:_ **LastPass** (third-party, cross-platform) at the organizational
    phase for **credential sharing** across the team.
  - _Guide:_ <https://ffcadmin.org/guides/password-manager/>
- **Microsoft Teams (desktop application + mobile app) — the first mandatory
  install** _(new FFC policy)_
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
  - _Guide:_ <https://ffcadmin.org/guides/microsoft-teams/>
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
  - _Guide:_ <https://ffcadmin.org/guides/cloud-storage-scanning/>

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
> created later (Section 2b). Turn on **MFA where the platform offers it**, using
> the Phase 0 authenticators.

- **A personal GitHub account**
  - _What:_ Your own GitHub account in your real name (e.g. `@FirstnameLastname`),
    MFA on. You add your charity email to it later — you do **not** create a
    separate "charity" login.
  - _You:_ It is **how you apply** (FFC's application flow is GitHub-only — see
    Section 3) and how you'll later review and approve changes to your website;
    one personal account works across every charity and role you hold.
  - _FFC:_ The application arrives through GitHub and we add your account to the
    charity's repository as a writer; a real, secured personal identity keeps the
    application and contribution history accountable.
  - _Guide:_ <https://ffcadmin.org/guides/github-account/>
- **A personal LinkedIn profile — applicant and every board / planned-board
  member**
  - _What:_ A personal LinkedIn profile (real name, photo, headline, current
    role), MFA on, for the applicant **and each legal or planned board member**.
    Detail level is up to the individual; the account itself is the requirement.
  - _You:_ Your professional identity, and the only way to create the
    organization's LinkedIn Page later.
  - _FFC:_ Confirms real, accountable people behind the charity, and supports the
    board volunteering-linkage governance signal (Section 2b).
  - _Guide:_ <https://ffcadmin.org/guides/linkedin/>
- **A personal Facebook account**
  - _What:_ Your own Facebook account in your real name, MFA on. (Never create a
    fake "charity person" account — Facebook removes those.)
  - _You:_ Required to create and administer the organization's Facebook Page.
  - _FFC:_ Keeps the eventual Page behind a real, secured human admin.
  - _Guide:_ <https://ffcadmin.org/guides/facebook/>
- **A personal Canva account**
  - _What:_ Your own Canva account, MFA on; you later join the charity's Canva
    team.
  - _You:_ Access the charity's brand kit and templates to make on-brand graphics.
  - _FFC:_ Brand-consistent materials without FFC doing the design.
  - _Guide:_ <https://ffcadmin.org/guides/canva/>
- **A personal Idealist account** (idealist.org)
  - _What:_ Your own account on **Idealist**, the nonprofit volunteer/jobs
    platform. You'll create the organization's listing later.
  - _You:_ Learn how volunteers find and connect with charities by experiencing
    the platform from the volunteer side first.
  - _FFC:_ You already know the tool when it's time to post the charity's
    opportunities — one fewer account to teach during delivery.
  - _Guide:_ <https://ffcadmin.org/guides/idealist/>
- **A personal Candid account** (candid.org)
  - _What:_ Your own **Candid** (formerly GuideStar) account. The organization's
    Candid profile and transparency seal come later (Section 6).
  - _You:_ See how donors and funders research charities on the canonical
    nonprofit registry before you build your own profile — and use it to **find
    other charities in your area of the same type and mission** (feeds the
    comparable-charities prerequisite in Group F).
  - _FFC:_ Familiarity with Candid before the org-profile/seal work speeds that
    step and reduces what we teach later.
  - _Guide:_ <https://ffcadmin.org/guides/candid/>
- **A personal Taproot account** (taprootfoundation.org / Taproot Plus)
  - _What:_ Your own **Taproot** account, the skills-based (pro-bono) volunteering
    marketplace. Organizational variations come later.
  - _You:_ Understand how pro-bono and skills-based volunteering is sourced and
    requested.
  - _FFC:_ Another standard nonprofit tool learned during prerequisites, not
    during delivery.
  - _Guide:_ <https://ffcadmin.org/guides/taproot/>

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
  - _You:_ Standardizing on the assistant that matches your everyday ecosystem
    keeps it close at hand and consistent with the accounts you already use, so
    it's the easiest to adopt and can guide you through nearly every step.
    _(This pairing is an FFC standardization choice, not a platform restriction —
    the assistants are separate apps/sites, not literally "built into" the email.)_
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
    before any work begins. _(Link **TBD** — there is no AUP page in this repo
    yet; publishing/linking it is tracked in Open Questions §B.)_
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

### 2c. Applicant self-check (everything you must complete to be accepted)

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

**Authenticators & password management (per person):**

- [ ] **Google Authenticator** installed.
- [ ] **Microsoft Authenticator** installed.
- [ ] A **password manager tied to my phone** — Apple Passwords/iCloud Keychain
      (iPhone) or Google Password Manager (Android) — storing my **MFA recovery
      codes**.
- [ ] My computer browser is **Chrome or Edge**, signed into my Google/Microsoft
      account (built-in password manager + bookmark backup).
- [ ] _(Advanced / org phase)_ **LastPass** for cross-platform use + credential
      sharing.

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
      (see the materials list in Section 3 and the track branches in Section 4).

## 3. Application intake steps (charity-driven)

These are the steps the applicant actively performs. They double as the first
technical-competence signals.

> **Application channel — moving to GitHub-only** _(new FFC policy)_. FFC is
> moving to a **GitHub-only application flow**: the applicant applies through
> **GitHub** using the **personal GitHub account** created in Phase 0 (Group D).
> The legacy **WHMCS portal product checkout** is **retired** as an application
> mechanism, and the freeforcharity.org web forms (<https://freeforcharity.org/submit-information/>,
> <https://freeforcharity.org/501c3/>, <https://freeforcharity.org/pre501c3/>) are informational landing pages that point into the
> GitHub flow. This is exactly why a personal GitHub account is a Phase 0
> requirement.

1. **Apply through GitHub** with your personal GitHub account (Phase 0, Group D).
2. **Acknowledge the FFC Acceptable Use Policy (AUP).**
3. _(501(c)(3) track)_ **Provide Candid/GuideStar profile links** (Public Profile
   and Full Profile).
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

**Both tracks:**

- EIN (Employer Identification Number)
- **Applicant's personal LinkedIn profile** (required for every applicant)
- Board member names, titles, contact info, **personal LinkedIn profiles**, and
  bios — for the **pre-501(c)(3) track**, supply these for the **planned board
  members**
- **Organization Facebook Page and LinkedIn Page** the applicant created
  themselves (see the social-page litmus test in Purpose)
- Mission statement
- Programs and services list
- Current operating budget
- Current website URL (if any)
- Social media links
- High-resolution logo files
- Brand guidelines (if any)

**501(c)(3) track only:**

- IRS 501(c)(3) determination letter
- Most recent Form 990
- Annual report (if available)
- Financial statements (past 2 years)
- Strategic plan (if available)

**Pre-501(c)(3) track instead:**

- Articles of incorporation / state nonprofit formation documents (if filed)
- IRS Form 1023 status (filed, in progress, or planned)
- Charitable-solicitation registration status (if applicable)
- Planned board roster (names + planned roles)

---

## 4. Where the tracks diverge (after the common flow)

Phase 0 and the organizational-page steps above are identical for both tracks.
Once the social Pages exist and the self-check is complete, the applicant submits
the application (the intake
steps in Section 3) — and **this is where the two tracks diverge**, on **legal
status and documentation**:

|                | **501(c)(3) track**                                                   | **pre-501(c)(3) track**                                                                                          |
| -------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Landing page   | <https://freeforcharity.org/501c3/>                                   | <https://freeforcharity.org/pre501c3/>                                                                           |
| How you apply  | **GitHub-only flow** (see Section 3)                                  | **GitHub-only flow** (see Section 3)                                                                             |
| Legal status   | Already IRS-recognized; has EIN + **IRS determination letter**        | Not yet recognized; working **IRS Form 1023** + state nonprofit formation + charitable-solicitation registration |
| Board          | **Seated** legal board (officers)                                     | **Planned** board members                                                                                        |
| Transparency   | **Candid/GuideStar to Gold** (Form 990, financials); see Sections 5–6 | No 990 yet; GuideStar deferred until recognized                                                                  |
| Extra accounts | TechSoup, VolunteerMatch, PayPal emphasized                           | Deferred / as-available                                                                                          |

After acceptance, FFC then provides the **services** (not prerequisites):
organizational email on Microsoft 365 by default, domain + `info@` routing, and
the website/template, plus — on the 501(c)(3) track — the validation work in
Sections 5–6.

---

## 5. Validation checks (FFC-run, after submission)

All checks must resolve to a **documented pass or documented exception** before
an offer is made. These run **after the applicant submits** (Section 3), and
several simply **confirm that Phase 0 prerequisites were completed** — e.g.
check 4 (verified Facebook page) and check 1 (Candid) verify work the applicant
already did in the Phase 0 ladder. **On the pre-501(c)(3) track**, the checks
that depend on 501(c)(3) status — GuideStar **Gold**, Form 990, and TechSoup —
are **deferred or recorded as documented exceptions** rather than applied
uniformly (see Section 4).

> **Note on stage numbering:** the source pages disagree on the exact number.
> `wordpress-service-delivery-stages` calls validation **Stage 2** of the
> eight-stage lifecycle, while `wordpress-charity-validation` says validation
> runs during **"Stage 1 — Intake."** They describe the same phase; the
> discrepancy is in the source material and is flagged for the founder to
> reconcile.

### 5a. External validation checks (six third-party signals)

| #   | Check                                                                                                                        | Demonstrates                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | **501(c)(3) status via Candid / GuideStar** (record NTEE code)                                                               | Legitimacy; mission-alignment scoring                            |
| 2   | **TechSoup legal-entity confirmation** ("Validated", not "Pending")                                                          | Independent vetting; unlocks discounted-software pipeline        |
| 3   | **VolunteerMatch engagement check**                                                                                          | Charity can receive and act on volunteer work                    |
| 4   | **Verified Facebook page** (cross-checked vs. intake form)                                                                   | Identity/branding consistency                                    |
| 5   | **Email on a reputable provider** (Microsoft 365 preferred; not Gmail/Yahoo)                                                 | Technical readiness; enables SPF/DKIM/DMARC under charity domain |
| 6   | **WHMCS account + PayPal donor flow** _(WHMCS is **legacy** — retired with the GitHub-only intake; PayPal donor flow stays)_ | KYC step; donor funding path                                     |

### 5b. Internal validation checks (three FFC reviews)

| #   | Check                                                                    | Purpose                                                  |
| --- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | **Cost-and-funding analysis** (size via Form 990: micro/small/mid/large) | Scopes engagement; drives template selection             |
| 2   | **Existing website + intake-form content review**                        | Mission/leadership consistency across all public sources |
| 3   | **Target-demographic assessment**                                        | Foundation for copy, imagery, accessibility              |

> The site refers to "**all nine validation checks**" (six external + three
> internal) resolving before exit.

---

## 6. Candid / GuideStar seal progression

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

## 7. External accounts the charity establishes

This separates **applicant-created** accounts from **FFC-supported** org accounts
and de-duplicates with Phase 0.

**Applicant-created (in Phase 0 / Section 2b — the litmus test):** the
organization **Facebook Page** and **LinkedIn Page** are created by the applicant
themselves from their personal accounts (see Phase 0 Group D and the Section 2b
flow), on both tracks. They are not repeated here.

**FFC-supported org accounts** — FFC provides guidance/admin support; several are
501(c)(3)-emphasized and happen during/after validation, not in Phase 0:

- Charity-named **Outlook mailbox** (Microsoft 365 tenant) — _validation check 5_
  (first-sign-in guide: <https://ffcadmin.org/guides/microsoft-365-email/>)
- **Candid (GuideStar) profile at Gold or higher** — _validation check 1_ (the
  applicant already holds a **personal** Candid account from Phase 0; this is the
  **organization** profile and seal)
- **TechSoup** validated account — _validation check 2_ (501(c)(3)-emphasized)
- **VolunteerMatch** profile, even if dormant — _validation check 3_
  (501(c)(3)-emphasized)
- **PayPal Nonprofits** account — _validation check 6_ (501(c)(3)-emphasized; the
  legacy WHMCS KYC step is retired)

---

## 8. Service-delivery lifecycle (legacy — for reference)

Once validation passes and the charity accepts the written offer (historically a
signed WHMCS quote — **legacy/pending replacement** under the GitHub-only intake),
the prerequisite/application phase is complete and the engagement moves into
provisioning. The full lifecycle below is the **legacy WordPress/Divi-era**
eight-stage flow (stages 6–8 in particular reflect the old stack); it is retained
**for reference** and is being superseded by the current FFC template direction:

1. Initial Contact & Onboarding
2. **FFC Validation Checks** ← prerequisite gate (Sections 5–6)
3. FFC Offers Services
4. Basic Services Package (domain + Microsoft 365)
5. Charity System & Website Setup (branches by 501(c)(3) status)
6. Technical Stack Assignment
7. Plugin & Theme Deployment
8. Initial Site Launch & Configuration

---

## Glossary

Plain-language definitions for the terms used above (charity applicants are often
non-technical).

- **501(c)(3)** — a US nonprofit the IRS has recognized as tax-exempt and
  charitable; donations to it are tax-deductible.
- **pre-501(c)(3)** — an organization not yet IRS-recognized (forming, or with a
  Form 1023 in progress). FFC supports these on a separate track.
- **EIN** — Employer Identification Number, the organization's federal tax ID.
- **IRS Form 1023** — the application a nonprofit files to be recognized as a
  501(c)(3).
- **IRS Form 990** — the annual information return most 501(c)(3)s file; a key
  transparency document.
- **IRS determination letter** — the IRS letter confirming 501(c)(3) status.
- **Candid (formerly GuideStar)** — the canonical public registry of US
  nonprofits; its **transparency seals** run Bronze → Silver → Gold → Platinum.
- **NTEE code** — National Taxonomy of Exempt Entities code; classifies a
  charity's mission/sector.
- **MFA / 2FA** — multi-factor / two-factor authentication: a second proof of
  identity (beyond a password) at sign-in.
- **TOTP** — time-based one-time password; the rotating 6-digit codes an
  authenticator app produces.
- **Authenticator app** — a phone app that generates TOTP codes (here: Google
  Authenticator, Microsoft Authenticator).
- **Passkey** — a newer, phishing-resistant sign-in that uses your device's
  biometric or PIN instead of a password (the **FIDO2 / WebAuthn** standard);
  e.g. **Windows Hello**.
- **Password manager** — a secure vault for unique passwords and MFA recovery
  codes (here: LastPass).
- **Organization Page** — a charity's LinkedIn or Facebook Page, created and
  administered from a real person's **personal** account.
- **AUP** — Acceptable Use Policy.
- **Cloudflare** — the service FFC uses to register/secure charity domains; also
  offers the domain name-availability check used in Phase 0.
- **WHMCS** — the legacy client/billing portal once used for intake; **retired**
  as the application mechanism under the GitHub-only flow.
- **TechSoup** — nonprofit tech-discount and validation service.
- **VolunteerMatch / Idealist / Taproot** — platforms for finding volunteers and
  (Taproot) skills-based/pro-bono help.

---

## Open questions for verification

### A. Decided — pending site implementation

These are founder-directed decisions captured in this document; the work is to
implement them in the rendered site/code (the site update referenced in the
top-of-document disclaimer).

- **Done — new setup guides added** to `src/data/setup-guides.ts`: **Microsoft
  Teams**, **cloud storage + document scanning**, **passkeys**, **Candid**,
  **Idealist**, and **Taproot** (live at `https://ffcadmin.org/guides/<slug>/`).
  Every Phase 0 account/tool type now has a guide.
- **Still pending — GitHub-only application channel:** build/define the actual
  GitHub entry point (repo + issue template or form); the freeforcharity.org
  pages (<https://freeforcharity.org/submit-information/>,
  <https://freeforcharity.org/501c3/>, <https://freeforcharity.org/pre501c3/>)
  become landing pages that point into it, and the legacy WHMCS checkout is
  retired.
- **Still pending — three-provider policy in the existing guides:** the live
  `multi-factor-authentication` and `password-manager` guides still recommend
  **one** authenticator app (Google _or_ Microsoft) and allow **LastPass _or_
  Bitwarden**; the Section 2a policy is stricter (**all three** — Google
  Authenticator, Microsoft Authenticator, LastPass — per person, no other tools).
  Updating these existing guides reverses currently-published guidance, so it
  awaits explicit founder confirmation before the edit.
- **Still pending — Chrome/Edge-only browser policy** is not yet stated in any
  rendered guide.

### B. Genuinely open — need a founder decision

- Are the **six external / three internal** validation checks still the current
  set, or have any been added/retired (e.g., Instagram, Google for Nonprofits)?
- Should the **organization Facebook Page and LinkedIn Page** (and the personal
  LinkedIn profiles) be promoted into the formal Section 5a validation checks,
  given they are now hard requirements on both tracks?
- Should **AUP acknowledgment** and a **conflict-of-interest / data-handling**
  agreement be explicit prerequisite line items? **There is no AUP page in this
  repo yet** — it needs to be written/published and linked from the prerequisite.
