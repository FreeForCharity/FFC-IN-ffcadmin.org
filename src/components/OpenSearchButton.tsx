'use client'

import { openGlobalSearch } from './GlobalSearch'

/**
 * A styled trigger for the global search modal, usable from server components
 * (e.g. the 404 page). The modal itself is rendered once inside Navigation.
 */
export default function OpenSearchButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={openGlobalSearch}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {children}
    </button>
  )
}
