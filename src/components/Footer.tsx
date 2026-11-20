import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, BUSINESS, DROP } from '../config'
import { supabase } from '../lib/supabase'

const LIST_KEY = 'injesusname_waitlist'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!value) return
    if (!agree) {
      setError('알림 수신(마케팅 정보 수신)에 동의해 주세요.')
      return
    }
    setError(null)
    if (supabase) {
      // Supabase 'waitlist' 테이블에 저장 (관리자 페이지에서 확인)
      setBusy(true)
      const { error: err } = await supabase.from('waitlist').insert({ email: value, source: DROP.code })
      setBusy(false)
      // 23505 = 이미 신청한 이메일 → 성공으로 처리
      if (err && err.code !== '23505') {
        setError('잠시 후 다시 시도해 주세요.')
        return
      }
    } else {
      try {
        const list: string[] = JSON.parse(localStorage.getItem(LIST_KEY) || '[]')
        if (!list.includes(value)) localStorage.setItem(LIST_KEY, JSON.stringify([...list, value]))
      } catch {
        /* ignore */
      }
    }
    setDone(true)
    setEmail('')
  }

  return (
    <footer className="relative mt-32 border-t border-line overflow-hidden">
      {/* Waitlist */}
      <div id="waitlist" className="grid md:grid-cols-2 border-b border-line">
        <div className="px-5 md:px-8 py-14 md:py-20 md:border-r border-line">
          <p className="micro text-ash">{DROP.code} — Early access</p>
          <h2 className="mt-4 text-5xl md:text-7xl leading-[0.9]">
            GET ON
            <br />
            THE LIST
          </h2>
          <p className="mt-5 text-sm text-ash max-w-sm leading-relaxed">
            런칭 소식과 드롭 오픈 알림을 가장 먼저 받아보세요. 리스트 회원에게는 오픈 1시간 전 선공개됩니다.
          </p>
        </div>
        <div className="px-5 md:px-8 py-14 md:py-20 flex items-end">
          {done ? (
            <div className="w-full">
              <p className="font-display text-4xl">YOU’RE ON THE LIST.</p>
              <p className="micro text-ash mt-3">See you at the drop — in Jesus name.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="w-full">
              <div className="flex items-end gap-4">
              <label className="flex-1">
                <span className="micro text-ash">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="field"
                />
              </label>
              <button type="submit" disabled={busy} className="btn btn-solid shrink-0">
                {busy ? '…' : 'Notify me →'}
              </button>
              </div>
              <label className="mt-4 flex items-start gap-2.5 text-[13px] text-ash cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 accent-[var(--color-bone)]"
                />
                <span>
                  드롭 오픈·이벤트 소식을 이메일로 받는 데 동의합니다. (선택 · 언제든 수신 거부 가능 ·{' '}
                  <Link to="/privacy" className="underline">개인정보처리방침</Link>)
                </span>
              </label>
              {error && <p className="micro text-signal mt-3">{error}</p>}
            </form>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 px-5 md:px-8 py-14">
        <div className="col-span-2">
          <p className="font-display text-3xl">{BRAND.name}</p>
          <p className="text-sm text-ash mt-3 max-w-xs leading-relaxed">
            “{BRAND.tagline}.”
            <br />
            <span className="micro">{BRAND.verse}</span>
          </p>
        </div>
        <div>
          <h3 className="micro text-ash mb-5 font-mono">Shop</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shop" className="link-line">All</Link></li>
            <li><Link to="/men" className="link-line">Men</Link></li>
            <li><Link to="/women" className="link-line">Women</Link></li>
            <li><Link to="/unisex" className="link-line">Unisex</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="micro text-ash mb-5 font-mono">Info</h3>
          <ul className="space-y-3 text-sm">
            <li><a href={BRAND.instagram} target="_blank" rel="noreferrer" className="link-line">Instagram</a></li>
            <li><Link to="/account/orders" className="link-line">주문 조회</Link></li>
            <li><Link to="/returns" className="link-line">배송·교환·반품</Link></li>
            <li><Link to="/terms" className="link-line">이용약관</Link></li>
            <li><Link to="/privacy" className="link-line font-semibold">개인정보처리방침</Link></li>
          </ul>
        </div>
      </div>

      {/* 사업자 정보 (전자상거래법 표시 사항) */}
      <div className="px-5 md:px-8 py-6 border-t border-line text-[12px] leading-[1.9] text-ash">
        <p>
          상호 {BUSINESS.companyName} <Sep /> 대표 {BUSINESS.ceo} <Sep /> 사업자등록번호 {BUSINESS.bizNumber} <Sep /> 통신판매업 신고{' '}
          {BUSINESS.mailOrderNumber}
        </p>
        <p>
          주소 {BUSINESS.address} <Sep /> 고객센터 {BUSINESS.phone} <Sep /> 이메일 {BUSINESS.email} <Sep /> 개인정보 보호책임자{' '}
          {BUSINESS.privacyOfficer} <Sep /> 호스팅 {BUSINESS.hosting}
        </p>
      </div>

      <div className="px-5 md:px-8 py-5 border-t border-line flex flex-col md:flex-row gap-2 justify-between micro text-ash">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
        <span>{BRAND.city} — Faith overcomes</span>
      </div>

      {/* Giant wordmark */}
      <div aria-hidden className="select-none pointer-events-none px-2 -mb-[2vw]">
        <svg viewBox="0 0 1000 190" className="w-full h-auto block">
          <text
            x="500"
            y="180"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            className="font-display"
            style={{ fontSize: 235, fill: 'transparent', stroke: 'rgba(236,233,226,0.3)', strokeWidth: 1 }}
          >
            INJESUSNAME
          </text>
        </svg>
      </div>
    </footer>
  )
}

function Sep() {
  return <span className="mx-1.5 text-line">|</span>
}
