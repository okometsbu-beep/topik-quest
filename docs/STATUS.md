# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v60 · one-tap return to the next Myeongdong learning quest
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

실제 기기 가격 퀘스트 수치나 새 `[AI 지시]`가 들어오기 전에는 밸런스·보상·다음 지역을
변경하지 않는다. 근거가 들어오면 식별정보 없이 완료율·오답·평균 잔액부터 검토한다.

## v60 검증 및 배포

- 완주했지만 미완료 명동 학습 퀘스트가 남은 코스의 기본 CTA를 `명동 다음 퀘스트`로 바꿨다.
- CTA 한 번으로 시간대에 맞는 다음 미완료 퀘스트가 있는 명동 허브에 들어간다. 모든 명동
  퀘스트를 마치면 기존 `완주 기록 보기`를 유지한다.
- `malbitStoryV1` 저장 구조, 지갑, 수집품, 단어장·게임·복습 기록은 그대로 보존한다.
- runtime contract v60, JavaScript 51개 구문, 빠른 검사 43개와 GitHub Actions 전체 검사를 통과했다.
- 실제 Chrome에서 320·375·390·430px containment, CTA 한 번의 터치 재진입, 세 경로 완주,
  명동 학습·재접속과 콘솔 오류 0개를 확인했다. 일본어 CTA와 도착 허브 화면도 직접 확인했다.
- 결제 UI·API 키·개인정보 수집·외부 전송은 추가하지 않았다.
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/58
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v59 main `66e47397bd65e1622e636446d01a213b111b62bf`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
