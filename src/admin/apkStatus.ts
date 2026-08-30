import type { ApkVersion } from '../types'

/**
 * Promote a version to LIVE and archive whichever version was previously live.
 * Returns a NEW list — the caller is responsible for persisting it.
 */
export function promoteToLive(versions: ApkVersion[], newLiveId: string): ApkVersion[] {
  return versions.map((v) => {
    if (v.id === newLiveId) return { ...v, status: 'LIVE' as const }
    if (v.status === 'LIVE') return { ...v, status: 'ARCHIVED' as const }
    return v
  })
}
