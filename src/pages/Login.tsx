import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const err = login(email, password)
    if (err) {
      setError(err)
      return
    }
    navigate('/')
  }

  if (user) {
    return (
      <section className="pt-28 px-4 pb-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bebas tracking-wide mb-6">MY ACCOUNT</h1>
          <p className="text-base mb-8">{user.name}님, 환영합니다.</p>
          <button
            onClick={logout}
            className="border border-black px-8 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-28 px-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bebas tracking-wide text-center mb-6">LOGIN</h1>

        <div className="bg-white p-8 rounded-md card-shadow">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="btn-primary mt-2 w-full justify-center"
            >
              로그인
            </button>
          </form>
        </div>

        <p className="text-sm text-center mt-6 opacity-70">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </section>
  )
}
