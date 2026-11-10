import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const KEY = 'ijn_intro_seen'

// 세션당 한 번만 보이는 인트로: 000 → 100 카운터 후 위로 걷힘
export default function IntroOverlay() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY)
    } catch {
      return true
    }
  })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    const start = performance.now()
    const DURATION = 1500
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / DURATION, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else
        setTimeout(() => {
          setShow(false)
          document.body.style.overflow = ''
          try {
            sessionStorage.setItem(KEY, '1')
          } catch {
            /* ignore */
          }
        }, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ink flex flex-col justify-between p-5 md:p-8"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="flex justify-between micro text-ash">
            <span>Romans 8:37</span>
            <span>Faith overcomes</span>
          </div>

          <div className="relative flex items-center justify-center">
            <motion.span
              className="absolute font-display text-outline text-[34vw] leading-none select-none"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              JESUS
            </motion.span>
            <motion.h1
              className="relative font-display text-[13vw] md:text-[9vw] leading-none"
              initial={{ opacity: 0, filter: 'blur(14px)', letterSpacing: '0.2em' }}
              animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.02em' }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              INJESUSNAME
            </motion.h1>
          </div>

          <div className="flex items-end justify-between">
            <span className="micro text-ash">Loading the drop</span>
            <span className="font-display text-6xl md:text-8xl leading-none tabular-nums">{String(n).padStart(3, '0')}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
