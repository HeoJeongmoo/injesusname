import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { loadTossPayments, type TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { POLICY } from '../config'
import { won } from '../lib/format'
import { api, paymentsEnabled, setNext, TOSS_CLIENT_KEY } from '../lib/api'
import { searchAddress } from '../lib/postcode'
import { supabase } from '../lib/supabase'

const ADDR_KEY = 'ijn_last_shipping'

interface Shipping {
  recipient: string
  phone: string
  zipcode: string
  address1: string
  address2: string
  memo: string
}

const EMPTY: Shipping = { recipient: '', phone: '', zipcode: '', address1: '', address2: '', memo: '' }
const MEMOS = ['문 앞에 놓아주세요', '경비실에 맡겨주세요', '배송 전 연락 바랍니다']

function loadShipping(): Shipping {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(ADDR_KEY) || '{}') }
  } catch {
    return EMPTY
  }
}

export default function Checkout() {
  const { lines, subtotal } = useCart()
  const { user } = useAuth()
  const [s, setS] = useState<Shipping>(loadShipping)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)
  const widgets = useRef<TossPaymentsWidgets | null>(null)

  const shippingFee = subtotal >= POLICY.freeShippingOver || subtotal === 0 ? 0 : POLICY.shippingFee
  const total = subtotal + shippingFee

  // 토스 결제위젯 렌더링
  useEffect(() => {
    if (!paymentsEnabled || !user || !lines.length || widgets.current) return
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await supabase!.auth.getUser()
        const toss = await loadTossPayments(TOSS_CLIENT_KEY!)
        const w = toss.widgets({ customerKey: data.user!.id })
        await w.setAmount({ currency: 'KRW', value: total })
        await Promise.all([
          w.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
          w.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
        ])
        if (!cancelled) {
          widgets.current = w
          setWidgetReady(true)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '결제 모듈을 불러오지 못했습니다.')
      }
    })()
    return () => {
      cancelled = true
    }
    // 금액 변경은 아래 effect에서 처리합니다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lines.length])

  useEffect(() => {
    widgets.current?.setAmount({ currency: 'KRW', value: total })
  }, [total])

  if (!lines.length) return <Navigate to="/cart" replace />

  if (supabase && !user) {
    setNext('/checkout')
    return <Navigate to="/login" replace />
  }

  const set = (k: keyof Shipping) => (e: { target: { value: string } }) => setS((p) => ({ ...p, [k]: e.target.value }))

  const findAddress = async () => {
    try {
      const r = await searchAddress()
      if (r) setS((p) => ({ ...p, zipcode: r.zipcode, address1: r.address }))
    } catch (e) {
      setError(e instanceof Error ? e.message : '주소 검색을 열지 못했습니다.')
    }
  }

  const pay = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!s.zipcode || !s.address1) return setError('주소 검색으로 배송지를 입력해 주세요.')
    if (s.phone.replace(/[^0-9]/g, '').length < 9) return setError('연락처를 정확히 입력해 주세요.')
    if (!agree) return setError('주문 내용 확인 및 결제 진행에 동의해 주세요.')
    if (!widgets.current) return setError('결제 모듈이 아직 준비되지 않았습니다.')

    setBusy(true)
    try {
      localStorage.setItem(ADDR_KEY, JSON.stringify(s))
      const order = await api<{ orderId: string; amount: number; orderName: string }>('/api/orders', {
        items: lines.map((l) => ({ id: l.id, size: l.size, qty: l.qty })),
        shipping: s,
      })
      // 서버가 계산한 금액으로 결제 (화면 금액과 다르면 서버 값이 우선)
      await widgets.current.setAmount({ currency: 'KRW', value: order.amount })
      await widgets.current.requestPayment({
        orderId: order.orderId,
        orderName: order.orderName,
        customerName: s.recipient,
        customerEmail: user?.email || undefined,
        customerMobilePhone: s.phone.replace(/[^0-9]/g, ''),
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      })
    } catch (err) {
      // 사용자가 결제창을 닫은 경우 등
      setError(err instanceof Error ? err.message : '결제를 진행하지 못했습니다.')
      setBusy(false)
    }
  }

  return (
    <section className="pt-16">
      <div className="px-5 md:px-8 pt-16 md:pt-24 pb-10 border-b border-line">
        <p className="micro text-ash">Secure checkout</p>
        <h1 className="mt-3 text-7xl md:text-[9vw] leading-[0.85]">CHECKOUT</h1>
      </div>

      <form onSubmit={pay} className="grid lg:grid-cols-[1fr_440px]">
        <div className="lg:border-r border-line">
          {/* 배송지 */}
          <div className="px-5 md:px-8 py-10 border-b border-line">
            <h2 className="text-3xl">SHIPPING</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-2xl">
              <input className="field" placeholder="받는 분" value={s.recipient} onChange={set('recipient')} required />
              <input className="field" placeholder="연락처 (010-0000-0000)" inputMode="tel" value={s.phone} onChange={set('phone')} required />
              <div className="sm:col-span-2 flex items-end gap-3">
                <input className="field flex-1" placeholder="우편번호" value={s.zipcode} readOnly onClick={findAddress} />
                <button type="button" onClick={findAddress} className="btn btn-ghost h-11! px-5! shrink-0">
                  주소 검색
                </button>
              </div>
              <input className="field sm:col-span-2" placeholder="기본 주소" value={s.address1} readOnly onClick={findAddress} />
              <input className="field sm:col-span-2" placeholder="상세 주소 (동·호수)" value={s.address2} onChange={set('address2')} />
              <input className="field sm:col-span-2" placeholder="배송 메모 (선택)" value={s.memo} onChange={set('memo')} list="memos" />
              <datalist id="memos">
                {MEMOS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="px-5 md:px-8 py-10">
            <h2 className="text-3xl">PAYMENT</h2>
            {paymentsEnabled ? (
              <div className="mt-6 rounded-md overflow-hidden bg-white max-w-2xl">
                <div id="payment-method" />
                <div id="agreement" />
                {!widgetReady && <p className="p-6 text-sm text-neutral-500">결제 수단을 불러오는 중…</p>}
              </div>
            ) : (
              <p className="mt-6 text-sm text-ash border border-line p-5 max-w-2xl leading-relaxed">
                온라인 결제는 오픈 준비 중입니다. (운영자: Supabase와 토스페이먼츠 키를 설정하면 결제가 켜집니다 — docs/SETUP.md)
              </p>
            )}
          </div>
        </div>

        {/* 주문 요약 */}
        <aside className="p-5 md:p-8 border-t lg:border-t-0 border-line">
          <div className="lg:sticky lg:top-24 space-y-5">
            <p className="micro text-ash">Order summary</p>
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <li key={`${l.id}-${l.size}`} className="flex gap-4 py-4">
                  <div className="w-16 aspect-[4/5] bg-ink-2 shrink-0">
                    <img src={l.product.image} alt="" className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg uppercase leading-tight truncate">{l.product.name}</p>
                    <p className="micro text-ash mt-1">
                      {l.product.color ? `${l.product.color} · ` : ''}
                      {l.size} · {l.qty}개
                    </p>
                  </div>
                  <p className="micro whitespace-nowrap">{won(l.product.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between micro">
              <span className="text-ash">Subtotal</span>
              <span>{won(subtotal)}</span>
            </div>
            <div className="flex justify-between micro">
              <span className="text-ash">Shipping</span>
              <span>{shippingFee ? won(shippingFee) : 'FREE'}</span>
            </div>
            {shippingFee > 0 && (
              <p className="text-[12px] text-ash">{won(POLICY.freeShippingOver - subtotal)} 더 담으면 무료배송</p>
            )}
            <div className="flex justify-between border-t border-line pt-5">
              <span className="font-display text-3xl">TOTAL</span>
              <span className="font-display text-3xl">{won(total)}</span>
            </div>

            <label className="flex items-start gap-2.5 text-[13px] text-ash cursor-pointer">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
              <span>
                주문 상품과 결제 금액을 확인했으며,{' '}
                <Link to="/terms" className="underline" target="_blank">
                  이용약관
                </Link>
                ·
                <Link to="/returns" className="underline" target="_blank">
                  교환·반품 규정
                </Link>
                에 동의합니다. (필수)
              </span>
            </label>

            {error && <p className="micro text-signal">{error}</p>}

            <button type="submit" disabled={!paymentsEnabled || !widgetReady || busy} className="btn btn-solid w-full">
              {busy ? '결제창 여는 중…' : `${won(total)} 결제하기`}
            </button>
          </div>
        </aside>
      </form>
    </section>
  )
}
