export const won = (n: number) => `₩${n.toLocaleString('ko-KR')}`
export const pad = (n: number, len = 3) => String(n).padStart(len, '0')
