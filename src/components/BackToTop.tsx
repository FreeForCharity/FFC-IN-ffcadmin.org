'use client'

import { useScrolledPast } from '@/hooks/useScrolledPast'

// The button appears once the page has scrolled this far.
const SHOW_AFTER = 400

export default function BackToTop() {
  // An IntersectionObserver sentinel instead of a scroll listener (Modern Web
  // Guidance: ui-behaviors/scroll-position-aware-elements).
  const { sentinelRef, scrolledPast: isVisible } = useScrolledPast(SHOW_AFTER)

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  return (
    <>
      {/* Sits at the top of the page and leaves the viewport after SHOW_AFTER px.
          It is absolutely positioned against the document, so keep this
          component outside any positioned wrapper (and <body> unpositioned),
          or the threshold moves with that wrapper. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-px"
        style={{ height: SHOW_AFTER }}
      />
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  )
}
