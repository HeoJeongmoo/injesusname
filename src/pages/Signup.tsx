import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    const err = signup(name, email, password)
    if (err) {
      setError(err)
      return
    }
    navigate('/')
  }

  return (
    <AuthShell title="JOIN" eyebrow="Become a member">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required className="field" />
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required className="field" />
        <input type="password" placeholder="비밀번호 (6자 이상)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="field" />
        <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="field" />
        {error && <p className="micro text-signal mt-2">{error}</p>}
        <button type="submit" className="btn btn-solid w-full mt-8">
          회원가입
        </button>
      </form>
      <p className="micro text-ash mt-8 text-center">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="text-bone link-line">
          로그인
        </Link>
      </p>
    </AuthShell>
  )
}
