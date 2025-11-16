import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'

export const metadata: Metadata = {
  title: 'Free For Charity Admin',
  description: 'Administrative portal for Free For Charity',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}
