---
title: "ZED X Mini + Jetson: 1개월 삽질 끝에 찾은 정답"
date: 2026-04-05
draft: false
tags: ["jetson", "zed-camera", "robotics"]
description: "ZED X Mini를 Jetson Orin NX에 연결하는 데 1개월 걸렸다. 안 되는 조합과 되는 조합, 바로 정리."
author: "Henry"
---

## 결론부터

| | 안 됨 | 됨 |
|---|---|---|
| **보드** | reComputer J4012 (15핀 CSI) | Waveshare Orin NX (22핀 CSI) |
| **JetPack** | 6.1, 6.2.0 | **6.2.1** |
| **케이블** | 22→15핀 어댑터 | 네이티브 22핀 직결 |

> 이 조합 외에는 전부 실패했다. 에러도 안 뜬다. 그냥 카메라가 없는 것처럼 동작한다.

<!-- 여기에 작동 성공 사진/영상 삽입 -->
<!-- ![ZED X Mini 카메라 피드 성공](/images/zed-working.jpg) -->

---

## 안 되는 것들 (시간 아끼세요)

### 1. reComputer J4012 + CSI 어댑터 케이블

15핀 CSI 보드에 22→15 어댑터 끼우면 물리적으로 꽂히긴 한다. **하지만 I2C 버스에 아무것도 안 잡힌다.**

```bash
sudo i2cdetect -y -r 9
# → 전부 빈칸. 카메라가 존재하지 않음.
```

핀 수 차이가 아니라 **시그널 라우팅 자체가 다르다.** 어댑터로 해결 불가.

### 2. JetPack 6.1

커뮤니티에서 "ZED X는 6.1까지만 지원"이라고 하는데 **틀렸다.** 6.1은 플래싱 자체가 계속 실패했다.

---

## 되는 것 (이대로 하세요)

### 최종 스택

| 컴포넌트 | 버전 |
|----------|------|
| JetPack | **6.2.1** (L4T 36.4.0) |
| ZED SDK | 5.2.1 |
| ZED Link | 1.4.0-L4T36.4.0 |
| 보드 | 22핀 CSI 네이티브 지원 보드 |

### 설치 (3줄)

```bash
sudo apt install zed-link
sudo apt install zed-sdk
zed-explorer  # 카메라 피드 확인
```

### 성공 확인

```bash
sudo i2cdetect -y -r 9
# → 주소가 보이면 GMSL2 디시리얼라이저 연결 성공
```

`i2cdetect`에서 주소가 보이는 순간이 **하드웨어 연결 성공의 첫 신호**다. 그 다음 `zed-explorer` 실행하면 바로 영상이 뜬다.

<!-- 여기에 i2cdetect 성공 스크린샷 삽입 -->
<!-- ![i2cdetect 결과](/images/i2cdetect-success.png) -->

<!-- 여기에 zed-explorer 카메라 피드 영상 삽입 -->
<!-- {{< youtube "VIDEO_ID" >}} -->

---

*직접 구매하고 테스트한 연구용 로보틱스 하드웨어 기록. Stereolabs, NVIDIA와 무관.*
