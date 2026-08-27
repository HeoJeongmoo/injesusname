import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    <section className="pt-28 px-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bebas tracking-wide text-center mb-6">SIGN UP</h1>

        <div className="bg-white p-8 rounded-md card-shadow">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="btn-primary mt-2 w-full justify-center"
            >
              회원가입
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-6 opacity-70">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </section>
  )
}
