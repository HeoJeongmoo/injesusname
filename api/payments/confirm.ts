// POST /api/payments/confirm — 토스 결제 성공 후 서버에서 금액을 검증하고 승인합니다.
import { admin, handle, HttpError, json, requireUser, tossCancel, tossConfirm } from '../_lib.js'

export const POST = handle(async (req) => {
  const user = await requireUser(req)
  const { paymentKey, orderId, amount } = (await req.json()) as { paymentKey: string; orderId: string; amount: number }
  if (!paymentKey || !orderId || !amount) throw new HttpError(400, '결제 정보가 올바르지 않습니다.')

  const db = admin()
  const { data: order, error } = await db.from('orders').select('*').eq('order_no', orderId).single()
  if (error || !order) throw new HttpError(404, '주문을 찾을 수 없습니다.')
  if (order.user_id !== user.id) throw new HttpError(403, '본인 주문만 결제할 수 있습니다.')

  // 새로고침 등으로 다시 호출된 경우
  if (order.status !== 'pending') {
    if (order.payment_key === paymentKey) return json({ ok: true, orderNo: order.order_no })
    throw new HttpError(409, '이미 처리된 주문입니다.')
  }
  // 금액 위변조 방지: 결제창에서 넘어온 금액과 서버에 저장된 주문 금액 비교
  if (Number(amount) !== order.total) throw new HttpError(400, '결제 금액이 주문 금액과 다릅니다.')

  const payment = await tossConfirm(paymentKey, orderId, order.total)

  // 재고 차감 (부족하면 결제 취소)
  const { error: stockErr } = await db.rpc('decrement_stock', { p_order: order.id })
  if (stockErr) {
    await tossCancel(paymentKey, '재고 부족으로 주문이 취소되었습니다.')
    await db.from('orders').update({ status: 'cancelled', payment_key: paymentKey }).eq('id', order.id)
    throw new HttpError(409, '결제 도중 재고가 소진되어 주문이 취소되었습니다. 결제는 자동으로 취소됩니다.')
  }

  await db
    .from('orders')
    .update({
      status: 'paid',
      payment_key: paymentKey,
      payment_method: payment.method ?? null,
      paid_at: payment.approvedAt ?? new Date().toISOString(),
    })
    .eq('id', order.id)

  return json({ ok: true, orderNo: order.order_no })
})
