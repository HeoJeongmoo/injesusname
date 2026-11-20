import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User as SbUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getUsers, saveUsers, getSession, setSession, clearSession } from '../utils/auth'

export type SocialProvider = 'kakao' | 'google'

interface User {
  name: string
  email: string
  /** 로그인한 방법 (email, kakao, google) */
  provider: string
  avatar?: string
}

interface AuthContextValue {
  user: User | null
  /** Supabase 키가 설정되어 진짜 로그인이 켜져 있는지 */
  ready: boolean
  login: (email: string, password: string) => Promise<string | null>
  /** 성공 시 null, 이메일 인증이 필요하면 'confirm', 실패 시 에러 메시지 */
  signup: (name: string, email: string, password: string) => Promise<string | null | 'confirm'>
  loginWith: (provider: SocialProvider) => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function fromSupabase(u: SbUser | null | undefined): User | null {
  if (!u) return null
  const m = u.user_metadata ?? {}
  const provider = (u.app_metadata?.provider as string) ?? 'email'
  return {
    name: m.full_name || m.name || m.nickname || m.preferred_username || u.email?.split('@')[0] || '회원',
    email: u.email ?? '',
    provider,
    avatar: m.avatar_url || m.picture,
  }
}

const ERR: Record<string, string> = {
  'Invalid login credentials': '이메일 또는 비밀번호가 일치하지 않습니다.',
  'Email not confirmed': '이메일 인증을 완료해 주세요. 메일함을 확인해 주세요.',
  'User already registered': '이미 가입된 이메일입니다.',
}
const ko = (msg: string) => ERR[msg] ?? msg

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (supabase) return null
    // 데모 모드: 브라우저 저장소
    const email = getSession()
    if (!email) return null
    const found = getUsers().find((u) => u.email === email)
    return found ? { name: found.name, email: found.email, provider: 'email' } : null
  })

  // Supabase 세션 동기화 (소셜 로그인 후 돌아왔을 때 포함)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUser(fromSupabase(data.session?.user)))
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(fromSupabase(session?.user)))
    return () => data.subscription.unsubscribe()
  }, [])

  const login: AuthContextValue['login'] = async (email, password) => {
    const trimmed = email.trim().toLowerCase()
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: trimmed, password })
      return error ? ko(error.message) : null
    }
    const found = getUsers().find((u) => u.email === trimmed)
    if (!found) return '가입되지 않은 이메일입니다.'
    if (found.password !== password) return '비밀번호가 일치하지 않습니다.'
    setSession(found.email)
    setUser({ name: found.name, email: found.email, provider: 'email' })
    return null
  }

  const signup: AuthContextValue['signup'] = async (name, email, password) => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedName || !trimmedEmail || !password) return '모든 항목을 입력해주세요.'
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { data: { full_name: trimmedName }, emailRedirectTo: `${window.location.origin}/login` },
      })
      if (error) return ko(error.message)
      return data.session ? null : 'confirm'
    }
    const users = getUsers()
    if (users.some((u) => u.email === trimmedEmail)) return '이미 가입된 이메일입니다.'
    saveUsers([...users, { name: trimmedName, email: trimmedEmail, password }])
    setSession(trimmedEmail)
    setUser({ name: trimmedName, email: trimmedEmail, provider: 'email' })
    return null
  }

  const loginWith: AuthContextValue['loginWith'] = async (provider) => {
    if (!supabase) return '소셜 로그인은 아직 준비 중입니다. (Supabase 키 설정 필요)'
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      // 로그인 후 돌아올 주소 — Supabase의 Redirect URLs 목록에 등록되어 있어야 합니다
      options: { redirectTo: `${window.location.origin}/login` },
    })
    return error ? ko(error.message) : null
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready: Boolean(supabase), login, signup, loginWith, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
