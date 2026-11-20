import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

const DOCS = [
  ['/terms', '이용약관'],
  ['/privacy', '개인정보처리방침'],
  ['/returns', '배송·교환·반품'],
] as const

/** 약관류 공용 레이아웃 */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <section className="pt-16">
      <div className="px-5 md:px-8 pt-16 md:pt-24 pb-10 border-b border-line">
        <p className="micro text-ash">시행일 {updated}</p>
        <h1 className="mt-3 text-6xl md:text-8xl leading-[0.9]">{title}</h1>
        <nav className="mt-8 flex flex-wrap gap-5">
          {DOCS.map(([to, label]) => (
            <Link key={to} to={to} className={`micro link-line ${pathname === to ? 'active text-bone' : 'text-ash hover:text-bone'}`}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <article className="legal px-5 md:px-8 py-14 max-w-3xl">{children}</article>
    </section>
  )
}
