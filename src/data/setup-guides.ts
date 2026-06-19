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
  intro: string[]
  /** The person-vs-entity (or other key) principle callout. */
  principle?: { title: string; body: string }
  steps: SetupStep[]
  /** Optional "what to do when you get a new phone" block. */
  newPhone?: string[]
  faqs?: SetupFaq[]
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
    related: ['linkedin', 'multi-factor-authentication', 'canva'],
  },
  {
    slug: 'microsoft-365-email',
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
        a: 'Contact your FFC contact (text Clarke Moyer at (520) 222-8104). FFC creates the mailbox and issues the first password; you can’t sign in until that’s provisioned.',
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
        a: 'That’s exactly the signal this step is designed to catch. Contact FFC (text Clarke Moyer at (520) 222-8104) — your machine may need an update or a different device before the later AI-tool connectors will work.',
      },
    ],
    related: ['microsoft-365-email', 'multi-factor-authentication'],
  },
  {
    slug: 'cloud-storage-scanning',
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
]

export function getSetupGuide(slug: string): SetupGuide | undefined {
  return SETUP_GUIDES.find((g) => g.slug === slug)
}
