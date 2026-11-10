import { useEffect, useRef } from 'react'
import { BRAND, DROP } from '../config'

const FPS = 24
const two = (n: number) => String(n).padStart(2, '0')

/** 실시간으로 흐르는 녹화 타임코드 (HH:MM:SS:FF) */
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    let last = -1
    const tick = (t: number) => {
      const frames = Math.floor(((t - start) / 1000) * FPS)
      if (frames !== last && ref.current) {
        last = frames
        const s = Math.floor(frames / FPS)
        ref.current.textContent = `${two(Math.floor(s / 3600))}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}:${two(frames % FPS)}`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <span ref={ref} className="tabular-nums">
      00:00:00:00
    </span>
  )
}

function Corner({ className }: { className: string }) {
  return <span aria-hidden className={`absolute w-6 h-6 md:w-9 md:h-9 border-bone/70 ${className}`} />
}

/** 캠코더 뷰파인더 오버레이: REC 표시, 타임코드, 코너 브래킷 */
export default function RecOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* 프레임 */}
      <div className="absolute top-[84px] bottom-5 left-4 right-4 md:left-7 md:right-7">
        <Corner className="top-0 left-0 border-t-[1.5px] border-l-[1.5px]" />
        <Corner className="top-0 right-0 border-t-[1.5px] border-r-[1.5px]" />
        <Corner className="bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]" />
        <Corner className="bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]" />

        {/* 상단 정보 */}
        <div className="absolute top-4 inset-x-4 md:top-5 md:inset-x-6 flex justify-between items-start micro">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-bone">
              <span className="w-2 h-2 rounded-full bg-signal rec-blink" />
              REC
            </div>
            <div className="text-ash">
              {DROP.code} / {DROP.title}
            </div>
          </div>
          <div className="text-right space-y-1.5">
            <div className="text-bone">
              <span className="text-ash mr-2">TC</span>
              <Timecode />
            </div>
            <div className="text-ash hidden sm:block">
              {BRAND.city} · {FPS}FPS · 4K
            </div>
          </div>
        </div>

        {/* 하단 — 티셔츠 밑단 성경 구절 프린트 레이아웃 */}
        <div className="absolute bottom-4 inset-x-4 md:bottom-5 md:inset-x-6 grid grid-cols-2 md:grid-cols-3 items-end gap-4 micro text-ash leading-relaxed">
          <div>
            로마서 8:37
            <br />
            Romans 8:37
          </div>
          <div className="hidden md:block text-center">
            믿음이 이긴다
            <br />
            Faith overcomes
          </div>
          <div className="text-right">
            요한일서 5:4
            <br />1 John 5:4
          </div>
        </div>
      </div>
    </div>
  )
}
