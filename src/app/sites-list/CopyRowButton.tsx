'use client'

import { useState } from 'react'

/**
 * Copies a server-prepared Markdown summary of a site row to the clipboard
 * (#409). Tiny client island inside the otherwise server-rendered tables.
 */
export default function CopyRowButton({ text, domain }: { text: string; domain: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // Clipboard unavailable (permissions/non-secure context) — no-op.
        }
      }}
      aria-label={`Copy ${domain} row as Markdown`}
      title={`Copy ${domain} row as Markdown`}
      className="text-gray-400 hover:text-gray-700 hover:underline"
    >
      {copied ? '✓ copied' : '⧉ copy'}
    </button>
  )
}
