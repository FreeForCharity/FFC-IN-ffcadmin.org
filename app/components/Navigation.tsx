'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              src="/hero-logo.png"
              alt="Free For Charity Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden lg:block border-l border-gray-200 pl-3">
              <div className="text-lg font-bold text-gray-900 leading-tight">Admin Portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-5">
            <Link
              href="/"
              className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              Home
            </Link>
            <Link href="/tech-stack" className="font-medium hover:text-blue-600 transition-colors">
              Tech Stack
            </Link>
            <Link
              href="/contributor-ladder"
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Contributor Ladder
            </Link>
            <Link
              href="/training-plan"
              className="font-medium hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Global Admin
            </Link>
            <Link
              href="/canva-designer-path"
              className="font-medium hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Canva Designer
            </Link>
            <Link
              href="/documentation"
              className="font-medium hover:text-blue-600 transition-colors"
            >
              Docs
            </Link>
            <Link href="/testing" className="font-medium hover:text-blue-600 transition-colors">
              Testing
            </Link>
            <Link
              href="/sites-list"
              className="font-medium hover:text-blue-600 transition-colors whitespace-nowrap"
            >
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
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-blue-600 font-bold bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/tech-stack"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tech Stack
            </Link>
            <Link
              href="/contributor-ladder"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contributor Ladder
            </Link>
            <Link
              href="/training-plan"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Global Admin
            </Link>
            <Link
              href="/canva-designer-path"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Canva Designer
            </Link>
            <Link
              href="/documentation"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/testing"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testing
            </Link>
            <Link
              href="/sites-list"
              className="block px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
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
