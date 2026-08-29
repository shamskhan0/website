export interface AdminUser {
  name: string
  email: string
  role: string
  avatar: string
}

// Admin credentials are no longer hardcoded in the client bundle.
// They are supplied at build time via environment variables (see .env):
//   VITE_ADMIN_EMAIL, VITE_ADMIN_PASSWORD, VITE_ADMIN_NAME
// In production, replace checkAdminCredentials with a call to a real
// backend authentication endpoint.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? ''

const ADMIN_PROFILE: AdminUser = {
  name: import.meta.env.VITE_ADMIN_NAME ?? 'Administrator',
  email: ADMIN_EMAIL,
  role: 'Super administrator',
  avatar: 'SK',
}

export function checkAdminCredentials(email: string, password: string): AdminUser | null {
  const cleanEmail = email.trim().toLowerCase()
  const cleanPassword = password.trim()
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Admin credentials are not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD.')
    return null
  }
  const emailOk =
    cleanEmail === ADMIN_EMAIL.toLowerCase() ||
    cleanEmail === ADMIN_EMAIL.split('@')[0].toLowerCase()
  if (emailOk && cleanPassword === ADMIN_PASSWORD) {
    return ADMIN_PROFILE
  }
  return null
}
