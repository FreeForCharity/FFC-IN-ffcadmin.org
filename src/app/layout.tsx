import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import BackToTop from '@/components/BackToTop'
import SisterSiteBanner from '@/components/SisterSiteBanner'
import { assetPath } from '@/lib/assetPath'

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
          Google Consent Mode v2 regional defaults. This MUST render before the GTM
          snippet below, and it is a plain inline <script> rather than next/script
          on purpose: next/script "beforeInteractive" is still injected by the
          runtime, whereas a raw inline tag is executed by the parser at exactly
          this position. GTM reads the consent state present when it initialises,
          so "before" here is a correctness requirement, not a preference.

          Without this block GTM loaded with no consent state at all, which Google
          treats as unrestricted: every tag in the container fired on first paint,
          before the banner was even shown. The banner's later consent_update then
          arrived after the tracking it was supposed to authorise had already
          happened — the site behaved as though consent were granted while telling
          the visitor it was being asked for.

          ONE `consent default` call, unscoped: analytics and advertising storage
          is DENIED for every visitor, worldwide, until they accept. Google's tags
          still load and send cookieless pings in that state, so aggregate
          measurement continues while nothing is stored on the device.

          This used to emit TWO calls — a denial scoped to a 32-code `region`
          array, then an unscoped GRANT for everyone else. Google's EU User
          Consent Policy only *requires* opt-in for those regions, but applying
          the weaker default everywhere else was a decision made on the charity's
          behalf: most of its visitors would get less protection than its
          European ones. Both the region array and the grant are gone, so there
          is no country in which measurement begins before the visitor agrees,
          and nothing depends on Google resolving a location from an IP address.

          functionality_storage and security_storage stay GRANTED: neither
          carries measurement, and a site that cannot remember a consent choice
          cannot honour one. That is why this says "analytics and advertising
          storage", not "storage".

          wait_for_update gives the stored-preference restore a window to apply a
          returning visitor's choice before tags evaluate. Its purpose inverted
          with the default and still holds: it used to stop a returning DECLINER
          being measured under the permissive default, and now stops a returning
          GRANTER's opening hit going out cookieless.
          url_passthrough keeps click ids flowing through navigation while cookies
          are denied, and ads_data_redaction strips ad identifiers from tag
          requests while ad_storage is denied — both are no-ops once consent is
          granted. Note what url_passthrough does and does not carry: a click id
          ALREADY in the visitor's URL travels between pages of this site, which
          is why the policy wording is "no identifiers from your device" rather
          than the flatter, false "no identifiers".
        */}
        <script
          id="consent-mode-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
              gtag('set', 'url_passthrough', true);
              gtag('set', 'ads_data_redaction', true);
            `,
          }}
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
