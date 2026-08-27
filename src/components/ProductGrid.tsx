import ProductCard from './ProductCard'
import { products as allProducts } from '../data/products'
import type { Product } from '../types/product'

interface ProductGridProps {
  title?: string
  products?: Product[]
}

export default function ProductGrid({
  title = '',
  products = allProducts,
}: ProductGridProps) {
  return (
    <section className="mx-auto px-0 py-6 max-w-screen-2xl">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bebas text-left mb-4 tracking-wide">
          {title}
        </h2>
      )}

      {products.length === 0 ? (
        <p className="text-center text-base opacity-60 py-8">등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
