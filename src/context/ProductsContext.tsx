import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { products as staticProducts } from '../data/products'
import type { Category, Product } from '../types/product'

interface Row {
  id: number
  name: string
  color: string | null
  price: number
  category: Category
  front: string | null
  back: string | null
  tag: string | null
  description: string | null
  product_stock: { size: string; qty: number }[]
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// eslint-disable-next-line react-refresh/only-export-components
export function rowToProduct(r: Row): Product {
  const main = r.back ?? r.front ?? ''
  const stock = Object.fromEntries((r.product_stock ?? []).map((s) => [s.size, s.qty]))
  const sizes = Object.keys(stock).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
  return {
    id: r.id,
    name: r.name,
    color: r.color ?? undefined,
    price: r.price,
    category: r.category,
    image: main,
    hoverImage: r.back && r.front ? r.front : undefined,
    front: r.front ?? undefined,
    back: r.back ?? undefined,
    tag: r.tag ?? undefined,
    description: r.description ?? undefined,
    sizes: sizes.length ? sizes : undefined,
    stock: sizes.length ? stock : undefined,
  }
}

 
export const PRODUCT_SELECT = 'id,name,color,price,category,front,back,tag,description,product_stock(size,qty)'

interface Value {
  products: Product[]
  loading: boolean
  /** 데이터 출처: db = Supabase, static = src/data/products.ts */
  source: 'db' | 'static'
  getProduct: (id: number) => Product | undefined
  refresh: () => Promise<void>
}

const Ctx = createContext<Value | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [source, setSource] = useState<'db' | 'static'>('static')
  const [loading, setLoading] = useState(Boolean(supabase))

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true)
      .order('sort')
      .order('id')
    // DB가 비어 있거나 아직 스키마를 만들지 않았으면 정적 데이터를 그대로 씁니다
    if (!error && data && data.length) {
      setProducts((data as Row[]).map(rowToProduct))
      setSource('db')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ products, loading, source, refresh, getProduct: (id: number) => products.find((p) => p.id === id) }),
    [products, loading, source, refresh],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useProducts는 ProductsProvider 안에서만 사용할 수 있습니다.')
  return v
}
