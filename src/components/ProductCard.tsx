import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { pad, won } from '../lib/format'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block bg-ink">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-2 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-6 md:p-10 mix-blend-lighten transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-6 md:p-10 mix-blend-lighten opacity-0 scale-[1.04] transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
          />
        )}

        <div className="absolute top-3 left-3 right-3 flex justify-between micro text-ash">
          <span>{pad(product.id)}</span>
          {product.tag && <span className="text-bone bg-ink/70 px-2 py-1">{product.tag}</span>}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="m-3 py-3 text-center micro bg-bone text-ink">Quick view</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3 px-3 md:px-4 py-3 md:py-4">
        <div>
          <h3 className="font-display text-lg md:text-xl uppercase leading-[0.95] tracking-wide line-clamp-2">{product.name}</h3>
          <p className="micro text-ash mt-2">{product.category}</p>
        </div>
        <p className="micro whitespace-nowrap sm:order-none order-last">{won(product.price)}</p>
      </div>
    </Link>
  )
}
