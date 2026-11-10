import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import Marquee from '../components/Marquee'
import { products } from '../data/products'
import { CATEGORY_LABELS, inCategory, type Category } from '../types/product'

type SortOrder = 'default' | 'low' | 'high'

const CATEGORY_DESCRIPTION: Record<Category, string> = {
  men: '남성을 위한 컬렉션',
  women: '여성을 위한 컬렉션',
  unisex: '성별 구분 없이 즐기는 컬렉션',
}

const SORTS: [SortOrder, string][] = [
  ['default', '추천순'],
  ['low', '낮은 가격순'],
  ['high', '높은 가격순'],
]

function isCategory(value: string): value is Category {
  return value === 'men' || value === 'women' || value === 'unisex'
}

export default function Shop() {
  const { pathname } = useLocation()
  const category = pathname.replace('/', '')
  const isCat = isCategory(category)

  const [sort, setSort] = useState<SortOrder>('default')

  const title = isCat ? CATEGORY_LABELS[category].toUpperCase() : 'SHOP ALL'
  const description = isCat ? CATEGORY_DESCRIPTION[category] : '전체 상품을 둘러보세요'

  const items = useMemo(() => {
    const base = isCat ? products.filter((p) => inCategory(p, category)) : products
    if (sort === 'low') return [...base].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...base].sort((a, b) => b.price - a.price)
    return base
  }, [category, isCat, sort])

  return (
    <section className="pt-16">
      <div className="px-5 md:px-8 pt-16 md:pt-24 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="micro text-ash">{description}</p>
          <h1 className="mt-3 text-7xl md:text-[10vw] leading-[0.85]">
            {title}
            <sup className="micro text-ash align-top ml-2">({items.length})</sup>
          </h1>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-ink/85 backdrop-blur-md border-y border-line px-5 md:px-8 h-12 flex items-center justify-between">
        <nav className="flex gap-5 overflow-x-auto no-scrollbar">
          {[
            ['/shop', 'All'],
            ['/men', 'Men'],
            ['/women', 'Women'],
            ['/unisex', 'Unisex'],
          ].map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `micro link-line ${isActive ? 'active' : 'text-ash hover:text-bone'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden sm:flex gap-5">
          {SORTS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`micro link-line ${sort === k ? 'active' : 'text-ash hover:text-bone'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="sm:hidden bg-transparent micro text-bone outline-none"
          aria-label="정렬"
        >
          {SORTS.map(([k, label]) => (
            <option key={k} value={k} className="bg-ink">
              {label}
            </option>
          ))}
        </select>
      </div>

      <ProductGrid products={items} />
      <Marquee className="mt-24" reverse />
    </section>
  )
}
