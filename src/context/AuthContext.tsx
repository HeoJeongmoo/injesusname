import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import {
  getUsers,
  saveUsers,
  getSession,
  setSession,
  clearSession,
} from '../utils/auth'

interface User {
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => string | null
  signup: (name: string, email: string, password: string) => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const email = getSession()
    if (!email) return null
    const found = getUsers().find((u) => u.email === email)
    return found ? { name: found.name, email: found.email } : null
  })

  const login = (email: string, password: string): string | null => {
    const trimmed = email.trim().toLowerCase()
    const found = getUsers().find((u) => u.email === trimmed)
    if (!found) return '가입되지 않은 이메일입니다.'
    if (found.password !== password) return '비밀번호가 일치하지 않습니다.'
    setSession(found.email)
    setUser({ name: found.name, email: found.email })
    return null
  }

  const signup = (name: string, email: string, password: string): string | null => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedName || !trimmedEmail || !password) return '모든 항목을 입력해주세요.'
    const users = getUsers()
    if (users.some((u) => u.email === trimmedEmail)) return '이미 가입된 이메일입니다.'
    saveUsers([...users, { name: trimmedName, email: trimmedEmail, password }])
    setSession(trimmedEmail)
    setUser({ name: trimmedName, email: trimmedEmail })
    return null
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
