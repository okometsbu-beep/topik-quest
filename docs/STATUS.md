# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v53 · Myeongdong station-sign quest and layered pixel-art reward
- Current candidate: v54 · multi-turn NPC dialogue, free composition, and mobile gameplay repair
- Core content: 2,088 original items
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: finish the first Game or Travel step within ten minutes
- Autonomous runtime: GitHub-connected ChatGPT Scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- independent Seoul Travel Mode and Wordlight Expedition
- Incheon Airport T1 → Seoul Station → Myeongdong route with six beginner missions,
  travel-won rewards, three factual transport choices, a persistent clock, and free avatar looks
- generated pixel-art backgrounds, interchangeable player skins, NPCs, props/rewards, and UI tiles
  composed as separate layers instead of emoji or characters baked into scenery
- Myeongdong day/evening hub with separate street background, guide/vendor NPCs, exchange prop,
  four collectible images, multi-turn NPC dialogue, free Korean composition, Hangul sign building with decoys,
  and a travel-won-only exchange
- Korean-only answer choices before grading, selected/correct translation reveal after grading, and
  evidence → distractor → solving-tip instructor feedback in Travel and Game modes
- Game battle rendering preserves the learner's scroll position instead of forcing smooth scrolling
- Travel UI containment contract: nine-slice variable-height frames, safe content insets, wrapping,
  44px touch targets, and automated 320/375/390/430px overflow/overlap checks
- first-minute dialogue, sign-hotspot, and ticket-machine actions with immediate world reactions,
  collectible rewards, and recoverable time costs
- durable recovery snapshot for vocabulary, game, review, beginner, travel, and settings records
- editable vocabulary details with safe AI integration boundary
- one detailed global TTS setting with device fallback and optional local neural pack
- token-minimal repository handoff, focused verification lanes, GitHub CI and Pages deployment
- Seoul learning-RPG and payment-free avatar reward north star documented

## 다음 우선순위

1. 명동 허브의 다음 학습 변화구로 실제 메뉴 가격 읽기를 추가하되, 자유 작문·표지판 조합과 겹치지
   않는 입력 방식과 작은 여행 원 소비 결정을 연결한다.
2. 첫 여행 코스와 명동 NPC 대화의 정답·해설·일본어 번역을 문맥 단위로 표본 검수한다.
3. 다음 역을 만들기 전에 첫 코스 완료율·명동 진입률·수집품 교환률을 개인정보 없이 로컬
   계측한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + ChatGPT Scheduled 구조를 사용한다.
- 자동화 시간은 Asia/Seoul 00:00, 06:00, 12:00, 18:00이다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포한다.
- 양대 앱스토어 자동 배포는 아직 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를
  유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## v54 검증 및 배포 후보

- runtime v54 무결성, 51개 JavaScript 구문, 2,088개 원본 문제와 전체 47개 테스트를 통과했다.
- 실제 Chrome 390×844에서 공항부터 명동까지 완주한 뒤 낮 NPC 다섯 차례 대화, 자유 작문,
  검수된 대체 문장 300 여행 원 보상, 모범 문장 2,500 여행 원 보상을 차례로 확인했다.
- 여행 선택지는 채점 전 한국어만 보이고 채점 뒤 선택 답·정답에만 번역이 열린다. 해설은
  정답 근거 → 선택 답/시간초과 분석 → 문제풀이 요령 순서로 Travel과 Game 모두 확인했다.
- 320·375·390·430px Game 화면과 390×844 Travel 화면에서 국기 버튼, 가운데 맞춘 배경,
  가변 높이 카드, 44px 터치 영역을 점검했다. 최종 320px HUD의 화면 밖 요소는 0개다.
- 강제 `smooth` 스크롤을 제거하고 스크롤 앵커를 고정해 Game 문제 전환의 덜컥임을 막았다.
- `malbitStoryV1`과 기존 단어장·게임·복습 저장 루트를 유지하고 새 작문 기록만 하위 필드에
  추가했다. 결제 버튼·가격·유료 잠금·API 키는 추가하지 않았다.
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/51
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v53 main `51bf5d9b901f3e6b80d44948df07ed7c69d70159`

## 초기 두 바퀴 사전 검증

1. Prompt contract dry run: 필수 기억 파일, 다섯 절, 한 작업 제한, PAUSE, 커밋 순서,
   배포 경계를 자동검사했고 통과했다.
2. Repository regression dry run: runtime v46·46개 JavaScript 구문·2,088개 문제은행·전체
   37개 테스트를 검사했고 모두 통과했다.

예약 작업을 켠 뒤 첫 두 **실제 독립 세션**도 결과를 검토하고, 범위가 넓거나 시각 검증이
누락되면 즉시 task를 일시정지한 뒤 prompt를 수정한다.

## 다음 한 작업

명동 허브의 다음 학습 변화구로 실제 메뉴 가격 읽기를 추가하고, 표지판 조합과 겹치지 않는
입력 방식 및 작은 여행 원 소비 결정을 연결한다.

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub의 문서와 Issue가 유일한 기억이다.
- 공개 Issue에 비밀정보를 적으면 안 된다.
- UI 변경은 CI만으로 시각 품질을 보증할 수 없으므로 병합 전 모바일 확인이 필수다.
- 서울 전체 지도와 다량의 스킨을 먼저 만들면 학습·재방문 검증 없이 제작비만 커질 수 있다.
- 기존 임시 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
- `malbitStoryV1`은 이름과 달리 기존 진행을 지키는 Travel Mode 호환 저장 키이므로
  이름을 바꾸거나 삭제하면 안 된다.
