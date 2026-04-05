---
title: "오픈소스 ML 프레임워크: 프로덕션에서 실제로 깨진 것들"
date: 2026-03-14
description: "화제의 ML 프레임워크를 배포하며 겪은 다섯 가지 실제 장애 사례와 해결법."
slug: "open-source-ml-framework-production-issues"
draft: false
schema: "Article"
author: "Henry"
categories:
  - "Artificial Intelligence"
  - "Developer Tools"
tags:
  - "machine-learning"
  - "production-engineering"
  - "technical-evaluation"
keywords:
  - "open-source machine learning framework"
  - "ML framework production issues"
  - "how to evaluate new ML frameworks"
  - "production machine learning deployment"
related_radar:
  - "langchain"
---

# 화제의 ML 프레임워크가 프로덕션에서 깨진 다섯 가지 방식

인기 오픈소스 ML 프레임워크(GitHub 스타 15k, 찬사 일색의 벤치마크)로 프로덕션 앱을 2주간 개발한 결과, 실제로 발생한 문제는 다음과 같다: 동시 접속 시 모델 로딩 충돌, 배칭 부재, 학습 루프 메모리 누수, 전처리가 지연시간을 지배, 에러의 조용한 통과. 각각 고칠 수 있었지만 디버깅에 추가로 3일이 소요됐다.

<!-- ![타임라인: 장애 유형별 예상 vs 실제 개발 시간](/images/ml-framework-failure-timeline.png) -->

## 장애 요약

| 문제 | 증상 | 근본 원인 | 해결책 |
|---|---|---|---|
| 모델 로딩 | 8.2초 콜드 스타트, 연쇄 타임아웃 | 요청별 모델 로딩, VRAM 중복 할당 | 스레드 안전 싱글턴 패턴 |
| 배칭 없음 | RTX 4090에서 45 req/s 한계 | 단건 추론 루프 | 동적 배칭 디스패처 |
| 메모리 누수 | 5,000 배치 후 2.1GB -> 8.7GB | 연산 그래프 미해제 | 명시적 텐서 정리 |
| 전처리 병목 | 종단간 800ms, 95%가 데이터 준비 | 추론 스레드에서의 동기 정규화 | 분리된 워커 풀 |
| 조용한 실패 | 0.3% NaN 예측 미감지 | 입출력 검증 부재 | 3단계 검증 |

## 1. 모델 로딩: 싱글턴을 사용하라

프레임워크는 기본적으로 요청마다 모델을 새로 로드한다. 동시 사용자 50명에서 VRAM이 4GB에서 16GB로 뛰며 CUDA OOM이 발생했다.

**해결책:** 시작 시 한 번만 로드하고 모든 핸들러에서 공유한다.

```python
import threading
from contextlib import contextmanager

class ModelRegistry:
    _instance = None
    _lock = threading.Lock()
    _model = None

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def initialize(self, model_path, device="cuda"):
        if self._model is not None:
            return
        with self._lock:
            self._model = load_framework_model(model_path, device)
            self._model.eval()

    @contextmanager
    def infer(self):
        with self._lock:
            yield self._model
```

**결과:** 콜드 스타트가 8.2초에서 1.1초로 단축. 이후 요청은 100ms 미만. VRAM 4GB로 안정.

## 2. 배칭: 직접 디스패처를 만들어라

단건 추론은 GPU 시간의 80%를 커널 런치 오버헤드에 낭비한다. 동적 배칭(최대 32개 요청 또는 50ms 중 먼저 도달하는 조건)을 추가하자 동일 하드웨어에서 처리량이 45에서 180 req/s로 증가했다.

<!-- ![막대 그래프: 배치 크기 1, 8, 16, 32별 처리량](/images/batching-throughput-comparison.png) -->

```python
class BatchingDispatcher:
    def __init__(self, model, max_batch_size=32, timeout_ms=50):
        self.model = model
        self.max_batch_size = max_batch_size
        self.timeout = timeout_ms / 1000.0
        self.queue = deque()

    async def infer(self, request):
        future = asyncio.Future()
        self.queue.append((request, future))
        if len(self.queue) >= self.max_batch_size:
            await self._process_batch()
        return await future

    async def _process_batch(self):
        batch_data, futures = [], []
        for _ in range(min(len(self.queue), self.max_batch_size)):
            req, fut = self.queue.popleft()
            batch_data.append(req)
            futures.append(fut)
        results = self.model.forward(batch_data)
        for fut, res in zip(futures, results):
            fut.set_result(res)
```

배치 크기를 하드코딩하지 마라. 트래픽이 적을 때는 타임아웃이 작은 배치를 트리거하게 하라.

## 3. 메모리 누수: backward 후 텐서를 분리하라

프레임워크는 기본적으로 backward pass 후에도 전체 연산 그래프를 유지한다. 5,000 배치 후 메모리가 2.1GB에서 8.7GB로 증가했다.

**해결책:** 배치당 세 줄의 정리 코드.

```python
# Inside training loop, after loss.backward() and optimizer.step():
loss_value = loss.detach().item()
del loss, output
torch.cuda.empty_cache()
```

**전:** 2.1GB -> 8.7GB (OOM 위험). **후:** 2.1GB -> 2.3GB (안정).

## 4. 전처리: 추론에서 분리하라

실제 데이터(다양한 해상도, 인코딩, 중첩 JSON)가 추론 스레드에서 동기적으로 정규화됐다. 프레임워크는 50ms 미만의 추론을 제공했지만, 시간의 95%가 전처리에 소요되어 종단간 지연시간이 800ms에 달했다.

**해결책:** 추론 전에 데이터를 정규화하고 결과를 캐싱하는 별도의 워커 풀.

**결과:** 전처리 비중이 전체 지연시간의 95%에서 8%로 감소.

## 5. 조용한 실패: 입출력을 검증하라

48시간 운영 중 0.3%의 요청이 NaN 예측을 생성했다. 에러도 크래시도 없이 쓰레기 값이 하류로 흘러갔다. 프레임워크는 입출력을 검증하지 않는다.

**해결책:** 추론 전후로 검증하라.

```python
class InputValidator:
    def __init__(self, expected_shape, value_range):
        self.expected_shape = expected_shape
        self.min_val, self.max_val = value_range

    def validate(self, tensor):
        if tensor.shape != self.expected_shape:
            raise ValueError(f"Shape mismatch: expected {self.expected_shape}, got {tensor.shape}")
        if np.isnan(tensor).any():
            raise ValueError("Input contains NaN values")
        if (tensor < self.min_val).any() or (tensor > self.max_val).any():
            raise ValueError(f"Values outside [{self.min_val}, {self.max_val}]")
```

출력도 반드시 검증하라 -- 결과 반환 전에 예측값에 NaN이 있는지 확인하라. 크래시는 정직하다. 조용한 실패는 데이터를 오염시킨다.

## 6. 컨테이너화: 리소스를 명시적으로 설정하라

ML 프레임워크는 컨테이너 리소스 제한을 무시한다. 파드에 CPU 2코어가 할당됐어도 호스트의 8코어를 감지하여 스레드를 생성하고, 스래싱으로 인해 요청의 40%가 타임아웃됐다.

**해결책:** 환경 변수를 통해 스레드 풀, GPU 메모리 비율, CPU 어피니티를 명시적으로 설정하라.

| 지표 | 전 (자동 감지) | 후 (명시적 설정) |
|---|---|---|
| CPU 사용률 | 60% | 45% |
| p99 지연시간 | 3.2초 | 280ms |
| 타임아웃 비율 | 40% | 0.2% |

반드시 그레이스풀 셧다운 훅을 추가하라 -- Kubernetes는 SIGTERM을 보내고 30초를 준다. 종료 전에 진행 중인 요청을 드레인하라.
