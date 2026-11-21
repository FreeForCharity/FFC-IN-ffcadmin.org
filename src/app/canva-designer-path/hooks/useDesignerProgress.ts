'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from '@/lib/localStorageStore'

const STORAGE_KEY = 'ffc_canva_designer_progress'

const store = createLocalStorageStore(STORAGE_KEY)

const hydratedSnapshot = () => true
const serverHydratedSnapshot = () => false

function save(items: Set<string>) {
  store.write(JSON.stringify(Array.from(items)))
}

export function useDesignerProgress(totalItems: number) {
  // Raw string snapshot from localStorage; parsed below. Server/hydration
  // renders see null, so the exported HTML and first client render agree.
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)

  const completedItems = useMemo(() => {
    if (!raw) return new Set<string>()
    try {
      const parsed: unknown = JSON.parse(raw)
      return new Set<string>(
        Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
      )
    } catch (error) {
      console.error('Failed to load designer progress:', error)
      return new Set<string>()
    }
  }, [raw])

  // False during SSR/hydration, true once the client store is live — same
  // contract the old isLoaded state provided, without a setState-in-effect.
  const isLoaded = useSyncExternalStore(store.subscribe, hydratedSnapshot, serverHydratedSnapshot)

  const toggleItem = (id: string) => {
    const next = new Set(completedItems)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    save(next)
  }

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      save(new Set())
    }
  }

  const progressPercentage =
    totalItems > 0 ? Math.round((completedItems.size / totalItems) * 100) : 0

  return {
    completedItems,
    toggleItem,
    resetProgress,
    progressPercentage,
    isLoaded,
  }
}
