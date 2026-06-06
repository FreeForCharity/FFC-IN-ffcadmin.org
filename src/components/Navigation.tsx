'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { assetPath } from '@/lib/assetPath'
import { trainingDropdown, resourcesDropdown, type NavDropdown } from '@/data/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileAccordions, setMobileAccordions] = useState<Set<string>>(new Set())
  const trainingRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname() ?? ''

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === ''
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isDropdownActive = (dropdown: NavDropdown) =>
    dropdown.items.some((item) => isActive(item.href))

  const linkClass = (href: string) =>
    isActive(href)
      ? 'text-blue-600 font-bold hover:text-blue-800 transition-colors'
      : 'font-medium hover:text-blue-600 transition-colors'

  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? 'block px-3 py-2 rounded-md text-blue-600 font-bold bg-blue-50'
      : 'block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors'

  const handleDropdownMouseEnter = useCallback((id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setOpenDropdown(id)
  }, [])

  const handleDropdownMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }, [])

  const toggleMobileAccordion = useCallback((id: string) => {
    setMobileAccordions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openDropdown) setOpenDropdown(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openDropdown])

  // Close dropdowns on route change
  useEffect(() => {
    queueMicrotask(() => {
      setOpenDropdown(null)
      setMobileAccordions(new Set())
    })
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }
  }, [pathname])

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openDropdown) return
      const target = e.target as Node
      if (!trainingRef.current?.contains(target) && !resourcesRef.current?.contains(target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const chevronSvg = (isOpen: boolean) => (
    <svg
      className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

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
          <div className="hidden xl:flex items-center space-x-6">
            <Link href="/" className={linkClass('/')}>
              Home
            </Link>
            <Link
              href="/get-involved"
              className={`${linkClass('/get-involved')} whitespace-nowrap`}
            >
              Get Involved
            </Link>
            <Link href="/site-owner" className={`${linkClass('/site-owner')} whitespace-nowrap`}>
              Edit My Site
            </Link>

            {/* Training Dropdown */}
            <div
              ref={trainingRef}
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('training')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                type="button"
                className={`${isDropdownActive(trainingDropdown) ? 'text-blue-600 font-bold' : 'font-medium'} hover:text-blue-600 transition-colors inline-flex items-center whitespace-nowrap`}
                aria-expanded={openDropdown === 'training'}
                aria-haspopup="true"
                aria-controls="training-dropdown-menu"
                onClick={() => setOpenDropdown(openDropdown === 'training' ? null : 'training')}
              >
                Training
                {chevronSvg(openDropdown === 'training')}
              </button>
              {openDropdown === 'training' && (
                <div
                  id="training-dropdown-menu"
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  {trainingDropdown.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              ref={resourcesRef}
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('resources')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                type="button"
                className={`${isDropdownActive(resourcesDropdown) ? 'text-blue-600 font-bold' : 'font-medium'} hover:text-blue-600 transition-colors inline-flex items-center whitespace-nowrap`}
                aria-expanded={openDropdown === 'resources'}
                aria-haspopup="true"
                aria-controls="resources-dropdown-menu"
                onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              >
                Resources
                {chevronSvg(openDropdown === 'resources')}
              </button>
              {openDropdown === 'resources' && (
                <div
                  id="resources-dropdown-menu"
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  {resourcesDropdown.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/sites-list" className={`${linkClass('/sites-list')} whitespace-nowrap`}>
              Sites List
            </Link>

            <a
              href="https://freeforcharity.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 hover:text-blue-900 inline-flex items-center whitespace-nowrap transition-colors"
            >
              For Charities &amp; Donors
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
              if (willClose) setMobileAccordions(new Set())
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
              href="/site-owner"
              className={mobileLinkClass('/site-owner')}
              onClick={() => setIsMenuOpen(false)}
            >
              Edit My Site
            </Link>

            {/* Mobile Training Accordion */}
            <div>
              <button
                type="button"
                className={`${isDropdownActive(trainingDropdown) ? 'text-blue-600 font-bold bg-blue-50' : 'hover:bg-gray-50 hover:text-blue-600'} w-full text-left px-3 py-2 rounded-md transition-colors inline-flex items-center justify-between`}
                onClick={() => toggleMobileAccordion('training')}
                aria-expanded={mobileAccordions.has('training')}
                aria-controls="mobile-training-panel"
              >
                Training
                {chevronSvg(mobileAccordions.has('training'))}
              </button>
              {mobileAccordions.has('training') && (
                <div
                  id="mobile-training-panel"
                  className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2"
                >
                  {trainingDropdown.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Resources Accordion */}
            <div>
              <button
                type="button"
                className={`${isDropdownActive(resourcesDropdown) ? 'text-blue-600 font-bold bg-blue-50' : 'hover:bg-gray-50 hover:text-blue-600'} w-full text-left px-3 py-2 rounded-md transition-colors inline-flex items-center justify-between`}
                onClick={() => toggleMobileAccordion('resources')}
                aria-expanded={mobileAccordions.has('resources')}
                aria-controls="mobile-resources-panel"
              >
                Resources
                {chevronSvg(mobileAccordions.has('resources'))}
              </button>
              {mobileAccordions.has('resources') && (
                <div
                  id="mobile-resources-panel"
                  className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2"
                >
                  {resourcesDropdown.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/sites-list"
              className={mobileLinkClass('/sites-list')}
              onClick={() => setIsMenuOpen(false)}
            >
              Sites List
            </Link>

            <a
              href="https://freeforcharity.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-blue-700 font-medium hover:bg-blue-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              For Charities &amp; Donors ↗
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
