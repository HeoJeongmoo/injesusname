export interface StoredUser {
  name: string
  email: string
  password: string
}

const USERS_KEY = 'injesusname_users'
const SESSION_KEY = 'injesusname_session'

export function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSession(email: string) {
  localStorage.setItem(SESSION_KEY, email)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
