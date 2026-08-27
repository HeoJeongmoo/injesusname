import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { products } from '../data/products'
import { CATEGORY_LABELS, type Category } from '../types/product'

type SortOrder = 'default' | 'low' | 'high'

const CATEGORY_DESCRIPTION: Record<Category, string> = {
  men: '남성을 위한 컬렉션',
  women: '여성을 위한 컬렉션',
  unisex: '성별 구분 없이 즐기는 컬렉션',
}

function isCategory(value: string): value is Category {
  return value === 'men' || value === 'women' || value === 'unisex'
}

export default function Shop() {
  const { pathname } = useLocation()
  const path = pathname.replace('/', '')
  const category = path as Category | 'shop'
  const isCat = isCategory(category)

  const [sort, setSort] = useState<SortOrder>('default')

  const title = isCat ? CATEGORY_LABELS[category].toUpperCase() : 'SHOP'
  const description = isCat ? CATEGORY_DESCRIPTION[category] : '전체 상품을 둘러보세요'

  const items = useMemo(() => {
    const base = isCat
      ? products.filter((p) => p.category === category)
      : products

    if (sort === 'low') return [...base].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...base].sort((a, b) => b.price - a.price)
    return base
  }, [category, isCat, sort])

  return (
    <section className="pt-28 px-4 pb-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bebas tracking-wide">{title}</h1>
        <p className="text-base mt-4 opacity-60">{description}</p>
        <p className="text-sm mt-1 opacity-40">{items.length} products</p>
      </div>

      <div className="max-w-5xl mx-auto mt-10 flex items-center justify-end">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="border border-gray-300 px-3 py-2 text-sm uppercase tracking-wide font-medium outline-none rounded-sm bg-white/0 text-[var(--color-text)]"
          aria-label="정렬"
        >
          <option value="default">추천순</option>
          <option value="low">낮은 가격순</option>
          <option value="high">높은 가격순</option>
        </select>
      </div>

      <ProductGrid title="" products={items} />
    </section>
  )
}
