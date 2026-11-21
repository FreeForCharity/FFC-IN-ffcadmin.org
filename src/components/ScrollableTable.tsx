'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ScrollableTableProps {
  /** Names the scroll area for screen readers, e.g. "Tier 1 sites". */
  label: string
  className?: string
  children: React.ReactNode
}

/**
 * A table that scrolls sideways on narrow screens instead of widening the
 * page (Modern Web Guidance: ui-components/responsive-table).
 *
 * Only while the table is wider than its box does the wrapper become a
 * labelled region in the tab order, so a keyboard user can reach it and
 * scroll it with the arrow keys. A table that fits adds no tab stop and no
 * landmark.
 */
export default function ScrollableTable({ label, className = '', children }: ScrollableTableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setOverflowing(element.scrollWidth > element.clientWidth + 1)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    const table = element.firstElementChild
    if (table) observer.observe(table)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      role={overflowing ? 'region' : undefined}
      aria-label={overflowing ? label : undefined}
      tabIndex={overflowing ? 0 : undefined}
      // relative: visually hidden (sr-only) text in the table is absolutely
      // positioned; without a positioned box here it escapes the scroll area
      // and widens the whole page.
      className={`relative overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}
    >
      {children}
    </div>
  )
}
