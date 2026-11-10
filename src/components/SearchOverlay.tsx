import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { won } from '../lib/format'

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 200)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return products.filter((p) => p.name.toLowerCase().includes(s) || p.category.includes(s))
  }, [q])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between h-16 px-5 md:px-8 border-b border-line">
            <span className="micro text-ash">Search</span>
            <button onClick={onClose} className="micro link-line">
              Close [esc]
            </button>
          </div>

          <div className="px-5 md:px-8 pt-10 md:pt-16 max-w-6xl mx-auto">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="WHAT ARE YOU LOOKING FOR?"
              className="w-full bg-transparent outline-none font-display text-5xl md:text-8xl placeholder:text-bone/15 border-b border-line pb-4"
            />

            <div className="mt-8 micro text-ash">
              {q ? `${results.length} results` : 'Try: tee, hoodie, kingdom, women'}
            </div>

            <ul className="mt-4 divide-y divide-line">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-5 py-4 hover:pl-3 transition-all"
                  >
                    <div className="w-14 h-14 bg-ink-3 shrink-0">
                      <img src={p.image} alt="" className="w-full h-full object-contain mix-blend-lighten" />
                    </div>
                    <span className="font-display text-2xl md:text-3xl uppercase flex-1">{p.name}</span>
                    <span className="micro text-ash">{won(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
