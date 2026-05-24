'use client'

import { useSyncExternalStore, useState } from 'react'

const DISMISS_KEY = 'ffc-sister-site-banner-dismissed-v1'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getDismissedFromStorage(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    // localStorage unavailable (private mode); show the banner so the
    // wrong-audience signpost still reaches the visitor.
    return false
  }
}

/**
 * Top-of-page banner that routes wrong-audience visitors (charities
 * looking for a free site, donors looking to give) to freeforcharity.org.
 *
 * Dismissible — once dismissed, localStorage holds the choice across
 * visits and across tabs (via the `storage` event). Rendered above
 * Navigation in the root layout. Returns null during SSR so the page
 * does not flash the banner before localStorage is read.
 */
export default function SisterSiteBanner() {
  const dismissedFromStorage = useSyncExternalStore(
    subscribe,
    getDismissedFromStorage,
    () => true // server snapshot — hide during SSR / static pre-render
  )
  const [locallyDismissed, setLocallyDismissed] = useState(false)
  const isVisible = !dismissedFromStorage && !locallyDismissed

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Ignored — dismissal will not persist across visits.
    }
    setLocallyDismissed(true)
  }

  if (!isVisible) return null

  return (
    <div
      role="region"
      aria-label="Sister site routing"
      className="bg-amber-50 border-b border-amber-200 text-amber-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <p>
          <strong>Looking for a free FFC site or want to donate?</strong> This site is for
          volunteers and admins.{' '}
          <a
            href="https://freeforcharity.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:no-underline"
          >
            Visit freeforcharity.org →
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="self-end sm:self-auto inline-flex items-center text-amber-900/80 hover:text-amber-900 text-xs px-2 py-1 rounded hover:bg-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
          aria-label="Dismiss this notice"
        >
          Dismiss
          <svg
            className="ml-1 w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
