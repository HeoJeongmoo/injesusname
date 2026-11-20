// Vercel 서버 함수 공용 도구 (파일명이 _ 로 시작하면 API 주소로 노출되지 않습니다)
import { createClient } from '@supabase/supabase-js'

// ⚠ src/config.ts 의 POLICY 와 같은 값으로 유지하세요. 실제 결제 금액은 이 값으로 계산됩니다.
export const SHIPPING_FEE = 3000
export const FREE_SHIPPING_OVER = 50000

const SUPABASE_URL = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)
  ?.trim()
  .replace(/\/+$/, '')
  .replace(/\/(rest|auth)\/v1$/, '')
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY

export function admin() {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new HttpError(500, '서버 설정이 완료되지 않았습니다. (SUPABASE_SERVICE_ROLE_KEY)')
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

/** Authorization: Bearer <supabase access token> 으로 로그인한 사용자 확인 */
export async function requireUser(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) throw new HttpError(401, '로그인이 필요합니다.')
  const { data, error } = await admin().auth.getUser(token)
  if (error || !data.user) throw new HttpError(401, '로그인 정보가 만료되었습니다. 다시 로그인해 주세요.')
  return data.user
}

export function handle(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await fn(req)
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status)
      console.error(e)
      return json({ error: '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, 500)
    }
  }
}

const tossAuth = () => {
  if (!TOSS_SECRET_KEY) throw new HttpError(500, '서버 설정이 완료되지 않았습니다. (TOSS_SECRET_KEY)')
  return 'Basic ' + Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')
}

export async function tossConfirm(paymentKey: string, orderId: string, amount: number) {
  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: { Authorization: tossAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })
  const body = await res.json()
  if (!res.ok) throw new HttpError(400, body?.message ?? '결제 승인에 실패했습니다.')
  return body as { method?: string; approvedAt?: string; status: string }
}

export async function tossCancel(paymentKey: string, reason: string) {
  await fetch(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(paymentKey)}/cancel`, {
    method: 'POST',
    headers: { Authorization: tossAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ cancelReason: reason }),
  })
}
