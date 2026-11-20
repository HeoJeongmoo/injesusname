-- ============================================================
-- 테이블 접근 권한 (최근 만든 Supabase 프로젝트는 새 테이블에 권한이 자동으로 붙지 않습니다)
-- schema.sql 다음에 실행하세요. 여러 번 실행해도 안전합니다.
-- 실제로 누가 어떤 행을 보고 고칠 수 있는지는 schema.sql 의 RLS 정책이 결정합니다.
-- ============================================================
grant usage on schema public to anon, authenticated, service_role;

-- 누구나: 상품·재고 보기, 알림 신청
grant select on public.products, public.product_stock to anon, authenticated;
grant insert on public.waitlist to anon, authenticated;

-- 로그인 사용자: 본인 주문 보기 / 관리자(RLS로 제한): 상품·재고·주문 수정, 알림 신청 목록
grant select, insert, update, delete on public.products, public.product_stock to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items, public.waitlist to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- 서버(결제 함수)
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
