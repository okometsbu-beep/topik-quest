# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v57 · privacy-free local Travel funnel metrics
- Current candidate: v58 · Myeongdong price-quest learning-flow metrics · PR #55
- Core content: 2,088 original items
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: finish the first Game or Travel step within ten minutes
- Autonomous runtime: GitHub-connected scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- independent Seoul Travel Mode and Wordlight Expedition
- Incheon Airport T1 → Seoul Station → Myeongdong route with six beginner missions,
  factual transport choices, travel-won rewards, a persistent clock, and free avatar looks
- generated pixel-art backgrounds, player skins, NPCs, props/rewards, and UI tiles as separate layers
- Myeongdong day/evening hub with NPC dialogue, free Korean composition, Hangul sign building,
  Korean price-board reading, travel-won exchanges, and four collectible images
- Korean-only choices before grading and evidence → distractor → solving-tip instructor feedback
- stable Game scroll position and Travel 320/375/390/430px containment contract
- local-only Travel route funnel counters; no identifier, event text, timestamp, device detail, or transmission
- durable recovery snapshot for vocabulary, game, review, beginner, travel, settings, and Travel metrics
- one global TTS setting with device fallback and optional local neural pack
- token-minimal repository handoff, focused verification lanes, GitHub CI and Pages deployment
- payment-free Seoul learning-RPG and avatar-reward north star

## 다음 우선순위

1. PR #55의 GitHub Actions 실행기 복구 뒤 모바일 시각 증거를 확인하고 v58을 병합·배포한다.
2. 가격 퀘스트 완료율·오답·평균 잔액을 사용자가 이해할 수 있는 로컬 진단 기준을 검토한다.
3. 실제 학습 흐름을 확인한 뒤에만 다음 역의 퀘스트 형식과 보상 수치를 확정한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## v58 후보 및 검증 상태

- 가격 퀘스트 시작·첫 완료·첫 완료 전 오답 제출·완료 직후 잔액을 기존
  `malbitStoryV1.metrics`의 숫자 합계로만 집계한다.
- 완료율·오답 제출 수·완료 후 평균 여행 원을 기기 안 여행 기록 카드에 표시한다.
- 재플레이·재접속은 시작/완료/오답/잔액을 중복 집계하지 않으며 v57 숫자 지표를 보존한다.
- 단어장·게임·복습·여행·설정 저장 키와 복구 스냅샷을 유지한다.
- 로컬 runtime contract, JavaScript 51개 구문, 전체 48개 테스트는 통과했다.
- 최초 CI의 코드·48개 테스트는 통과했지만 Chrome 디버깅 포트 준비 전에 종료됐다.
  다음 두 GitHub 실행은 job 생성 전 `startup_failure`로 끝났고 PR 실행은 대기 중이다.
- Chrome 시작을 최대 30초 기다리고 한 차례 재시작하는 검증 복구를 추가했으나, 실행기 자체가
  시작되지 않아 아직 해당 코드와 320/375/390/430px 모바일 캡처를 검증하지 못했다.
- UI 변경의 모바일 시각 증거와 CI 성공이 없으므로 병합·배포하지 않았다.
- 결제 UI·API 키·외부 전송은 추가하지 않았다.
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/55
- 후보 head: `4bc9d1790c7f098dccc996e1a89fdf60f136afa5`
- 배포 주소(현재 v57): https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v57 main `c9250c58ce96b912d2bc17d42d8d9d7e908567f3`

## 다음 한 작업

GitHub Actions가 정상화되면 PR #55의 전체 CI와 모바일 캡처를 확인하고, 합격 기준을 충족한
경우에만 squash merge한 뒤 라이브 v58과 기존 기록 보존을 검증한다.

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
