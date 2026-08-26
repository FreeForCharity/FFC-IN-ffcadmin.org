import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import BackToTop from '@/components/BackToTop'
import SisterSiteBanner from '@/components/SisterSiteBanner'
import { assetPath } from '@/lib/assetPath'
import { CONSENT_MODE_BOOTSTRAP } from '@/lib/consent-mode'

const SITE_URL = 'https://ffcadmin.org'

export const metadata: Metadata = {
  title: {
    default: 'Free For Charity Admin | Volunteer & Admin Training Hub',
    template: '%s | Free For Charity Admin',
  },
  description:
    'Volunteer training hub for Free For Charity. Complete Microsoft 365 Administrator or Canva Designer certification paths, learn our tech stack, and join the contributor ladder to build free websites for nonprofits.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  keywords: [
    'nonprofit volunteer',
    'volunteer web development',
    'free nonprofit website',
    'IT volunteer program',
    'open source charity',
    'Microsoft 365 admin training',
    'Canva designer nonprofit',
    'nonprofit technology volunteer',
    '501c3 free website',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Free For Charity Admin',
    title: 'Free For Charity Admin | Volunteer & Admin Training Hub',
    description:
      'Training hub for Free For Charity volunteers. Explore Microsoft 365 Administrator and Canva Designer certification paths while helping nonprofits.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free For Charity Admin | Volunteer & Admin Training Hub',
    description:
      'Training hub for Free For Charity volunteers. Explore Microsoft 365 Administrator and Canva Designer certification paths while helping nonprofits.',
  },
  icons: {
    icon: assetPath('/Svgs/ffc-logo.svg'),
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Consent Mode v2 defaults. This MUST render before the GTM snippet below,
          and it is a plain inline <script> rather than next/script on purpose:
          next/script "beforeInteractive" is still injected by the runtime, whereas
          a raw inline tag is executed by the parser at exactly this position. GTM
          reads the consent state present when it initialises, so "before" here is a
          correctness requirement, not a preference.

          Without this block GTM loaded with no consent state at all, which Google
          treats as unrestricted: every tag in the container fired on first paint,
          before the banner was even shown. The banner's later consent_update then
          arrived after the tracking it was supposed to authorise had already
          happened — the site behaved as though consent were granted while telling
          the visitor it was being asked for.

          The state itself is REGION-SCOPED rather than denied worldwide, and the
          bootstrap now lives in @/lib/consent-mode so it stays identical to
          FFC-IN-freeforcharity.org. Both sites report to one GA4 property
          (386764754) as of GTM-WMZH965Q version 4, and one property fed by two
          different consent policies fragments the very cross-site journeys the
          consolidation exists to measure. See that module for the full rationale,
          including why Microsoft Clarity is gated container-side instead of here.

          wait_for_update gives the stored-preference restore a window to grant
          before tags evaluate, so a returning visitor who already accepted is not
          measured as a new denial.
        */}
        <script
          id="consent-mode-default"
          dangerouslySetInnerHTML={{ __html: CONSENT_MODE_BOOTSTRAP }}
        />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WMZH965Q');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Free For Charity',
              url: 'https://ffcadmin.org',
              logo: `${SITE_URL}${assetPath('/Images/hero-logo.png')}`,
              description:
                'Free For Charity trains volunteers through Microsoft 365 Administrator and Canva Designer certification paths to build and manage free websites for 501(c)(3) nonprofits.',
              foundingDate: '2013',
              areaServed: 'US',
              nonprofitStatus: '501c3',
              knowsAbout: [
                'Microsoft 365 Administration',
                'GitHub Repository Management',
                'Next.js Static Site Development',
                'Canva Graphic Design',
                'Nonprofit Technology',
                'Website Accessibility',
              ],
              parentOrganization: {
                '@type': 'NGO',
                name: 'Free For Charity',
                url: 'https://freeforcharity.org',
                taxID: '46-2471893',
              },
              sameAs: [
                'https://github.com/FreeForCharity',
                'https://facebook.com/FreeForCharity',
                'https://linkedin.com/company/freeforcharity',
                'https://youtube.com/@FreeForCharity',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Free For Charity Admin',
              url: 'https://ffcadmin.org',
              // Lets Google offer a sitelinks search box that deep-links into
              // the on-site /search results page (#543).
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://ffcadmin.org/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WMZH965Q"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SisterSiteBanner />
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  )
}
