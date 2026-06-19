'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { assetPath } from '@/lib/assetPath'
import { NAV_MENUS, menuItems, type NavMenu } from '@/data/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileAccordions, setMobileAccordions] = useState<Set<string>>(new Set())
  const desktopNavRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname() ?? ''

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === ''
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isDropdownActive = (menu: NavMenu) => menuItems(menu).some((item) => isActive(item.href))

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
      if (!desktopNavRef.current?.contains(e.target as Node)) {
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

  const desktopDropdown = (menu: NavMenu) => (
    <div
      key={menu.id}
      className="relative"
      onMouseEnter={() => handleDropdownMouseEnter(menu.id)}
      onMouseLeave={handleDropdownMouseLeave}
    >
      <button
        type="button"
        id={`${menu.id}-dropdown-button`}
        className={`${isDropdownActive(menu) ? 'text-blue-600 font-bold' : 'font-medium'} hover:text-blue-600 transition-colors inline-flex items-center whitespace-nowrap`}
        aria-expanded={openDropdown === menu.id}
        aria-haspopup="true"
        aria-controls={`${menu.id}-dropdown-menu`}
        onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
      >
        {menu.label}
        {chevronSvg(openDropdown === menu.id)}
      </button>
      {openDropdown === menu.id && (
        <div
          id={`${menu.id}-dropdown-menu`}
          role="menu"
          aria-labelledby={`${menu.id}-dropdown-button`}
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-[40rem] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 grid grid-cols-2 gap-x-6 gap-y-1"
        >
          {menu.sections.map((section) => (
            <div key={section.heading} role="group" aria-label={section.heading}>
              <p
                aria-hidden="true"
                className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-gray-400"
              >
                {section.heading}
              </p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`block rounded-md px-3 py-2 transition-colors hover:bg-blue-50 ${
                    isActive(item.href) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setOpenDropdown(null)}
                >
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const mobileDropdown = (menu: NavMenu) => (
    <div key={menu.id}>
      <button
        type="button"
        className={`${isDropdownActive(menu) ? 'text-blue-600 font-bold bg-blue-50' : 'hover:bg-gray-50 hover:text-blue-600'} w-full text-left px-3 py-2 rounded-md transition-colors inline-flex items-center justify-between`}
        onClick={() => toggleMobileAccordion(menu.id)}
        aria-expanded={mobileAccordions.has(menu.id)}
        aria-controls={`mobile-${menu.id}-panel`}
      >
        {menu.label}
        {chevronSvg(mobileAccordions.has(menu.id))}
      </button>
      {mobileAccordions.has(menu.id) && (
        <div
          id={`mobile-${menu.id}-panel`}
          className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2"
        >
          {menu.sections.map((section) => (
            <div key={section.heading}>
              <p className="px-3 pt-2 pb-0.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                {section.heading}
              </p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
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
          <div ref={desktopNavRef} className="hidden xl:flex items-center space-x-6">
            <Link href="/" className={linkClass('/')}>
              Home
            </Link>

            <Link
              href="/site-owner"
              aria-current={isActive('/site-owner') ? 'page' : undefined}
              className={`inline-flex items-center whitespace-nowrap rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
                isActive('/site-owner') ? 'ring-2 ring-emerald-700 ring-offset-2' : ''
              }`}
            >
              <span aria-hidden="true" className="mr-1.5">
                🌱
              </span>
              Manage My Site
            </Link>

            {NAV_MENUS.map((menu) => desktopDropdown(menu))}

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
              href="/site-owner"
              aria-current={isActive('/site-owner') ? 'page' : undefined}
              className="block rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 my-1 text-center font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span aria-hidden="true">🌱 </span>Manage My Site
            </Link>

            {NAV_MENUS.map((menu) => mobileDropdown(menu))}

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
