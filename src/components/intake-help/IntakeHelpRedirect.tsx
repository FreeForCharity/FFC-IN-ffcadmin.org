'use client'

import { useEffect } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import { SUPPORT_LINE } from '@/data/charity-messaging'

interface IntakeHelpRedirectProps {
  title: string
  target: string
}

/**
 * Body of every retired /intake-help/ URL. GitHub Pages cannot send a 301, so
 * the page combines a meta refresh (works without JavaScript; React hoists it
 * into <head>), a client-side location.replace, and a visible link. The page
 * metadata sets noindex and a canonical pointing at the new URL.
 */
export default function IntakeHelpRedirect({ title, target }: IntakeHelpRedirectProps) {
  useEffect(() => {
    window.location.replace(target)
  }, [target])

  return (
    <div className="min-h-screen bg-gray-50">
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title }]} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">This help page has moved</h1>
        <p className="mt-4 text-lg text-gray-700">
          Application help now lives on freeforcharity.org, next to the application itself.
          Redirecting you to <strong>{title}</strong>…
        </p>
        <p className="mt-6">
          <a
            href={target}
            className="inline-block rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
          >
            Go to the new page
          </a>
        </p>
        <p className="mt-8 text-sm text-gray-600">{SUPPORT_LINE}</p>
      </main>
    </div>
  )
}
