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
