import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BRAND, DROP } from '../config'

const LIST_KEY = 'injesusname_waitlist'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      const list: string[] = JSON.parse(localStorage.getItem(LIST_KEY) || '[]')
      if (!list.includes(email)) localStorage.setItem(LIST_KEY, JSON.stringify([...list, email.trim()]))
    } catch {
      /* ignore */
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
            <form onSubmit={submit} className="w-full flex items-end gap-4">
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
              <button type="submit" className="btn btn-solid shrink-0">
                Notify me →
              </button>
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
            <li><Link to="/cart" className="link-line">Bag</Link></li>
            <li><Link to="/login" className="link-line">Account</Link></li>
          </ul>
        </div>
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
