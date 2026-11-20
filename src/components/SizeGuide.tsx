import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { SIZE_CHART } from '../config'

export default function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label="사이즈 가이드"
            className="w-full sm:max-w-lg bg-ink-2 border border-line p-6 md:p-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="micro text-ash">Size guide · cm</p>
                <h2 className="text-4xl mt-2">SIZE CHART</h2>
              </div>
              <button onClick={onClose} className="micro link-line">
                Close
              </button>
            </div>

            <table className="w-full mt-6 text-sm tabular-nums">
              <thead>
                <tr className="border-b border-line">
                  <th className="micro text-ash text-left py-3 font-normal">Size</th>
                  {SIZE_CHART.columns.map((c) => (
                    <th key={c} className="text-ash text-right py-3 font-normal text-[13px]">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.rows.map((r) => (
                  <tr key={r.size} className="border-b border-line">
                    <td className="py-3 font-display text-xl">{r.size}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className="py-3 text-right">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-[13px] text-ash mt-5 leading-relaxed">{SIZE_CHART.note}</p>
            <p className="text-[13px] text-ash mt-1 leading-relaxed">가슴단면은 겨드랑이 아래 1cm 지점을 수평으로 잰 값입니다.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
