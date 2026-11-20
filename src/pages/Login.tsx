import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'
import SocialLogin from '../components/SocialLogin'

export default function Login() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const err = await login(email, password)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    navigate('/')
  }

  if (user) {
    return (
      <AuthShell title="ACCOUNT" eyebrow="Welcome back">
        <p className="text-lg">{user.name}님, 환영합니다.</p>
        <p className="micro text-ash mt-2">
          {user.email || '이메일 정보 없음'} · {user.provider === 'kakao' ? '카카오' : user.provider === 'google' ? 'Google' : '이메일'} 로그인
        </p>
        <button onClick={logout} className="btn btn-ghost w-full mt-10">
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
