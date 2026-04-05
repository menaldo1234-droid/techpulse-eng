---
title: "로봇 정밀 제조: 서브밀리미터 조립"
date: 2026-03-14
description: "분산 의사결정 아키텍처로 8ms 슬립 감지와 서브밀리미터 로봇 조립을 달성하는 방법."
slug: "robotic-precision-assembly-tolerances"
draft: false
schema: "Article"
author: "Henry"
categories:
  - "Technology"
tags:
  - "industrial-robotics"
  - "precision-manufacturing"
  - "edge-computing"
keywords:
  - "robotic precision manufacturing"
  - "automated assembly tolerance control"
  - "how robots achieve sub-millimeter accuracy"
related_radar: []
---

# 서브밀리미터 로봇 조립: 성공을 만든 아키텍처

로봇이 사전 프로그래밍된 경로나 3D 모델 없이 서브밀리미터 정밀도로 변속기 하우징을 조립했다. 그립 압력을 실시간으로 조절하고 위치 오류를 자율적으로 복구했다. 결과: 불량률 73% 감소.

핵심은 하드웨어가 아닌 아키텍처의 혁신이었다. 중앙집중형에서 분산형 의사결정으로 전환하면서 슬립 감지가 120ms에서 8ms로 단축됐다.

<!-- ![변속기 하우징을 실시간 적응으로 조립하는 로봇 그리퍼](/images/robotic-precision-assembly.png) -->

## 핵심 문제: 지연은 정밀도의 적

| 파이프라인 단계 | 소요 시간 |
|---------------|----------|
| 이미지 캡처 | 5-10ms |
| 추론 (감지, 자세) | 30-100ms |
| 의사결정 로직 | 2-5ms |
| 모터 명령 + 응답 | 10-30ms |
| **합계** | **50-200ms** |

업계 표준은 10ms 이하의 의사결정 루프를 요구한다. 기존 중앙집중형 파이프라인은 이를 5-20배 초과한다. 더 빠른 하드웨어를 직렬 파이프라인에 투입해도 10-15% 개선에 그친다 -- 병목은 물리가 아닌 아키텍처다.

이로 인해 힘든 트레이드오프가 강요됐다:

| 접근법 | 속도 | 불량률 | 한계 |
|--------|------|--------|------|
| 고정형 자동화 (피드백 없음) | 빠름 | 5-8% | 취약, 적응 불가 |
| 적응형 비전 가이드 | 30-40% 속도 | 낮음 | 생산에 너무 느림 |

## 해결책: 분산 의사결정 아키텍처

그리퍼에 실제 마이크로컨트롤러를 넣었다. 힘 피드백은 1000Hz로 로컬 처리하고, 중앙 시스템은 상위 수준 명령을 비동기로 전달한다.

<!-- ![분산 아키텍처: 엣지 그리퍼 컨트롤러 + 중앙 시스템](/images/distributed-gripper-arch.png) -->

| 계층 | 지연 | 담당 역할 |
|------|------|----------|
| 엣지 (그리퍼) | <5ms | 힘 피드백, 슬립 감지, PID 제어 |
| 중앙 | 50-200ms | 작업 순서, 부품 식별, 전략 |

```cpp
// Local gripper controller running at 1000Hz
volatile float target_force = 2.5;  // Updated asynchronously from central
volatile float measured_force = 0.0;
volatile bool slip_detected = false;

const float Kp = 0.8, Ki = 0.15, Kd = 0.05;
float integral_error = 0.0, last_error = 0.0;

ISR(TIMER1_COMPA_vect) {
  measured_force = read_load_cell();
  float pressure_avg = read_pressure_array();

  // Slip detection: rapid pressure changes
  static float last_pressure = 0.0;
  if (abs(pressure_avg - last_pressure) > 15.0)
    slip_detected = true;
  last_pressure = pressure_avg;

  // PID force control
  float error = target_force - measured_force;
  integral_error = constrain(integral_error + error * 0.001, -5.0, 5.0);
  float derivative = (error - last_error) / 0.001;
  set_gripper_command((Kp * error) + (Ki * integral_error) + (Kd * derivative));
  last_error = error;
}
```

결과: **슬립 감지가 120ms에서 8ms로 단축** (15배 개선). 중앙 시스템에 네트워크 문제가 생겨도 그리퍼는 멈추지 않고 반응한다.

## 합의 없는 조율

합의 프로토콜(Raft, Paxos)은 실시간 제어에서 함정이다. 노드 하나가 느리면 전체가 멈춘다. 대안은 소유권 + 상태 브로드캐스트다.

각 컴포넌트가 하나의 도메인을 소유한다. 겹침도 충돌도 없다:

- 그리퍼가 힘 제어 소유
- 비전 시스템이 부품 분류 소유
- 컨베이어가 타이밍과 속도 소유

컴포넌트들은 시계열 데이터베이스에 상태를 브로드캐스트하고, 다른 컴포넌트는 최신 값을 구독해서 반응한다 -- 대기도, 합의 단계도 없다.

```python
# Conveyor monitors gripper health via timeouts
class ConveyorController:
    def __init__(self):
        self.last_gripper_update = time.time()
        self.gripper_timeout = 0.15  # 150ms deadline

    def run_control_loop(self):
        while True:
            if time.time() - self.last_gripper_update > self.gripper_timeout:
                self.speed = 0.2  # Fail safe: crawl speed
            apply_speed(self.speed)
            time.sleep(0.005)
```

| 아키텍처 | 센서 장애 복구 | 생산 영향 |
|----------|--------------|----------|
| 합의 기반 | 8-12초 | 라인 정지 |
| 상태 브로드캐스트 + 타임아웃 | <50ms | 라인 계속 가동 |

## 실제 환경을 위한 적응형 모델

실험실에서 학습한 모델은 첫날 84% 정확도를 보이지만, 부품 산화, 공구 마모, 조명 변화로 점차 성능이 떨어진다.

해결책: 지수이동평균을 활용한 스테이션 단위 온라인 적응 + 정기 배치 재학습.

| 지표 | 1일차 (실험실 학습) | 14일차 (적응 적용 후) |
|------|-------------------|---------------------|
| 정확도 | 84% | 96% |
| 오검출률 | 18% | 5.8% |

## 관측성: 시스템 상태가 아닌 결과를 추적하라

CPU 45%라는 숫자는 아무것도 알려주지 않는다. 중요한 것을 추적하라:

- 부품당 사이클 타임 (평균이 아닌 백분위수)
- 그리퍼 슬립 이벤트
- 재작업 비율
- 센서 드리프트 추이
- 공구 마모 진행도

모든 그리퍼 접촉과 모델 판단을 불변 이벤트로 스트리밍하라. 불량 발생 시 정확한 시퀀스를 재생해 몇 시간이 아닌 몇 분 만에 진단할 수 있다.

## 운영 패턴

**카나리 배포**: 새 그리퍼 모델을 한 대에 1시간 배포한다. 불량률을 관찰하고 점진적으로 확대하거나 즉시 롤백한다.

**점진적 성능 저하**: 센서 드리프트 감지 시 컨베이어를 60%로 감속하고 그립을 15% 강화한 뒤 점검을 요청한다. 생산은 계속된다.

**정기 학습 시간**: 교대 시간에 70% 처리량으로 재학습한다. 완전 정지 없음.

**사람 개입**: 신뢰도가 75% 이하로 떨어지면 부품을 운영자 검사 대상으로 표시한다. 해당 라벨은 재학습에 반영된다.

서브밀리미터 정밀도를 달성한 로봇이 그 정밀도를 유지하는 건 누군가 적극적으로 관리하기 때문이다. 적응형 제조는 "설정 후 방치"가 아닌 적극적 관리다.

---

## 관련 글

- [로봇 실시간 객체 감지 및 추적: 엣지 디바이스용 컴퓨터 비전 파이프라인 최적화](/posts/real-time-object-detection-tracking-robotics-edge-optimization/)
