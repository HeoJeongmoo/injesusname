// POST /api/orders — 결제 전에 주문서를 만듭니다. 금액은 반드시 서버에서 DB 가격으로 계산합니다.
import { admin, FREE_SHIPPING_OVER, handle, HttpError, json, requireUser, SHIPPING_FEE } from './_lib.js'

interface Body {
  items: { id: number; size: string; qty: number }[]
  shipping: { recipient: string; phone: string; zipcode: string; address1: string; address2?: string; memo?: string }
}

const orderNo = () => {
  const d = new Date(Date.now() + 9 * 3600 * 1000) // KST
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `IJN-${ymd}-${rand}`
}

export const POST = handle(async (req) => {
  const user = await requireUser(req)
  const body = (await req.json()) as Body
  const items = (body.items ?? []).filter((i) => i && i.qty > 0)
  const s = body.shipping ?? ({} as Body['shipping'])
  if (!items.length) throw new HttpError(400, '장바구니가 비어 있습니다.')
  if (!s.recipient?.trim() || !s.phone?.trim() || !s.zipcode?.trim() || !s.address1?.trim())
    throw new HttpError(400, '배송지 정보를 모두 입력해 주세요.')

  const db = admin()
  const ids = [...new Set(items.map((i) => i.id))]
  const { data: products, error } = await db
    .from('products')
    .select('id,name,color,price,front,back,active,product_stock(size,qty)')
    .in('id', ids)
  if (error) throw error

  let itemsTotal = 0
  const lines = items.map((i) => {
    const p = products?.find((x) => x.id === i.id)
    if (!p || !p.active) throw new HttpError(400, '판매가 종료된 상품이 있습니다. 장바구니를 확인해 주세요.')
    const stock = (p.product_stock as { size: string; qty: number }[]).find((x) => x.size === i.size)?.qty ?? 0
    if (stock < i.qty) throw new HttpError(409, `${p.name} (${i.size}) 재고가 부족합니다. 남은 수량: ${stock}`)
    const qty = Math.min(Math.floor(i.qty), 9)
    itemsTotal += p.price * qty
    return { product_id: p.id, name: p.name, color: p.color, size: i.size, price: p.price, qty, image: p.back ?? p.front }
  })

  const shippingFee = itemsTotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE
  const total = itemsTotal + shippingFee
  const no = orderNo()

  const { data: order, error: oErr } = await db
    .from('orders')
    .insert({
      order_no: no,
      user_id: user.id,
      email: user.email,
      items_total: itemsTotal,
      shipping_fee: shippingFee,
      total,
      recipient: s.recipient.trim(),
      phone: s.phone.replace(/[^0-9]/g, ''),
      zipcode: s.zipcode.trim(),
      address1: s.address1.trim(),
      address2: s.address2?.trim() || null,
      memo: s.memo?.trim() || null,
    })
    .select('id')
    .single()
  if (oErr) throw oErr

  const { error: iErr } = await db.from('order_items').insert(lines.map((l) => ({ ...l, order_id: order.id })))
  if (iErr) throw iErr

  const first = lines[0].name.toUpperCase()
  const count = lines.reduce((n, l) => n + l.qty, 0)
  return json({
    orderId: no,
    amount: total,
    itemsTotal,
    shippingFee,
    orderName: count > 1 ? `${first} 외 ${count - 1}건` : first,
  })
})
