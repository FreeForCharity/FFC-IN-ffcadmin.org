/**
 * A tiny localStorage-backed external store for useSyncExternalStore.
 *
 * Why this exists: the "load from localStorage in a mount effect, then
 * setState" pattern trips eslint-plugin-react-hooks 7.1's set-state-in-effect
 * rule (a synchronous setState in an effect cascades a second render), and the
 * lazy-useState alternative breaks hydration on statically-exported pages (the
 * server HTML is rendered without localStorage). useSyncExternalStore is the
 * pattern React documents for exactly this: the server snapshot renders the
 * empty state everywhere, and after hydration React re-reads the client
 * snapshot and updates.
 *
 * Snapshots are the RAW string (string | null): strings compare by value under
 * Object.is, so getSnapshot can read localStorage directly without caching.
 * Parse the raw value into richer state with useMemo keyed on it.
 *
 * `write` notifies same-tab subscribers itself; cross-tab updates arrive via
 * the browser's `storage` event, which only fires for other tabs.
 */

export type LocalStorageStore = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => string | null
  getServerSnapshot: () => null
  /** Write (or remove, with null) the value and notify this tab's subscribers. */
  write: (value: string | null) => void
}

export function createLocalStorageStore(key: string): LocalStorageStore {
  const listeners = new Set<() => void>()

  const emit = () => {
    for (const listener of listeners) listener()
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) emit()
  }

  return {
    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener('storage', onStorage)
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) window.removeEventListener('storage', onStorage)
      }
    },
    getSnapshot() {
      try {
        return localStorage.getItem(key)
      } catch {
        // localStorage unavailable (privacy mode, disabled) — behave as unset.
        return null
      }
    },
    getServerSnapshot() {
      return null
    },
    write(value) {
      try {
        if (value === null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, value)
        }
      } catch (error) {
        // Continue anyway: subscribers still see the attempted state via emit
        // being skipped — the snapshot re-read simply returns the old value.
        console.warn(`Unable to persist ${key} to localStorage:`, error)
      }
      emit()
    },
  }
}
