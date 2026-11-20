import { useState } from 'react'
import { useAuth, type SocialProvider } from '../context/AuthContext'

// 카카오·구글 로그인 버튼. 각 사의 로그인 버튼 디자인 가이드(색상·심볼)를 따릅니다.
const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path fill="#FEE500" d="M12 3C6.48 3 2 6.5 2 10.82c0 2.79 1.86 5.24 4.66 6.62l-.95 3.48c-.08.3.26.54.52.37l4.15-2.75c.53.06 1.07.1 1.62.1 5.52 0 10-3.5 10-7.82S17.52 3 12 3Z" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.92 7.53 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

export default function SocialLogin() {
  const { loginWith } = useAuth()
  const [busy, setBusy] = useState<SocialProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const go = async (p: SocialProvider) => {
    setError(null)
    setBusy(p)
    const err = await loginWith(p)
    // 성공하면 카카오/구글 페이지로 이동하므로 여기까지 오면 실패한 경우뿐입니다
    if (err) {
      setError(err)
      setBusy(null)
    }
  }

  const item = 'flex items-center gap-2 sm:gap-2.5 whitespace-nowrap text-[14px] text-bone/90 hover:text-bone transition-colors disabled:opacity-50'

  return (
    <div className="mt-10">
      <div className="flex items-center justify-center gap-4 sm:gap-5">
        <button type="button" onClick={() => go('kakao')} disabled={busy !== null} className={item}>
          <KakaoIcon />
          {busy === 'kakao' ? '이동 중…' : <>카카오 로그인</>}
        </button>
        <span aria-hidden className="w-px h-3.5 bg-line" />
        <button type="button" onClick={() => go('google')} disabled={busy !== null} className={item}>
          <GoogleIcon />
          {busy === 'google' ? '이동 중…' : <>구글 로그인</>}
        </button>
      </div>
      {error && <p className="micro text-signal text-center mt-4">{error}</p>}
    </div>
  )
}
