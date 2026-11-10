export type Category = 'men' | 'women' | 'unisex'

export interface Product {
  id: number
  name: string
  /** 색상명 (예: Charcoal) */
  color?: string
  price: number
  category: Category
  /** 목록 카드에 먼저 보이는 이미지 (보통 프린트가 큰 쪽) */
  image: string
  /** 카드에 마우스를 올렸을 때 보이는 이미지 */
  hoverImage?: string
  /** 상세 페이지용 앞/뒤 이미지 */
  front?: string
  back?: string
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

/** 남성/여성 카테고리에서는 유니섹스 상품도 함께 보여줍니다 */
export const inCategory = (p: { category: Category }, c: Category) => p.category === c || p.category === 'unisex'
