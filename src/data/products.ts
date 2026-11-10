import type { Category, Product } from '../types/product'

// 상품 이미지: public/images/products/web/ (원본 SVG를 렌더링해 WebP로 변환한 파일)
const W = (n: string) => `/images/products/web/${n}.webp`

interface Def {
  name: string
  color: string
  price: number
  back?: string
  front?: string
  tag?: string
  category?: Category
  description?: string
}

// 가격·이름·앞/뒤 짝은 임시로 정한 값입니다. 실제 정보로 바꿔 주세요.
const DEFS: Def[] = [
  {
    name: 'conquerors tee',
    color: 'White',
    price: 39000,
    back: '/images/products/conquerors-back.webp',
    front: '/images/products/product1.webp',
    tag: 'DROP 001',
    description:
      '등판의 INJESUSNAME 아웃라인 레터링 뒤로 JESUS가 겹쳐 흐르는 시그니처 티셔츠. 밑단에는 로마서 8:37과 요한일서 5:4, “믿음이 이긴다”가 새겨져 있습니다.',
  },
  { name: 'in jesus name tee', color: 'Slate', price: 42000, back: W('g731'), front: W('t-shirt'), tag: 'NEW', description: '굵은 CONQUERORS 레터링 아래 IN JESUS NAME. 앞면에는 작은 레터링이 들어갑니다.' },
  { name: 'a movement tee', color: 'Navy', price: 42000, back: W('g726'), front: W('t-shirt-1'), tag: 'NEW', description: '등판을 가로지르는 십자 타이포그래피 “A MOVEMENT OF 200 LEADERS”.' },
  { name: 'faith love hope tee', color: 'Charcoal', price: 39000, back: W('g651'), front: W('g648'), description: '등판 가득 채운 말씀 블록과 밑단의 FAITH · LOVE · HOPE.' },
  { name: 'the cross tee', color: 'Black', price: 39000, back: W('g659'), front: W('g663'), description: '블랙 위에 블랙으로 새긴 십자가와 말씀. 가까이서 봐야 보이는 톤온톤 프린트.' },
  { name: 'mighty nation tee', color: 'Brown', price: 42000, back: W('g744'), front: W('g740'), description: '이사야 60:22 — “그 작은 자가 천 명을 이루겠고 그 약한 자가 강국을 이룰 것이라.”' },
  { name: 'mighty nation tee', color: 'Cocoa', price: 42000, back: W('g750'), front: W('g749') },
  { name: 'mighty nation tee', color: 'Charcoal', price: 42000, back: W('g724') },
  { name: 'conquerors tee', color: 'Charcoal', price: 39000, back: W('g753'), front: W('g665') },
  { name: 'conquerors star tee', color: 'Charcoal', price: 42000, back: W('g768'), front: W('g662'), tag: 'NEW' },
  { name: 'holy spirit fire tee', color: 'Black', price: 39000, back: W('g759'), front: W('g796') },
  { name: 'the army of the lord tee', color: 'Slate', price: 42000, back: W('g781') },
  { name: 'conquerors tee', color: 'Navy', price: 39000, back: W('g784') },
  { name: 'conquerors tee', color: 'Stone', price: 39000, back: W('g755') },
  { name: 'conquerors tee', color: 'Steel Blue', price: 39000, back: W('g756') },
  { name: 'conquerors scripture tee', color: 'Graphite', price: 42000, back: W('g777') },
  { name: 'conquerors cross tee', color: 'Charcoal', price: 45000, back: W('g853'), front: W('g834') },
  { name: 'holy spirit fire tee', color: 'Charcoal', price: 39000, back: W('g835'), front: W('g836') },
  { name: 'injesusname glow tee', color: 'White', price: 42000, back: W('g819'), front: W('g820') },
  { name: 'conquerors glow tee', color: 'White', price: 42000, back: W('g702'), front: W('g851') },
  { name: 'injesusname glow tee', color: 'White / Orange', price: 42000, back: W('g713'), front: W('g688') },
  { name: 'a thousand tee', color: 'White', price: 39000, back: W('g695') },
  { name: 'conquerors gradient tee', color: 'Mint', price: 45000, back: W('g817') },
  { name: 'nurim gradient tee', color: 'Lime', price: 45000, back: W('g818') },
  { name: 'nurim gradient tee', color: 'Lavender', price: 45000, back: W('g793') },
  { name: 'nurim gradient tee', color: 'Sand', price: 45000, back: W('g792') },
  { name: 'nurim tee', color: 'Olive', price: 35000, front: W('g747') },
  { name: 'conquerors tee', color: 'White / Red', price: 39000, back: W('g832') },
]

export const products: Product[] = DEFS.map((d, i) => {
  const main = d.back ?? d.front!
  return {
    id: i + 1,
    name: d.name,
    color: d.color,
    price: d.price,
    category: d.category ?? 'unisex',
    image: main,
    hoverImage: d.back && d.front ? d.front : undefined,
    front: d.front,
    back: d.back,
    tag: d.tag,
    description: d.description,
  }
})

export const getProduct = (id: number) => products.find((p) => p.id === id)
