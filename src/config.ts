// 브랜드 전역 설정 — 런칭 일정이 정해지면 여기만 바꾸면 됩니다.
export const BRAND = {
  name: 'INJESUSNAME',
  tagline: 'Whatever you do, do it in the name of Jesus',
  taglineKo: '무엇을 하든지 예수의 이름으로',
  verse: 'COLOSSIANS 3:17',
  city: 'SEOUL, KR',
  instagram: 'https://instagram.com/',
}

export const DROP = {
  code: 'DROP 001',
  title: 'CONQUERORS',
  // 런칭 일시 (KST). 실제 날짜로 교체하세요.
  date: '2026-12-25T20:00:00+09:00',
}

// 상단/중간 띠에 흐르는 문구
export const TICKER = [
  'IN JESUS NAME',
  'FAITH OVERCOMES',
  '믿음이 이긴다',
  'ROMANS 8:37',
  '1 JOHN 5:4',
  `${DROP.code} — ${DROP.title}`,
]

// ───────────── 사업자 정보 (전자상거래법상 사이트 하단 표시 의무) ─────────────
// 사업자등록·통신판매업 신고 후 실제 값으로 바꿔 주세요. '[입력 필요]'인 칸은 푸터에 그대로 보입니다.
export const BUSINESS = {
  companyName: 'INJESUSNAME',
  ceo: '[대표자명]',
  bizNumber: '[000-00-00000]',
  /** 통신판매업 신고번호 */
  mailOrderNumber: '[제0000-서울00-0000호]',
  address: '[사업장 주소]',
  phone: '[000-0000-0000]',
  email: '[contact@injesusname.com]',
  /** 개인정보 보호책임자 */
  privacyOfficer: '[성명]',
  hosting: 'Vercel Inc.',
}

// ───────────── 배송·교환·반품 기준 ─────────────
export const POLICY = {
  shippingFee: 3000,
  freeShippingOver: 50000,
  /** 출고 소요 영업일 */
  dispatchDays: '2~5',
  courier: '[택배사명]',
  /** 단순 변심 교환·반품 왕복 배송비 */
  returnFee: 6000,
  returnDays: 7,
  returnAddress: '[반품 받을 주소]',
}

// ───────────── 사이즈 가이드 (단위 cm, 예시 값) ─────────────
// 실측 후 바꿔 주세요. 상품별로 다르면 products 데이터에 sizeChart를 따로 넣을 수 있습니다.
export const SIZE_CHART = {
  columns: ['총장', '가슴단면', '어깨너비', '소매길이'],
  rows: [
    { size: 'S', values: [68, 56, 52, 21] },
    { size: 'M', values: [71, 58.5, 54, 22] },
    { size: 'L', values: [74, 61, 56, 23] },
    { size: 'XL', values: [77, 63.5, 58, 24] },
  ],
  note: '오버핏 기준 실측 사이즈이며, 측정 방법에 따라 1~2cm 오차가 있을 수 있습니다.',
}
