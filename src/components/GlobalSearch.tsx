'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchDocs } from '@/data/search-index'
import { useDialogLightDismiss } from '@/lib/useDialogLightDismiss'

/**
 * Global site search — a ⌘K / Ctrl-K command-palette modal that searches every
 * page on the site (see `src/data/search-index.ts`). Rendered once in the
 * header; the trigger buttons live in `Navigation` and call `openGlobalSearch()`
 * so the single modal + keyboard listener isn't duplicated.
 */

const OPEN_EVENT = 'ffc:open-search'

/** Open the global search modal from anywhere (header trigger buttons). */
export function openGlobalSearch() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export default function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const results = useMemo(() => searchDocs(query), [query])

  // Runs after the native <dialog> closes (Esc, backdrop click, or close()).
  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  const close = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  const go = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router]
  )

  // Open on custom event (from header triggers) and on ⌘K / Ctrl-K anywhere.
  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (dialogRef.current?.open) dialogRef.current.close()
        else setOpen(true)
      }
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Open as a native modal dialog: the browser makes the page inert, traps
  // focus and restores it on close. Focus goes to the search input.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog || dialog.open) return
    dialog.showModal()
    inputRef.current?.focus()
  }, [open])

  // Backdrop-click fallback for browsers without closedby="any".
  const lightDismiss = useDialogLightDismiss(dialogRef)

  if (!open) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = results[active]
      if (target) go(target.href)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      {...{ closedby: 'any' }}
      onClose={handleClose}
      {...lightDismiss}
      className="mx-auto mt-[12vh] mb-auto w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl bg-white p-0 shadow-2xl"
    >
      <div onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-gray-200 px-4">
          <svg
            className="h-5 w-5 flex-shrink-0 text-gray-400"
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
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Search pages, guides, roles, docs…"
            aria-label="Search the site"
            aria-controls="global-search-results"
            className="w-full py-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <kbd className="hidden flex-shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs text-gray-400 sm:block">
            Esc
          </kbd>
        </div>

        {query && (
          <ul
            id="global-search-results"
            className="max-h-[50vh] overflow-y-auto py-2"
            role="listbox"
          >
            {results.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-500" role="status">
                No pages match “{query}”. Try a different term.
              </li>
            ) : (
              results.map((doc, i) => (
                <li key={doc.href} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(doc.href)}
                    className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors ${
                      i === active ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="font-semibold text-gray-900">{doc.title}</span>
                      <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        {doc.category}
                      </span>
                    </span>
                    <span className="line-clamp-1 text-sm text-gray-500">{doc.description}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        {query && results.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-2.5">
            <button
              type="button"
              onClick={() => go(`/search?q=${encodeURIComponent(query)}`)}
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              See all results for “{query}” →
            </button>
          </div>
        )}

        {!query && (
          <p className="px-4 py-6 text-center text-sm text-gray-400">
            Start typing to search every page on the site.
          </p>
        )}
      </div>
    </dialog>
  )
}
