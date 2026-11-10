// src/assets 의 무드 이미지를 룩북으로 사용합니다.
// 실존 인물(유명인) 사진은 브랜드 사이트에 쓰면 초상권 문제가 생길 수 있어 빌드 단계에서부터 제외합니다.
const modules = import.meta.glob(['../assets/*.{jpg,jpeg,png,webp}', '!../assets/*Brad Pitt*'], {
  eager: true,
  import: 'default',
}) as Record<string, string>

const EXCLUDE = /brad pitt/i

export const lookbook: string[] = Object.entries(modules)
  .filter(([path]) => !EXCLUDE.test(decodeURIComponent(path)))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)
