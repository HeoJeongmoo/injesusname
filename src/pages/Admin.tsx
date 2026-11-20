import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_SELECT, useProducts } from '../context/ProductsContext'
import { supabase } from '../lib/supabase'
import { ORDER_STATUS, setNext } from '../lib/api'
import { fmtDate, won } from '../lib/format'
import type { OrderRow } from './Orders'

type Tab = 'orders' | 'products' | 'waitlist'

export default function Admin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('orders')

  useEffect(() => {
    if (!supabase || !user) return
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(Boolean(data)))
  }, [user])

  if (!supabase) return <Gate>Supabase 키를 설정하면 관리자 페이지를 쓸 수 있어요. (docs/SETUP.md)</Gate>
  if (!user) {
    setNext('/admin')
    return <Navigate to="/login" replace />
  }
  if (isAdmin === null) return <Gate>확인 중…</Gate>
  if (!isAdmin) return <Gate>관리자 계정이 아니에요. Supabase의 admins 테이블에 {user.email || '이 계정의 이메일'}을 추가해 주세요.</Gate>

  return (
    <section className="pt-16">
      <div className="px-5 md:px-8 pt-12 pb-6 border-b border-line flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="micro text-ash">Admin · {user.email}</p>
          <h1 className="mt-2 text-6xl md:text-7xl leading-none">DASHBOARD</h1>
        </div>
        <nav className="flex gap-6">
          {(
            [
              ['orders', '주문'],
              ['products', '상품·재고'],
              ['waitlist', '알림 신청'],
            ] as const
          ).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`micro link-line ${tab === k ? 'active text-bone' : 'text-ash hover:text-bone'}`}>
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="px-5 md:px-8 py-8">
        {tab === 'orders' && <OrdersTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'waitlist' && <WaitlistTab />}
      </div>
    </section>
  )
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[70svh] pt-16 flex items-center px-5 md:px-8">
      <div>
        <p className="micro text-ash">Admin</p>
        <p className="mt-4 text-bone/80 max-w-lg leading-relaxed">{children}</p>
        <Link to="/" className="btn btn-ghost mt-8">
          Home
        </Link>
      </div>
    </section>
  )
}

const input = 'bg-transparent border border-line px-2.5 h-9 text-sm outline-none focus:border-bone'

/* ───────────── 주문 ───────────── */
function OrdersTab() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [filter, setFilter] = useState('active')
  const [open, setOpen] = useState<string | null>(null)

  const load = useCallback(async () => {
    let q = supabase!.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(200)
    if (filter === 'active') q = q.in('status', ['paid', 'preparing', 'shipped'])
    else if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setOrders((data as OrderRow[]) ?? [])
  }, [filter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const update = async (id: string, patch: Partial<OrderRow>) => {
    const { error } = await supabase!.from('orders').update(patch).eq('id', id)
    if (error) alert(error.message)
    else load()
  }

  const paidSum = orders.filter((o) => !['pending', 'cancelled', 'refunded'].includes(o.status)).reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${input} bg-ink`}>
          <option value="active">처리할 주문 (결제완료·준비중·배송중)</option>
          <option value="all">전체</option>
          {Object.entries(ORDER_STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <span className="micro text-ash">
          {orders.length}건 · 매출 {won(paidSum)}
        </span>
      </div>

      <ul className="divide-y divide-line border-y border-line">
        {orders.map((o) => (
          <li key={o.id}>
            <button onClick={() => setOpen(open === o.id ? null : o.id)} className="w-full text-left py-4 grid grid-cols-2 md:grid-cols-[180px_150px_1fr_120px_110px] gap-2 md:gap-4 items-center">
              <span className="micro">{o.order_no}</span>
              <span className="micro text-ash">{fmtDate(o.created_at)}</span>
              <span className="text-sm truncate">
                {o.recipient} · {o.order_items.map((i) => `${i.name.toUpperCase()}(${i.size})×${i.qty}`).join(', ')}
              </span>
              <span className="micro">{won(o.total)}</span>
              <span className={`micro ${o.status === 'paid' ? 'text-signal' : 'text-ash'}`}>● {ORDER_STATUS[o.status]}</span>
            </button>
            {open === o.id && <OrderDetail o={o} onSave={(p) => update(o.id, p)} />}
          </li>
        ))}
        {!orders.length && <li className="py-10 text-ash text-sm">해당하는 주문이 없어요.</li>}
      </ul>
    </div>
  )
}

function OrderDetail({ o, onSave }: { o: OrderRow; onSave: (p: Partial<OrderRow>) => void }) {
  const [status, setStatus] = useState(o.status)
  const [courier, setCourier] = useState(o.courier ?? '')
  const [tracking, setTracking] = useState(o.tracking_no ?? '')

  return (
    <div className="pb-6 grid md:grid-cols-2 gap-6 text-sm">
      <div className="space-y-1 text-bone/80">
        <p>
          {o.recipient} · {o.phone}
        </p>
        <p>
          ({o.zipcode}) {o.address1} {o.address2}
        </p>
        {o.memo && <p className="text-ash">메모: {o.memo}</p>}
        <p className="text-ash">{o.email}</p>
        <p className="text-ash">
          상품 {won(o.items_total)} + 배송비 {won(o.shipping_fee)}
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} bg-ink`}>
            {Object.entries(ORDER_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="택배사" className={`${input} w-28`} />
          <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="송장번호" className={`${input} w-40`} />
          <button
            onClick={() => onSave({ status, courier: courier || null, tracking_no: tracking || null })}
            className="btn btn-solid h-9! px-4!"
          >
            저장
          </button>
        </div>
        {(status === 'cancelled' || status === 'refunded') && (
          <p className="text-[12px] text-signal">
            상태만 바뀝니다. 실제 결제 취소·환불은 토스페이먼츠 상점관리자에서 처리해 주세요.
          </p>
        )}
      </div>
    </div>
  )
}

/* ───────────── 상품·재고 ───────────── */
interface PRow {
  id: number
  name: string
  color: string | null
  price: number
  category: 'men' | 'women' | 'unisex'
  front: string | null
  back: string | null
  tag: string | null
  description: string | null
  active: boolean
  sort: number
  product_stock: { size: string; qty: number }[]
}

const SIZES = ['S', 'M', 'L', 'XL']

function ProductsTab() {
  const [rows, setRows] = useState<PRow[]>([])
  const { refresh } = useProducts()

  const load = useCallback(async () => {
    const { data } = await supabase!.from('products').select(`${PRODUCT_SELECT},active,sort`).order('sort').order('id')
    setRows((data as PRow[]) ?? [])
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const add = async () => {
    const { error } = await supabase!.from('products').insert({ name: 'new tee', price: 39000, active: false, sort: rows.length })
    if (error) alert(error.message)
    load()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={add} className="btn btn-solid h-10! px-5!">
          + 상품 추가
        </button>
        <span className="micro text-ash">숨김 상태로 추가돼요. 정보를 채운 뒤 “판매중”을 켜세요.</span>
      </div>
      {!rows.length && <p className="text-ash text-sm">상품이 없어요. supabase/seed.sql 을 실행하면 지금 사이트의 상품이 들어가요.</p>}
      <ul className="space-y-3">
        {rows.map((r) => (
          <ProductEditor
            key={r.id}
            row={r}
            onSaved={() => {
              load()
              refresh()
            }}
          />
        ))}
      </ul>
    </div>
  )
}

function ProductEditor({ row, onSaved }: { row: PRow; onSaved: () => void }) {
  const [p, setP] = useState(row)
  const [stock, setStock] = useState<Record<string, number>>(() =>
    Object.fromEntries(SIZES.map((s) => [s, row.product_stock.find((x) => x.size === s)?.qty ?? 0])),
  )
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const set = <K extends keyof PRow>(k: K, v: PRow[K]) => setP((x) => ({ ...x, [k]: v }))

  const upload = async (side: 'front' | 'back', file: File) => {
    const path = `${row.id}/${side}-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase!.storage.from('products').upload(path, file, { upsert: true })
    if (error) return setMsg(error.message)
    set(side, supabase!.storage.from('products').getPublicUrl(path).data.publicUrl)
  }

  const save = async () => {
    setBusy(true)
    setMsg(null)
    const { error } = await supabase!
      .from('products')
      .update({
        name: p.name,
        color: p.color || null,
        price: Number(p.price) || 0,
        category: p.category,
        front: p.front || null,
        back: p.back || null,
        tag: p.tag || null,
        description: p.description || null,
        active: p.active,
        sort: Number(p.sort) || 0,
      })
      .eq('id', row.id)
    const { error: sErr } = await supabase!
      .from('product_stock')
      .upsert(SIZES.map((size) => ({ product_id: row.id, size, qty: Math.max(0, Number(stock[size]) || 0) })))
    setBusy(false)
    if (error || sErr) setMsg((error ?? sErr)!.message)
    else {
      setMsg('저장됨')
      onSaved()
    }
  }

  const total = SIZES.reduce((n, s) => n + (Number(stock[s]) || 0), 0)

  return (
    <li className={`border border-line p-4 grid lg:grid-cols-[150px_1fr] gap-5 ${p.active ? '' : 'opacity-60'}`}>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {(['front', 'back'] as const).map((side) => (
          <label key={side} className="block cursor-pointer">
            <div className="aspect-[4/5] bg-ink-2 flex items-center justify-center overflow-hidden">
              {p[side] ? <img src={p[side]!} alt="" className="w-full h-full object-contain p-2" /> : <span className="micro text-ash">{side}</span>}
            </div>
            <span className="micro text-ash block mt-1">{side} 이미지 바꾸기</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(side, e.target.files[0])} />
          </label>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="micro text-ash w-10">#{row.id}</span>
          <input value={p.name} onChange={(e) => set('name', e.target.value)} placeholder="상품명" className={`${input} w-56`} />
          <input value={p.color ?? ''} onChange={(e) => set('color', e.target.value)} placeholder="색상" className={`${input} w-32`} />
          <input type="number" value={p.price} onChange={(e) => set('price', Number(e.target.value))} className={`${input} w-28`} />
          <input value={p.tag ?? ''} onChange={(e) => set('tag', e.target.value)} placeholder="태그 (NEW)" className={`${input} w-28`} />
          <select value={p.category} onChange={(e) => set('category', e.target.value as PRow['category'])} className={`${input} bg-ink`}>
            <option value="unisex">unisex</option>
            <option value="men">men</option>
            <option value="women">women</option>
          </select>
          <input type="number" value={p.sort} onChange={(e) => set('sort', Number(e.target.value))} title="정렬 순서 (작을수록 앞)" className={`${input} w-16`} />
          <label className="flex items-center gap-2 text-sm ml-2">
            <input type="checkbox" checked={p.active} onChange={(e) => set('active', e.target.checked)} /> 판매중
          </label>
        </div>
        <textarea
          value={p.description ?? ''}
          onChange={(e) => set('description', e.target.value)}
          placeholder="상품 설명"
          rows={2}
          className="w-full bg-transparent border border-line p-2.5 text-sm outline-none focus:border-bone"
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="micro text-ash">재고</span>
          {SIZES.map((s) => (
            <label key={s} className="flex items-center gap-1.5 text-sm">
              {s}
              <input
                type="number"
                min={0}
                value={stock[s]}
                onChange={(e) => setStock((x) => ({ ...x, [s]: Number(e.target.value) }))}
                className={`${input} w-16 ${Number(stock[s]) === 0 ? 'text-signal' : ''}`}
              />
            </label>
          ))}
          <span className="micro text-ash">합계 {total}</span>
          <button onClick={save} disabled={busy} className="btn btn-solid h-9! px-5! ml-auto">
            {busy ? '저장 중…' : '저장'}
          </button>
          {msg && <span className={`micro ${msg === '저장됨' ? 'text-ash' : 'text-signal'}`}>{msg}</span>}
        </div>
      </div>
    </li>
  )
}

/* ───────────── 알림 신청 ───────────── */
function WaitlistTab() {
  const [rows, setRows] = useState<{ email: string; source: string | null; created_at: string }[]>([])

  useEffect(() => {
    supabase!
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setRows(data ?? []))
  }, [])

  const csv = () => {
    const body = ['email,source,created_at', ...rows.map((r) => `${r.email},${r.source ?? ''},${r.created_at}`)].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' }))
    a.download = `injesusname-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <span className="micro text-ash">{rows.length}명</span>
        <button onClick={csv} disabled={!rows.length} className="btn btn-ghost h-10! px-5!">
          CSV 다운로드
        </button>
      </div>
      <ul className="divide-y divide-line border-y border-line max-w-2xl">
        {rows.map((r) => (
          <li key={r.email} className="py-3 flex justify-between gap-4 text-sm">
            <span>{r.email}</span>
            <span className="micro text-ash">
              {r.source} · {fmtDate(r.created_at)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
