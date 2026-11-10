import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { won } from '../lib/format'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-[71] w-full sm:w-[440px] bg-ink-2 border-l border-line flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
            aria-label="장바구니"
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-line">
              <span className="micro">Bag ({lines.reduce((s, l) => s + l.qty, 0)})</span>
              <button onClick={() => setOpen(false)} className="micro link-line">
                Close
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="font-display text-5xl text-outline">EMPTY</p>
                <p className="text-sm text-ash">장바구니가 비어 있습니다.</p>
                <Link to="/shop" onClick={() => setOpen(false)} className="btn btn-ghost">
                  Shop the drop
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-line">
                  {lines.map((l) => (
                    <li key={`${l.id}-${l.size}`} className="flex gap-4 p-6">
                      <Link
                        to={`/product/${l.id}`}
                        onClick={() => setOpen(false)}
                        className="w-24 aspect-[4/5] bg-ink-3 shrink-0 flex items-center justify-center"
                      >
                        <img src={l.product.image} alt={l.product.name} className="w-full h-full object-contain mix-blend-lighten" />
                      </Link>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between gap-3">
                          <p className="font-display text-xl uppercase leading-tight">{l.product.name}</p>
                          <p className="micro whitespace-nowrap">{won(l.product.price * l.qty)}</p>
                        </div>
                        <p className="micro text-ash mt-1">Size {l.size}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-line">
                            <button className="w-8 h-8 micro" onClick={() => setQty(l.id, l.size, l.qty - 1)} aria-label="수량 감소">
                              −
                            </button>
                            <span className="w-8 text-center micro">{l.qty}</span>
                            <button className="w-8 h-8 micro" onClick={() => setQty(l.id, l.size, l.qty + 1)} aria-label="수량 증가">
                              +
                            </button>
                          </div>
                          <button onClick={() => remove(l.id, l.size)} className="micro text-ash hover:text-bone">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line p-6 space-y-4">
                  <div className="flex justify-between micro">
                    <span className="text-ash">Subtotal</span>
                    <span>{won(subtotal)}</span>
                  </div>
                  <Link to="/cart" onClick={() => setOpen(false)} className="btn btn-solid w-full">
                    View bag & checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
