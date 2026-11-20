import { supabase } from './supabase'

/** 로그인 토큰을 붙여 Vercel 서버 함수(/api/...)를 호출합니다 */
export async function api<T>(path: string, body: unknown): Promise<T> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? '요청에 실패했습니다.')
  return data as T
}

export const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string | undefined
/** 결제 기능 사용 가능 여부 (Supabase + 토스 키 모두 필요) */
export const paymentsEnabled = Boolean(supabase && TOSS_CLIENT_KEY)

/** 로그인 후 돌아갈 주소 저장/꺼내기 */
const NEXT_KEY = 'ijn_next'
export const setNext = (path: string) => {
  try {
    sessionStorage.setItem(NEXT_KEY, path)
  } catch {
    /* ignore */
  }
}
export const takeNext = () => {
  try {
    const v = sessionStorage.getItem(NEXT_KEY)
    sessionStorage.removeItem(NEXT_KEY)
    return v
  } catch {
    return null
  }
}

export const ORDER_STATUS: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  preparing: '상품 준비중',
  shipped: '배송중',
  delivered: '배송 완료',
  cancelled: '주문 취소',
  refunded: '환불 완료',
}
