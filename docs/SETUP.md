# INJESUSNAME 운영 설정 가이드

코드는 모두 준비되어 있습니다. 아래 순서대로 키를 넣으면 기능이 하나씩 켜집니다.
키가 없을 때는 사이트가 지금처럼 "보여주기 모드"(정적 상품, 결제 준비 중 안내)로 동작합니다.

| 단계 | 켜지는 기능 | 필요한 것 |
|---|---|---|
| 0 | 사업자 정보·약관 | `src/config.ts` 의 `BUSINESS`, `POLICY`, `SIZE_CHART` 값 채우기 |
| 1 | 회원가입·로그인, 알림 신청 저장, 상품·재고 DB | Supabase 프로젝트 |
| 2 | 카카오·구글 로그인 | 각 개발자 콘솔 키 → `docs/SOCIAL_LOGIN.md` |
| 3 | 결제·주문·관리자 | 사업자등록 → 토스페이먼츠 가입 |

## 0. 사업자 정보 채우기
`src/config.ts` 에서 `[대표자명]` 처럼 대괄호로 된 값을 실제 값으로 바꿉니다.
통신판매업 신고 전에는 결제를 열면 안 됩니다. 약관(`/terms`), 개인정보처리방침(`/privacy`)은 초안이므로 실제 운영 방식에 맞는지 검토하세요.

## 1. Supabase
1. supabase.com → New project (Region: Seoul)
2. **SQL Editor** 에서 `supabase/schema.sql` 전체를 붙여넣고 Run
   - 파일 맨 아래 `'[관리자 이메일]'` 을 관리자로 쓸 로그인 이메일로 바꿔서 실행
3. 이어서 `supabase/grants.sql` 실행 (schema.sql 에도 포함되어 있지만, 이전 버전으로 만들었다면 따로 실행)
4. 이어서 `supabase/seed.sql` 실행 → 현재 상품 28개와 재고(사이즈별 10개)가 들어갑니다
4. Project Settings → API 에서 키 복사 → Vercel → Settings → Environment Variables

| 이름 | 값 | 비고 |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL | |
| `VITE_SUPABASE_ANON_KEY` | anon public key | 브라우저에 공개돼도 되는 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | **서버 전용. 절대 VITE_ 를 붙이거나 코드에 넣지 마세요** |

5. Authentication → URL Configuration
   - Site URL: `https://<내-도메인>`
   - Redirect URLs: `https://<내-도메인>/login`, `http://localhost:5173/login`
6. Vercel 에서 Redeploy

이제 상품 목록은 DB에서 읽고, 관리자 페이지(`/admin`)에서 상품·가격·재고·이미지를 바꿀 수 있습니다.
(DB가 비어 있으면 `src/data/products.ts` 의 상품을 계속 보여줍니다.)

## 2. 소셜 로그인
`docs/SOCIAL_LOGIN.md` 참고.

## 3. 토스페이먼츠 결제
1. 사업자등록 → 통신판매업 신고 → tosspayments.com 가입·계약
2. 개발자센터 → API 키 → **결제위젯 연동 키** 복사 (계약 전에도 테스트 키로 결제 흐름을 시험할 수 있습니다)

| 이름 | 값 |
|---|---|
| `VITE_TOSS_CLIENT_KEY` | 클라이언트 키 (`test_gck_...` / 실서비스 `live_gck_...`) |
| `TOSS_SECRET_KEY` | 시크릿 키 (`test_gsk_...`) — **서버 전용** |

3. Redeploy 하면 장바구니 → Checkout 이 열립니다.

### 결제 흐름 (보안)
1. `/checkout` 에서 배송지 입력 → 결제하기
2. 서버(`/api/orders`)가 **DB 가격으로 금액을 다시 계산**하고 재고를 확인한 뒤 주문서(결제 대기)를 만듭니다
3. 토스 결제창 → 성공 시 `/checkout/success`
4. 서버(`/api/payments/confirm`)가 주문 금액과 결제 금액이 같은지 확인 → 토스 승인 → 재고 차감 → 결제 완료
   - 승인 직전에 재고가 없어지면 결제를 자동 취소합니다
5. 고객은 `/account/orders`, 관리자는 `/admin` 에서 주문을 확인

### 관리자 페이지 `/admin`
- **주문**: 상태 변경(상품 준비중 → 배송중 → 배송 완료), 택배사·송장번호 입력, 매출 합계
- **상품·재고**: 이름·색상·가격·태그·설명·정렬, 판매중/숨김, 사이즈별 재고, 앞/뒤 이미지 업로드
- **알림 신청**: 드롭 알림 신청 이메일 목록, CSV 다운로드
- 주문을 "취소/환불"로 바꿔도 실제 결제 취소는 되지 않습니다. 토스페이먼츠 상점관리자에서 처리하세요.

## 금액 설정 위치
배송비·무료배송 기준은 두 곳에 있습니다. 바꿀 때 **둘 다** 바꾸세요.
- 화면 표시: `src/config.ts` → `POLICY`
- 실제 결제 금액: `api/_lib.ts` → `SHIPPING_FEE`, `FREE_SHIPPING_OVER`
