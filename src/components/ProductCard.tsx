import { Link } from 'react-router-dom'
import type { Product } from '../types/product'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 card-shadow rounded-md flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-opacity duration-300 ease-in-out group-hover:opacity-0"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 z-10"
          />
        )}
      </div>

      <div className="mt-2 text-left">
        <h3 className="text-sm uppercase tracking-wide font-medium leading-tight">{product.name}</h3>
        <p className="text-sm mt-1 opacity-70">{product.price.toLocaleString()}원</p>
      </div>
    </Link>
  )
}
