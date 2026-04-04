# AG 한방 프롬프트: 사이트 전체 리빌드

아래를 AG에 통째로 복붙하면 됨.
토큰 초기화되면 "이어서 해줘. GEMINI.md 읽고 아직 안 한 것부터 계속해" 입력.

---

```
이 레포는 techblips.com — Hugo + PaperMod 기반 테크 블로그야.
GEMINI.md 파일을 먼저 읽고 모든 규칙을 따라.
main 브랜치에서 작업하고, 작업 완료되면 바로 commit + push 해줘.
Cloudflare Pages가 main push를 감지해서 자동 배포해.

사이트를 Vercel 블로그, Linear 블로그 수준으로 완전히 리디자인해줘.
아래 작업을 순서대로 전부 해줘. 하나 끝나면 commit + push 하고 다음 작업으로 넘어가.

## 절대 금지
- themes/ 폴더 수정 금지
- {{ define "head" }} 블록 사용 금지 (PaperMod에서 안 됨)
- head 확장은 반드시 layouts/partials/extend_head.html 사용

## 수정 가능한 파일
- assets/css/extended/custom.css (전부 다시 써도 됨)
- layouts/_default/single.html (이미 오버라이드됨)
- layouts/partials/extend_head.html
- layouts/partials/footer.html
- layouts/partials/newsletter.html
- layouts/partials/author-card.html
- static/css/radar.css
- static/js/radar.js (조심해서)
- layouts/radar/single.html
- hugo.toml
- content/about.md
- 필요하면 layouts/index.html, layouts/404.html 새로 생성 가능

## 디자인 스펙
- 색상: #6c5ce7 (보라), #0ea5e9 (파랑), #f59e0b (노랑), #10b981 (초록)
- 폰트: Inter (이미 로드됨)
- 느낌: 미니멀, 클린, 화이트스페이스 충분히, 프로페셔널
- 레퍼런스: Vercel Blog, Linear Blog, Raycast Blog

---

### TASK 1: 네비게이션 + 홈페이지

1. hugo.toml 네비게이션 메뉴:
   - 이모지 전부 제거
   - 메뉴 4개만: Home | Blog | Radar | About
   - AI, Dev Tools, Trending 카테고리 직링크 제거

2. 홈페이지 히어로 섹션:
   - 큰 임팩트 있는 타이틀 + 서브텍스트
   - CTA 버튼 2개 (Latest Posts, Tech Radar)
   - 서브틀한 그라데이션 배경
   - 프로페셔널하고 깔끔하게

3. 포스트 카드:
   - 카드 그리드 (데스크톱 2컬럼, 모바일 1컬럼)
   - 호버 시 올라가면서 그림자
   - 카테고리 뱃지, 날짜, 읽기 시간
   - 깔끔한 간격

→ commit + push 하고 다음으로

---

### TASK 2: 포스트 상세 페이지

1. 본문:
   - max-width: 720px 중앙 정렬
   - line-height: 1.8
   - 충분한 문단 간격

2. 코드 블록:
   - 다크 배경, 라운드 12px
   - 상단 언어 라벨
   - 인라인 코드는 accent 배경

3. 타이포그래피:
   - h2: 볼드, 하단 보더
   - h3: accent 색상
   - blockquote: 왼쪽 보더 + 연한 배경
   - 리스트 간격, 링크 호버

4. author-card.html:
   - 인라인 스타일 → CSS 클래스로
   - 아바타, 이름, 소개
   - 호버 그림자

5. 이전/다음 글, 태그, 공유 버튼 스타일

→ commit + push 하고 다음으로

---

### TASK 3: 레이더 페이지

1. 블립 인터랙션:
   - 호버 툴팁 (이름 + 카테고리 + 링)
   - 호버 시 블립 확대
   - 클릭 피드백

2. 사이드바:
   - 카드 형태 블립 리스트
   - 쿼드런트별 필터 버튼
   - 링별 필터

3. 레이아웃:
   - 레이더:사이드바 = 7:3
   - 쿼드런트 라벨 가독성
   - 상단 설명 텍스트

4. 모바일: 사이드바를 레이더 아래로

→ commit + push 하고 다음으로

---

### TASK 4: About + 마감

1. content/about.md 리라이팅
2. 검색 페이지 스타일
3. 카테고리/태그 페이지 스타일
4. layouts/404.html 생성
5. 스크롤 프로그레스 바 개선

→ commit + push 하고 다음으로

---

### TASK 5: 다크모드 + 반응형 전체 점검

1. 다크모드:
   - 모든 컴포넌트 [data-theme=dark] 대응
   - 카드, 히어로, 코드블록, 네비, 레이더 전부
   - 전환 시 부드럽게

2. 모바일 (860px 이하):
   - 카드 1컬럼
   - 네비 모바일 메뉴
   - 히어로 폰트 축소
   - 레이더 터치 대응
   - 전체 패딩/마진

3. 불필요한 CSS 정리, 성능 체크

→ 최종 commit + push

---

모든 작업이 끝나면 마지막에 이 메시지를 남겨줘:
"✅ 사이트 리빌드 완료. 모든 TASK commit + push 됨."
```
