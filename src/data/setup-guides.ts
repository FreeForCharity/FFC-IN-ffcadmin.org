/**
 * Account & tool setup guides (#187 / onboarding).
 *
 * Beginner-friendly, "every step made overly clear" walkthroughs for the
 * accounts a volunteer or charity owner needs as part of the FFC application /
 * onboarding process (GitHub, the authenticator, social pages, charity email,
 * password manager, design tools).
 *
 * Single source of truth: rendered by src/components/SetupGuide.tsx via the
 * /guides/[guide] dynamic route, listed on the /guides hub, and added to the
 * sitemap. Add a new account guide by appending an entry here.
 *
 * Guiding principle, repeated throughout: an account is a **person, not an
 * entity**. You sign up as yourself with the identity on your phone, turn on
 * multi-factor authentication, then add your work persona (e.g. an
 * @freeforcharity.org email) to that one personal account. The login stays the
 * person — @ClarkeMoyer, not @FreeForCharity.
 */

export interface SetupStep {
  title: string
  /** Each string is its own paragraph or bullet line. */
  body: string[]
  /** Optional highlighted tip/callout under the step. */
  tip?: string
}

export interface SetupFaq {
  q: string
  a: string
}

export interface SetupGuide {
  slug: string
  title: string
  shortTitle: string
  /** Grouping label on the hub. */
  category: 'Identity & Code' | 'Security' | 'Social Presence' | 'Email & Workspace' | 'Tools'
  icon: string
  gradient: string
  description: string
  keywords: string
  audience: string
  estMinutes: number
  /**
   * Which track this guide belongs to. 'personal' (default) is the individual
   * setup; 'organizational' is the charity/501(c)(3)-level setup of the same tool.
   */
  track?: 'personal' | 'organizational'
  /**
   * Slug of the counterpart guide on the other track (personal ⇆ organizational),
   * surfaced as a prominent banner so readers can switch.
   */
  counterpart?: string
  /**
   * Optional phase note shown on organizational guides, e.g. when a step depends
   * on IRS 501(c)(3) recognition.
   */
  phaseNote?: string
  intro: string[]
  /** The person-vs-entity (or other key) principle callout. Required on every guide. */
  principle: { title: string; body: string }
  steps: SetupStep[]
  /** Optional "what to do when you get a new phone" block. */
  newPhone?: string[]
  /** Common questions. Required on every guide (at least one). */
  faqs: SetupFaq[]
  /** Slugs of related setup guides. */
  related: string[]
}

const MFA_STEP_SHARED: SetupStep = {
  title: 'Turn on multi-factor authentication (MFA)',
  body: [
    'MFA means that after your password, you also approve a second step from your phone — so a stolen password alone can’t get in. See the full walkthrough in the Multi-Factor Authentication guide.',
    'Open one of your **authenticator apps** — FFC has you install **both Google Authenticator and Microsoft Authenticator** (see the Multi-Factor Authentication guide). Use the one that matches the account where you can; for sites that aren’t Google or Microsoft, either app works.',
    'When the site shows a **QR code**, open your authenticator app, tap **+ / Add**, and **scan the QR code**. The app starts showing a 6-digit code that changes every 30 seconds. Type the current code back into the website to confirm.',
  ],
  tip: 'Always save the backup / recovery codes the site gives you right after setup — store them in your password manager. They are how you get back in if you lose your phone.',
}

export const SETUP_GUIDES: SetupGuide[] = [
  {
    slug: 'github-account',
    title: 'Create your GitHub account',
    shortTitle: 'GitHub account',
    category: 'Identity & Code',
    icon: '🐙',
    gradient: 'from-gray-700 to-gray-900',
    description:
      'Step-by-step: create a personal GitHub account with the email on your phone, turn on multi-factor authentication, and add your work email — the account is you, the person, not the charity.',
    keywords:
      'create GitHub account, GitHub signup, GitHub 2FA, GitHub add email, personal GitHub account nonprofit, Free For Charity GitHub',
    audience: 'New volunteers and charity site owners',
    estMinutes: 15,
    intro: [
      'GitHub is where your charity’s website files live, and where you’ll approve changes. You need your own free GitHub account before you can be added to a repository.',
      'We’ll use a real example: the FFC founder’s account, **@ClarkeMoyer**. Notice it’s his name — not “FreeForCharity.” That’s the most important idea on this page.',
    ],
    principle: {
      title: 'Your account is a person, not an organization',
      body: 'You create ONE GitHub account for yourself as a human being — tied to your own identity, secured with your own phone. You then add extra email addresses (like clarkemoyer@freeforcharity.org) to that single personal account so it works across your roles. The login is always the person (@ClarkeMoyer), never the entity (@FreeForCharity). Organizations and charity repos are things your personal account is later given access to — they are not separate logins you create here.',
    },
    steps: [
      {
        title: 'Go to the signup page',
        body: ['On your computer or phone, open **github.com/signup**.'],
      },
      {
        title: 'Sign up with the email tied to your phone',
        body: [
          'Use the email address that is the **primary account on your cell phone** — the one already on your device.',
          'If you have an **Android** phone, that’s your Google/Gmail address, so choose **“Continue with Google”** and pick that account. If you have an **iPhone**, use your iCloud/Apple email (or “Continue with Google” if Gmail is your main email).',
          'Using your phone’s primary email means password resets and security prompts land somewhere you always have with you.',
        ],
        tip: 'This first email is just how you log in. You are NOT making a “work” account — you’re making your personal account. Work emails get added later in Step 5.',
      },
      {
        title: 'Choose your username',
        body: [
          'Pick a username that is **your name**, like Clarke did with **ClarkeMoyer** — e.g. firstnamelastname or a close variation if it’s taken.',
          'It is public and shown on everything you do, and it’s painful to change later, so choose a clean, professional version of your name.',
          'Do **not** use the charity’s name as your username. The charity gets its own organization later; this account is you.',
        ],
      },
      {
        title: 'Verify your email and finish',
        body: [
          'GitHub emails you a code (or, with “Continue with Google,” verifies automatically). Enter the code if asked, answer the couple of setup questions, and choose the **Free** plan.',
        ],
      },
      MFA_STEP_SHARED,
      {
        title: 'Add your other email addresses',
        body: [
          'Now make the one account work for all your roles. Go to **GitHub → top-right profile photo → Settings → Emails**.',
          'Under **Add email address**, add your work/persona email — for the FFC example, **clarkemoyer@freeforcharity.org** — and verify it from the confirmation email GitHub sends there.',
          'You can keep several emails on the account (personal + charity). Keep your reliable phone email as the primary so account-recovery messages always reach you.',
        ],
        tip: 'This is the key move: one personal login, multiple emails — not multiple accounts. It keeps your contribution history and identity in one place.',
      },
      {
        title: 'Tell FFC your username',
        body: [
          'Send your **GitHub username** to FFC (text Clarke Moyer at (520) 222-8104) so you can be added to your charity’s repository as a writer. You’ll then get an invitation to accept.',
          'Accepting that invitation is the step most people get stuck on, so we wrote an every-click walkthrough: **https://ffcadmin.org/site-owner/accept-invitation** — what the email looks like, who it’s from, and three ways to accept it.',
        ],
        tip: 'You can accept from the email, from your GitHub notifications (https://github.com/notifications), or from the direct repository invitations link — whichever you find first. The walkthrough shows all three.',
      },
    ],
    faqs: [
      {
        q: 'Should I make a separate GitHub account for the charity?',
        a: 'No. You make one personal account (you, the person) and add your charity email to it. The charity itself is represented by a GitHub Organization that your personal account is given access to — not a second login you create.',
      },
      {
        q: 'I already have a GitHub account — do I need a new one?',
        a: 'No. Use your existing personal account. Just make sure MFA is on (see the MFA guide) and add your charity email under Settings → Emails.',
      },
      {
        q: 'What if my preferred username is taken?',
        a: 'Add a middle initial or a small variation that is still clearly your name. Avoid random numbers or the charity name.',
      },
    ],
    related: ['multi-factor-authentication', 'microsoft-365-email', 'password-manager'],
  },
  {
    slug: 'multi-factor-authentication',
    title: 'Set up multi-factor authentication (MFA)',
    shortTitle: 'Multi-factor authentication',
    category: 'Security',
    icon: '🔐',
    gradient: 'from-emerald-600 to-teal-700',
    description:
      'What multi-factor authentication is, how the scan-a-QR-code flow works, which authenticator app to use, saving recovery codes, and the precautions to take before you get a new phone.',
    keywords:
      'multi-factor authentication, MFA, two-factor authentication, 2FA, authenticator app, Google Authenticator, Microsoft Authenticator, QR code login, new phone authenticator',
    audience: 'Everyone — required on every FFC-related account',
    estMinutes: 10,
    intro: [
      'Multi-factor authentication (MFA, also called 2FA) is required on every account you use for FFC — GitHub, your charity email, LinkedIn, Facebook, your bank, everything.',
      'It’s simple: after you type your password, the site asks for a second proof that it’s really you — a 6-digit code from an app on your phone. Even if someone steals your password, they can’t get in without your phone.',
    ],
    principle: {
      title: 'Set up both Google and Microsoft Authenticator',
      body: 'FFC standardizes on the two native authenticators and you set up both: Google Authenticator for your Google sign-ins, and Microsoft Authenticator for Microsoft 365. Each is the native app for its ecosystem (with its own cloud backup), so the right one is always already on your phone. Use the matching app for each account.',
    },
    steps: [
      {
        title: 'Install both authenticator apps',
        body: [
          'On your phone’s app store, install **both Google Authenticator and Microsoft Authenticator**. Use Google’s app for your Google accounts and Microsoft’s for Microsoft 365.',
          'An authenticator app simply shows 6-digit codes that change every 30 seconds. It works offline and is far safer than text-message codes.',
          'Turn on each app’s built-in **cloud backup** (in its settings) so a new phone restores your codes.',
        ],
      },
      {
        title: 'Find the security settings on the website',
        body: [
          'On the site you’re securing (e.g. GitHub → Settings → Password and authentication), look for **Two-factor authentication** or **Multi-factor authentication** and choose to set it up with an **authenticator app** (not SMS, if you’re given the choice).',
        ],
      },
      {
        title: 'Scan the QR code',
        body: [
          'The website shows a square **QR code**. Open your authenticator app, tap **+** (Add / Scan a QR code), and point your phone’s camera at the code on the screen.',
          'This is the same action you’ve done for your bank or LinkedIn — the QR code privately hands the app a secret so it can generate your codes.',
          'The app immediately starts showing a 6-digit code for that site. Type the current code back into the website to prove it worked.',
        ],
      },
      {
        title: 'Save your recovery codes',
        body: [
          'The site gives you a list of one-time **recovery codes**. These are your lifeline if you ever lose your phone.',
          'Copy them into your **password manager** (see the Password Manager guide), or print them and keep them somewhere safe. Do not store them only on the same phone that has the authenticator.',
        ],
        tip: 'No recovery codes + lost phone = locked out, sometimes permanently. Save them now, every time.',
      },
    ],
    newPhone: [
      'Getting a new phone is the #1 way people get locked out — plan for it BEFORE you switch.',
      'If you use **Microsoft Authenticator** or **Google Authenticator**, turn on the app’s built-in **cloud backup** first (in the app’s settings), then restore it on the new phone and your codes come with you.',
      'If there’s no backup, you must re-add each account on the new phone: sign in to each site (using a recovery code if needed), turn MFA off and back on, and scan a fresh QR code.',
      'Keep your **recovery codes** in your password manager so a new phone — or a lost one — is never a lockout.',
      'Do this for every account: GitHub, charity email, LinkedIn, Facebook, your bank.',
    ],
    faqs: [
      {
        q: 'Why both Google and Microsoft Authenticator?',
        a: 'Each is the native app for its ecosystem — Google Authenticator for Google services, Microsoft Authenticator for Microsoft 365 — and the native app unlocks features (cloud backup, the provider’s own approval prompts) a generic app can’t. FFC standardizes on having both so the matching one is always ready.',
      },
      {
        q: 'Is a text-message (SMS) code good enough?',
        a: 'An authenticator app is stronger and works without signal. Use the app whenever the site offers it; SMS is a last resort.',
      },
      {
        q: 'What happens if I lose my phone and have no recovery codes?',
        a: 'You’ll have to go through each site’s account-recovery process, which can be slow or, in some cases, impossible. That’s why saving recovery codes is mandatory.',
      },
    ],
    related: ['github-account', 'password-manager', 'passkeys', 'microsoft-365-email'],
  },
  {
    slug: 'linkedin',
    counterpart: 'linkedin-organization',
    title: 'Set up LinkedIn (you + your charity Page)',
    shortTitle: 'LinkedIn',
    category: 'Social Presence',
    icon: '💼',
    gradient: 'from-sky-600 to-blue-700',
    description:
      'Create your personal LinkedIn profile, turn on multi-factor authentication, then create your charity’s LinkedIn Page from that personal profile — the same person-owns-the-page pattern as GitHub.',
    keywords:
      'create LinkedIn account, LinkedIn company page nonprofit, LinkedIn 2FA, LinkedIn charity page, Free For Charity LinkedIn',
    audience: 'Volunteers and charity owners building the charity’s presence',
    estMinutes: 20,
    intro: [
      'LinkedIn works just like GitHub: there is **you, the person**, and there is the **charity’s Page**. You first create your own profile, then you create the charity Page from it.',
      'A LinkedIn Company/Organization Page can only be created by a personal profile — so the person comes first, always.',
    ],
    principle: {
      title: 'Person first, then the Page',
      body: 'Your personal LinkedIn profile is you. The charity’s Page is a separate thing your profile administers. You can add other admins later, but the Page always sits behind real people’s accounts — never a shared anonymous login.',
    },
    steps: [
      {
        title: 'Create your personal profile',
        body: [
          'Go to **linkedin.com** and sign up with the email on your phone (the same identity approach as GitHub). Use your real name.',
          'Fill in a basic profile — photo, headline, current role. This is your professional identity.',
        ],
      },
      {
        ...MFA_STEP_SHARED,
        body: [
          'Go to **Me → Settings & Privacy → Sign in & security → Two-step verification** and turn it on with an **authenticator app**.',
          ...MFA_STEP_SHARED.body.slice(1),
        ],
      },
      {
        title: 'Create the charity’s Page',
        body: [
          'From the LinkedIn home page, click **For Business** (top-right grid icon) → **Create a Company Page**.',
          'Choose **Company** (or **Nonprofit**), enter the charity’s name, website, and logo, and confirm you’re authorized to act on its behalf.',
        ],
      },
      {
        title: 'Add other admins and finish the Page',
        body: [
          'Open the Page → **Admin tools → Manage admins** and add at least one other person so the Page is never controlled by a single account.',
          'Complete the About section, add the logo and a banner, and publish your first post so the Page looks active.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I create a charity Page without a personal LinkedIn profile?',
        a: 'No. LinkedIn only lets a personal profile create and administer an organization Page. The person always comes first — make your profile, secure it with MFA, then create the Page from it.',
      },
      {
        q: 'Should my board members have LinkedIn accounts too?',
        a: 'Yes. Every legal or planned board member should have a personal LinkedIn profile and list the charity under their profile’s Volunteering section — it publicly signals they’ve accepted the role. Each person makes their own account, just like you did.',
      },
    ],
    related: ['facebook', 'multi-factor-authentication', 'canva'],
  },
  {
    slug: 'facebook',
    counterpart: 'facebook-organization',
    title: 'Set up Facebook (you + your charity Page)',
    shortTitle: 'Facebook',
    category: 'Social Presence',
    icon: '📘',
    gradient: 'from-blue-600 to-indigo-700',
    description:
      'Create your personal Facebook account, turn on multi-factor authentication, then create your charity’s Facebook Page from it — the person owns the Page, just like GitHub and LinkedIn.',
    keywords:
      'create Facebook account, Facebook page nonprofit, Facebook 2FA, charity Facebook page, Free For Charity Facebook',
    audience: 'Volunteers and charity owners building the charity’s presence',
    estMinutes: 20,
    intro: [
      'Facebook follows the same rule as GitHub and LinkedIn: **you** have a personal account, and the **charity** has a Page that your account manages. Facebook requires a personal account to create and run a Page.',
    ],
    principle: {
      title: 'A Page is run by people, not a shared login',
      body: 'Never create a “fake person” account for the charity — Facebook removes those, which can take the Page down with them. Create your real personal account, then create the charity Page from it and add other real admins.',
    },
    steps: [
      {
        title: 'Create your personal account',
        body: [
          'Go to **facebook.com** and sign up with the email or phone number tied to your device, using your real name.',
        ],
      },
      {
        ...MFA_STEP_SHARED,
        body: [
          'Go to **Settings & privacy → Settings → Accounts Center → Password and security → Two-factor authentication**, pick your account, and choose **Authentication app**.',
          ...MFA_STEP_SHARED.body.slice(1),
        ],
      },
      {
        title: 'Create the charity’s Page',
        body: [
          'Click your profile menu → **See all profiles / Create → Page** (or go to **facebook.com/pages/create**).',
          'Enter the charity’s name, choose a **category** (e.g. Nonprofit Organization), add a short description, then add the logo as the profile picture and a banner as the cover.',
        ],
      },
      {
        title: 'Add admins and publish',
        body: [
          'In the Page’s **Settings → Page access**, add at least one more person with admin/full control so the Page survives any one account being lost.',
          'Post a welcome update with the logo so the Page isn’t empty.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can’t I just make one Facebook account for the charity?',
        a: 'No — a “charity” account pretending to be a person violates Facebook’s rules and gets removed, which can take the Page down with it. Create your real personal account, then build the charity Page from it and add other real people as admins.',
      },
      {
        q: 'What if I don’t want to manage the Page from my personal account?',
        a: 'The Page is a separate space your account administers; your personal posts stay private and separate. You can also add co-admins so you’re not the only person who can manage it.',
      },
    ],
    related: ['instagram', 'linkedin', 'multi-factor-authentication', 'canva'],
  },
  {
    slug: 'microsoft-365-email',
    counterpart: 'microsoft-365-organization',
    title: 'Set up your charity email (Microsoft 365)',
    shortTitle: 'Microsoft 365 email',
    category: 'Email & Workspace',
    icon: '✉️',
    gradient: 'from-cyan-600 to-sky-700',
    description:
      'First sign-in to your FFC-provided Microsoft 365 charity mailbox, turning on multi-factor authentication, and getting Outlook on your computer and phone.',
    keywords:
      'Microsoft 365 nonprofit email, first sign in Office 365, M365 MFA setup, charity email setup, Outlook setup, Free For Charity email',
    audience: 'Charity owners and admins issued an @yourcharity Microsoft 365 mailbox',
    estMinutes: 15,
    intro: [
      'FFC runs charity email on **Microsoft 365**. Once FFC creates your mailbox (e.g. you@yourcharity.org), you’ll get a temporary password to set up — usually from your FFC contact.',
      'This email becomes one of your **personas**. Remember the principle from the GitHub guide: it’s an address you *add to your identity*, not a whole separate online life.',
    ],
    principle: {
      title: 'Your charity email is a persona, not a new identity',
      body: 'The mailbox FFC provisions (you@yourcharity.org) is a hat you wear, not a second person. You add it to the accounts where it belongs — like an extra email on your one personal GitHub account — rather than building a parallel online life around it. The human behind it is still you.',
    },
    steps: [
      {
        title: 'Sign in for the first time',
        body: [
          'Go to **office.com** (or **outlook.com/yourcharity.org**) and sign in with your new address and the temporary password FFC gave you.',
          'You’ll be asked to set a new, strong password. Save it in your password manager.',
        ],
      },
      {
        title: 'Turn on multi-factor authentication',
        body: [
          'Microsoft will prompt you to set up “more information” for security — choose **authenticator app** and scan the QR code with **Microsoft Authenticator** (the matching app for the Microsoft ecosystem — you’ll already have it installed, since FFC has you set up both authenticators).',
          'From then on, sign-ins will send an approval to your authenticator. Save any recovery info offered.',
        ],
        tip: 'See the Multi-Factor Authentication guide for the full QR-scan walkthrough and new-phone precautions.',
      },
      {
        title: 'Get Outlook on your devices',
        body: [
          'On your phone, install the **Outlook** app and sign in with your charity address. On your computer you can use **outlook.com** in a browser or the desktop Outlook app.',
          'Send yourself a test email to confirm it’s working.',
        ],
      },
      {
        title: 'Use it as your charity identity',
        body: [
          'Add this address to your other accounts where it belongs — for example, add it as an additional email on your **GitHub** account (see the GitHub guide).',
          'Ask your FFC contact before changing any mailbox, alias, or license settings in the admin center.',
        ],
      },
    ],
    faqs: [
      {
        q: 'I never got a temporary password — what do I do?',
        a: 'Reach out to your FFC contact using the Support details at the bottom of this guide. FFC creates the mailbox and issues the first password; you can’t sign in until that’s provisioned.',
      },
      {
        q: 'Can I just forward charity email to my personal inbox?',
        a: 'Use Outlook with the charity address directly so your replies come from the charity, not your personal email — and so MFA and records stay on the charity account. Ask FFC before setting up any forwarding or auto-reply rules.',
      },
    ],
    related: [
      'multi-factor-authentication',
      'microsoft-teams',
      'cloud-storage-scanning',
      'google-workspace',
    ],
  },
  {
    slug: 'google-workspace',
    counterpart: 'google-workspace-organization',
    title: 'Set up your charity email (Google Workspace)',
    shortTitle: 'Google Workspace',
    category: 'Email & Workspace',
    icon: '🗂️',
    gradient: 'from-amber-500 to-orange-600',
    description:
      'First sign-in to a Google Workspace charity account, turning on 2-Step Verification, and getting Gmail on your devices. For charities already standardized on Google.',
    keywords:
      'Google Workspace nonprofit, first sign in Google Workspace, Google 2-step verification, charity Gmail setup, Free For Charity Google Workspace',
    audience: 'Charity owners/admins on a Google-based charity (FFC default is Microsoft 365)',
    estMinutes: 15,
    intro: [
      'FFC’s default is Microsoft 365, but charities already deeply embedded in Google can stay on **Google Workspace**. If that’s you, your admin issues you a you@yourcharity.org Google account.',
    ],
    principle: {
      title: 'Your charity email is a persona, not a new identity',
      body: 'The Workspace account (you@yourcharity.org) is a role you wear, not a second person. You add it to the accounts where it belongs rather than building a parallel online life around it — the same person-not-entity rule as everywhere else at FFC.',
    },
    steps: [
      {
        title: 'Sign in and set your password',
        body: [
          'Go to **mail.google.com** (or **accounts.google.com**) and sign in with your new Workspace address and the temporary password you were given. Set a strong password and save it in your password manager.',
        ],
      },
      {
        title: 'Turn on 2-Step Verification',
        body: [
          'Go to **Google Account → Security → 2-Step Verification** and turn it on. Choose an **authenticator app** and scan the QR code with **Google Authenticator** (the matching app for the Google ecosystem — you’ll already have it installed, since FFC has you set up both authenticators).',
          'Save the backup codes Google offers into your password manager.',
        ],
        tip: 'See the Multi-Factor Authentication guide for the full walkthrough and new-phone precautions.',
      },
      {
        title: 'Get Gmail on your devices',
        body: [
          'Install the **Gmail** app on your phone and sign in; use **mail.google.com** on your computer. Send a test email to confirm.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Should my charity use Google Workspace or Microsoft 365?',
        a: 'FFC’s default is Microsoft 365. Stay on Google Workspace only if your charity is already deeply embedded in Google (Gmail, Drive, shared docs) and switching would be disruptive. If you’re starting fresh, go with Microsoft 365.',
      },
      {
        q: 'Is Google Workspace free for nonprofits?',
        a: 'Google offers Workspace for Nonprofits at no cost once your organization is verified through Google for Nonprofits. Your FFC contact can help you confirm eligibility.',
      },
    ],
    related: ['multi-factor-authentication', 'microsoft-365-email', 'cloud-storage-scanning'],
  },
  {
    slug: 'password-manager',
    counterpart: 'lastpass-organization',
    title: 'Set up a password manager',
    shortTitle: 'Password manager',
    category: 'Tools',
    icon: '🔑',
    gradient: 'from-indigo-600 to-purple-700',
    description:
      'Why you need a password manager, the built-in option in your Chrome or Edge browser profile, when to add LastPass, and how to store your MFA recovery codes so a lost or new phone never locks you out.',
    keywords:
      'password manager setup, Apple Passwords iCloud Keychain, Google Password Manager Android, Chrome password manager, Edge password manager, LastPass, store recovery codes, Free For Charity',
    audience: 'Everyone — the safety net behind every other account',
    estMinutes: 15,
    intro: [
      'A password manager remembers a unique strong password for every account so you don’t have to — and it’s the safest place to store your **MFA recovery codes**. Take a **holistic** approach: have one **tied to the mobile device you carry**, plus the one in your computer’s browser.',
      'Tied to your phone: **Apple Passwords / iCloud Keychain** on **iPhone & Mac**, or **Google Password Manager**, which is **built into Android**. On your computer, the **browser-profile** manager — **Chrome** signed into Google, or **Edge** signed into Microsoft — saves passwords and backs up bookmarks (see the Chrome and Edge guides).',
      '**LastPass** is a third-party manager that works **universally across every browser and device**. Being third-party, it has some native-support limitations, and most people won’t need it at first — but it becomes valuable at the **organizational phase** because it supports **credential sharing** across a team. Advanced users adopt it then.',
    ],
    principle: {
      title: 'One secured vault, a unique password everywhere',
      body: 'Whether it’s your browser’s built-in manager (unlocked by your Google or Microsoft account) or LastPass (unlocked by one master password), the rules are the same: a different strong password for every site, MFA turned on for the account behind the manager, and your MFA recovery codes stored inside it.',
    },
    steps: [
      {
        title: 'Pick your managers (mobile + computer)',
        body: [
          'On your **phone**, use the one tied to your device: **Apple Passwords / iCloud Keychain** on iPhone, or **Google Password Manager** on Android (both are already built in — just turn on sync).',
          'On your **computer**, use the **browser-profile** manager — Chrome signed into Google, or Edge signed into Microsoft (see those guides).',
          'Power option (advanced / organizational phase): install **LastPass** (browser extension + phone app) for cross-platform use and team **credential sharing** later. Choose a strong, memorable master password — if you forget it, no one can recover the vault.',
        ],
      },
      {
        title: 'Secure the manager itself with MFA',
        body: [
          'The manager holds the keys to everything. Make sure the Google or Microsoft account behind it — or your LastPass account — has an authenticator app turned on (see the MFA guide).',
        ],
      },
      {
        title: 'Let it save and generate passwords',
        body: [
          'As you sign in to sites, let the manager **save** the password. When creating new accounts, use its **generate password** button for a strong unique one.',
        ],
      },
      {
        title: 'Never reuse the same password across services',
        body: [
          'Use a **different password for every account** — never the same one twice. When passwords are reused, a breach at one weak site hands attackers the key to all your other accounts (this is called *credential stuffing*). A password manager exists precisely so you never have to remember or repeat one.',
          'Be most careful with your **email** and **bank** accounts. Your email is usually the **ultimate recovery method** — “forgot password” links and many MFA resets land there — so whoever controls your email can take over almost everything else. Banking and financial logins protect real money. These must have **unique, strong passwords of their own** (and MFA turned on), never shared with any other site.',
          'If you’ve been reusing a password, change it on the important accounts first (email, then bank, then anything financial), letting the manager generate a fresh unique one for each.',
        ],
        tip: 'Rule of thumb: if the same password would unlock both a random shopping site and your email or bank, that password is already too risky — give email and bank their own.',
      },
      {
        title: 'Know how to actually see a saved password (not just autofill)',
        body: [
          'Every one of these managers lets you **reveal** a stored password after you re-confirm it’s you (Face ID / fingerprint / device PIN / your account password) — you’re not stuck with autofill-only. You’ll need this when signing in on a device the manager can’t autofill into, or when adding a teammate to a shared account.',
          '**Apple Passwords / iCloud Keychain:** open the **Passwords** app (iPhone: Settings → Passwords; Mac: Passwords app), authenticate with Face ID / Touch ID / your passcode, tap the entry, then tap the password to reveal or copy it.',
          '**Google Password Manager (Android/Chrome):** go to **passwords.google.com** or Chrome → Settings → Google Password Manager, pick the site, and tap the **eye icon** — it asks for your phone screen lock or Google password first.',
          '**Edge (Microsoft):** Edge → Settings → Profiles → **Passwords**, choose the site, and click the **eye icon**; Windows asks for your Windows Hello PIN / account password to show it.',
        ],
      },
      {
        title: 'Store your MFA recovery codes here',
        body: [
          'Save each account’s **recovery codes** (from the MFA setup) in the manager — a secure note in LastPass, or your browser/Google account’s secure notes. This is what saves you when you lose or replace your phone.',
        ],
        tip: 'Passwords + recovery codes in one secured, backed-up vault = you can recover any account from any device.',
      },
    ],
    faqs: [
      {
        q: 'Why does it matter if I reuse one strong password everywhere?',
        a: 'Because you don’t control how every site stores it. When one site is breached — and breaches happen constantly — attackers take the leaked email + password and try it automatically on hundreds of other services (credential stuffing). One reused password turns a single breach into a break-in everywhere. It’s especially dangerous for your email and bank: email is the recovery channel for most of your other accounts, and bank logins guard real money. A manager makes a unique password per site effortless, so there’s no reason to reuse.',
      },
      {
        q: 'Built-in browser manager or LastPass — which?',
        a: 'Start with the built-in manager in your Chrome or Edge profile; it’s free and automatic. Add (or move to) LastPass when you need the same logins to work across many browsers/devices, or to share credentials with your team at the organizational phase.',
      },
      {
        q: 'What happens to my passwords if I lose my phone?',
        a: 'This is the whole reason FFC insists on a holistic setup with sync turned on. Apple Passwords (iCloud Keychain) and Google Password Manager both sync to your account in the cloud, so signing into iCloud or your Google account on a replacement phone restores every password and passkey — provided sync was on before you lost the device. The real danger is a manager that only kept passwords locally with no backup: if that device is gone, so are those passwords. So (1) keep iCloud Keychain or Google sync enabled, (2) keep a second copy on your computer’s browser profile, and (3) store each account’s MFA recovery codes in the vault, so even if you’re locked out of one factor you can still get back in.',
      },
    ],
    related: ['multi-factor-authentication', 'passkeys', 'chrome', 'edge'],
  },
  {
    slug: 'canva',
    counterpart: 'canva-organization',
    title: 'Set up Canva (design)',
    shortTitle: 'Canva',
    category: 'Tools',
    icon: '🎨',
    gradient: 'from-fuchsia-600 to-purple-700',
    description:
      'Create a Canva account, turn on multi-factor authentication, and join the charity’s Canva team to access its brand kit and templates.',
    keywords:
      'Canva nonprofit setup, Canva account, Canva team, Canva brand kit, Canva 2FA, Free For Charity Canva',
    audience: 'Designers and anyone making the charity’s marketing materials',
    estMinutes: 10,
    intro: [
      'Canva is where charity brand kits, social templates, and print materials are made. Like everything else, you sign up as **you**, then join the **charity’s team**.',
    ],
    principle: {
      title: 'Your account is you; the brand lives in the team',
      body: 'You sign up as a person, secure it with MFA, then join the charity’s Canva team — the same person-not-entity pattern as GitHub and LinkedIn. The charity’s logos, colors, and templates live in the shared Brand Kit, so always design from there to stay on-brand.',
    },
    steps: [
      {
        title: 'Create your account',
        body: [
          'Go to **canva.com** and sign up with the email on your phone (Continue with Google works well on Android). Use your real name.',
        ],
      },
      {
        ...MFA_STEP_SHARED,
        body: [
          'Go to **Settings → Login & security → Two-factor authentication** and turn it on with an **authenticator app**.',
          ...MFA_STEP_SHARED.body.slice(1),
        ],
      },
      {
        title: 'Join the charity’s Canva team',
        body: [
          'Ask your FFC contact to invite your email to the charity’s Canva team (Canva Pro for nonprofits is free). Accept the invite from your email.',
          'Once in, you’ll see the charity’s **Brand Kit** (logos, colors, fonts) and shared templates — always design from these so everything stays on-brand.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Canva free for our charity?',
        a: 'Yes — Canva offers Canva Pro free to verified nonprofits, which includes the Brand Kit and team features. Your FFC contact handles the nonprofit verification and invites you to the team.',
      },
      {
        q: 'Should I make a separate Canva account for the charity?',
        a: 'No. Make one personal account as yourself and join the charity’s team. The brand assets live in the shared team, not in a separate charity login.',
      },
    ],
    related: ['linkedin', 'facebook', 'multi-factor-authentication'],
  },
  {
    slug: 'microsoft-teams',
    counterpart: 'microsoft-teams-organization',
    title: 'Set up Microsoft Teams (your first install)',
    shortTitle: 'Microsoft Teams',
    category: 'Email & Workspace',
    icon: '💬',
    gradient: 'from-indigo-500 to-blue-700',
    description:
      'Install Microsoft Teams on your computer and phone — the first app every applicant installs. It’s how you meet with FFC, share your screen, and get live help.',
    keywords:
      'Microsoft Teams setup, install Teams desktop, Teams mobile app, screen sharing FFC, charity onboarding meeting, Free For Charity Teams',
    audience: 'Charity applicants and site owners — the first install',
    estMinutes: 10,
    intro: [
      'Microsoft Teams is how you meet with FFC: screen sharing, live walkthroughs, and real-time help during onboarding and beyond.',
      'It’s also the **first thing you install** — getting it onto your computer proves your machine can install the software the rest of the process needs.',
    ],
    principle: {
      title: 'Your first install is also a readiness test',
      body: 'Teams is deliberately the first thing you install. If it goes onto your computer cleanly, that’s proof your machine can handle the AI-tool connectors used later. If it won’t install, that’s the earliest, easiest moment to get help — before anything else depends on it.',
    },
    steps: [
      {
        title: 'Install the Teams desktop app',
        body: [
          'On your computer, download **Microsoft Teams** from **microsoft.com/microsoft-teams/download-app** and install it. Use the full desktop app, not just the browser version — screen sharing works best there.',
        ],
        tip: 'If installing it works, that’s the proof your computer can install the AI-tool connectors used later. If it won’t install, that’s exactly when to contact FFC for help.',
      },
      {
        title: 'Install Teams on your phone',
        body: [
          'Install the **Microsoft Teams** app from the App Store or Google Play so you can also join meetings from anywhere.',
        ],
      },
      {
        title: 'Sign in',
        body: [
          'For now, sign in with a **free personal Microsoft account** (create one at **signup.live.com** if you don’t have one). Later, once FFC provisions your charity’s Microsoft 365, you’ll add your **@yourcharity.org** identity to Teams.',
        ],
      },
      {
        title: 'Test a meeting',
        body: [
          'Open Teams, start a quick test meeting with yourself, and try the **Share** button so you know how screen sharing works before your first call with FFC.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I need a paid Teams license to meet with FFC?',
        a: 'No. A free personal Microsoft account works for onboarding. Later, once FFC provisions your charity’s Microsoft 365, you’ll add your @yourcharity.org identity to the same Teams app.',
      },
      {
        q: 'Teams won’t install on my computer — what now?',
        a: 'That’s exactly the signal this step is designed to catch. Contact FFC using the Support details at the bottom of this guide — your machine may need an update or a different device before the later AI-tool connectors will work.',
      },
    ],
    related: ['microsoft-365-email', 'multi-factor-authentication'],
  },
  {
    slug: 'cloud-storage-scanning',
    counterpart: 'cloud-storage-organization',
    title: 'Set up cloud storage & scan your documents',
    shortTitle: 'Cloud storage & scanning',
    category: 'Email & Workspace',
    icon: '🗄️',
    gradient: 'from-sky-500 to-cyan-700',
    description:
      'Set up Google Drive or Microsoft OneDrive to store the charity’s core files, and learn to scan paper documents (like the IRS determination letter) with your phone.',
    keywords:
      'Google Drive nonprofit, OneDrive charity files, scan documents phone, store IRS determination letter, charity recordkeeping, Free For Charity cloud storage',
    audience: 'Charity applicants and site owners',
    estMinutes: 15,
    intro: [
      'Your charity will accumulate documents you reuse constantly — state formation/incorporation papers, the IRS determination letter, board documents. Keep them in **one secure, backed-up place** from day one.',
      'You’ll use either **Google Drive** or **Microsoft OneDrive** — whichever matches your email ecosystem.',
    ],
    principle: {
      title: 'One secure, backed-up home for every document',
      body: 'Every important charity document lives in one cloud folder, secured with MFA and backed up automatically — never only on a single laptop or in an email thread. Scan paper the day it arrives so nothing is ever lost, and share a link rather than passing files around.',
    },
    steps: [
      {
        title: 'Pick Drive or OneDrive',
        body: [
          'If your email is **Gmail/Google**, use **Google Drive** (drive.google.com). If it’s **Microsoft/Outlook**, use **OneDrive** (onedrive.com). Either is fine — pick the one that matches the account you already sign in to.',
        ],
      },
      {
        ...MFA_STEP_SHARED,
        body: [
          'Make sure the Google or Microsoft account behind your storage has **multi-factor authentication on** (see the Multi-Factor Authentication guide) — these files matter.',
          ...MFA_STEP_SHARED.body.slice(1),
        ],
      },
      {
        title: 'Make a “Charity core files” folder',
        body: [
          'Create a top-level folder named for your charity, with sub-folders like **Formation & IRS**, **Board**, **Finances**, and **Brand/Logos**. A little structure now saves hours later.',
        ],
      },
      {
        title: 'Scan a document with your phone',
        body: [
          'Open the **Google Drive** app (**+ → Scan**) or the **OneDrive** app (camera/scan icon), photograph the document, and save it as a PDF straight into the right folder.',
          'Do this the moment a document arrives — for example, scan the **IRS determination letter** the day it comes in, so it’s never lost.',
        ],
        tip: 'Name files clearly, e.g. “IRS-determination-letter-2026.pdf”, so anyone can find them.',
      },
      {
        title: 'Share with FFC when asked',
        body: [
          'When FFC needs a document for validation, share the specific file or folder link rather than emailing attachments around.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Google Drive or OneDrive — does it matter which?',
        a: 'Pick the one that matches the account you already sign in to: Google Drive if your email is Gmail/Google, OneDrive if it’s Microsoft/Outlook. Both store files securely and scan from your phone; using the one tied to your existing account means one less password and one less app.',
      },
      {
        q: 'Where should the IRS determination letter go?',
        a: 'In your “Formation & IRS” sub-folder, scanned to PDF the day it arrives. It’s one of the documents you’ll reuse most, so name it clearly (e.g. IRS-determination-letter-2026.pdf) and never keep the only copy on paper.',
      },
    ],
    related: ['microsoft-365-email', 'google-workspace', 'password-manager'],
  },
  {
    slug: 'passkeys',
    title: 'Set up passkeys (phishing-resistant sign-in)',
    shortTitle: 'Passkeys',
    category: 'Security',
    icon: '🔐',
    gradient: 'from-emerald-600 to-green-700',
    description:
      'What passkeys are, how to add one on your phone and computer (including Windows Hello), and why you keep them alongside — not instead of — your authenticator MFA.',
    keywords:
      'passkeys setup, FIDO2, WebAuthn, Windows Hello, passwordless sign-in, phishing-resistant login, Free For Charity passkeys',
    audience: 'Everyone — enable where offered',
    estMinutes: 10,
    intro: [
      'A **passkey** replaces your password with your device’s **fingerprint, face, or PIN**. It can’t be phished or reused, and it’s becoming the default sign-in across Google, Microsoft, Apple, LinkedIn, and Facebook.',
      'Passkeys are **vendor-aligned** — each one lives in an ecosystem (Google, Apple, Microsoft, or a device like **Windows Hello**).',
    ],
    principle: {
      title: 'Passkeys complement your MFA — they don’t replace it',
      body: 'Turn passkeys on where a site offers them, but keep your authenticator app and recovery codes too. A passkey lives in a platform keychain (e.g. iCloud Keychain or Google Password Manager) and can sync across that ecosystem’s devices — but it won’t follow you outside that ecosystem, so your authenticator (with cloud backup) and recovery codes are how you get in from anywhere or recover a lost device.',
    },
    steps: [
      {
        title: 'Add a passkey on your phone',
        body: [
          'When a site (Google, Microsoft, LinkedIn, Facebook) offers to **create a passkey**, accept it and confirm with your phone’s fingerprint/face. The passkey is stored securely in your Google or Apple account.',
        ],
      },
      {
        title: 'Turn on Windows Hello on your computer',
        body: [
          'On Windows, set up **Windows Hello** (Settings → Accounts → Sign-in options) with a PIN or fingerprint/face. Sites can then create a passkey tied to your computer.',
        ],
      },
      {
        title: 'Keep your authenticator MFA as backup',
        body: [
          'Do **not** remove your authenticator app or recovery codes after adding passkeys — they’re your fallback if you lose the device that holds a passkey. See the Multi-Factor Authentication and Password Manager guides.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do passkeys replace my authenticator app?',
        a: 'No — they complement it. Turn passkeys on where offered for faster, phishing-resistant sign-in, but keep your authenticator app and recovery codes as the fallback that works from any device and any ecosystem.',
      },
      {
        q: 'What happens to my passkey if I lose my device?',
        a: 'A passkey lives in a platform keychain (iCloud Keychain or Google Password Manager) and syncs to that ecosystem’s other devices, so a replacement phone signed into the same account gets it back — if sync was on. If not, you fall back to your authenticator app and recovery codes, which is exactly why FFC has you keep them.',
      },
    ],
    related: ['multi-factor-authentication', 'password-manager'],
  },
  {
    slug: 'candid',
    counterpart: 'candid-organization',
    title: 'Set up a Candid (GuideStar) account',
    shortTitle: 'Candid (GuideStar)',
    category: 'Social Presence',
    icon: '📊',
    gradient: 'from-teal-500 to-emerald-700',
    description:
      'Create a personal Candid (formerly GuideStar) account to research nonprofits, and use it to find charities doing your mission. Your organization’s own profile and seal come later.',
    keywords:
      'Candid account, GuideStar account, nonprofit research, find similar charities, NTEE, transparency seal, Free For Charity Candid',
    audience: 'Charity applicants and founders',
    estMinutes: 15,
    intro: [
      'Candid (formerly **GuideStar**) is the canonical public registry of US nonprofits. Donors and funders use it to research charities.',
      'You set up a **personal** account first to see how that research works — your **organization’s** Candid profile and transparency seal come later, once you’re recognized.',
    ],
    principle: {
      title: 'Personal research account now, organization profile later',
      body: 'This is your own account for learning the nonprofit landscape — not your charity’s Candid profile. Seeing how donors and funders research organizations here makes your own profile and transparency seal far stronger when you claim them after IRS recognition.',
    },
    steps: [
      {
        title: 'Create your account',
        body: ['Go to **candid.org** and create a free account with your real name and email.'],
      },
      {
        ...MFA_STEP_SHARED,
        body: [
          'Turn on **two-factor authentication** if Candid offers it in your account settings.',
          ...MFA_STEP_SHARED.body.slice(1),
        ],
      },
      {
        title: 'Find charities like yours',
        body: [
          'Search by **cause, location, or NTEE code** to see organizations doing the same or a near-identical mission in your area.',
          'Note **at least three comparable charities** — you’ll be asked for these, and studying them sharpens what makes your organization distinct.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is this the same as my charity’s Candid profile?',
        a: 'No. This is your personal research account. Your organization’s Candid profile — and the Bronze-through-Platinum transparency seal — come later, once your charity is IRS-recognized and you claim and complete its profile.',
      },
      {
        q: 'Why do I need to find three comparable charities?',
        a: 'It sharpens what makes your organization distinct, and FFC asks for them during validation. Searching by cause, location, or NTEE code on Candid is the fastest way to find organizations doing your exact or near-exact mission.',
      },
    ],
    related: ['idealist', 'taproot'],
  },
  {
    slug: 'idealist',
    counterpart: 'idealist-organization',
    title: 'Set up Idealist (volunteers & nonprofit jobs)',
    shortTitle: 'Idealist',
    category: 'Social Presence',
    icon: '🧭',
    gradient: 'from-amber-500 to-orange-600',
    description:
      'Create a personal Idealist account to see how volunteers find and connect with charities. Your organization’s listings come later.',
    keywords:
      'Idealist account, nonprofit volunteers, volunteer matching, nonprofit jobs, Free For Charity Idealist',
    audience: 'Charity applicants and founders',
    estMinutes: 10,
    intro: [
      'Idealist is where people find nonprofit volunteer opportunities and jobs. Experiencing it from the **volunteer’s** side first helps you post effective opportunities later.',
    ],
    principle: {
      title: 'Learn it as a volunteer before you post as an organization',
      body: 'Set up a personal account and browse as someone looking to help. Understanding what makes a volunteer opportunity appealing is exactly what you’ll need when your charity posts its own listings later — with FFC’s help.',
    },
    steps: [
      {
        title: 'Create your account',
        body: ['Go to **idealist.org** and sign up with your real name and email.'],
      },
      {
        title: 'Explore charities like yours',
        body: [
          'Search opportunities near you and in your cause area to see how charities describe their work and ask for help.',
        ],
      },
      {
        title: 'Note what good listings look like',
        body: [
          'Save a couple of strong examples. When your charity is up and running, you’ll post opportunities the same way — FFC can help you create the organization’s listing later.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Will I post my charity’s volunteer roles here now?',
        a: 'Not yet. For now you’re learning the volunteer’s side. Once your charity is running, FFC can help you create the organization’s listings so they attract the right people.',
      },
      {
        q: 'How is Idealist different from Taproot?',
        a: 'Idealist covers general nonprofit volunteering and jobs; Taproot focuses on skills-based, pro-bono projects (design, marketing, consulting). FFC has you try both so you understand each channel.',
      },
    ],
    related: ['candid', 'taproot'],
  },
  {
    slug: 'taproot',
    counterpart: 'taproot-organization',
    title: 'Set up Taproot (skills-based volunteering)',
    shortTitle: 'Taproot',
    category: 'Social Presence',
    icon: '🌳',
    gradient: 'from-lime-500 to-green-700',
    description:
      'Create a personal Taproot account to learn how skills-based (pro-bono) volunteering is sourced. Your organization can request pro-bono help here later.',
    keywords:
      'Taproot Foundation, Taproot Plus, skills-based volunteering, pro bono nonprofit, Free For Charity Taproot',
    audience: 'Charity applicants and founders',
    estMinutes: 10,
    intro: [
      'Taproot (and **Taproot Plus**) is a marketplace for **pro-bono, skills-based** volunteering — designers, marketers, and consultants donating expertise.',
      'See how it works from the volunteer side now; your organization can post pro-bono requests once you’re running.',
    ],
    principle: {
      title: 'Understand pro-bono before you request it',
      body: 'Set up a personal account and see how skilled professionals donate their expertise. Knowing how a good pro-bono project is scoped is exactly what makes your organization’s future requests succeed — and FFC can help you post them later.',
    },
    steps: [
      {
        title: 'Create your account',
        body: [
          'Go to **taprootfoundation.org** (or **taprootplus.org**) and create a free account with your real name and email.',
        ],
      },
      {
        title: 'Browse pro-bono projects',
        body: [
          'Look through example projects to understand how nonprofits scope and request skilled help.',
        ],
      },
      {
        title: 'Note how requests are scoped',
        body: [
          'Save an example or two. Later your organization can post a pro-bono request the same way, with FFC’s help.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What’s the difference between Taproot and Idealist?',
        a: 'Taproot is for skills-based, pro-bono projects — professionals donating design, marketing, or consulting work. Idealist is broader: general volunteering and nonprofit jobs. Try both so you know which channel fits a given need.',
      },
      {
        q: 'Can my charity request pro-bono help right now?',
        a: 'Once your organization is set up you can post pro-bono requests on Taproot Plus. For now, study how existing projects are scoped — clear scope is what attracts skilled volunteers — and FFC can help you post later.',
      },
    ],
    related: ['idealist', 'candid'],
  },
  {
    slug: 'chrome',
    title: 'Set up Chrome (profile, saved passwords & bookmarks)',
    shortTitle: 'Chrome browser',
    category: 'Tools',
    icon: '🌐',
    gradient: 'from-blue-500 to-green-500',
    description:
      'Install Google Chrome and sign it into a profile tied to your Google account so your saved passwords and bookmarks sync and back up — your built-in password manager on the Google side.',
    keywords:
      'Chrome setup, Chrome profile, Google Password Manager, Chrome sync, saved passwords bookmarks, approved browser, Free For Charity Chrome',
    audience: 'Everyone — Chrome and Edge are the only supported browsers',
    estMinutes: 10,
    intro: [
      'Chrome is one of the **two approved browsers** (Chrome and Edge). FFC doesn’t support Firefox, Safari, or others.',
      'Signing Chrome into a **profile tied to your Google account** gives you a **built-in password manager** and backs up your **bookmarks** automatically — this is the everyday password manager for Google-ecosystem users.',
    ],
    principle: {
      title: 'The profile is you, the person',
      body: 'You sign Chrome into your own personal Google account — the same person-not-entity rule as everywhere else. Your passwords and bookmarks live with that account, so they follow you to any computer where you sign in.',
    },
    steps: [
      {
        title: 'Install Chrome',
        body: ['Download and install **Google Chrome** from **google.com/chrome**.'],
      },
      {
        title: 'Sign in and turn on Sync',
        body: [
          'Click your profile circle (top-right) → **Sign in** with your personal **Google account**, and turn on **Sync**.',
          'With Sync on, your **saved passwords and bookmarks back up to your Google account** and appear on any device where you sign in.',
        ],
      },
      {
        title: 'Let Google Password Manager save your passwords',
        body: [
          'As you sign in to sites, let Chrome **save** the password; use **Suggest strong password** for new accounts. Review them anytime at **passwords.google.com**.',
        ],
      },
      {
        title: 'Secure your Google account with MFA',
        body: [
          'Because everything syncs to your Google account, protect it with **Google Authenticator** (see the MFA guide) and consider a **passkey** (see the Passkeys guide).',
        ],
      },
    ],
    faqs: [
      {
        q: 'Why can’t I use Firefox or Safari?',
        a: 'FFC supports only Chrome and Edge so our guides, screenshots, and AI-tool integrations match exactly what you see — no time lost to browser-specific quirks. Pick Chrome if you live in the Google ecosystem, Edge if you live in Microsoft.',
      },
      {
        q: 'Is Chrome’s built-in password manager enough?',
        a: 'For Google-ecosystem users it’s a solid everyday manager — saved passwords and bookmarks sync to your Google account. Pair it with the holistic approach in the Password Manager guide (a manager tied to your phone, plus your MFA recovery codes stored safely).',
      },
    ],
    related: ['password-manager', 'multi-factor-authentication', 'passkeys', 'edge'],
  },
  {
    slug: 'edge',
    title: 'Set up Edge (profile, saved passwords & bookmarks)',
    shortTitle: 'Edge browser',
    category: 'Tools',
    icon: '🌐',
    gradient: 'from-cyan-600 to-blue-700',
    description:
      'Install Microsoft Edge and sign it into a profile tied to your Microsoft account so your saved passwords and favorites sync and back up — your built-in password manager on the Microsoft side.',
    keywords:
      'Edge setup, Edge profile, Microsoft account sync, saved passwords favorites, approved browser, Free For Charity Edge',
    audience: 'Everyone — Chrome and Edge are the only supported browsers',
    estMinutes: 10,
    intro: [
      'Edge is one of the **two approved browsers** (Chrome and Edge). FFC doesn’t support Firefox, Safari, or others.',
      'Signing Edge into a **profile tied to your Microsoft account** gives you a **built-in password manager** and backs up your **favorites/bookmarks** automatically — this is the everyday password manager for Microsoft-ecosystem users.',
    ],
    principle: {
      title: 'The profile is you, the person',
      body: 'You sign Edge into your own personal Microsoft account — the same person-not-entity rule as everywhere else. Your passwords and favorites live with that account, so they follow you to any computer where you sign in.',
    },
    steps: [
      {
        title: 'Install Edge',
        body: [
          'Download and install **Microsoft Edge** from **microsoft.com/edge** (it’s pre-installed on Windows).',
        ],
      },
      {
        title: 'Sign in and turn on Sync',
        body: [
          'Click your profile (top-right) → **Sign in** with your personal **Microsoft account**, and turn on **Sync**.',
          'With Sync on, your **saved passwords and favorites back up to your Microsoft account** and appear on any device where you sign in.',
        ],
      },
      {
        title: 'Let Edge save your passwords',
        body: [
          'As you sign in to sites, let Edge **save** the password (**Settings → Profiles → Passwords**); use its **suggest strong password** for new accounts.',
        ],
      },
      {
        title: 'Secure your Microsoft account with MFA',
        body: [
          'Because everything syncs to your Microsoft account, protect it with **Microsoft Authenticator** (see the MFA guide) and consider a **passkey** (see the Passkeys guide).',
        ],
      },
    ],
    faqs: [
      {
        q: 'Why can’t I use Firefox or Safari?',
        a: 'FFC supports only Chrome and Edge so our guides, screenshots, and AI-tool integrations match exactly what you see. Choose Edge if you live in the Microsoft ecosystem, Chrome if you live in Google.',
      },
      {
        q: 'Is Edge’s built-in password manager enough?',
        a: 'For Microsoft-ecosystem users it’s a solid everyday manager — saved passwords and favorites sync to your Microsoft account. (Note Microsoft Authenticator stopped storing passwords in 2025; Edge is now Microsoft’s password manager.) Pair it with the holistic approach in the Password Manager guide.',
      },
    ],
    related: ['password-manager', 'multi-factor-authentication', 'passkeys', 'chrome'],
  },
  {
    slug: 'ai-assistant',
    title: 'Set up your AI assistant',
    shortTitle: 'AI assistant',
    category: 'Tools',
    icon: '🤖',
    gradient: 'from-violet-600 to-fuchsia-700',
    description:
      'Pick and sign in to the AI assistant that matches your email — Gemini for Gmail/iCloud, Copilot for Outlook — then add Claude for deeper work, so you always have help walking through any step.',
    keywords:
      'AI assistant setup, Google Gemini, Microsoft Copilot, Claude, AI for nonprofits, AI help onboarding, Free For Charity AI assistant',
    audience: 'Everyone — AI assistance is part of how FFC works',
    estMinutes: 10,
    intro: [
      'FFC leans on AI assistants — they’re remarkably good at walking you through any step in plain language, at any hour. Being **willing to use one** is a Phase 0 requirement.',
      'The required assistant **matches your email ecosystem**, so the one you need is already tied to an account you have.',
    ],
    principle: {
      title: 'Use the assistant that matches your ecosystem',
      body: 'If your email is Gmail or iCloud, your assistant is Google Gemini. If it’s Outlook.com, your assistant is Microsoft Copilot. For development and deeper writing work you’ll also use Claude. Matching the assistant to your ecosystem means one less account and an assistant that can already see the right context.',
    },
    steps: [
      {
        title: 'Pick the assistant for your email',
        body: [
          '**Gmail or iCloud →** use **Google Gemini** (gemini.google.com), signed in with your Google account.',
          '**Outlook.com →** use **Microsoft Copilot** (copilot.microsoft.com), signed in with your Microsoft account.',
          'Either one is free to start and works in your browser and as a phone app.',
        ],
      },
      {
        title: 'Sign in and secure it',
        body: [
          'Sign in with the matching account and make sure that account has **multi-factor authentication** on (see the MFA guide) — the assistant can see a lot, so protect the login behind it.',
        ],
      },
      {
        title: 'Add Claude for development work',
        body: [
          'For building and maintaining the charity’s website with an AI agent, you’ll also use **Claude**. See the **Dev Environment Setup** guide (ffcadmin.org/developer-environment-setup) for how FFC uses Claude, Codex, Gemini, or Copilot for code.',
        ],
        tip: 'Stuck on any FFC step? Your assistant is the fastest first answer — paste the step and ask it to explain.',
      },
    ],
    faqs: [
      {
        q: 'Do I have to pay for an AI assistant?',
        a: 'No — the matching assistant (Gemini or Copilot) has a capable free tier that’s plenty for onboarding. You can upgrade later if you want, but it isn’t required to apply or get started.',
      },
      {
        q: 'Why does the assistant have to match my email?',
        a: 'Because it’s already tied to an account you have (Gemini to Google, Copilot to Microsoft), so there’s nothing new to create, and it can work with your email and files in that ecosystem. Claude is added on top for development work.',
      },
    ],
    related: ['microsoft-365-email', 'google-workspace', 'chrome'],
  },
  {
    slug: 'google-voice',
    title: 'Set up a public phone number (Google Voice)',
    shortTitle: 'Google Voice',
    category: 'Tools',
    icon: '📞',
    gradient: 'from-green-600 to-emerald-700',
    description:
      'Get a free Google Voice number to use as the charity’s public phone line — it rings to your own phone while keeping your personal number private.',
    keywords:
      'Google Voice setup, free public phone number, charity phone number, nonprofit phone, keep personal number private, Free For Charity Google Voice',
    audience: 'Charity applicants who need a public phone number',
    estMinutes: 15,
    intro: [
      'The charity needs a **public phone number**, and a free **Google Voice** number works well — it’s what the FFC founder uses.',
      'It rings through to the phone you already carry, but keeps your **personal number private** and becomes the charity’s public-facing line.',
    ],
    principle: {
      title: 'A public number that protects your personal one',
      body: 'A Google Voice number is a free US phone number tied to your Google account. You give it out publicly (website, social profiles) instead of your personal cell, and it forwards calls and texts to your real phone — so you’re reachable without exposing your private number.',
    },
    steps: [
      {
        title: 'Get your Google Voice number',
        body: [
          'On a computer, go to **voice.google.com**, sign in with your Google account, and choose a **free US number** (search by area code). It’s tied to your account, so secure that account with MFA (see the MFA guide).',
        ],
      },
      {
        title: 'Set where it rings and record a greeting',
        body: [
          'Link your real mobile number so calls and texts **forward to your phone**, and record a short, professional voicemail greeting in the charity’s name.',
          'Install the **Google Voice** app so you can make and answer calls/texts from the public number, keeping your personal number off the conversation.',
        ],
      },
      {
        title: 'Use it as the charity’s public line',
        body: [
          'Put the Google Voice number — not your personal cell — on the website, Google/social profiles, and anywhere the charity is listed publicly.',
          'When others join the team later, you can share access or move to a Google Workspace Voice line; for now this one free number covers the public-phone requirement.',
        ],
        tip: 'Using a separate public number now means you never have to change “the charity’s number” later just because your personal situation changes.',
      },
    ],
    faqs: [
      {
        q: 'Is Google Voice really free?',
        a: 'Yes — a personal Google Voice number is free in the US for calls and texts to US numbers. It’s available to US-based Google accounts.',
      },
      {
        q: 'Can the team share this number later?',
        a: 'For a small team you can simply forward or check it together. As the charity grows you can move to Google Workspace Voice (paid) or add the number to shared tools — but the free number meets the public-phone requirement to start.',
      },
    ],
    related: ['microsoft-teams', 'password-manager', 'multi-factor-authentication'],
  },
  {
    slug: 'instagram',
    counterpart: 'instagram-organization',
    title: 'Set up Instagram (you + your charity account)',
    shortTitle: 'Instagram',
    category: 'Social Presence',
    icon: '📸',
    gradient: 'from-pink-600 to-rose-700',
    description:
      'Create your personal Instagram account, turn on multi-factor authentication, then set up the charity’s account and link it to your Facebook Page — the same person-owns-the-account pattern as everywhere else.',
    keywords:
      'create Instagram account, Instagram nonprofit, Instagram professional account, Instagram 2FA, link Instagram Facebook page, Free For Charity Instagram',
    audience: 'Volunteers and charity owners building the charity’s visual presence',
    estMinutes: 20,
    intro: [
      'Instagram is part of the **Meta** family with Facebook, so it follows the same rule: **you** have a personal account, and the **charity** has its own account that real people manage.',
      'Set up your personal account first, then create the charity’s account and connect it to the Facebook Page.',
    ],
    principle: {
      title: 'Person first, then the charity account',
      body: 'You sign up as yourself and secure it with MFA, then create the charity’s Instagram and switch it to a free **Professional account** linked to the Facebook Page. The accounts are run by real, MFA-secured people — never a shared anonymous login.',
    },
    steps: [
      {
        title: 'Create your personal account',
        body: [
          'Install **Instagram** from the app store and sign up with the email or phone tied to your device, using your real name.',
        ],
      },
      {
        ...MFA_STEP_SHARED,
        body: [
          'Go to **Settings → Accounts Center → Password and security → Two-factor authentication**, pick your account, and choose **Authentication app**.',
          ...MFA_STEP_SHARED.body.slice(1),
        ],
      },
      {
        title: 'Create the charity’s account and make it Professional',
        body: [
          'Create a separate account for the charity (a clean handle in the charity’s name), then switch it to a **Professional account** (Settings → Account type) and choose a category like **Nonprofit Organization**.',
          'Link it to the charity’s **Facebook Page** so you can manage both from Meta Business Suite and cross-post. Add the logo and a clear bio with your website.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I need a separate account for the charity?',
        a: 'Yes — keep your personal account and create a separate one for the charity, switched to a free Professional account. They’re linked to the same Facebook Page and managed by real admins, but the charity’s posts stay separate from your personal life.',
      },
      {
        q: 'Why link Instagram to the Facebook Page?',
        a: 'Linking them lets you manage both in Meta Business Suite, schedule and cross-post, and (once you’re a 501(c)(3)) turn on Meta’s fundraising tools across both.',
      },
    ],
    related: ['facebook', 'instagram-organization', 'canva'],
  },

  // ────────────────────────────────────────────────────────────────────────
  // Organizational track — the charity/501(c)(3)-level setup of the same tools.
  // Each pairs with a personal guide via `counterpart`.
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'linkedin-organization',
    track: 'organizational',
    counterpart: 'linkedin',
    title: 'Run your charity’s LinkedIn Page',
    shortTitle: 'LinkedIn Page (org)',
    category: 'Social Presence',
    icon: '💼',
    gradient: 'from-blue-700 to-indigo-800',
    description:
      'Take the LinkedIn Page you created and make it work for the charity: complete the profile, add admins, post on a cadence, and connect LinkedIn’s nonprofit features.',
    keywords:
      'LinkedIn Page management nonprofit, LinkedIn company page admins, LinkedIn for Nonprofits, charity LinkedIn strategy, Free For Charity LinkedIn org',
    audience: 'Charity owners and the volunteer running the charity’s LinkedIn presence',
    intro: [
      'Creating the Page (in the personal LinkedIn guide) is step one. This guide is about **running** it: a complete profile, multiple admins, a steady posting rhythm, and LinkedIn’s nonprofit tools.',
    ],
    estMinutes: 20,
    principle: {
      title: 'A Page is a team effort behind real admins',
      body: 'The charity’s Page should never depend on one person. Add several admins (each on their own MFA-secured personal profile), and treat the Page as the organization’s public voice — consistent, on-brand, and active.',
    },
    steps: [
      {
        title: 'Complete the Page profile',
        body: [
          'Fill every field: logo, banner, tagline, About, website, industry, location, and company size. A complete Page ranks better and looks credible to funders.',
          'Use the charity’s **Canva** brand assets (see the Canva guides) for the logo and banner.',
        ],
      },
      {
        title: 'Add multiple admins',
        body: [
          'Open the Page → **Admin tools → Manage admins** and add at least two more people as admins, so coverage never depends on one account.',
        ],
      },
      {
        title: 'Post on a steady cadence',
        body: [
          'Aim for a regular rhythm (e.g. weekly): impact stories, volunteer spotlights, and milestones. Consistency, not volume, builds an audience.',
        ],
      },
      {
        title: 'Connect LinkedIn for Nonprofits',
        body: [
          'Explore **LinkedIn for Nonprofits** for discounted talent and learning tools, and add a volunteer/role call-to-action to the Page so people can find ways to help.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How is this different from the personal LinkedIn guide?',
        a: 'The personal guide gets you a profile and creates the Page. This guide is about operating that Page well — completeness, multiple admins, posting cadence, and nonprofit features — once it exists.',
      },
      {
        q: 'How often should the charity post?',
        a: 'A sustainable, regular rhythm beats sporadic bursts. Weekly is a good target; the key is consistency so the Page always looks active to funders and volunteers.',
      },
    ],
    related: ['linkedin', 'facebook-organization', 'canva-organization'],
  },
  {
    slug: 'facebook-organization',
    track: 'organizational',
    counterpart: 'facebook',
    title: 'Run your charity’s Facebook Page',
    shortTitle: 'Facebook Page (org)',
    category: 'Social Presence',
    icon: '📘',
    gradient: 'from-blue-700 to-indigo-800',
    description:
      'Operate the charity’s Facebook Page with Meta Business Suite: assign roles, turn on nonprofit fundraising tools, and post consistently.',
    keywords:
      'Facebook Page management nonprofit, Meta Business Suite, Facebook page roles, Facebook charity fundraising tools, Free For Charity Facebook org',
    audience: 'Charity owners and the volunteer running the charity’s Facebook presence',
    intro: [
      'You created the Page in the personal Facebook guide. Now make it work for the charity using **Meta Business Suite** — roles, scheduling, insights, and nonprofit fundraising tools.',
    ],
    estMinutes: 20,
    principle: {
      title: 'Manage the Page through Business Suite, not personal posts',
      body: 'Meta Business Suite is the organization’s control room: it separates the charity’s Page from your personal timeline, lets several people manage it by role, and unlocks scheduling, insights, and donation tools.',
    },
    steps: [
      {
        title: 'Open Meta Business Suite',
        body: [
          'Go to **business.facebook.com** and connect the charity’s Page. This is where you’ll post, schedule, reply to messages, and see insights.',
        ],
      },
      {
        title: 'Assign Page roles',
        body: [
          'In **Settings → Page access**, add at least one more person with full control and others with limited roles as needed, so the Page survives any one account being lost.',
        ],
      },
      {
        title: 'Turn on nonprofit fundraising tools',
        body: [
          'Once the charity is recognized, enroll in **Meta’s charitable/fundraising tools** so supporters can donate directly through the Page and your campaigns.',
        ],
      },
      {
        title: 'Schedule consistent posts',
        body: [
          'Use Business Suite’s **scheduler** to keep a steady stream of on-brand updates (built from your Canva templates), and review **Insights** to see what resonates.',
        ],
      },
    ],
    phaseNote: 'Facebook’s charitable/fundraising tools require verified 501(c)(3) status.',
    faqs: [
      {
        q: 'Do I manage the Page from my personal Facebook?',
        a: 'You sign in as yourself, but you manage the charity through Meta Business Suite, which keeps the Page separate from your personal timeline and lets you add co-managers by role.',
      },
      {
        q: 'Can supporters donate through the Page?',
        a: 'Yes, once the charity is a verified 501(c)(3) you can enable Meta’s fundraising tools so people donate directly via the Page and campaigns.',
      },
    ],
    related: ['facebook', 'instagram-organization', 'linkedin-organization', 'canva-organization'],
  },
  {
    slug: 'canva-organization',
    track: 'organizational',
    counterpart: 'canva',
    title: 'Set up your charity’s Canva team & brand kit',
    shortTitle: 'Canva team (org)',
    category: 'Tools',
    icon: '🎨',
    gradient: 'from-fuchsia-700 to-purple-800',
    description:
      'Create the charity’s Canva team, get Canva Pro free for nonprofits, build the Brand Kit, and invite volunteers so everything stays on-brand.',
    keywords:
      'Canva for Nonprofits, Canva team setup, Canva brand kit, Canva nonprofit free, invite Canva team members, Free For Charity Canva org',
    audience: 'Charity owners and design leads building the charity’s Canva workspace',
    intro: [
      'The personal Canva guide gets you an account and into a team. This guide sets up the **charity’s** team: the free nonprofit plan, the Brand Kit, and inviting your designers.',
    ],
    estMinutes: 20,
    principle: {
      title: 'The brand lives in the team, not in one person’s account',
      body: 'A charity Canva team holds the Brand Kit (logos, colors, fonts) and shared templates so every volunteer designs from the same source of truth. People come and go; the brand stays in the team.',
    },
    steps: [
      {
        title: 'Apply for Canva for Nonprofits',
        body: [
          'Once recognized, apply at **canva.com/canva-for-nonprofits** to get **Canva Pro free** for the organization, including team features and the Brand Kit.',
          'Canva verifies your nonprofit status through **Goodstack** — if you’re already verified there it’s quick (see the Goodstack guide).',
        ],
      },
      {
        title: 'Create the team and Brand Kit',
        body: [
          'Create the charity’s **team**, then build the **Brand Kit**: upload the logo, set the brand colors and fonts, and save approved templates for social posts and print.',
        ],
      },
      {
        title: 'Invite your designers',
        body: [
          'Invite volunteers by email into the team with the right role. They’ll design from the shared Brand Kit so everything stays consistent.',
        ],
      },
    ],
    phaseNote: 'Canva for Nonprofits (free Pro) requires eligibility verification as a 501(c)(3).',
    faqs: [
      {
        q: 'Is the nonprofit plan really free?',
        a: 'Yes — Canva Pro is free for eligible verified nonprofits, which includes team collaboration and the Brand Kit. You apply once the charity is recognized.',
      },
      {
        q: 'Why use a Brand Kit instead of letting people design freely?',
        a: 'The Brand Kit keeps every volunteer’s work on-brand automatically — same logo, colors, and fonts — so the charity looks consistent and professional everywhere.',
      },
    ],
    related: ['canva', 'goodstack', 'linkedin-organization', 'facebook-organization'],
  },
  {
    slug: 'microsoft-365-organization',
    track: 'organizational',
    counterpart: 'microsoft-365-email',
    title: 'Set up your charity’s Microsoft 365 tenant',
    shortTitle: 'Microsoft 365 (org)',
    category: 'Email & Workspace',
    icon: '🏢',
    gradient: 'from-cyan-700 to-sky-800',
    description:
      'Claim Microsoft 365 Business Premium through Microsoft for Nonprofits, add your domain and users, and run the tenant safely with FFC.',
    keywords:
      'Microsoft 365 nonprofit tenant, Microsoft for Nonprofits grant, M365 admin center, add users domain, charity email tenant, Free For Charity Microsoft 365 org',
    audience: 'Charity owners and admins standing up the organization’s Microsoft 365',
    intro: [
      'Your personal mailbox guide covers signing into a mailbox FFC made. This guide is the **organization** side: the tenant those mailboxes live in, claimed through **Microsoft for Nonprofits**.',
      'FFC does most of this with you — the tenant underpins the whole charity, so changes are made carefully.',
    ],
    estMinutes: 25,
    principle: {
      title: 'The tenant is the charity’s foundation — change it deliberately',
      body: 'The Microsoft 365 tenant holds every mailbox, identity, and security setting. It’s powerful and easy to misconfigure, so FFC partners with you on tenant-level changes rather than leaving them to guesswork.',
    },
    steps: [
      {
        title: 'Get the Microsoft for Nonprofits grant',
        body: [
          'Once recognized, register at **Microsoft for Nonprofits** to receive donated/discounted **Microsoft 365** licenses (with FFC’s help).',
          'Microsoft’s nonprofit offers are validated through **TechSoup** — being validated there first makes this smoother (see the TechSoup guide).',
        ],
      },
      {
        title: 'Add and verify your domain',
        body: [
          'In the **Microsoft 365 admin center**, add the charity’s domain (e.g. yourcharity.org) and verify it via DNS — FFC manages the DNS records so mail routes correctly.',
        ],
      },
      {
        title: 'Create users and assign licenses',
        body: [
          'Create a mailbox for each person (you@yourcharity.org), assign a license, and require MFA. Each person then follows the **personal** Microsoft 365 guide to sign in.',
        ],
      },
      {
        title: 'Set baseline security with FFC',
        body: [
          'Turn on security defaults / conditional access and MFA enforcement. Ask FFC before changing sharing, retention, or admin roles.',
        ],
        tip: 'Keep at least two global admins, each with MFA, so the tenant is never locked behind one account.',
      },
    ],
    phaseNote:
      'Microsoft for Nonprofits grants require validated 501(c)(3) (or equivalent) status.',
    faqs: [
      {
        q: 'What’s the difference between this and the personal email guide?',
        a: 'The personal guide is one user signing into a mailbox. This guide creates and runs the tenant that all those mailboxes live in — the grant, the domain, the users, and security.',
      },
      {
        q: 'Should I make tenant changes on my own?',
        a: 'Coordinate tenant-level changes with FFC. The tenant underpins every account, so mistakes are costly; FFC helps you make them safely.',
      },
    ],
    related: ['microsoft-365-email', 'techsoup', 'cloud-storage-organization'],
  },
  {
    slug: 'google-workspace-organization',
    track: 'organizational',
    counterpart: 'google-workspace',
    title: 'Set up your charity’s Google Workspace',
    shortTitle: 'Google Workspace (org)',
    category: 'Email & Workspace',
    icon: '🏢',
    gradient: 'from-amber-600 to-orange-700',
    description:
      'Claim Google Workspace through Google for Nonprofits, verify your domain, and add users — for charities standardized on Google.',
    keywords:
      'Google Workspace nonprofit, Google for Nonprofits, Workspace admin console, add users domain, charity Google Workspace, Free For Charity Google Workspace org',
    audience: 'Charity owners/admins on a Google-based charity (FFC default is Microsoft 365)',
    intro: [
      'For charities on Google rather than Microsoft, this is the **organization** side of the personal Google Workspace guide: the domain, the nonprofit grant, and user accounts.',
    ],
    estMinutes: 25,
    principle: {
      title: 'The Workspace is the charity’s foundation — change it deliberately',
      body: 'The admin console controls every account, identity, and sharing setting. Treat tenant-level changes carefully and lean on FFC, the same way you would for a Microsoft 365 tenant.',
    },
    steps: [
      {
        title: 'Register for Google for Nonprofits',
        body: [
          'Once recognized, apply at **google.com/nonprofits** to unlock **Google Workspace for Nonprofits** at no cost.',
          'Google verifies your nonprofit status through **Goodstack** — getting verified there first makes this fast (see the Goodstack guide).',
        ],
      },
      {
        title: 'Verify your domain',
        body: [
          'In the **Google Admin console**, add and verify the charity’s domain via DNS (FFC manages the records) so Gmail routes to your charity address.',
        ],
      },
      {
        title: 'Add users and require 2-Step Verification',
        body: [
          'Create an account for each person (you@yourcharity.org) and enforce **2-Step Verification** org-wide. Each person then follows the personal Google Workspace guide to sign in.',
        ],
      },
    ],
    phaseNote:
      'Google for Nonprofits requires validated nonprofit (501(c)(3) or equivalent) status.',
    faqs: [
      {
        q: 'Should our charity use Google or Microsoft?',
        a: 'FFC’s default is Microsoft 365. Choose Google Workspace only if the charity is already deeply embedded in Google. Don’t run both — pick one home for email and files.',
      },
      {
        q: 'Is Google Workspace free for us?',
        a: 'Google Workspace for Nonprofits is free for eligible verified organizations once you’re approved through Google for Nonprofits.',
      },
    ],
    related: ['google-workspace', 'goodstack', 'cloud-storage-organization'],
  },
  {
    slug: 'microsoft-teams-organization',
    track: 'organizational',
    counterpart: 'microsoft-teams',
    title: 'Set up Microsoft Teams for your charity',
    shortTitle: 'Microsoft Teams (org)',
    category: 'Email & Workspace',
    icon: '💬',
    gradient: 'from-indigo-700 to-blue-800',
    description:
      'Move from a personal Teams sign-in to the charity’s tenant: add your @yourcharity.org identity, create teams and channels, and organize the volunteers’ workspace.',
    keywords:
      'Microsoft Teams nonprofit, Teams channels charity, Teams tenant setup, add work account Teams, Free For Charity Teams org',
    audience: 'Charity owners and admins organizing the team’s collaboration space',
    intro: [
      'The personal Teams guide gets the app installed and you into meetings. This guide moves Teams onto the **charity’s Microsoft 365 tenant** and organizes it for the whole team.',
    ],
    estMinutes: 15,
    principle: {
      title: 'One workspace, organized by team and channel',
      body: 'Teams works best when conversations live in clear channels (e.g. Website, Fundraising, Board) under the charity’s tenant identity — not scattered across personal chats. Structure now keeps everyone aligned later.',
    },
    steps: [
      {
        title: 'Add your charity identity to Teams',
        body: [
          'Once your @yourcharity.org account exists (see the Microsoft 365 organization guide), add it to the **same Teams app** (profile → Add account) and switch to the charity tenant.',
        ],
      },
      {
        title: 'Create teams and channels',
        body: [
          'Create a team for the charity and add **channels** by topic (Website, Fundraising, Board, General). Invite volunteers by their charity email.',
        ],
      },
      {
        title: 'Set norms and pin resources',
        body: [
          'Pin key files (brand kit links, the document folder) into the right channels, and agree on simple norms — where to ask for help, where decisions are recorded.',
        ],
      },
    ],
    phaseNote:
      'The charity tenant comes from the Microsoft for Nonprofits grant (needs 501(c)(3)).',
    faqs: [
      {
        q: 'Do I install Teams again for the charity?',
        a: 'No — add your charity account to the Teams app you already installed in the personal guide, then switch between your personal and charity identities in the same app.',
      },
      {
        q: 'How should we organize channels?',
        a: 'Start simple: one team for the charity with a handful of topic channels (Website, Fundraising, Board, General). Add more only when a real need appears.',
      },
    ],
    related: ['microsoft-teams', 'microsoft-365-organization', 'cloud-storage-organization'],
  },
  {
    slug: 'cloud-storage-organization',
    track: 'organizational',
    counterpart: 'cloud-storage-scanning',
    title: 'Set up shared cloud storage for your charity',
    shortTitle: 'Shared storage (org)',
    category: 'Email & Workspace',
    icon: '🗄️',
    gradient: 'from-sky-700 to-cyan-800',
    description:
      'Move the charity’s files from a personal drive to a shared Team/Shared Drive or SharePoint, with a clear folder structure and the right permissions for the whole team.',
    keywords:
      'shared drive nonprofit, SharePoint charity, Google Shared Drive, team file permissions, charity recordkeeping, Free For Charity shared storage org',
    audience: 'Charity owners and admins organizing the team’s files',
    intro: [
      'The personal guide scans documents into your own drive. This guide moves them into **shared organizational storage** — a Google **Shared Drive** or Microsoft **SharePoint/OneDrive for Business** — so files belong to the charity, not a person.',
    ],
    estMinutes: 20,
    principle: {
      title: 'Files belong to the charity, not to a person’s account',
      body: 'A shared/Team drive means documents survive any one volunteer leaving, and access is granted by role. The charity’s records — formation papers, the IRS letter, finances — must never live only in an individual’s personal storage.',
    },
    steps: [
      {
        title: 'Create the shared drive',
        body: [
          'On Google, create a **Shared Drive**; on Microsoft, use the charity’s **SharePoint** site / Team files (created with the Microsoft 365 organization setup).',
        ],
      },
      {
        title: 'Build the folder structure',
        body: [
          'Mirror the personal guide’s structure at the org level: **Formation & IRS**, **Board**, **Finances**, **Brand/Logos**, **Website**. Move the documents you scanned personally into the shared drive.',
        ],
      },
      {
        title: 'Set permissions by role',
        body: [
          'Give each person access appropriate to their role (e.g. board members see Board and Finances; designers see Brand). Keep sensitive folders limited.',
        ],
        tip: 'Share a link from the shared drive rather than emailing copies, so there’s always one current version.',
      },
    ],
    faqs: [
      {
        q: 'Why not just keep everything in my personal Drive?',
        a: 'Because the charity’s records would then depend on your account. A shared/Team drive keeps documents owned by the organization, accessible by role, and safe when people come and go.',
      },
      {
        q: 'Where do the documents I already scanned go?',
        a: 'Move them from your personal drive into the matching folders in the shared drive (Formation & IRS, Board, Finances, Brand). From then on, scan straight into the shared drive.',
      },
    ],
    related: [
      'cloud-storage-scanning',
      'microsoft-365-organization',
      'google-workspace-organization',
    ],
  },
  {
    slug: 'candid-organization',
    track: 'organizational',
    counterpart: 'candid',
    title: 'Claim your charity’s Candid profile & seal',
    shortTitle: 'Candid profile (org)',
    category: 'Social Presence',
    icon: '🏅',
    gradient: 'from-teal-600 to-emerald-800',
    description:
      'Claim your organization’s Candid (GuideStar) profile and earn the transparency seal — Bronze through Platinum — so funders can trust and find you.',
    keywords:
      'Candid nonprofit profile, GuideStar seal, transparency seal bronze silver gold platinum, claim nonprofit profile, Free For Charity Candid org',
    audience: 'Charity owners and admins (after IRS recognition)',
    intro: [
      'Your personal Candid guide was for research. This is the **organization** side: claiming your charity’s own profile and earning the **transparency seal** that funders look for.',
    ],
    estMinutes: 25,
    principle: {
      title: 'Transparency you control becomes trust funders can see',
      body: 'Candid already lists your organization from public IRS data. Claiming the profile lets you tell your story and complete the fields that unlock the seal — the higher the seal, the more credible you look to grantmakers.',
    },
    steps: [
      {
        title: 'Claim the organization profile',
        body: [
          'Once recognized, go to **candid.org**, find your organization, and request to become its profile manager (Candid verifies you represent the charity).',
        ],
      },
      {
        title: 'Complete the profile for the seal',
        body: [
          'Fill in mission, programs, leadership, finances, and goals. Each section you complete raises your **transparency seal**: Bronze → Silver → Gold → Platinum.',
          'Aim for **Gold** as a practical target; many funders filter for it.',
        ],
      },
      {
        title: 'Keep it current',
        body: [
          'Update the profile yearly (after each Form 990) so the seal stays valid and the information funders see is accurate.',
        ],
      },
    ],
    phaseNote:
      'Claiming the profile and earning higher seals depends on 501(c)(3) recognition and filings (e.g. Form 990).',
    faqs: [
      {
        q: 'Is this the same account as my personal Candid login?',
        a: 'You sign in with your personal Candid account, then request to manage the organization’s profile. The profile and seal belong to the charity; the login is still you.',
      },
      {
        q: 'Which seal should we aim for?',
        a: 'Gold is a strong, achievable target that many funders look for. Platinum adds quantified results/metrics — pursue it once you have outcomes to report.',
      },
    ],
    related: ['candid', 'idealist-organization', 'taproot-organization'],
  },
  {
    slug: 'idealist-organization',
    track: 'organizational',
    counterpart: 'idealist',
    title: 'Post your charity’s opportunities on Idealist',
    shortTitle: 'Idealist listings (org)',
    category: 'Social Presence',
    icon: '🧭',
    gradient: 'from-amber-600 to-orange-700',
    description:
      'Register your charity on Idealist and post volunteer opportunities and jobs that attract the right people.',
    keywords:
      'Idealist organization account, post nonprofit volunteer opportunities, nonprofit job listings, recruit volunteers, Free For Charity Idealist org',
    audience: 'Charity owners and admins recruiting volunteers',
    intro: [
      'Having browsed Idealist as a volunteer (personal guide), now register the **organization** and post the opportunities you need filled.',
    ],
    estMinutes: 15,
    principle: {
      title: 'Recruit by being specific',
      body: 'The listings that work tell people exactly what they’ll do, the skills needed, the time commitment, and the impact. Vague asks get ignored; specific, mission-driven ones attract the right volunteers.',
    },
    steps: [
      {
        title: 'Register your organization',
        body: [
          'On **idealist.org**, create the organization’s profile and verify it represents the charity (you manage it from your personal account).',
        ],
      },
      {
        title: 'Post a clear opportunity',
        body: [
          'Write a listing with a specific role, the skills/time needed, location or remote, and the impact. Reuse the strong examples you saved as a volunteer.',
        ],
      },
      {
        title: 'Respond promptly',
        body: [
          'Reply to interested people quickly and have a simple next step (a short call or form). Responsiveness is what converts interest into committed volunteers.',
        ],
      },
    ],
    phaseNote:
      'An organization profile generally expects an established (often recognized) nonprofit.',
    faqs: [
      {
        q: 'How is this different from my personal Idealist account?',
        a: 'Personally you browse and learn the volunteer’s side. As an organization you register the charity and post opportunities — recruiting rather than searching.',
      },
      {
        q: 'What makes a listing succeed?',
        a: 'Specificity: a clear role, the skills and time required, and the concrete impact. Then respond quickly to anyone who reaches out.',
      },
    ],
    related: ['idealist', 'taproot-organization', 'candid-organization'],
  },
  {
    slug: 'taproot-organization',
    track: 'organizational',
    counterpart: 'taproot',
    title: 'Request pro-bono help on Taproot',
    shortTitle: 'Taproot requests (org)',
    category: 'Social Presence',
    icon: '🌳',
    gradient: 'from-lime-600 to-green-800',
    description:
      'Once you’re a 501(c)(3), register your charity on Taproot Plus and post well-scoped pro-bono projects to get skilled professionals donating expertise.',
    keywords:
      'Taproot Plus organization, request pro bono nonprofit, skills-based volunteering request, scope pro bono project, Free For Charity Taproot org',
    audience: 'Charity owners and admins (after 501(c)(3) recognition)',
    intro: [
      'You saw Taproot from the volunteer side in the personal guide. Now, **once your charity has its 501(c)(3)**, register the organization and **request** the skilled, pro-bono help you need.',
    ],
    estMinutes: 15,
    principle: {
      title: 'Clear scope attracts skilled volunteers',
      body: 'Pro-bono professionals choose projects that respect their time. A tightly scoped request — defined deliverable, timeline, and what you’ll provide — gets matched fast; a vague one sits unanswered.',
    },
    steps: [
      {
        title: 'Register your organization',
        body: [
          'Once recognized, create the charity’s account on **taprootplus.org** and confirm your 501(c)(3) status so you can post projects.',
        ],
      },
      {
        title: 'Scope a pro-bono project',
        body: [
          'Define one concrete project: the deliverable (e.g. a logo, a marketing plan), the timeline, the skills needed, and what your team will provide. Model it on the examples you saved as a volunteer.',
        ],
      },
      {
        title: 'Post and partner',
        body: [
          'Post the request, review interested professionals, and agree on clear checkpoints. Treat the volunteer as a partner — good experiences lead to repeat help.',
        ],
      },
    ],
    phaseNote: 'Requesting pro-bono support on Taproot Plus requires 501(c)(3) recognition.',
    faqs: [
      {
        q: 'When can my charity request pro-bono help?',
        a: 'Once you have 501(c)(3) recognition you can register the organization on Taproot Plus and post projects. Before that, use the personal guide to learn how scoping works.',
      },
      {
        q: 'Why does scope matter so much?',
        a: 'Skilled volunteers donate limited time and pick projects that are well-defined. A clear deliverable, timeline, and your own commitments make your request the easy one to say yes to.',
      },
    ],
    related: ['taproot', 'idealist-organization', 'candid-organization'],
  },
  {
    slug: 'lastpass-organization',
    track: 'organizational',
    counterpart: 'password-manager',
    title: 'Share credentials with your team using LastPass',
    shortTitle: 'LastPass for teams (org)',
    category: 'Tools',
    icon: '🔑',
    gradient: 'from-indigo-700 to-purple-800',
    description:
      'At the organizational phase, use LastPass to securely share the charity’s shared logins across the team — without anyone ever seeing or copying the raw passwords.',
    keywords:
      'LastPass teams nonprofit, shared credentials charity, password sharing organization, LastPass folders, Free For Charity LastPass org',
    audience: 'Charity owners and admins managing shared accounts (organizational phase)',
    intro: [
      'Personal password managers (the personal guide) secure your own logins. When the charity has **shared accounts** several people must use, LastPass adds **credential sharing** done safely.',
      'Most people won’t need this at first — it’s the **organizational-phase** tool for teams.',
    ],
    estMinutes: 20,
    principle: {
      title: 'Share access, not passwords',
      body: 'LastPass lets you share a login so a teammate can use it without seeing or copying the password — and you can revoke access the moment someone leaves. That’s far safer than emailing passwords or using one weak shared secret.',
    },
    steps: [
      {
        title: 'Set up the LastPass account & MFA',
        body: [
          'Each team member installs the **LastPass** browser extension and phone app and secures it with a strong master password plus an authenticator app (see the MFA guide).',
        ],
      },
      {
        title: 'Create shared folders',
        body: [
          'Make shared **folders** for the charity’s shared logins (e.g. social accounts, vendor portals) and add the credentials there.',
        ],
      },
      {
        title: 'Share by role and revoke on exit',
        body: [
          'Share each folder only with the people who need it, using **hide password** where possible so they can log in without seeing the secret. Remove access immediately when someone leaves.',
        ],
        tip: 'Pair this with the holistic personal setup: everyone still keeps their own phone-tied manager and MFA recovery codes.',
      },
    ],
    faqs: [
      {
        q: 'Do all volunteers need LastPass?',
        a: 'No. Most people are fine with the holistic personal setup (phone-tied manager plus their browser profile). LastPass is for the organizational phase when several people must share specific logins.',
      },
      {
        q: 'Can I share a login without revealing the password?',
        a: 'Yes — LastPass can share an item so the recipient can use it to sign in without seeing or copying the password, and you can revoke that access at any time.',
      },
    ],
    related: ['password-manager', 'multi-factor-authentication', 'microsoft-365-organization'],
  },
  {
    slug: 'instagram-organization',
    track: 'organizational',
    counterpart: 'instagram',
    title: 'Run your charity’s Instagram',
    shortTitle: 'Instagram (org)',
    category: 'Social Presence',
    icon: '📸',
    gradient: 'from-pink-700 to-rose-800',
    description:
      'Operate the charity’s Instagram through Meta Business Suite alongside the Facebook Page: post on a cadence, read insights, and turn on nonprofit fundraising tools.',
    keywords:
      'Instagram nonprofit management, Meta Business Suite Instagram, Instagram insights, Instagram fundraising tools, charity Instagram strategy, Free For Charity Instagram org',
    audience: 'Charity owners and the volunteer running the charity’s Instagram',
    estMinutes: 15,
    intro: [
      'You created the charity’s Professional Instagram account in the personal guide and linked it to the Facebook Page. This guide is about **running** it well — through the same Meta Business Suite you use for Facebook.',
    ],
    principle: {
      title: 'One Meta workspace for Facebook and Instagram',
      body: 'Because the accounts are linked, Meta Business Suite manages both the Facebook Page and Instagram together — one place to schedule posts, reply to messages, see insights, and run fundraising. Treat them as one coordinated, on-brand presence.',
    },
    steps: [
      {
        title: 'Manage Instagram in Meta Business Suite',
        body: [
          'Open **business.facebook.com**, confirm the Instagram account is connected to the charity’s Facebook Page, and use Business Suite to post, schedule, and reply across both.',
        ],
      },
      {
        title: 'Post on a steady cadence from your brand kit',
        body: [
          'Use the charity’s **Canva** templates (see the Canva guides) for on-brand posts and stories, and schedule a regular rhythm. Review **Insights** to see what resonates.',
        ],
      },
      {
        title: 'Turn on nonprofit fundraising tools',
        body: [
          'Once the charity is recognized, enable Meta’s **charitable/fundraising tools** so supporters can donate through Instagram and Facebook campaigns.',
        ],
      },
    ],
    phaseNote: 'Instagram/Meta fundraising tools require verified 501(c)(3) status.',
    faqs: [
      {
        q: 'Do I manage Instagram separately from Facebook?',
        a: 'No — once linked, both live in Meta Business Suite, so you schedule, reply, and analyze them together rather than juggling two apps.',
      },
      {
        q: 'Can supporters donate through Instagram?',
        a: 'Yes, once the charity is a verified 501(c)(3) you can enable Meta’s fundraising tools, which work across Instagram and Facebook.',
      },
    ],
    related: ['instagram', 'facebook-organization', 'canva-organization'],
  },
  {
    slug: 'techsoup',
    track: 'organizational',
    title: 'Get validated on TechSoup',
    shortTitle: 'TechSoup',
    category: 'Tools',
    icon: '🎟️',
    gradient: 'from-orange-600 to-red-700',
    description:
      'Register and get your charity “Validated” on TechSoup — the nonprofit-status validator that unlocks donated and deeply discounted software, most notably Intuit QuickBooks Online, Microsoft 365, and Adobe.',
    keywords:
      'TechSoup validation, nonprofit software discounts, QuickBooks Online nonprofit, Microsoft 365 nonprofit, Adobe nonprofit, donated software charity, Free For Charity TechSoup',
    audience: 'Charity owners and admins (after IRS recognition)',
    estMinutes: 25,
    intro: [
      'TechSoup is a **nonprofit-status validator**: it confirms your charity’s 501(c)(3) status once, on your behalf, and many software vendors trust that confirmation to grant you donated or discounted products.',
      'It’s the validator FFC recommends behind **Intuit QuickBooks Online** (your books), **Microsoft 365**, **Adobe**, and others. (A second validator, **Goodstack**, covers Canva and Google — see the Goodstack guide.)',
    ],
    principle: {
      title: 'Validate once, vendors trust it',
      body: 'Instead of proving your nonprofit status to every software company separately, you validate once on TechSoup. Vendors that partner with TechSoup (Intuit/QuickBooks, Microsoft, Adobe, Norton, and more) then accept that “Validated” status to confirm you qualify for nonprofit pricing. Get it done early — several of the charity’s tools depend on it.',
    },
    steps: [
      {
        title: 'Create the organization’s TechSoup account',
        body: [
          'Go to **techsoup.org**, register your organization, and start the verification. You sign in as a real person representing the charity, the same person-not-entity pattern as everywhere else.',
        ],
      },
      {
        title: 'Submit for validation',
        body: [
          'Provide the charity’s **EIN** and supporting documents — your **IRS determination letter** (scan it from your shared drive; see the cloud-storage guides). TechSoup independently confirms you’re a legitimate 501(c)(3), usually within a couple of business days.',
          'Note the difference TechSoup makes between **“Validated”** (your organization is legitimate) and **“Eligible”** (you meet a specific vendor’s rules, e.g. budget caps).',
        ],
      },
      {
        title: 'Claim your software',
        body: [
          'Once “Validated”, claim products through TechSoup. The headline offers for FFC charities are **QuickBooks Online** (a core benefit — see the QuickBooks guide) and **Microsoft 365**, plus **Adobe Creative Cloud/Acrobat** and **Norton** security.',
          'For **Canva** and **Google for Nonprofits**, use the other validator, **Goodstack** (see that guide) — different vendors trust different validators.',
        ],
        tip: 'Keep your TechSoup validation handy — many vendor nonprofit programs ask for it to confirm eligibility.',
      },
    ],
    phaseNote:
      'TechSoup validation requires IRS 501(c)(3) recognition (EIN + determination letter).',
    faqs: [
      {
        q: 'What software does TechSoup unlock?',
        a: 'The most popular offers are Intuit QuickBooks Online (steep nonprofit pricing), Microsoft 365, Adobe Creative Cloud/Acrobat, and Norton security — plus discounted hardware. TechSoup confirms your 501(c)(3) status to these vendors so you get nonprofit rates.',
      },
      {
        q: 'Is TechSoup the only validator I need?',
        a: 'No. TechSoup covers QuickBooks, Microsoft, and Adobe; a second validator, Goodstack, covers Canva, Google for Nonprofits, and others. FFC charities typically register with both — see the Goodstack guide.',
      },
      {
        q: 'How long does validation take?',
        a: 'Usually a couple of business days while TechSoup independently confirms your legal status. Have your EIN and IRS determination letter ready (scanned in your shared drive) to avoid delays.',
      },
    ],
    related: ['goodstack', 'quickbooks-online', 'microsoft-365-organization'],
  },
  {
    slug: 'goodstack',
    track: 'organizational',
    title: 'Get verified with Goodstack',
    shortTitle: 'Goodstack',
    category: 'Tools',
    icon: '🪪',
    gradient: 'from-emerald-600 to-teal-700',
    description:
      'Register with Goodstack (formerly Percent) — the nonprofit-status validator that Canva, Google for Nonprofits, and many other tools use to confirm your charity qualifies for free or discounted access.',
    keywords:
      'Goodstack verification, Percent nonprofit, Canva for Nonprofits validation, Google for Nonprofits Goodstack, nonprofit software discounts, Free For Charity Goodstack',
    audience: 'Charity owners and admins (after IRS recognition)',
    estMinutes: 20,
    intro: [
      'Goodstack (formerly **Percent**) is the **other major nonprofit-status validator** alongside TechSoup. It checks your organization’s legal and charitable status, and partner vendors trust that check to grant you nonprofit access.',
      'It’s the validator FFC recommends behind **Canva** and **Google for Nonprofits** — and many others, including Asana, Atlassian, Eventbrite, monday.com, OpenAI (ChatGPT), and Zoom.',
    ],
    principle: {
      title: 'A second validator for a different set of vendors',
      body: 'Vendors don’t all use the same verifier. TechSoup covers QuickBooks, Microsoft, and Adobe; Goodstack covers Canva, Google, and a long list of SaaS tools. Registering with both means whichever validator a vendor uses, your charity is already verified.',
    },
    steps: [
      {
        title: 'Start verification with Goodstack',
        body: [
          'When you apply to a partner program — e.g. **Canva for Nonprofits** or **Google for Nonprofits** — you’ll be routed to **Goodstack** to verify. You can also begin directly at **goodstack.io**.',
          'You sign in as a real person representing the charity, the same person-not-entity pattern as everywhere else.',
        ],
      },
      {
        title: 'Provide your charity’s details',
        body: [
          'Supply the charity’s legal name, **EIN**, and supporting documents (your **IRS determination letter** from the shared drive). Goodstack runs due-diligence checks to confirm you’re a legally registered, active nonprofit.',
        ],
      },
      {
        title: 'Use it to unlock partner tools',
        body: [
          'Once verified, claim the offers: **Canva** Pro free for nonprofits (see the Canva organization guide) and **Google for Nonprofits** / Google Workspace (see that guide), plus any other Goodstack partners your charity uses.',
        ],
        tip: 'Between TechSoup and Goodstack you’ll cover almost every nonprofit software offer FFC recommends.',
      },
    ],
    phaseNote:
      'Goodstack verification requires recognized nonprofit (501(c)(3)) status (EIN + determination letter).',
    faqs: [
      {
        q: 'How is Goodstack different from TechSoup?',
        a: 'They’re both nonprofit-status validators, but different vendors trust different ones. Goodstack verifies for Canva, Google for Nonprofits, Asana, Atlassian, Eventbrite, monday.com, OpenAI, Zoom and more; TechSoup verifies for QuickBooks, Microsoft, and Adobe. FFC charities register with both.',
      },
      {
        q: 'Is this the same as Percent?',
        a: 'Yes — Percent rebranded to Goodstack. If you see “Percent” referenced by an older vendor page, it’s the same verification service.',
      },
      {
        q: 'Do I have to go to Goodstack first?',
        a: 'Usually you don’t — when you apply to a partner like Canva or Google for Nonprofits, they route you into Goodstack’s verification automatically. You can also start directly at goodstack.io.',
      },
    ],
    related: ['techsoup', 'canva-organization', 'google-workspace-organization'],
  },
  {
    slug: 'quickbooks-online',
    track: 'organizational',
    title: 'Set up QuickBooks Online for your charity',
    shortTitle: 'QuickBooks Online',
    category: 'Tools',
    icon: '📒',
    gradient: 'from-green-700 to-emerald-800',
    description:
      'Get QuickBooks Online through TechSoup and set it up for nonprofit bookkeeping — a clean chart of accounts, fund tracking, and a connected bank feed so your books are audit-ready.',
    keywords:
      'QuickBooks Online nonprofit, nonprofit bookkeeping, fund accounting, QuickBooks TechSoup, chart of accounts charity, Free For Charity QuickBooks',
    audience: 'Charity owners and treasurers/admins (after IRS recognition)',
    estMinutes: 30,
    intro: [
      'QuickBooks Online is the charity’s **bookkeeping** home — and a primary benefit you get **through TechSoup** at the nonprofit rate.',
      'Clean books from day one make your Form 990, board reporting, and Candid profile far easier later.',
    ],
    principle: {
      title: 'Clean books from day one',
      body: 'Set QuickBooks up for nonprofit accounting from the start — a sensible chart of accounts and fund/class tracking — so income and restricted funds are recorded correctly. Fixing messy books later is far harder than starting clean.',
    },
    steps: [
      {
        title: 'Claim QuickBooks Online via TechSoup',
        body: [
          'Get the nonprofit offer through **TechSoup** (see the TechSoup guide) rather than paying retail. Create the company using the charity’s name and email.',
        ],
      },
      {
        title: 'Configure it for a nonprofit',
        body: [
          'In settings, choose the **Nonprofit** profile so terminology and reports fit (donors, funds, statements). Set up a simple **chart of accounts** and use **classes/projects** to track restricted funds and programs.',
        ],
      },
      {
        title: 'Connect the bank and secure access',
        body: [
          'Connect the charity’s bank/credit accounts for an automatic transaction feed, and protect the QuickBooks login with **MFA** (see the MFA guide). Give each person the least access they need.',
        ],
        tip: 'Store statements and receipts in the charity’s shared drive (see the cloud-storage guides) so bookkeeping records are backed up and shareable.',
      },
    ],
    phaseNote:
      'The nonprofit QuickBooks Online offer comes through TechSoup, which requires 501(c)(3) status.',
    faqs: [
      {
        q: 'How do I get the nonprofit price?',
        a: 'Through TechSoup — QuickBooks Online is one of its primary benefits. Validate on TechSoup first (see that guide), then claim QuickBooks at the nonprofit rate instead of paying retail.',
      },
      {
        q: 'Why QuickBooks Online instead of the desktop version?',
        a: 'Online means your books are accessible to your treasurer and FFC from anywhere, backed up automatically, and easy to grant least-privilege access to — no single computer holds the only copy.',
      },
    ],
    related: ['techsoup', 'microsoft-365-organization', 'cloud-storage-organization'],
  },
  {
    slug: 'microsoft-clarity',
    track: 'organizational',
    title: 'Set up Microsoft Clarity (free website heatmaps)',
    shortTitle: 'Microsoft Clarity',
    category: 'Tools',
    icon: '🔎',
    gradient: 'from-sky-600 to-indigo-700',
    description:
      'Add Microsoft Clarity — a free, no-limits analytics tool — to the charity’s site to see heatmaps and session recordings of how visitors actually use it. Pairs with Google Analytics.',
    keywords:
      'Microsoft Clarity setup, website heatmaps, session recordings, free website analytics, nonprofit website analytics, Free For Charity Clarity',
    audience: 'Charity owners and the volunteer maintaining the website',
    estMinutes: 15,
    intro: [
      'Microsoft Clarity is **free for everyone** (no nonprofit gate, no traffic limits) and shows **heatmaps** and **session recordings** — where people click, scroll, and get stuck on the charity’s site.',
      'It answers “**how** are people using the site,” complementing Google Analytics, which answers “**how many** and from where.”',
    ],
    principle: {
      title: 'See what visitors actually do',
      body: 'Clarity records anonymized sessions and aggregates them into heatmaps, so you can see real behavior — the donate button no one finds, the page everyone abandons — and fix it. It’s free and lightweight, so there’s no reason not to run it.',
    },
    steps: [
      {
        title: 'Create a Clarity project',
        body: [
          'Go to **clarity.microsoft.com**, sign in with the charity’s **Microsoft account**, and create a project for the website (enter the site name and URL).',
        ],
      },
      {
        title: 'Add the tracking code to the site',
        body: [
          'Clarity gives you a small tracking snippet. Add it to the charity’s site — FFC can install it for you, or follow the prompt if your site supports a direct integration.',
        ],
      },
      {
        title: 'Read heatmaps and recordings',
        body: [
          'After traffic comes in, review **heatmaps** and a few **session recordings** to spot friction, then make small improvements and watch the effect.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is Microsoft Clarity really free?',
        a: 'Yes — Clarity is completely free with no traffic limits, for any organization. There’s no nonprofit application needed.',
      },
      {
        q: 'How is Clarity different from Google Analytics?',
        a: 'They’re complementary. Clarity shows behavior (heatmaps, recordings — the “how”); Google Analytics shows traffic and sources (the “how many” and “where from”). Run both for the full picture.',
      },
    ],
    related: ['google-analytics', 'microsoft-365-organization'],
  },
  {
    slug: 'google-analytics',
    track: 'organizational',
    title: 'Set up Google Analytics (GA4) for your charity site',
    shortTitle: 'Google Analytics (GA4)',
    category: 'Tools',
    icon: '📈',
    gradient: 'from-amber-600 to-orange-700',
    description:
      'Create a free Google Analytics 4 property and connect it to the charity’s website so you can measure visitors, traffic sources, and the actions that matter — the foundation of impact reporting.',
    keywords:
      'Google Analytics GA4 setup, nonprofit website analytics, measurement ID, key events, impact reporting, Free For Charity Google Analytics',
    audience: 'Charity owners and the volunteer maintaining the website',
    estMinutes: 20,
    intro: [
      'Google Analytics 4 (GA4) is the **free** standard for measuring website traffic — how many people visit, where they come from, and what they do.',
      'It’s the foundation for the **impact reporting** behind FFC’s Data & Analytics work, and pairs with Microsoft Clarity’s behavior view.',
    ],
    principle: {
      title: 'Measure what matters',
      body: 'Set up GA4 to track the actions that show impact — donations, sign-ups, contact clicks — not just raw page views. Clear, free measurement turns the charity’s website into evidence you can show funders.',
    },
    steps: [
      {
        title: 'Create a GA4 property',
        body: [
          'Go to **analytics.google.com**, sign in with the charity’s **Google account**, and create an **Account** and a **GA4 property** for the website. Copy the **Measurement ID** (starts with G-).',
        ],
      },
      {
        title: 'Connect it to the site',
        body: [
          'Add the Measurement ID to the charity’s website so GA4 starts collecting data — FFC can wire this in for you. Use Google’s **Realtime** report to confirm it’s working.',
        ],
      },
      {
        title: 'Define key events and read reports',
        body: [
          'Mark the actions that matter (e.g. donate, contact, volunteer sign-up) as **key events**, then check the **Reports** for traffic, sources, and those events over time.',
        ],
        tip: 'Pair GA4 (how many / where from) with Microsoft Clarity (how they behave) for the full picture of your site.',
      },
    ],
    faqs: [
      {
        q: 'Is Google Analytics free?',
        a: 'Yes — GA4 is free for the vast majority of nonprofit sites. (Separately, Google for Nonprofits offers the Ad Grant, which does require 501(c)(3) status, but GA4 itself doesn’t.)',
      },
      {
        q: 'GA4 or Microsoft Clarity — which do I need?',
        a: 'Both. GA4 measures traffic and conversions; Clarity shows on-page behavior via heatmaps and recordings. They answer different questions, so FFC sites typically run both.',
      },
    ],
    related: ['microsoft-clarity', 'google-workspace-organization'],
  },
]

export function getSetupGuide(slug: string): SetupGuide | undefined {
  return SETUP_GUIDES.find((g) => g.slug === slug)
}

/** Guides on the individual/personal track (default when `track` is unset). */
export const PERSONAL_GUIDES = SETUP_GUIDES.filter((g) => g.track !== 'organizational')

/** Guides on the charity/organizational track. */
export const ORGANIZATIONAL_GUIDES = SETUP_GUIDES.filter((g) => g.track === 'organizational')
