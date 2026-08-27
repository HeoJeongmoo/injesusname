import { Menu, X, Search, Heart, User as LucideUser } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClasses = `w-full fixed top-0 z-50 transition-all duration-300 ${
    scrolled || searchOpen ? 'bg-white text-[var(--color-text)] header-shadow' : 'bg-transparent text-white'
  }`

  return (
    <header className={headerClasses}>
      <div className="mx-auto px-5 flex items-center justify-between h-15">
        {/* 로고 */}
        <Link to="/" className="font-bold font-bebas logo tracking-wide">
          INJESUSNAME
        </Link>

        {/* 데스크탑 내비게이션 */}
        <nav className="hidden md:flex items-center gap-8 site-nav">
          <Link to="/men" className="text-lg uppercase tracking-wide font-medium nav-link">Men</Link>
          <Link to="/women" className="text-lg uppercase tracking-wide font-medium nav-link">Women</Link>
          <Link to="/unisex" className="text-lg uppercase tracking-wide font-medium nav-link">Unisex</Link>
        </nav>

        {/* 우측 아이콘 영역 */}
        <div className="flex items-center gap-5">
          <button aria-label="검색" onClick={() => setSearchOpen(!searchOpen)} className="opacity-80 hover:opacity-100 transition-opacity">
            {searchOpen ? <X size={20} strokeWidth={3} /> : <Search size={18} strokeWidth={3} />}
          </button>

          <button aria-label="찜" className="opacity-80 hover:opacity-100 transition-opacity">
            <Heart size={18} strokeWidth={3} />
          </button>

          <Link to="/login" aria-label={user ? '마이페이지' : '로그인'} className="opacity-80 hover:opacity-100 transition-opacity">
            <LucideUser size={18} strokeWidth={3} />
          </Link>

          <button
            aria-label="메뉴"
            className="md:hidden opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 검색창 - 펼쳐지는 영역 */}
      <div
        className={`overflow-hidden transition-all duration-300 bg-white text-[var(--color-text)] ${
          searchOpen ? 'max-h-28' : 'max-h-0'
        }`}
      >
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-3">
          <Search size={19} className="shrink-0" strokeWidth={3} />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 outline-none text-sm search-input"
            autoFocus={searchOpen}
          />
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <nav className="md:hidden mobile-menu-panel">
          <Link to="/men" className="block py-3 text-lg uppercase tracking-wide font-medium">Men</Link>
          <Link to="/women" className="block py-3 text-lg uppercase tracking-wide font-medium">Women</Link>
          <Link to="/unisex" className="block py-3 text-lg uppercase tracking-wide font-medium">Unisex</Link>
        </nav>
      )}
    </header>
  )
}
