# Antigravity: 0xHenry.dev 디자인 시스템 가이드

## 매 세션 시작 시 반드시 먼저 입력:
```
이 레포는 0xhenry.dev — Next.js 16 + Tailwind CSS 4 엔지니어 스터디 블로그.
GEMINI.md 파일을 먼저 읽고 규칙을 따라.
main 브랜치에서 작업. 완료되면 commit + push.
Vercel이 main push 감지해서 자동 배포.
```

---

# 🎨 SESSION 1: UI/UX 마이크로 인터랙션 + 레이아웃 최적화

```
0xhenry.dev의 UI/UX를 Linear, Vercel 수준으로 끌어올려줘.

먼저 GEMINI.md를 읽어.

## 현재 상태
- Next.js 16 + Tailwind CSS 4
- globals.css에 .card-hover, .nav-glass, .prose 시스템 있음
- 다크 모드 지원 (class 기반)
- 모바일 반응형 구현됨

## 수정 가능한 파일
- app/globals.css — 전역 스타일 (카드, 타이포, prose)
- app/[lang]/page.tsx — 홈페이지 (히어로 + 포스트 리스트)
- app/[lang]/study/page.tsx — 스터디 목록
- app/[lang]/study/[slug]/page.tsx — 포스트 상세
- components/Nav.tsx — 네비게이션
- components/SearchModal.tsx — 검색 모달

## 절대 금지
- app/api/ 수정 금지
- prisma/ 수정 금지
- lib/posts.ts 로직 변경 금지
- 새 npm 패키지 설치 금지

## 해야 할 것

### 1. 카드 인터랙션 고도화
- .card-hover에 border-color 트랜지션 추가
- 호버 시 accent glow 효과 강화
- 카드 간 stagger 애니메이션 (CSS @keyframes)

### 2. 네비게이션 리파인
- 스크롤 시 nav 배경 opacity 변화
- 현재 페이지 active 인디케이터
- 모바일 메뉴 열릴 때 부드러운 backdrop

### 3. 히어로 섹션
- 타이틀 그라데이션 텍스트 효과
- 서브텍스트 fade-in 애니메이션
- CTA 버튼 hover pulse

### 4. 포스트 상세 페이지
- 스크롤 프로그레스 바 (상단)
- 이미지 lazy loading skeleton
- 코드 블록 복사 버튼

### 5. 다크 모드 + 모바일
- 모든 변경사항 다크 모드 대응
- 640px 이하 터치 인터랙션 최적화

commit + push
```

---

# 🎥 SESSION 2: 유튜브 & 미디어 에셋 생성

```
0xHenry 유튜브 채널용 브랜드 에셋을 생성해줘.

먼저 GEMINI.md를 읽어.

## 브랜드 기준
- 메인 컬러: #0d9488 (Cyber Teal)
- 보조 컬러: #0f766e (darker), #10b981 (lighter green)
- 배경: #030712 (dark) / #ffffff (light)
- 폰트: Inter (Bold for titles, Regular for body)
- 로고: public/logo.svg (0x Henry.dev 배지)

## 생성할 파일

### 1. 썸네일 템플릿 (1280x720)
- public/images/youtube/thumb-template-dark.svg
- 다크 배경 + 서킷 패턴 + 텍스트 영역
- 0xHenry 로고 워터마크 (우하단)

### 2. 로워 서드 (Lower Third)
- public/images/youtube/lower-third.svg
- 투명 배경, 하단 좌측 이름 표시
- accent 컬러 언더라인

### 3. 포인트 아이콘 세트
- public/images/youtube/icons/check.svg
- public/images/youtube/icons/warning.svg
- public/images/youtube/icons/info.svg
- public/images/youtube/icons/arrow.svg
- 모두 accent 컬러, 투명 배경

### 4. 인트로/아웃트로 카드
- public/images/youtube/intro-card.svg
- public/images/youtube/outro-card.svg
- 0xHenry 로고 + Engineer Study 텍스트

commit + push
```

---

# 💎 SESSION 3: 브랜드 아이덴티티 정비

```
0xHenry 브랜드 시스템을 정비해줘.

먼저 GEMINI.md를 읽어.

## 해야 할 것

### 1. 컬러 팔레트 확장
- app/globals.css에 CSS 변수 추가:
  --accent: #0d9488
  --accent-hover: #0f766e
  --accent-light: #10b981
  --accent-glow: rgba(13, 148, 136, 0.15)
  --bg-primary / --bg-secondary / --bg-tertiary

### 2. 타이포그래피 감사
- heading 자간/행간 검토
- body 텍스트 16px 기준 가독성
- 코드 블록 폰트 사이즈 통일
- 모바일 폰트 스케일링

### 3. 로고 베리에이션
- public/images/brand/logo-dark.svg (다크 배경용)
- public/images/brand/logo-light.svg (라이트 배경용)
- public/images/brand/logo-mono.svg (단색)
- public/images/brand/logo-icon-only.svg (0xH 아이콘만)

### 4. OG 이미지 템플릿
- public/og-default.png 개선
- 포스트별 동적 OG는 나중에 (지금은 기본만)

commit + push
```

---

# 📝 SESSION 4: 콘텐츠 비주얼 퀄리티

```
블로그 콘텐츠의 비주얼 퀄리티를 올려줘.

먼저 GEMINI.md를 읽어.

## 해야 할 것

### 1. 코드 블록 미학
- 문법 강조 컬러 팔레트 정의 (Dracula 베이스)
- 코드 블록 상단 언어 라벨 + 파일명
- 라인 넘버 옵션
- app/globals.css .prose pre 스타일 개선

### 2. 포스트 헤더 아트
- 각 포스트 주제에 맞는 기하학적 SVG 헤더
- content/*/study/ 포스트에 통일된 헤더 스타일
- public/images/study/headers/ 디렉토리에 저장

### 3. 테이블 스타일 개선
- 스트라이프 행 (even/odd)
- 호버 하이라이트
- 모바일 가로 스크롤 + 그림자 힌트

### 4. 인용문 + 팁 박스
- blockquote 스타일 개선 (아이콘 추가)
- TIP / WARNING / NOTE 커스텀 블록 스타일
- 다크 모드 대응

### 5. 콘텐츠 폴리싱
- AI가 쓴 느낌 나는 문장 다듬기
- 두괄식 구조 확인 (결론 먼저)
- 단락 간격 + 소제목 위계 정리

commit + push
```

---

# 🛠️ SESSION 5: 주간 유지보수 (매주 반복)

```
GEMINI.md 먼저 읽어.
main 브랜치. commit + push.

매주 반복 작업:

### 1. 디자인 폴리시
- globals.css 호버/간격/그림자 미세 조정
- 다크 모드 깨진 부분 수정
- 모바일 레이아웃 확인 (640px 이하)

### 2. 콘텐츠 리뷰
- content/en/study/에서 포스트 퀄리티 개선
- content/ko/study/ 대응하는 한국어 포스트도 같이 수정
- AI 느낌 문장 제거
- 새 포스트 생성 금지

### 3. 브랜드 일관성
- 로고, 파비콘, OG 이미지 정상 확인
- 컬러 변수 사용 일관성
- 폰트 렌더링 확인

→ commit + push
끝나면: "주간 유지보수 완료."
```

---

# 세션 순서 및 활용 가이드

| 세션 | 용도 | 빈도 |
|------|------|------|
| 1 | UI/UX 마이크로 인터랙션 | 초기 1회 + 분기별 |
| 2 | 유튜브 에셋 생성 | 영상 업로드 전 |
| 3 | 브랜드 정비 | 초기 1회 + 분기별 |
| 4 | 콘텐츠 비주얼 | 포스트 작성 후 |
| 5 | 주간 유지보수 | 매주 |

## 활용 팁
- "Linear처럼 깔끔하게" 같은 의도(Intent) 기반 지시가 효과적
- 구체적 파일 + 스타일 레퍼런스를 함께 주면 정확도 상승
- 한 세션에 TASK 1개씩 집중 → 품질 유지
