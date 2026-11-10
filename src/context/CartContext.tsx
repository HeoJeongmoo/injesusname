import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProduct } from '../data/products'
import type { Product } from '../types/product'

export interface CartItem {
  id: number
  size: string
  qty: number
}

export interface CartLine extends CartItem {
  product: Product
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (id: number, size: string, qty?: number) => void
  setQty: (id: number, size: string, qty: number) => void
  remove: (id: number, size: string) => void
  clear: () => void
  /** 사이드 BAG 드로어 열림 상태 */
  open: boolean
  setOpen: (v: boolean) => void
}

const KEY = 'injesusname_cart'
const CartContext = createContext<CartContextValue | null>(null)

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable */
    }
  }, [items])

  const add = useCallback((id: number, size: string, qty = 1) => {
    setItems((prev) => {
      const hit = prev.find((i) => i.id === id && i.size === size)
      if (hit) return prev.map((i) => (i === hit ? { ...i, qty: Math.min(i.qty + qty, 9) } : i))
      return [...prev, { id, size, qty }]
    })
  }, [])

  const setQty = useCallback((id: number, size: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.size === size))
        : prev.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.min(qty, 9) } : i)),
    )
  }, [])

  const remove = useCallback((id: number, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const lines = items
      .map((i) => ({ ...i, product: getProduct(i.id) }))
      .filter((l): l is CartLine => Boolean(l.product))
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
    }
  }, [items, add, setQty, remove, clear, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart는 CartProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
