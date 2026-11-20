// 현재 src/data/products.ts 의 상품을 Supabase 초기 데이터(SQL)로 만듭니다.
// 실행: node --experimental-strip-types scripts/gen-seed.mjs > supabase/seed.sql
const { products } = await import('../src/data/products.ts')
const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const out = [
  '-- 상품 초기 데이터 (scripts/gen-seed.mjs 로 생성). schema.sql 실행 후 한 번만 실행하세요.',
  "-- 재고는 사이즈마다 10개로 넣었습니다. 관리자 페이지에서 바꿀 수 있어요.",
  'begin;',
]
products.forEach((p, i) => {
  out.push(
    `insert into public.products (id, name, color, price, category, front, back, tag, description, sort) values (${p.id}, ${q(p.name)}, ${q(p.color)}, ${p.price}, ${q(p.category)}, ${q(p.front)}, ${q(p.back)}, ${q(p.tag)}, ${q(p.description)}, ${i}) on conflict (id) do nothing;`,
  )
  for (const s of ['S', 'M', 'L', 'XL'])
    out.push(`insert into public.product_stock (product_id, size, qty) values (${p.id}, '${s}', 10) on conflict do nothing;`)
})
out.push("select setval(pg_get_serial_sequence('public.products', 'id'), (select max(id) from public.products));")
out.push('commit;')
console.log(out.join('\n'))
