import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'
import SocialLogin from '../components/SocialLogin'
import { takeNext } from '../lib/api'
import { supabase } from '../lib/supabase'

export default function Login() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)

  // 결제·주문 조회 중 로그인하러 왔다면 로그인 후 그 페이지로 돌려보냅니다 (소셜 로그인 포함)
  useEffect(() => {
    if (!user) return
    const next = takeNext()
    if (next) navigate(next, { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const err = await login(email, password)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    navigate(takeNext() ?? '/')
  }

  if (user) {
    return (
      <AuthShell title="ACCOUNT" eyebrow="Welcome back">
        <p className="text-lg">{user.name}님, 환영합니다.</p>
        <p className="micro text-ash mt-2">
          {user.email || '이메일 정보 없음'} · {user.provider === 'kakao' ? '카카오' : user.provider === 'google' ? 'Google' : '이메일'} 로그인
        </p>
        <Link to="/account/orders" className="btn btn-solid w-full mt-10">
          주문 내역
        </Link>
        <AdminLink />
        <button onClick={logout} className="btn btn-ghost w-full mt-3">
          로그아웃
        </button>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="LOGIN" eyebrow="Members">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required className="field" />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required className="field" />
        {error && <p className="micro text-signal mt-2">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-solid w-full mt-8">
          {busy ? '로그인 중…' : '로그인'}
        </button>
      </form>
      <p className="micro text-ash mt-8 text-center">
        아직 계정이 없으신가요?{' '}
        <Link to="/signup" className="text-bone link-line">
          회원가입
        </Link>
      </p>
      <SocialLogin />
    </AuthShell>
  )
}

/** 관리자 계정일 때만 관리자 페이지 링크 표시 */
function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    supabase?.rpc('is_admin').then(({ data }) => setIsAdmin(Boolean(data)))
  }, [])
  return isAdmin ? (
    <Link to="/admin" className="btn btn-ghost w-full mt-3">
      관리자 페이지
    </Link>
  ) : null
}
