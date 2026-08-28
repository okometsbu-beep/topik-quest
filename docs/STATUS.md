# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v67 · Travel RPG engine, Incheon Airport arrivals, and restored Travel themes
- Current candidate: PR #71 until live Pages verification
- Core content: 2,144 original items, including a 56-item set-0 practice expansion
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: finish the first Game or Travel step within ten minutes
- Autonomous runtime: GitHub-connected scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- 172 TOPIK I and 116 TOPIK II quick-practice questions; fixed 12-set mock composition remains intact
- bank explanations structured as answer evidence → distractor trap → reusable type-solving method,
  with separate TOPIK II writing 51–54 plans
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
- semantic spacing, type, surface, border, and touch tokens with Game Mode as the first reference screen
- Game hub and trail checks for 44px controls, 10px support copy, symmetry, overflow, tile brightness,
  and direct 320/375/390/430px screenshot review
- Home hero, level controls, learning cards, weekly goal, and bottom navigation use the same semantic
  surfaces and four-width visual gate
- Shorts question, choice, graded feedback, instructor coaching, and save proposal use one bright
  semantic visual owner with unanswered/graded four-width gates
- Random Practice TOPIK I·II questions, choices, grading, translation, and instructor coaching use
  the same bright semantic surfaces with unanswered/graded four-width gates
- Review TOPIK I·II filters, queue, retry, requested translation, grading, and option elimination use
  the same bright semantic surfaces with resolution/re-entry four-width gates
- Travel exploration separates Seoul world/district/zone/collision/POI/portal data from route learning events
- Incheon Airport T1 arrivals supports tile movement, collision, camera tracking, investigations, and event entry
- Travel respects system/light/dark appearance; map art is unfiltered and actors remain separate layers

## 다음 우선순위

1. 인천공항 T1 교통센터를 두 번째 구역으로 추가하고 입국장과 포털 하나로 연결한다.
2. Home·Game 등 목적 기반 시각 소유자를 밝은/어두운 테마 토큰으로 한 화면씩 전환한다.
3. 실제 학습자가 자주 틀리는 유형 근거를 정리한 뒤 TOPIK·Shorts 문항을 추가한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

`icn-t1-transport-center` 구역 하나를 추가해 입국장 출구 포털과 왕복 이동을 연결하고,
교통 표지 조사 하나를 넣는다. 새 학습 문항이나 서울역 구역은 아직 추가하지 않는다.

## v67 검증 및 배포

- 서울 월드·지역·구역·충돌·조사·이벤트·포털 데이터와 DOM 없는 이동 엔진을 분리하고,
  인천공항 T1 입국장에서 걷기·충돌·카메라·조사·기존 학습 이벤트 진입을 구현했다.
- Travel의 강제 어두운 색상 설정을 제거하고 밝은/어두운 테마별 카드·조작부 토큰을 적용했다.
  공항 맵 원화에는 캐릭터·NPC·검은 도색을 넣지 않고 실행 중 별도 레이어로 합성한다.
- 좌표·방향·걸음·조사 ID는 기존 `malbitStoryV1` episode 안에 저장하며 조사 보상은 한 번만 지급한다.
- 전체 62개 자동검사와 실제 Chrome 320·375·390·430px 밝은/어두운 RPG 검사를 통과했다.
  대칭·돌출·44px 조작부·10px 문구·카메라 안 캐릭터·조사 보상·기존 기록 보존·콘솔 오류 0개를 확인했다.
- 결제 UI·API 키·개인정보 수집·외부 전송은 추가하지 않았다.
- 추적 Issue: https://github.com/okometsbu-beep/topik-quest/issues/70
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/71
- 모바일 검증: https://github.com/okometsbu-beep/topik-quest/actions/runs/33217107943
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v66 main `3a20dda2afdeee7c2afc27db22441cd98cb85197`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 현재 실제 이동 구역은 입국장 하나뿐이다. 서울 전체를 한 캔버스로 늘리지 말고 포털로 구역을 연결한다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
