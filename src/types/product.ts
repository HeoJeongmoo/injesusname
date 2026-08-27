export type Category = 'men' | 'women' | 'unisex'

export interface Product {
  id: number
  name: string
  price: number
  category: Category
  image: string
  hoverImage?: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
}
