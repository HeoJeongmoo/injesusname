import type { ReactNode } from 'react'
import { lookbook } from '../data/lookbook'

// 로그인/회원가입 공용 레이아웃: 좌측 무드 이미지 + 우측 폼
export default function AuthShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  const img = lookbook[0]
  return (
    <section className="pt-16 grid lg:grid-cols-2 min-h-[100svh]">
      <div className="relative hidden lg:block border-r border-line overflow-hidden">
        {img && <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <p className="absolute left-8 bottom-8 font-display text-8xl leading-[0.85]">
          FAITH
          <br />
          OVER
          <br />
          COMES<span className="text-signal">.</span>
        </p>
      </div>
      <div className="flex items-center justify-center px-5 md:px-12 py-20">
        <div className="w-full max-w-sm">
          <p className="micro text-ash">{eyebrow}</p>
          <h1 className="text-7xl mt-3 mb-10 leading-none">{title}</h1>
          {children}
        </div>
      </div>
    </section>
  )
}
