import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free For Charity Admin',
  description: 'Administrative portal for Free For Charity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
