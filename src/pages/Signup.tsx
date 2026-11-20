import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'
import SocialLogin from '../components/SocialLogin'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setBusy(true)
    const err = await signup(name, email, password)
    setBusy(false)
    if (err === 'confirm') {
      setSent(true)
      return
    }
    if (err) {
      setError(err)
      return
    }
    navigate('/')
  }

  return (
    <AuthShell title="JOIN" eyebrow="Become a member">
      {sent ? (
        <div className="space-y-4">
          <p className="text-lg">인증 메일을 보냈어요.</p>
          <p className="text-sm text-ash leading-relaxed">
            {email} 메일함에서 인증 링크를 누르면 가입이 완료됩니다. 메일이 보이지 않으면 스팸함도 확인해 주세요.
          </p>
          <Link to="/login" className="btn btn-ghost w-full mt-6">
            로그인으로 이동
          </Link>
        </div>
      ) : (
      <>
      <SocialLogin />
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required className="field" />
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required className="field" />
        <input type="password" placeholder="비밀번호 (6자 이상)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="field" />
        <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="field" />
        {error && <p className="micro text-signal mt-2">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-solid w-full mt-8">
          {busy ? '처리 중…' : '회원가입'}
        </button>
      </form>
      <p className="micro text-ash mt-8 text-center">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-bone link-line">
          로그인
        </Link>
      </p>
      </>
      )}
    </AuthShell>
  )
}
