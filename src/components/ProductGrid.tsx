import ProductCard from './ProductCard'
import { products as allProducts } from '../data/products'
import type { Product } from '../types/product'

interface ProductGridProps {
  title?: string
  products?: Product[]
}

// 1px 라인이 격자를 만드는 에디토리얼 그리드
export default function ProductGrid({ title = '', products = allProducts }: ProductGridProps) {
  return (
    <section>
      {title && <h2 className="px-5 md:px-8 mb-6 text-4xl md:text-5xl">{title}</h2>}

      {products.length === 0 ? (
        <p className="text-center text-ash py-20">등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border-y border-line">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
