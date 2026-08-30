export interface AdminUser {
  name: string
  email: string
  role: string
  avatar: string
}

// Admin credentials are stored as SHA-256 hashes in build-time environment
// variables (see .env) — the real email/password never appear in source code,
// .env, or the built bundle:
//   VITE_ADMIN_EMAIL_HASH, VITE_ADMIN_PASSWORD_HASH
//
// To change your credentials: compute the SHA-256 hex digest of the new value
// (e.g. in PowerShell:
//   [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().
//     ComputeHash([Text.Encoding]::UTF8.GetBytes('newvalue'))).Replace('-','').ToLower()
// ) and update the hash in .env, then restart the dev server.
//
// NOTE: this is client-side auth — the hashes ship in the JS bundle, so an
// attacker could try to brute-force the original values. For real production,
// replace this with a backend authentication endpoint.
const EMAIL_HASH = import.meta.env.VITE_ADMIN_EMAIL_HASH ?? ''
const PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? ''

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const ADMIN_PROFILE: AdminUser = {
  name: import.meta.env.VITE_ADMIN_NAME ?? 'Administrator',
  email: 'admin@roshandigital.local',
  role: 'Super administrator',
  avatar: 'SK',
}

export async function checkAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  if (!EMAIL_HASH || !PASSWORD_HASH) {
    console.error('Admin credentials are not configured. Set VITE_ADMIN_EMAIL_HASH and VITE_ADMIN_PASSWORD_HASH in .env.')
    return null
  }

  const [emailHash, passwordHash] = await Promise.all([
    sha256Hex(email.trim().toLowerCase()),
    sha256Hex(password),
  ])

  if (emailHash === EMAIL_HASH && passwordHash === PASSWORD_HASH) {
    return ADMIN_PROFILE
  }
  return null
}
