# Content Briefs

이 디렉토리에는 AI가 생성한 주간 콘텐츠 브리프가 저장됩니다.

## 구조

각 브리프는 `YYYY-MM-DD-brief.yaml` 형식의 YAML 파일로 저장되며, 다음 정보를 포함합니다:

- **date**: 브리프 생성일
- **topics**: 제안된 기사 주제 목록
  - **title**: 기사 제목
  - **key_points**: 핵심 논점 3개
  - **sources**: 참고 소스 3개
  - **radar_blips**: 관련 Tech Radar 블립

## 워크플로우

1. 매주 월요일 09:00 UTC에 `content-brief.yml` 워크플로우가 자동 실행됩니다.
2. AI가 최신 테크 트렌드를 분석하여 3개의 기사 주제를 제안합니다.
3. PR로 제출되며, 팀이 검토 후 승인할 주제를 선택합니다.
4. 승인된 주제는 `auto-content.yml` 워크플로우를 수동 실행하여 기사를 생성합니다.
