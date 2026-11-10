import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { DROP } from '../config'
import SearchOverlay from './SearchOverlay'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/men', label: 'Men' },
  { to: '/women', label: 'Women' },
  { to: '/unisex', label: 'Unisex' },
]

export default function Header() {
  const { user } = useAuth()
  const { count, setOpen } = useCart()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 페이지 이동 시 메뉴 닫기 (렌더 중 이전 경로와 비교)
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : ''
  }, [menuOpen, searchOpen])

  const solid = scrolled || pathname !== '/'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? 'bg-ink/80 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 px-5 md:px-8">
          {/* left */}
          <div className="flex items-center gap-7">
            <button
              aria-label="메뉴 열기"
              onClick={() => setMenuOpen(true)}
              className="md:hidden micro flex items-center gap-2"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block w-5 h-px bg-bone" />
                <span className="block w-3 h-px bg-bone" />
              </span>
              Menu
            </button>
            <nav className="hidden md:flex items-center gap-7">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) => `micro link-line ${isActive ? 'active' : 'text-bone/80 hover:text-bone'}`}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* center logo */}
          <Link to="/" aria-label="INJESUSNAME 홈" className="font-display text-[26px] md:text-[30px] leading-none tracking-[0.04em]">
            INJESUSNAME
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-5 md:gap-7">
            <span className="hidden lg:inline-flex items-center gap-2 micro text-ash">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              {DROP.code}
            </span>
            <button onClick={() => setSearchOpen(true)} className="hidden md:inline micro link-line text-bone/80 hover:text-bone">
              Search
            </button>
            <Link to="/login" className="hidden md:inline micro link-line text-bone/80 hover:text-bone">
              {user ? 'Account' : 'Login'}
            </Link>
            <button onClick={() => setOpen(true)} className="micro link-line">
              Bag <span className="text-ash">({count})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink flex flex-col"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-line">
              <span className="font-display text-[26px]">INJESUSNAME</span>
              <button onClick={() => setMenuOpen(false)} className="micro">
                Close
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-5 gap-1">
              {[...NAV, { to: '/login', label: user ? 'Account' : 'Login' }].map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.5 }}
                >
                  <Link to={n.to} className="flex items-baseline gap-4 font-display text-6xl leading-[1.05]">
                    <span className="micro text-ash">0{i + 1}</span>
                    {n.label.toUpperCase()}
                  </Link>
                </motion.div>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setSearchOpen(true)
                }}
                className="mt-8 micro text-left text-ash"
              >
                Search →
              </button>
            </nav>
            <div className="px-5 py-6 border-t border-line flex justify-between micro text-ash">
              <span>Faith overcomes</span>
              <span>Romans 8:37</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
