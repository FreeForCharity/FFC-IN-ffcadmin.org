'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { assetPath } from '@/lib/assetPath'
import { guides } from '@/data/guides'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGuidesOpen, setIsGuidesOpen] = useState(false)
  const [isMobileGuidesOpen, setIsMobileGuidesOpen] = useState(false)
  const guidesRef = useRef<HTMLDivElement>(null)
  const guidesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname() ?? ''

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === ''
    return pathname === href || pathname.startsWith(href + '/')
  }

  const linkClass = (href: string) =>
    isActive(href)
      ? 'text-blue-600 font-bold hover:text-blue-800 transition-colors'
      : 'font-medium hover:text-blue-600 transition-colors'

  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? 'block px-3 py-2 rounded-md text-blue-600 font-bold bg-blue-50'
      : 'block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors'

  const handleGuidesMouseEnter = useCallback(() => {
    if (guidesTimeoutRef.current) clearTimeout(guidesTimeoutRef.current)
    setIsGuidesOpen(true)
  }, [])

  const handleGuidesMouseLeave = useCallback(() => {
    guidesTimeoutRef.current = setTimeout(() => setIsGuidesOpen(false), 150)
  }, [])

  useEffect(() => {
    return () => {
      if (guidesTimeoutRef.current) clearTimeout(guidesTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGuidesOpen) setIsGuidesOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isGuidesOpen])

  // Close Guides dropdowns on route change to avoid stale open state
  useEffect(() => {
    const handler = () => {
      setIsGuidesOpen(false)
      setIsMobileGuidesOpen(false)
    }
    // Use popstate-like pattern: subscribe to the current pathname
    // and reset dropdown states asynchronously via microtask
    queueMicrotask(handler)
    return () => {
      if (guidesTimeoutRef.current) {
        clearTimeout(guidesTimeoutRef.current)
        guidesTimeoutRef.current = null
      }
    }
  }, [pathname])

  // Close desktop Guides dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isGuidesOpen && guidesRef.current && !guidesRef.current.contains(e.target as Node)) {
        setIsGuidesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isGuidesOpen])

  return (
    <nav className="bg-white text-gray-700 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={assetPath('/Images/hero-logo.png')}
              alt="Free For Charity Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="hidden lg:block border-l border-gray-200 pl-3">
              <div className="text-lg font-bold text-gray-900 leading-tight">Admin Portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-5">
            <Link href="/" className={linkClass('/')}>
              Home
            </Link>
            <Link
              href="/get-involved"
              className={`${linkClass('/get-involved')} whitespace-nowrap`}
            >
              Get Involved
            </Link>
            <Link href="/tech-stack" className={linkClass('/tech-stack')}>
              Tech Stack
            </Link>
            <Link href="/contributor-ladder" className={linkClass('/contributor-ladder')}>
              Contributor Ladder
            </Link>
            <Link
              href="/training-plan"
              className={`${linkClass('/training-plan')} whitespace-nowrap`}
            >
              Global Admin
            </Link>
            <Link
              href="/canva-designer-path"
              className={`${linkClass('/canva-designer-path')} whitespace-nowrap`}
            >
              Canva Designer
            </Link>
            <Link href="/documentation" className={linkClass('/documentation')}>
              Documentation
            </Link>

            {/* Guides Mega Menu */}
            <div
              ref={guidesRef}
              className="relative"
              onMouseEnter={handleGuidesMouseEnter}
              onMouseLeave={handleGuidesMouseLeave}
            >
              <button
                type="button"
                className={`${isActive('/guides') ? 'text-blue-600 font-bold' : 'font-medium'} hover:text-blue-600 transition-colors inline-flex items-center whitespace-nowrap`}
                aria-expanded={isGuidesOpen}
                aria-haspopup="true"
                aria-controls="guides-dropdown-menu"
                onClick={() => setIsGuidesOpen(!isGuidesOpen)}
              >
                Guides
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${isGuidesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isGuidesOpen && (
                <div
                  id="guides-dropdown-menu"
                  role="menu"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  {guides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      role="menuitem"
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsGuidesOpen(false)}
                    >
                      <p className="text-sm font-semibold text-gray-900">{guide.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{guide.description}</p>
                    </Link>
                  ))}
                  <div role="separator" className="border-t border-gray-100 mt-1 pt-1" />
                  <Link
                    href="/guides"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                    onClick={() => setIsGuidesOpen(false)}
                  >
                    View All Guides &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link href="/testing" className={linkClass('/testing')}>
              Testing
            </Link>
            <Link href="/sites-list" className={`${linkClass('/sites-list')} whitespace-nowrap`}>
              Sites List
            </Link>
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://freeforcharity.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-medium text-teal-600 hover:text-teal-800 transition-colors whitespace-nowrap"
            >
              freeforcharity.org
              <svg
                className="ml-1 w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => {
              const willClose = isMenuOpen
              setIsMenuOpen(!isMenuOpen)
              if (willClose) setIsMobileGuidesOpen(false)
            }}
            className="xl:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            className="xl:hidden pb-4 space-y-1 bg-white border-t border-gray-100"
            id="mobile-menu"
          >
            <Link href="/" className={mobileLinkClass('/')} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/get-involved"
              className={mobileLinkClass('/get-involved')}
              onClick={() => setIsMenuOpen(false)}
            >
              Get Involved
            </Link>
            <Link
              href="/tech-stack"
              className={mobileLinkClass('/tech-stack')}
              onClick={() => setIsMenuOpen(false)}
            >
              Tech Stack
            </Link>
            <Link
              href="/contributor-ladder"
              className={mobileLinkClass('/contributor-ladder')}
              onClick={() => setIsMenuOpen(false)}
            >
              Contributor Ladder
            </Link>
            <Link
              href="/training-plan"
              className={mobileLinkClass('/training-plan')}
              onClick={() => setIsMenuOpen(false)}
            >
              Global Admin
            </Link>
            <Link
              href="/canva-designer-path"
              className={mobileLinkClass('/canva-designer-path')}
              onClick={() => setIsMenuOpen(false)}
            >
              Canva Designer
            </Link>
            <Link
              href="/documentation"
              className={mobileLinkClass('/documentation')}
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>

            {/* Mobile Guides Collapsible */}
            <div>
              <button
                type="button"
                className={`${isActive('/guides') ? 'text-blue-600 font-bold bg-blue-50' : 'hover:bg-gray-50 hover:text-blue-600'} w-full text-left px-3 py-2 rounded-md transition-colors inline-flex items-center justify-between`}
                onClick={() => setIsMobileGuidesOpen(!isMobileGuidesOpen)}
                aria-expanded={isMobileGuidesOpen}
                aria-controls="mobile-guides-panel"
              >
                Guides
                <svg
                  className={`h-4 w-4 transition-transform ${isMobileGuidesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isMobileGuidesOpen && (
                <div
                  id="mobile-guides-panel"
                  className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2"
                >
                  {guides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => {
                        setIsMobileGuidesOpen(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      {guide.title}
                    </Link>
                  ))}
                  <Link
                    href="/guides"
                    className="block px-3 py-2 rounded-md text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setIsMobileGuidesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    View All Guides &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/testing"
              className={mobileLinkClass('/testing')}
              onClick={() => setIsMenuOpen(false)}
            >
              Testing
            </Link>
            <Link
              href="/sites-list"
              className={mobileLinkClass('/sites-list')}
              onClick={() => setIsMenuOpen(false)}
            >
              Sites List
            </Link>
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
            <a
              href="https://freeforcharity.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-teal-600 font-medium hover:bg-teal-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              freeforcharity.org
              <svg
                className="ml-1 w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
