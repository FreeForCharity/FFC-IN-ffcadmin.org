'use client'

import { useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  className = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`section-${sectionId}`}
      >
        <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={`section-${sectionId}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  )
}
