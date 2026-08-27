# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v58 · privacy-free Myeongdong price-quest learning metrics
- Current candidate: v59 · on-device price-quest learning feedback
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
- local-only route and price-quest metrics; no identifier, event text, timestamp, device detail, or transmission
- durable recovery snapshot for vocabulary, game, review, beginner, travel, settings, and Travel metrics
- one global TTS setting with device fallback and optional local neural pack
- token-minimal repository handoff, focused verification lanes, GitHub CI and Pages deployment
- payment-free Seoul learning-RPG and avatar-reward north star

## 다음 우선순위

1. 충분한 실제 사용 기록이 쌓인 뒤 여행 기록 화면의 수치로 다음 지역·상점 밸런스를 검토한다.
2. 실제 학습 흐름을 확인한 뒤에만 다음 역의 퀘스트 형식과 보상 수치를 확정한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## v58 검증 및 배포

- 가격 퀘스트 시작·첫 완료·첫 완료 전 오답 제출·완료 직후 잔액을 기존
  `malbitStoryV1.metrics`의 숫자 합계로만 집계한다.
- 완료율·오답 제출 수·완료 후 평균 여행 원을 기기 안 여행 기록 카드에 표시한다.
- 재플레이·재접속은 시작/완료/오답/잔액을 중복 집계하지 않으며 v57 숫자 지표를 보존한다.
- 단어장·게임·복습·여행·설정 저장 키와 복구 스냅샷을 유지한다.
- runtime contract v58, JavaScript 51개 구문, 전체 48개 테스트를 통과했다.
- Chrome 모바일에서 320·375·390·430px containment, 터치, 세 경로 완주, NPC 작문,
  표지 조립, 가격 오답→정답, 재접속과 기존 기록을 검사했다. 증거 22개와 콘솔 오류 0개를 확인했다.
- 일본어 지표 카드·가격 문제·정답 보상·여행 허브 캡처를 눈으로 확인했고 돌출·겹침이 없었다.
- 간헐적인 Chrome 시작과 장면 탭을 재시도하되 실제 터치·장면 전환 검증은 유지하도록 QA를 보강했다.
- 결제 UI·API 키·외부 전송은 추가하지 않았다.
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/55
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v57 main `c9250c58ce96b912d2bc17d42d8d9d7e908567f3`

## 다음 한 작업

실제 기기에 가격 퀘스트 기록이 더 쌓인 뒤 완료율·오답·평균 잔액을 확인하고, 다음 지역의
가격 학습 난이도나 보상 수치를 바꿀 근거가 충분한지 검토한다.

## v59 후보 검증

- 시작 전, 미완료, 오답 포함 완료, 무오답 완주, 중도 이탈 조합을 구분해 같은 여행 기록 카드에
  짧은 학습 힌트를 표시한다.
- 일본어 기준으로 완료율·오답·평균 잔액을 그대로 보여 주고 `값×개수 → 예산−합계` 순서를 안내한다.
- 새 저장 키나 외부 전송 없이 기존 `malbitStoryV1.metrics`의 기기 내 숫자만 읽는다.
- runtime contract v59와 빠른 검사 43개를 통과했다.
- GitHub Actions 전체 검사, 320·375·390·430px containment, 실제 터치 여행 흐름, 콘솔 오류 0개를 통과했다.
- 일본어 모바일 증거에서 힌트·긴 숫자·다음 카드의 돌출과 겹침이 없음을 확인했다.
- 후보 브랜치: `agent/loop-20260827-price-feedback`
- 후보 체크포인트: `66874759edc7e09a64122a2b6b6a699e0e1ccbc1`
- 되돌리기 기준: v58 main `1c8b4a0175e53f5c7db3df9bfff83da81f209bfa`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
