export type Category = 'men' | 'women' | 'unisex'

export interface Product {
  id: number
  name: string
  price: number
  category: Category
  image: string
  hoverImage?: string
  /** 카드 위에 붙는 작은 라벨 (예: NEW, DROP 001) */
  tag?: string
  description?: string
  sizes?: string[]
}

export const CATEGORY_LABELS: Record<Category, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
}

export const DEFAULT_SIZES = ['S', 'M', 'L', 'XL']
