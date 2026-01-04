'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-ffc-gradient text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <img src="/ffc-logo.svg" alt="Free For Charity Logo" className="w-10 h-10" />
            <div className="hidden sm:block">
              <div className="text-xl font-bold">Free For Charity</div>
              <div className="text-xs opacity-90">Admin Portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:opacity-80 transition-opacity font-medium">
              Home
            </Link>
            <Link href="/tech-stack" className="hover:opacity-80 transition-opacity font-medium">
              Tech Stack
            </Link>
            <Link
              href="/contributor-ladder"
              className="hover:opacity-80 transition-opacity font-medium"
            >
              Contributor Ladder
            </Link>
            <Link href="/training-plan" className="hover:opacity-80 transition-opacity font-medium">
              Global Admin
            </Link>
            <Link
              href="/canva-designer-path"
              className="hover:opacity-80 transition-opacity font-medium"
            >
              Canva Designer
            </Link>
            <Link href="/documentation" className="hover:opacity-80 transition-opacity font-medium">
              Documentation
            </Link>
            <Link href="/testing" className="hover:opacity-80 transition-opacity font-medium">
              Testing
            </Link>
            <Link href="/sites-list" className="hover:opacity-80 transition-opacity font-medium">
              Sites List
            </Link>
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity font-medium"
            >
              GitHub
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
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
          <div className="md:hidden pb-4 space-y-2" id="mobile-menu">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/tech-stack"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tech Stack
            </Link>
            <Link
              href="/contributor-ladder"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contributor Ladder
            </Link>
            <Link
              href="/training-plan"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Global Admin
            </Link>
            <Link
              href="/canva-designer-path"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Canva Designer
            </Link>
            <Link
              href="/documentation"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/testing"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testing
            </Link>
            <Link
              href="/sites-list"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sites List
            </Link>
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
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
