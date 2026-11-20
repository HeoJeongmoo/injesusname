export const won = (n: number) => `₩${n.toLocaleString('ko-KR')}`
export const pad = (n: number, len = 3) => String(n).padStart(len, '0')
export const fmtDate = (s: string) =>
  new Date(s).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
