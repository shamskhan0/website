export interface AdminUser {
  name: string
  email: string
  role: string
  avatar: string
}

import { signInAdmin as signInWithFirebase } from '../firebase'

const ADMIN_PROFILE: AdminUser = {
  name: import.meta.env.VITE_ADMIN_NAME ?? 'Shams Khan',
  email: 'admin@roshandigital.local',
  role: 'Super administrator',
  avatar: 'SK',
}

export async function signInAdmin(email: string, password: string): Promise<AdminUser | null> {
  const user = await signInWithFirebase(email.trim().toLowerCase(), password)
  if (!user) return null
  return { ...ADMIN_PROFILE, email: user.email ?? email }
}
