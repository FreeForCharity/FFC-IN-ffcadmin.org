import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import BackToTop from '@/components/BackToTop'
import { assetPath } from '@/lib/assetPath'

const SITE_URL = 'https://ffcadmin.org'

export const metadata: Metadata = {
  title: {
    default: 'Free For Charity Admin | Volunteer & Admin Training Hub',
    template: '%s | Free For Charity Admin',
  },
  description:
    'Volunteer training hub for Free For Charity. Complete Global Administrator or Canva Designer certification paths, learn our tech stack, and join the contributor ladder to build free websites for nonprofits.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
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
      'Training hub for Free For Charity volunteers. Explore Global Administrator and Canva Designer certification paths while helping nonprofits.',
  },
  twitter: {
    card: 'summary',
    title: 'Free For Charity Admin | Volunteer & Admin Training Hub',
    description:
      'Training hub for Free For Charity volunteers. Explore Global Administrator and Canva Designer certification paths while helping nonprofits.',
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
                'Free For Charity trains volunteers through Global Administrator and Canva Designer certification paths to build and manage free websites for 501(c)(3) nonprofits.',
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
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieConsent />
        <BackToTop />
      </body>
    </html>
  )
}
