import { useState } from 'react'

/**
 * Lazily read a JSON value from localStorage, validate its shape, and fall
 * back to the provided default if the value is missing, malformed, or fails
 * the validator.
 */
export function loadPersisted<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => boolean,
): T {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return fallback
    const parsed: unknown = JSON.parse(saved)
    return isValid(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * useState that transparently persists its value to localStorage.
 * The initializer validates the stored shape via loadPersisted, and the
 * setter writes through to localStorage (silently ignoring quota/privacy
 * errors).
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => boolean,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => loadPersisted(key, initial, isValid))

  const update = (next: T) => {
    setValue(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // ignore storage failures (quota exceeded, private mode, etc.)
    }
  }

  return [value, update]
}

/** Remove a persisted value (used for session logout). */
export function removePersisted(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
