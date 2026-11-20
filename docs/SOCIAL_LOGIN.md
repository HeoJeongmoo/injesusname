# 소셜 로그인(카카오·구글) 설정 가이드

사이트 코드는 이미 준비되어 있습니다. 아래 키만 넣으면 카카오·구글·이메일 로그인이 실제로 동작합니다.
키를 넣기 전에는 이메일 로그인이 브라우저 저장 방식(데모)으로 동작하고, 소셜 버튼은 "준비 중" 안내를 띄웁니다.

> 콘솔 메뉴 이름은 각 서비스 업데이트에 따라 조금씩 다를 수 있습니다.

## 1. Supabase 프로젝트 만들기 (무료)
1. https://supabase.com 가입 → New project (Region: Northeast Asia (Seoul))
2. Project Settings → API 에서 두 값을 복사
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
3. Vercel → 프로젝트 → Settings → Environment Variables 에 위 두 값을 추가 → Redeploy
   (내 컴퓨터에서 테스트할 때는 `.env.example`을 복사해 `.env.local`을 만들고 같은 값을 넣기)
4. Authentication → URL Configuration
   - Site URL: `https://<내-도메인>`
   - Redirect URLs: `https://<내-도메인>/login`, `http://localhost:5173/login`

아래 두 콘솔에 넣을 **콜백 주소**는 모두 같습니다:
`https://<프로젝트ID>.supabase.co/auth/v1/callback`

## 2. 카카오
1. https://developers.kakao.com → 내 애플리케이션 → 애플리케이션 추가
2. 플랫폼 → Web → 사이트 도메인에 `https://<내-도메인>` 등록
3. 카카오 로그인 → 활성화 ON, Redirect URI에 위 **콜백 주소** 등록
4. 동의항목 → 닉네임, 프로필 사진 설정. 이메일(카카오계정)은 비즈 앱 전환(개인 개발자도 가능) 후 설정할 수 있습니다.
5. 보안 → Client Secret 코드 생성 후 활성화
6. Supabase → Authentication → Sign In / Providers → Kakao 켜기
   - Client ID: 앱 키의 **REST API 키**
   - Client Secret: 5번에서 만든 코드
   - 이메일 동의항목을 받지 않는다면 "Allow users without an email" 을 켜기

## 3. 구글
1. https://console.cloud.google.com → 새 프로젝트
2. API 및 서비스 → OAuth 동의 화면(브랜딩) 작성 (앱 이름 INJESUSNAME, 지원 이메일)
3. 사용자 인증 정보 → OAuth 클라이언트 ID 만들기 → 웹 애플리케이션
   - 승인된 JavaScript 원본: `https://<내-도메인>`
   - 승인된 리디렉션 URI: 위 **콜백 주소**
4. Supabase → Providers → Google 켜기 → Client ID / Client Secret 붙여넣기

## 참고
- 이메일 회원가입은 Supabase가 인증 메일을 보냅니다. 무료 기본 메일 서버는 시간당 발송량이 적으니, 런칭 전에 Authentication → SMTP 에서 외부 메일 서비스를 연결하는 것을 권장합니다.
- 이전 데모 방식(브라우저 저장)으로 가입한 계정은 Supabase로 옮겨지지 않습니다.
