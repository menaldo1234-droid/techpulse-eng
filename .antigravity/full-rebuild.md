# AG 작업 매뉴얼 — 0xHenry 디자인 & 운영

## 사용법
1. Antigravity 열기
2. techpulse-eng 레포 열기
3. 아래 세션 프롬프트를 **목적에 맞게** 복붙
4. 토큰 리셋되면: "이어서 해줘. GEMINI.md 읽고 아직 안 한 TASK부터 계속해. main 브랜치, commit + push."

---

# 빠른 시작 — 목적별 프롬프트

## 🎨 "디자인 손보기"
```
이 레포는 0xhenry.dev — Next.js 16 + Tailwind CSS 4 블로그.
GEMINI.md 먼저 읽어. main 브랜치. commit + push.

app/globals.css의 .card-hover, .nav-glass, .prose 스타일을 개선해줘.
Linear, Vercel 블로그 수준의 미니멀 미학.

체크리스트:
1. 카드 호버 — accent glow, 부드러운 translateY
2. 네비 — 스크롤 시 배경 opacity 변화
3. 다크 모드 — 모든 변경 대응
4. 모바일 640px — 터치 최적화
5. commit + push
```

## 🎥 "유튜브 썸네일 만들어줘"
```
이 레포는 0xhenry.dev. GEMINI.md 먼저 읽어. main. commit + push.

이번 영상 주제: [주제 입력]

public/images/youtube/ 에 썸네일 SVG 생성해줘.
- 1280x720, 다크 배경
- 브랜드 컬러 #0d9488
- 주제 텍스트 + 0xHenry 로고
- 기술적 배경 패턴 (서킷, 보드, 코드 등)
- commit + push
```

## 📝 "포스트 퀄리티 올려줘"
```
이 레포는 0xhenry.dev. GEMINI.md 먼저 읽어. main. commit + push.

content/en/study/와 content/ko/study/ 포스트들을 리뷰해줘.

규칙:
1. AI가 쓴 느낌 나는 문장 → 자연스럽게 수정
2. 두괄식 확인 — 결론이 맨 위?
3. 코드 블록 정확성 검증
4. description 150자 이내
5. EN/KO 버전 일관성
6. 새 포스트 생성 금지
7. commit + push
```

## 💎 "브랜드 에셋 만들어줘"
```
이 레포는 0xhenry.dev. GEMINI.md 먼저 읽어. main. commit + push.

브랜드 컬러: #0d9488 (Cyber Teal)
폰트: Inter
로고: public/logo.svg

[요청 내용 입력 — 예: "시즌 베리에이션 로고", "OG 이미지 개선" 등]

output은 public/images/brand/ 에 저장.
commit + push
```

## 🛠️ "긴급 수정"
```
이 레포는 0xhenry.dev. GEMINI.md 먼저 읽어. main. commit + push.

긴급 수정:
1. npm run build 에러 확인 및 수정
2. 깨진 레이아웃/CSS 수정
3. 다크 모드 깨진 부분 수정

에러 내용: [에러 설명 입력]

수정 후 commit + push
```

---

# 전체 디자인 리뉴얼 (초기 세팅용, 순서대로)

```
이 레포는 0xhenry.dev — Next.js 16 + Tailwind CSS 4 엔지니어 스터디 블로그.
GEMINI.md 먼저 읽고 모든 규칙을 따라.
main 브랜치에서 작업. 완료되면 바로 commit + push.
Vercel이 main push 감지해서 자동 배포.

## 브랜드 기준
- 컬러: #0d9488 (accent), #0f766e (hover), #10b981 (light)
- 폰트: Inter
- 레퍼런스: Vercel Blog, Linear Blog, Raycast Blog
- 다크 모드 우선

## 수정 가능한 파일
- app/globals.css — 전역 스타일
- app/[lang]/page.tsx — 홈페이지
- app/[lang]/study/page.tsx — 스터디 목록
- app/[lang]/study/[slug]/page.tsx — 포스트 상세
- components/Nav.tsx — 네비게이션
- components/SearchModal.tsx — 검색
- lib/i18n.ts — UI 텍스트

## 절대 금지
- app/api/ 수정 금지
- prisma/ 수정 금지
- .github/workflows/ 수정 금지
- 새 npm 패키지 설치 금지

### TASK 1: 마이크로 인터랙션
1. 카드 호버 — glow + border transition
2. 네비 — scroll opacity + active indicator
3. 히어로 — gradient text + fade-in
→ commit + push

### TASK 2: 타이포그래피 + 코드 블록
1. heading 위계 정비 (h1~h4)
2. 코드 블록 — 언어 라벨, 복사 버튼
3. blockquote — 아이콘 + 배경
→ commit + push

### TASK 3: 모바일 + 다크모드 QA
1. 전체 다크모드 점검
2. 640px 이하 모바일 점검
3. 불필요한 CSS 정리
→ commit + push

### TASK 4: 유튜브 에셋
1. 썸네일 템플릿 SVG
2. 로워 서드 SVG
3. 포인트 아이콘 세트
→ commit + push

끝나면: "전체 리뉴얼 완료. 모든 TASK commit + push 됨."
```

---

# 작업 캘린더

| 언제 | 세션 | 뭘 하나 |
|------|------|---------|
| 처음 1회 | 전체 리뉴얼 | UI/UX + 브랜드 + 유튜브 에셋 |
| 매주 1회 | 디자인 폴리시 | CSS 미세 조정 + 콘텐츠 리뷰 |
| 영상 전 | 썸네일 | 주제별 유튜브 썸네일 생성 |
| 포스트 후 | 퀄리티 | 콘텐츠 폴리싱 + 비주얼 개선 |
| 에러 시 | 긴급 | 빌드 에러, 레이아웃 수정 |
