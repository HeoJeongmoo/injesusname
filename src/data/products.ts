import type { Product } from '../types/product'

// 목업 이미지: 기존 SVG(장당 16~28MB)에서 추출해 WebP로 변환한 버전입니다.
const FRONT = '/images/products/product1.webp'
const BACK = '/images/products/product1-hover.webp'

export const products: Product[] = [
  {
    id: 1,
    name: 'conquerors tee',
    price: 39000,
    category: 'unisex',
    image: '/images/products/conquerors-back.webp',
    hoverImage: FRONT,
    tag: 'DROP 001',
    description:
      '등판의 INJESUSNAME 아웃라인 레터링 뒤로 JESUS가 겹쳐 흐르는 시그니처 티셔츠. 밑단에는 로마서 8:37과 요한일서 5:4, “믿음이 이긴다”가 새겨져 있습니다.',
  },
  { id: 2, name: 'nurim & conquerors t-shirt', price: 45000, category: 'men', image: FRONT, hoverImage: BACK, tag: 'NEW' },
  { id: 3, name: 'faithful oversized tee', price: 52000, category: 'women', image: FRONT, hoverImage: BACK },
  { id: 4, name: 'grace hoodie', price: 38000, category: 'unisex', image: FRONT, hoverImage: BACK },
  { id: 5, name: 'kingdom long sleeve', price: 48000, category: 'men', image: FRONT, hoverImage: BACK },
  { id: 6, name: 'victory crop top', price: 34000, category: 'women', image: FRONT, hoverImage: BACK },
  { id: 7, name: 'anointed coach jacket', price: 62000, category: 'men', image: FRONT, hoverImage: BACK },
  { id: 8, name: 'blessing wide pants', price: 56000, category: 'women', image: FRONT, hoverImage: BACK },
  { id: 9, name: 'victory track pants', price: 45000, category: 'men', image: FRONT, hoverImage: BACK },
  { id: 10, name: 'kingdom bomber jacket', price: 78000, category: 'men', image: FRONT, hoverImage: BACK },
  { id: 11, name: 'graceful slip dress', price: 62000, category: 'women', image: FRONT, hoverImage: BACK },
  { id: 12, name: 'anointed knit sweater', price: 54000, category: 'women', image: FRONT, hoverImage: BACK },
]

export const getProduct = (id: number) => products.find((p) => p.id === id)
