# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v59 · on-device Myeongdong price-quest learning feedback
- Current candidate: none
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

1. 사용자가 실제 기기 수치를 직접 제공하기 전에는 가격 퀘스트 난이도·가격·보상을 유지한다.
2. 기존 코스 재진입 시 다음 학습 행동을 한 번에 찾을 수 있는지 먼저 개선한다.
3. 실제 학습 흐름을 확인한 뒤에만 다음 역의 퀘스트 형식과 보상 수치를 확정한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

코스 완주 후 여행모드에 재진입한 초보자가 명동 허브의 다음 미완료 학습 퀘스트를 한 번의
명확한 행동으로 찾을 수 있는지 검토하고, 필요하면 저장 구조를 유지한 채 CTA 하나만 개선한다.

## v59 검증 및 배포

- 시작 전, 미완료, 오답 포함 완료, 무오답 완주, 중도 이탈 조합을 구분해 같은 여행 기록 카드에
  짧은 학습 힌트를 표시한다.
- 일본어 기준으로 완료율·오답·평균 잔액을 그대로 보여 주고 `값×개수 → 예산−합계` 순서를 안내한다.
- 새 저장 키나 외부 전송 없이 기존 `malbitStoryV1.metrics`의 기기 내 숫자만 읽는다.
- runtime contract v59와 빠른 검사 43개를 통과했다.
- GitHub Actions 전체 검사, 320·375·390·430px containment, 실제 터치 여행 흐름, 콘솔 오류 0개를 통과했다.
- 일본어 모바일 증거에서 힌트·긴 숫자·다음 카드의 돌출과 겹침이 없음을 확인했다.
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/56
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 배포 main: `6ee302f175f17688f22e2661a36c7ccee217b45f`
- 되돌리기 기준: v58 main `1c8b4a0175e53f5c7db3df9bfff83da81f209bfa`

## v59 가격 밸런스 근거 검토

- GitHub·CI에는 실제 사용자의 완료율·오답·평균 잔액이 없다. 지표는 개인정보 보호를 위해
  `malbitStoryV1.metrics`에만 있고 외부 전송 계약도 없다.
- 모바일 QA의 `5회 시작·4회 완주` 같은 값은 레이아웃·계산 검사용 시드이며 실제 행동 근거가 아니다.
- 따라서 현재는 가격 퀘스트 난이도·가격·보상과 다음 지역 수치를 바꾸지 않는다. 가짜 데이터로
  밸런싱하는 것은 최적화가 아니라 숫자 분장을 한 주술이다.
- 사용자가 식별정보 없이 실제 기기 숫자를 `[AI 지시]` Issue로 제공한 경우에만 다시 검토한다.
- 코드·콘텐츠·저장 키·결제 표면은 변경하지 않았고 production v59를 그대로 유지한다.
- 검사: runtime contract v59
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: main `eb7168c04d1794c865ae6b3e0a0140ec7270f510`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
