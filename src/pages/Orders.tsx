import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ORDER_STATUS, setNext } from '../lib/api'
import { fmtDate, won } from '../lib/format'

export interface OrderRow {
  id: string
  order_no: string
  status: string
  total: number
  items_total: number
  shipping_fee: number
  created_at: string
  recipient: string
  phone: string
  zipcode: string
  address1: string
  address2: string | null
  memo: string | null
  email: string | null
  courier: string | null
  tracking_no: string | null
  order_items: { id: number; name: string; color: string | null; size: string; qty: number; price: number; image: string | null }[]
}


export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderRow[] | null>(null)

  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .neq('status', 'pending')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders((data as OrderRow[]) ?? []))
  }, [user])

  if (!supabase) {
    return (
      <Shell>
        <p className="text-ash">주문 조회는 온라인 결제 오픈과 함께 제공됩니다.</p>
      </Shell>
    )
  }
  if (!user) {
    setNext('/account/orders')
    return <Navigate to="/login" replace />
  }

  return (
    <Shell>
      {orders === null ? (
        <p className="text-ash">불러오는 중…</p>
      ) : orders.length === 0 ? (
        <div className="space-y-6">
          <p className="text-ash">아직 주문 내역이 없어요.</p>
          <Link to="/shop" className="btn btn-ghost">
            Shop
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {orders.map((o) => (
            <li key={o.id} className="py-6 grid md:grid-cols-[220px_1fr_auto] gap-4 md:gap-8">
              <div>
                <p className="micro">{o.order_no}</p>
                <p className="micro text-ash mt-1">{fmtDate(o.created_at)}</p>
                <p className={`micro mt-3 ${o.status === 'cancelled' || o.status === 'refunded' ? 'text-ash' : 'text-signal'}`}>
                  ● {ORDER_STATUS[o.status] ?? o.status}
                </p>
                {o.tracking_no && (
                  <p className="micro text-ash mt-1">
                    {o.courier} {o.tracking_no}
                  </p>
                )}
              </div>
              <ul className="space-y-3">
                {o.order_items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3">
                    <div className="w-12 aspect-[4/5] bg-ink-2 shrink-0">
                      {i.image && <img src={i.image} alt="" className="w-full h-full object-contain p-1" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-lg uppercase leading-tight truncate">{i.name}</p>
                      <p className="micro text-ash">
                        {i.color ? `${i.color} · ` : ''}
                        {i.size} · {i.qty}개
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="font-display text-2xl md:text-right">{won(o.total)}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[13px] text-ash mt-10">
        교환·반품·취소는 <Link to="/returns" className="underline">배송·교환·반품 안내</Link>를 확인해 주세요.
      </p>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="pt-16">
      <div className="px-5 md:px-8 pt-16 md:pt-24 pb-10 border-b border-line">
        <p className="micro text-ash">My account</p>
        <h1 className="mt-3 text-7xl md:text-[9vw] leading-[0.85]">ORDERS</h1>
      </div>
      <div className="px-5 md:px-8 py-10">{children}</div>
    </section>
  )
}
