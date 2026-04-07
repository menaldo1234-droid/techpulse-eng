---
title: "ZED X Mini + Jetson Orin NX: 30일간의 삽질 기록"
date: 2026-04-05
draft: false
tags: ["jetson", "zed-camera", "robotics", "gmsl2", "stereolabs"]
description: "ZED X Mini를 Jetson에 붙이려고 보드, 케이블, JetPack 버전 조합을 한 달간 시도했다. 뭐가 안 됐고, 왜 안 됐고, 결국 된 스택은 뭔지 전부 기록."
author: "Henry"
---

ZED X Mini를 로보틱스 프로젝트용으로 샀다. Stereolabs 공식 문서에는 "Jetson에 연결하고 SDK 깔면 끝"이라고 써있다.

**첫 프레임 하나** 얻는 데 30일 걸렸다.

느려서가 아니다 — 실패가 *조용하다*. 에러 메시지도 없고 크래시 로그도 없다. 카메라가 그냥 없는 것처럼 행동한다. 꽂고, 명령어 치고, 아무 반응 없다.

이 글은 그 한 달 동안 겪은 모든 걸 정리한 거다. 같은 삽질 안 하려면 읽어봐라.

![디버깅 여정 — 혼돈에서 성공까지](/images/study/zed/journey-desk.jpg)

---

## 정답 (바쁘면 여기만 봐)

| 컴포넌트 | 버전 |
|----------|------|
| **보드** | Waveshare Orin NX (**22핀 CSI 네이티브**) |
| **JetPack** | **6.2.1** (L4T 36.4.0) |
| **ZED SDK** | 5.2.1 |
| **ZED Link** | 1.4.0-L4T36.4.0 |

설치 순서:

```bash
# 1. ZED Link 드라이버 (GMSL2 디시리얼라이저)
chmod +x ZED_Link_Driver_L4T36.4.0_v1.4.0.run
sudo ./ZED_Link_Driver_L4T36.4.0_v1.4.0.run
sudo reboot

# 2. ZED SDK
chmod +x ZED_SDK_Tegra_L4T36.4_v5.2.1.zstd.run
./ZED_SDK_Tegra_L4T36.4_v5.2.1.zstd.run

# 3. 카메라 확인
/usr/local/zed/tools/ZED_Explorer
```

> Stereolabs 다운로드 페이지에서 JetPack 버전에 맞는 `.run` 파일을 받아야 된다. `apt install` 아니다.

뎁스 영상 나오면 — 축하한다. 이 탭 닫아도 된다.

안 나오면 계속 읽어라. 나도 거기 있었다.

---

## 왜 이렇게 헷갈리냐

ZED X Mini는 **GMSL2** (Gigabit Multimedia Serial Link)를 쓴다. USB가 아니다. 그래서:

- Jetson 캐리어 보드의 **CSI 커넥터**로 연결해야 되고
- 캐리어 보드에 **GMSL2 디시리얼라이저** 칩이 있어야 되고
- 디시리얼라이저가 **I2C 버스 9번**으로 Jetson이랑 통신한다

근데 아무도 안 알려주는 게 있다: **CSI 커넥터가 다 같은 게 아니다.**

![전체 신호 경로: ZED X Mini → GMSL2 캡처 카드 → Jetson Orin NX](/images/study/zed/signal-path.jpeg)

실제 하드웨어 연결하면 이렇게 생겼다 — GMSL2 캡처 카드가 카메라랑 Jetson 보드 사이에 FFC 리본 케이블로 연결돼있다:

![실제 하드웨어: Jetson Orin NX와 GMSL2 캡처 카드의 FFC 리본 연결](/images/study/zed/capture-card-real.jpeg)

---

## 1-2주차: 어댑터의 함정

![몇 주간의 실패](/images/study/zed/failure-desk.jpg)

첫 보드는 **Seeed reComputer J4012**. 좋은 보드다 — 15핀 CSI 포트에 컴팩트하고 문서화도 잘 되어있다.

근데 ZED X Mini는 22핀이다. 그래서 22→15핀 어댑터 케이블을 주문했다. 물리적으로 꽂힌다. 겉보기엔 완벽하다.

```bash
sudo i2cdetect -y -r 9
```

```
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:                         -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

전부 대시. 카메라가 버스에 아예 안 잡힌다.

이것저것 다 해봤다:
- 어댑터 케이블 3종류 바꿔봤고
- 커넥터 뺐다 꽂았다 (확대경까지 동원)
- I2C 버스 번호 0~30 전수조사
- 커널 디바이스 트리 수정

**아무것도 안 됐다.**

핀 수가 문제가 아니었다. reComputer 15핀 CSI 커넥터가 라우팅하는 신호랑 GMSL2 디시리얼라이저가 기대하는 신호가 **완전히 다르다**. 어댑터는 물리적 형태만 바꿔주지 **전기 신호를 매핑해주진 못한다**.

![15핀(안 됨) vs 22핀(됨) CSI 커넥터 — 비슷하게 생겼지만 완전히 다른 신호를 보낸다](/images/study/zed/csi-connector-comparison.jpeg)

> 쉽게 말하면 이런 거다: Lightning→USB-C 어댑터는 있지만, "PCIe 레인을 I2C로 바꿔주는" 어댑터는 없다. 실리콘 위의 경로 자체가 다른 프로토콜이다.

---

## 3주차: JetPack 버전 지옥

22핀 보드(Waveshare Orin NX)를 새로 사고 나서 다음 벽을 만났다: **JetPack을 몇 버전으로 깔아야 되냐?**

Stereolabs 포럼, NVIDIA 포럼, 레딧 — 다 답이 다르다:

| 출처 | 말하는 것 |
|------|-----------|
| 포럼 글 (2025) | "JetPack 6.1에서만 됨" |
| Stereolabs 공식 문서 | "JetPack 6.x 필요" |
| 레딧 유저 | "6.2.0에서 성공함" |
| 내 경험 | **6.2.1만 진짜 됨** |

JetPack 6.1은 플래싱 자체가 실패했다. 6.2.0은 플래싱은 됐는데 ZED Link 깔 때 L4T 버전이랑 디펜던시 충돌.

ZED SDK도 골치다. Stereolabs 사이트에서 `.run` 파일 받아서 까는데, **SDK 버전이랑 L4T 버전이 정확히 안 맞으면 설치가 터진다**. 설치는 되는데 카메라를 못 찾는 경우도 있다. 에러도 제각각이다:

```
[ZED SDK] Dependency error: L4T version mismatch
[ZED Link] Kernel module build failed: incompatible kernel headers
```

SDK 5.2.0 깔았더니 ZED Link 1.4.0이랑 충돌, SDK 5.1.x로 내리면 CUDA 버전이 안 맞고 — 한 레이어 바꾸면 다른 레이어가 터진다.

**JetPack 6.2.1**이 유일하게 전부 맞아떨어지는 버전이었다: L4T 커널 버전(36.4.0)이 ZED Link가 원하는 거랑 일치하고, ZED SDK 5.2.1이 정상 설치되고, GMSL2 드라이버가 로드되고, `i2cdetect`에 드디어 뭔가 나온다.

---

## 4주차: 됐다

Waveshare 보드에 JetPack 6.2.1 올리고 나서:

```bash
sudo i2cdetect -y -r 9
```

```
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:                         -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- 2d -- --
30: UU -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

**주소가 떴다.** `0x2d`랑 `0x30 (UU)` — GMSL2 디시리얼라이저다. 카메라가 버스에 잡힌다.

설치:

```bash
# ZED Link 드라이버 (GMSL2)
chmod +x ZED_Link_Driver_L4T36.4.0_v1.4.0.run
sudo ./ZED_Link_Driver_L4T36.4.0_v1.4.0.run
sudo reboot

# ZED SDK
chmod +x ZED_SDK_Tegra_L4T36.4_v5.2.1.zstd.run
./ZED_SDK_Tegra_L4T36.4_v5.2.1.zstd.run

# 카메라 피드 확인
/usr/local/zed/tools/ZED_Explorer
```

뎁스맵, 포인트 클라우드, 전부 다 — 첫 시도에 됐다.

![동작하는 뎁스맵 — 30일 만에 드디어 본 화면](/images/study/zed/depth-success.jpg)

---

## 전체 소프트웨어 스택

![하드웨어부터 애플리케이션까지 5개 레이어](/images/study/zed/stack-visual.jpg)

레이어별로 버전이 **전부 맞아야** 된다. 결합도가 높다:

- **ZED Link**은 특정 **L4T 커널 버전**에 맞춰 컴파일돼있다
- **L4T 버전**은 **JetPack 버전**이 정한다
- **ZED SDK**는 특정 **ZED Link** 버전을 요구한다

어느 레이어든 하나라도 안 맞으면 카메라가 조용히 사라진다. 에러 메시지 같은 거 없다. 그냥 `i2cdetect`에 아무것도 안 나온다.

---

## 시작 전에 알았으면 좋았던 것들

1. **어댑터 케이블은 소용없다.** 보드가 15핀 CSI면 보드를 바꿔야 된다. 어떤 케이블로도 신호 라우팅 불일치는 못 고친다.

2. **`i2cdetect -y -r 9`이 진단 도구다.** 소프트웨어 깔기 전에 하드웨어 연결부터 확인해라. 버스 9에 아무것도 안 나오면 SDK 깔아봤자 의미 없다.

3. **포럼 버전 추천 믿지 마라.** Stereolabs가 공식 지원하는 최신 JetPack을 깔아라. 지금 기준으로는 6.2.1이다.

4. **Waveshare Orin NX 캐리어 보드는 된다.** 22핀 CSI에 GMSL2 디시리얼라이저 내장. 바로 연결 가능하고 어댑터 필요 없다.

5. **JetPack 플래싱은 한 번에 ~45분 걸린다.** 4번째 재플래싱쯤 되면 체감이 다르다. 처음부터 맞는 버전 쓰자.

---

## 내 하드웨어 셋업

| 항목 | 쓴 것 |
|------|-------|
| 카메라 | ZED X Mini (스테레오, GMSL2) |
| 컴퓨트 모듈 | NVIDIA Jetson Orin NX 16GB |
| 캐리어 보드 | Waveshare Orin NX carrier (22핀 CSI) |
| 케이블 | 22핀 GMSL2 케이블 (ZED X 기본 포함) |
| 전원 | 19V DC 배럴잭 |
| 플래시 툴 | NVIDIA SDK Manager (Ubuntu 22.04 호스트) |

개봉부터 뎁스 피드 성공까지 총 소요 시간: **30일** (원래 30분이면 됐어야 했다).

---

*로보틱스 프로젝트 하면서 실제로 겪은 하드웨어 삽질 기록. 내가 한 만큼 너는 안 해도 되게. — Henry*

*Stereolabs, NVIDIA와 무관.*
