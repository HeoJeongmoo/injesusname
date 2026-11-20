import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { api } from '../lib/api'

/** /checkout/success — 토스에서 돌아오면 서버에 결제 승인을 요청합니다 */
export function CheckoutSuccess() {
  const [params] = useSearchParams()
  const { clear } = useCart()
  const { refresh } = useProducts()
  const [state, setState] = useState<{ status: 'loading' | 'ok' | 'error'; message?: string; orderNo?: string }>({ status: 'loading' })
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    api<{ orderNo: string }>('/api/payments/confirm', {
      paymentKey: params.get('paymentKey'),
      orderId: params.get('orderId'),
      amount: Number(params.get('amount')),
    })
      .then((r) => {
        clear()
        refresh()
        setState({ status: 'ok', orderNo: r.orderNo })
      })
      .catch((e: Error) => setState({ status: 'error', message: e.message }))
  }, [params, clear, refresh])

  return (
    <Result
      title={state.status === 'ok' ? 'THANK YOU.' : state.status === 'error' ? 'PAYMENT FAILED' : 'CONFIRMING…'}
      eyebrow={state.status === 'ok' ? `Order ${state.orderNo}` : 'Payment'}
    >
      {state.status === 'loading' && <p className="text-ash">결제를 확인하고 있어요. 창을 닫지 말아 주세요.</p>}
      {state.status === 'ok' && (
        <>
          <p className="text-bone/80">주문이 완료되었습니다. 출고되면 주문 내역에서 송장번호를 확인할 수 있어요.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link to="/account/orders" className="btn btn-solid">
              주문 내역 보기
            </Link>
            <Link to="/shop" className="btn btn-ghost">
              계속 쇼핑하기
            </Link>
          </div>
        </>
      )}
      {state.status === 'error' && (
        <>
          <p className="text-signal">{state.message}</p>
          <Link to="/checkout" className="btn btn-ghost mt-10">
            다시 시도하기
          </Link>
        </>
      )}
    </Result>
  )
}

/** /checkout/fail — 결제창에서 취소하거나 실패한 경우 */
export function CheckoutFail() {
  const [params] = useSearchParams()
  const canceled = params.get('code') === 'PAY_PROCESS_CANCELED'
  return (
    <Result title={canceled ? 'CANCELED' : 'PAYMENT FAILED'} eyebrow="Payment">
      <p className="text-bone/80">{canceled ? '결제를 취소했어요.' : params.get('message') ?? '결제에 실패했습니다.'}</p>
      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Link to="/checkout" className="btn btn-solid">
          다시 결제하기
        </Link>
        <Link to="/cart" className="btn btn-ghost">
          장바구니로
        </Link>
      </div>
    </Result>
  )
}

function Result({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="min-h-[80svh] pt-16 flex items-center">
      <div className="px-5 md:px-8 py-20 max-w-2xl">
        <p className="micro text-ash">{eyebrow}</p>
        <h1 className="text-7xl md:text-9xl leading-[0.85] mt-3 mb-8">{title}</h1>
        {children}
      </div>
    </section>
  )
}
