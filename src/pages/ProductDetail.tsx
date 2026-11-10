import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import { getProduct, products } from '../data/products'
import { useCart } from '../context/CartContext'
import { CATEGORY_LABELS, DEFAULT_SIZES } from '../types/product'
import { pad, won } from '../lib/format'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProduct(Number(id))
  const { add, setOpen } = useCart()
  const [size, setSize] = useState<string | null>(null)
  const [warn, setWarn] = useState(false)

  if (!product) return <NotFound />

  // 앞면 → 뒷면 순서
  const images: [string, string][] = []
  if (product.front) images.push(['Front', product.front])
  if (product.back) images.push(['Back', product.back])
  const sizes = product.sizes ?? DEFAULT_SIZES
  const related = products.filter((p) => p.id !== product.id && p.name === product.name).concat(products.filter((p) => p.id !== product.id && p.name !== product.name)).slice(0, 4)

  const addToBag = () => {
    if (!size) {
      setWarn(true)
      return
    }
    add(product.id, size)
    setOpen(true)
  }

  return (
    <div className="pt-16">
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        {/* gallery */}
        <div className="flex flex-col gap-px bg-line lg:border-r border-line">
          {images.map(([label, src], i) => (
            <div key={src} className="relative bg-[radial-gradient(circle_at_50%_45%,#1a1a1a_0%,#000_70%)] aspect-square flex items-center justify-center">
              <img src={src} alt={`${product.name} ${label}`} className="w-[82%] h-[82%] object-contain" />
              <span className="absolute top-4 left-4 micro text-ash">
                {pad(i + 1, 2)} / {pad(images.length, 2)} — {label}
              </span>
            </div>
          ))}
        </div>

        {/* info */}
        <div className="relative">
          <div className="lg:sticky lg:top-16 px-5 md:px-10 py-10 md:py-14 flex flex-col gap-10">
            <nav className="micro text-ash flex gap-2">
              <Link to="/shop" className="link-line">Shop</Link>/
              <Link to={`/${product.category}`} className="link-line">{CATEGORY_LABELS[product.category]}</Link>/
              <span className="text-bone">{pad(product.id)}</span>
            </nav>

            <div>
              {product.tag && <p className="micro text-signal mb-4">● {product.tag}</p>}
              <h1 className="text-6xl md:text-7xl uppercase leading-[0.88]">{product.name}</h1>
              {product.color && <p className="micro text-ash mt-3">Color — {product.color}</p>}
              <p className="micro mt-5 text-base">{won(product.price)}</p>
            </div>

            {product.description && <p className="text-bone/75 leading-relaxed">{product.description}</p>}

            <div>
              <div className="flex justify-between micro mb-3">
                <span className={warn && !size ? 'text-signal' : 'text-ash'}>
                  {warn && !size ? '사이즈를 선택해주세요' : 'Select size'}
                </span>
                <span className="text-ash">Size guide</span>
              </div>
              <div className="grid grid-cols-4 gap-px bg-line border border-line">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s)
                      setWarn(false)
                    }}
                    className={`h-12 micro transition-colors ${size === s ? 'bg-bone text-ink' : 'bg-ink hover:bg-ink-3'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} onClick={addToBag} className="btn btn-solid w-full">
              Add to bag — {won(product.price)}
            </motion.button>

            <ul className="border-t border-line text-sm">
              {[
                ['Shipping', '결제 후 2–5 영업일 내 출고'],
                ['Returns', '수령 후 7일 이내 교환·반품 가능'],
                ['Care', '찬물 단독 세탁, 프린트 면 뒤집어 건조'],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-6 py-4 border-b border-line">
                  <span className="micro text-ash">{k}</span>
                  <span className="text-bone/75 text-right">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-28">
          <h2 className="px-5 md:px-8 mb-6 text-5xl md:text-6xl">YOU MAY ALSO LIKE</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
