# 슬라이드 패키지: ZED X Mini + Jetson

**영상 제목:** ZED X Mini + Jetson: 30일간의 삽질 끝에 성공
**날짜:** 2026-04-10
**Pillar:** 로봇공학
**예상 길이:** 18분
**슬라이드 수:** 12장
**StackPulse 슬러그:** /study/zed-x-mini-jetson-setup

---

## 슬라이드 1: 타이틀

**화면에 표시:**
```
ZED X Mini + Jetson
30일간의 삽질 끝에 성공

0xH — 헥세이치
```

**할 말 (KO):**
> 안녕하세요, 로봇 엔지니어 헥세이치입니다.
> 오늘은 ZED X Mini 스테레오 카메라를 Jetson에 연결하는 과정을 공유합니다.
> 공식 문서에는 연결하고 SDK 설치하면 끝이라고 하는데, 저는 한 달 걸렸습니다.

**EN subtitle:**
> Hi, I'm 0xH, a robotics engineer.
> Today I'll share how I connected a ZED X Mini stereo camera to a Jetson.
> The official docs say just plug in and install the SDK. It took me 30 days.

---

## 슬라이드 2: 목차

**화면에 표시:**
```
오늘 다룰 내용

1. GMSL2란? — USB와 뭐가 다른가
2. 보드 3개 × JetPack 4개 — 조합 테스트
3. 최종 동작 스택 공개
```

**할 말 (KO):**
> 오늘 다룰 내용입니다.
> 첫 번째, GMSL2가 뭔지, 왜 USB처럼 안 되는지.
> 두 번째, 보드 3개와 JetPack 4개 버전을 조합 테스트한 과정.
> 세 번째, 최종 동작하는 스택.

**EN subtitle:**
> Here's what we'll cover.
> First, what GMSL2 is and why it's not like USB.
> Second, testing 3 boards with 4 JetPack versions.
> Third, the final working stack.

---

## 슬라이드 3: GMSL2란?

**화면에 표시:**
```
GMSL2 (Gigabit Multimedia Serial Link)

USB 카메라:  PC ──USB──> 카메라    ← 플러그 앤 플레이
GMSL2 카메라: Jetson ──CSI──> 디시리얼라이저 ──GMSL2──> 카메라

필요 조건:
✓ GMSL2 디시리얼라이저가 있는 보드
✓ 맞는 JetPack 버전
✓ 맞는 ZED SDK + ZED Link 드라이버
→ 하나라도 안 맞으면? 카메라가 "조용히" 안 잡힘
```

**할 말 (KO):**
> ZED X Mini는 일반 USB 카메라가 아닙니다.
> GMSL2라는 프로토콜을 사용합니다.
> Gigabit Multimedia Serial Link의 약자인데, 원래 자동차 쪽에서 쓰는 고속 카메라 연결 방식입니다.
> USB 카메라는 꽂으면 바로 되잖아요.
> GMSL2는 이렇게 디시리얼라이저를 거쳐야 합니다.
> 그래서 보드, JetPack, SDK 버전이 전부 맞아야 되는데,
> 하나라도 안 맞으면 에러도 안 나오고 카메라가 그냥 없는 겁니다.
> 이게 가장 힘든 부분이었습니다.

**EN subtitle:**
> The ZED X Mini is not a regular USB camera.
> It uses GMSL2 — Gigabit Multimedia Serial Link.
> Originally designed for automotive high-speed camera connections.
> USB cameras just work when you plug them in.
> GMSL2 needs a deserializer in between.
> So the board, JetPack, and SDK versions must all match.
> If anything's off, there's no error — the camera just silently doesn't exist.
> That was the hardest part.

---

## 슬라이드 4: 시도 1 — reComputer

**화면에 표시:**
```
시도 1: Seeed Studio reComputer

✓ Jetson Orin NX 탑재
✓ 인기 있는 보드
✗ GMSL2 커넥터: FAKRA 방식

[reComputer 보드 사진]
```

**할 말 (KO):**
> 처음에 Seeed Studio의 reComputer를 사용했습니다.
> Jetson Orin NX가 탑재된 보드인데, 꽤 인기 있는 제품입니다.
> 이걸로 해보겠습니다.

**EN subtitle:**
> I started with the Seeed Studio reComputer.
> It has a Jetson Orin NX onboard — a pretty popular board.
> Let's try this one.

---

## 슬라이드 5: [화면녹화] reComputer 설치 과정

> **[화면 전환: 화면녹화]**

**할 말 (KO):**
> JetPack 6.0을 설치하고, ZED SDK를 깔겠습니다.
> 설치는 잘 됩니다. 에러 없이 끝나요.
> 이제 zed-explorer를 실행하면...
> 아무것도 안 뜹니다.
> 카메라가 없다고 나옵니다.
> 에러 메시지도 없습니다. 그냥 조용합니다.

**EN subtitle:**
> Installing JetPack 6.0, then the ZED SDK.
> Installation goes fine. No errors.
> Now running zed-explorer...
> Nothing shows up.
> It says no camera found.
> No error messages. Just silence.

---

## 슬라이드 6: reComputer 실패 원인

**화면에 표시:**
```
❌ 실패 원인

reComputer GMSL2 커넥터: FAKRA 방식
ZED X Mini GMSL2 핀 배열: 비호환

→ 공식 문서 어디에도 안 써있음
→ 커넥터가 물리적으로 맞아도 신호가 안 감

교훈: 보드의 GMSL2 커넥터 타입을 먼저 확인할 것
```

**할 말 (KO):**
> 원인을 찾아봤습니다.
> reComputer는 GMSL2 커넥터가 FAKRA 방식입니다.
> ZED X Mini의 핀 배열과 호환이 안 됩니다.
> 커넥터가 물리적으로는 꽂히는데, 신호가 안 가는 겁니다.
> 이건 공식 문서 어디에도 안 써있었습니다.
> 여기서 일주일을 날렸습니다.

**EN subtitle:**
> I investigated the cause.
> The reComputer uses FAKRA-style GMSL2 connectors.
> They're not compatible with the ZED X Mini's pin layout.
> The connector physically fits, but the signal doesn't go through.
> This wasn't documented anywhere.
> Lost a week here.

---

## 슬라이드 7: 시도 2 — Waveshare 보드

**화면에 표시:**
```
시도 2: Waveshare Orin NX

✓ Jetson Orin NX 탑재
✓ 22-pin CSI 네이티브 커넥터 ← 핵심!
✓ ZED X Mini와 물리적 호환

[Waveshare 보드 사진 + 22-pin 커넥터 강조]
```

**할 말 (KO):**
> 그래서 보드를 바꿨습니다.
> Waveshare Orin NX 보드입니다.
> 중요한 건 22-pin CSI 네이티브 커넥터가 있다는 겁니다.
> 이게 ZED X Mini와 물리적으로 호환됩니다.

**EN subtitle:**
> So I switched boards.
> The Waveshare Orin NX.
> The key feature — it has a native 22-pin CSI connector.
> This is physically compatible with the ZED X Mini.

---

## 슬라이드 8: [화면녹화] JetPack 버전 테스트

> **[화면 전환: 화면녹화]**

**할 말 (KO):**
> JetPack 6.1로 시도합니다.
> 설치 완료. zed-explorer 실행...
> 이번에도 카메라가 안 잡힙니다.
> dmesg를 보면 디바이스 트리에 ZED 관련 엔트리가 없습니다.
>
> JetPack 6.2로 올려봅니다.
> 이번엔 카메라가 잡히긴 합니다! 근데 프레임이 안 나옵니다.
> 한 발짝 전진입니다.

**EN subtitle:**
> Trying JetPack 6.1.
> Installation done. Running zed-explorer...
> Camera still not detected.
> dmesg shows no ZED-related device tree entries.
>
> Upgrading to JetPack 6.2.
> This time the camera appears! But no frames come through.
> One step forward.

---

## 슬라이드 9: JetPack 버전별 결과

**화면에 표시:**
```
JetPack 버전별 결과

| JetPack | L4T     | 카메라 인식 | 프레임 출력 |
|---------|---------|-----------|-----------|
| 6.0     | 36.2.0  | ❌         | ❌         |
| 6.1     | 36.3.0  | ❌         | ❌         |
| 6.2     | 36.3.1  | ✅         | ❌         |
| 6.2.1   | 36.4.0  | ✅         | ✅         |

→ ZED Link 1.4.0이 L4T 36.4.0을 요구
→ JetPack 6.2.1 = L4T 36.4.0
```

**할 말 (KO):**
> 정리하면 이렇습니다.
> JetPack 6.0, 6.1은 카메라 인식 자체가 안 됩니다.
> 6.2는 인식은 되는데 프레임이 안 나옵니다.
> 6.2.1에서 드디어 전부 동작합니다.
> 이유는 ZED Link 1.4.0 드라이버가 L4T 36.4.0을 요구하는데,
> 그게 JetPack 6.2.1에 대응하는 버전이기 때문입니다.
> 이 표 하나 만드는 데 3주가 걸렸습니다.

**EN subtitle:**
> Here's the summary.
> JetPack 6.0 and 6.1 — camera not even detected.
> 6.2 — detected but no frames.
> 6.2.1 — everything works.
> The reason: ZED Link 1.4.0 requires L4T 36.4.0,
> which corresponds to JetPack 6.2.1.
> This one table took three weeks to figure out.

---

## 슬라이드 10: 최종 동작 스택

**화면에 표시:**
```
✅ 최종 동작 스택

| 항목      | 버전                           |
|----------|-------------------------------|
| 보드      | Waveshare Orin NX (22-pin CSI) |
| JetPack  | 6.2.1 (L4T 36.4.0)            |
| ZED SDK  | 5.2.1                         |
| ZED Link | 1.4.0                         |

설치 명령어 (3줄):
$ sudo apt install zed-link
$ sudo apt install zed-sdk
$ zed-explorer
```

**할 말 (KO):**
> 최종 동작하는 조합은 이겁니다.
> Waveshare 보드에 22-pin CSI 커넥터.
> JetPack 6.2.1. ZED SDK 5.2.1. ZED Link 1.4.0.
> 설치는 딱 세 줄입니다.
> sudo apt install zed-link, sudo apt install zed-sdk, zed-explorer.

**EN subtitle:**
> Here's the final working combination.
> Waveshare board with 22-pin CSI connector.
> JetPack 6.2.1. ZED SDK 5.2.1. ZED Link 1.4.0.
> Installation is just three commands.

> **[화면 전환: 화면녹화 — zed-explorer 실행, depth 영상 출력]**

**할 말 (KO):**
> 실행합니다.
> depth 영상이 나옵니다.
> 한 달 만에 첫 프레임입니다.

**EN subtitle:**
> Running it now.
> There's the depth feed.
> First frame after 30 days.

---

## 슬라이드 11: 정리

**화면에 표시:**
```
📌 핵심 정리

1. 22-pin CSI 네이티브 보드를 쓸 것
   → FAKRA 방식 보드는 ZED X Mini와 비호환

2. JetPack + ZED Link 버전을 정확히 맞출 것
   → 현재: JetPack 6.2.1 + ZED Link 1.4.0

3. 이 카메라의 실패 모드는 "침묵"
   → 에러가 안 나오므로 버전 조합을 체계적으로 테스트
```

**할 말 (KO):**
> 오늘 내용을 정리하면:
> 첫 번째, 22-pin CSI 네이티브 보드를 쓰세요. FAKRA 방식은 안 됩니다.
> 두 번째, JetPack과 ZED Link 드라이버 버전이 정확히 맞아야 합니다. 현재 기준 JetPack 6.2.1과 ZED Link 1.4.0입니다.
> 세 번째, 이 카메라의 실패 모드는 침묵입니다. 에러가 안 나오기 때문에, 버전 조합을 체계적으로 테스트하는 수밖에 없습니다.

**EN subtitle:**
> To summarize:
> First, use a board with native 22-pin CSI. FAKRA-type won't work.
> Second, JetPack and ZED Link versions must match exactly. Currently JetPack 6.2.1 and ZED Link 1.4.0.
> Third, the failure mode is silence. No errors, so you have to systematically test version combinations.

---

## 슬라이드 12: 아웃트로

**화면에 표시:**
```
📝 블로그: techblips.com/study/zed-x-mini-jetson-setup
다음 영상: ZED SDK — Depth Map 추출 & 포인트 클라우드

구독 & 좋아요
0xH — 헥세이치
```

**할 말 (KO):**
> 전체 트러블슈팅 과정과 코드는 StackPulse 블로그에 정리했습니다.
> 링크는 설명란에 있습니다.
> 다음에는 ZED SDK로 depth map을 추출하고 포인트 클라우드를 만드는 걸 해보겠습니다.
> 도움이 됐다면 구독 부탁드립니다.
> 헥세이치였습니다.

**EN subtitle:**
> Full troubleshooting details and code are on the StackPulse blog.
> Link in the description.
> Next time, I'll extract depth maps and create point clouds with the ZED SDK.
> If this helped, please subscribe.
> This was 0xH.

---

## YouTube 설명란

```
ZED X Mini 스테레오 카메라를 Jetson에 연결하기까지 30일간의 삽질 과정을 정리했습니다.

📌 핵심 내용:
- 문제: GMSL2 프로토콜 호환성 — 보드, JetPack, SDK 버전이 전부 맞아야 동작
- 개선: 보드 3개 × JetPack 4개 버전 조합 테스트
- 결과: Waveshare Orin NX + JetPack 6.2.1 + ZED SDK 5.2.1

⏱️ 타임스탬프:
00:00 인트로
00:30 목차
01:00 GMSL2란?
03:00 시도 1 — reComputer (실패)
07:00 시도 2 — Waveshare + JetPack 테스트
12:00 최종 동작 스택
15:00 핵심 정리
17:00 다음 영상 예고

📝 블로그 글 (전체 코드 + 상세 정리):
https://techblips.com/ko/study/zed-x-mini-jetson-setup

🔧 사용한 장비:
- Waveshare Orin NX (22-pin CSI)
- ZED X Mini (Stereolabs)
- JetPack 6.2.1 / ZED SDK 5.2.1 / ZED Link 1.4.0

#로봇공학 #Jetson #ZED #GMSL2 #스테레오카메라 #임베디드 #0xH #엔지니어스터디
```
