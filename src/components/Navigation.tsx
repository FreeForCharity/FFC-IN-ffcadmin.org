'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { assetPath } from '@/lib/assetPath'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
            <Link
              href="/wordpress-to-nextjs-guide"
              className={`${linkClass('/wordpress-to-nextjs-guide')} whitespace-nowrap`}
            >
              Conversion Guide
            </Link>
            <Link href="/documentation" className={linkClass('/documentation')}>
              Docs
            </Link>
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
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              href="/wordpress-to-nextjs-guide"
              className={mobileLinkClass('/wordpress-to-nextjs-guide')}
              onClick={() => setIsMenuOpen(false)}
            >
              Conversion Guide
            </Link>
            <Link
              href="/documentation"
              className={mobileLinkClass('/documentation')}
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
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
          </div>
        )}
      </div>
    </nav>
  )
}
