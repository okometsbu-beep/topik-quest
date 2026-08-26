# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v52 · Myeongdong NPC hub, word-order quest, and mobile-safe Travel UI
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

## v53 검증 및 배포 후보

- GitHub CI `npm run check`, 51개 JavaScript 구문, 2,088개 원본 문제, runtime v53 무결성 통과
- GitHub CI Chrome에서 실제 버튼 입력으로 공항부터 명동까지 세 교통 경로를 완주하고,
  낮 안내원 NPC 순서 맞추기 뒤에 정답 3음절과 방해 글자 2개를 구분하는 표지판 조립,
  저녁 노점 NPC 전환·수집품 교환·재접속을 검사했다.
- 320·375·390·430px에서 가로 넘침, 화면 밖 터치 요소, 44px 미만 조작부, 흐름 요소 겹침을
  자동으로 차단했고 15장의 실제 화면 중 표지판 입력·정답·상점 화면을 사람이 확인했다.
- 새 수집 보상은 이모지 대신 투명 배경 도트 그래픽으로 생성했고, 기존 배경·캐릭터·NPC·상점
  레이어와 분리해 합성한다. 표지판 문자는 이미지에 굽지 않고 접근 가능한 HTML로 표시한다.
- `malbitStoryV1` 저장 루트와 기존 episode 필드를 유지하고 새 퀘스트만 하위 필드에 추가했다.
  단어장·게임·복습 기록을 플레이 전후 비교해 모두 보존했다.
- 결제 버튼·가격·유료 잠금·API 키를 추가하지 않음
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/50
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v52 main `676ee9b2a94a9b7ff22551aefc7e8eda3e5caf44`

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
