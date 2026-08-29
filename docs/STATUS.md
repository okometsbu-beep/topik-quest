# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v70 · interpolated movement, camera follow, and rapid-input queue
- Current candidate: v71 · map-first full-screen exploration shell and minimal HUD
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
- Incheon Airport T1 transport center is a separate 12×9 zone connected to Arrivals by one bidirectional portal
- Incheon Airport T1 Airport Railroad concourse is a third 12×9 zone connected to the transport center
- Travel respects system/light/dark appearance; map art is unfiltered and actors remain separate layers
- Travel movement keeps the map DOM alive for a 190ms player step, 280ms camera follow, ordered rapid
  input, directional collision response, and reduced-motion fallback
- Travel exploration uses a full-height map surface with aspect-correct world art, horizontal camera
  tracking, overlaid location/objective/status HUD, and bottom-corner movement/action controls

## 다음 우선순위

1. 4방향 idle/walk 스프라이트 규격과 발 접지 파이프라인을 만든다.
2. 전경 가림·그림자·빛·환경 효과 레이어를 만든다.
3. 실제 학습자가 자주 틀리는 유형 근거를 정리한 뒤 TOPIK·Shorts 문항을 추가한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

기본 여행자 스킨 하나에 4방향 idle/walk 프레임 규격과 발 접지점을 적용하고, 방향 전환과
걷기 프레임을 실제 이동 상태에 연결한다. 새 구역·학습 문항·전경 효과는 같은 작업에 추가하지 않는다.

## v71 후보 검증 및 배포

- 탐험의 큰 제목·재화 카드·목표 카드·조작부를 맵 밖에서 제거하고 전체 높이 맵 위 최소 HUD로 재배치했다.
- 4:3 지형 원본은 늘이지 않고 세로 높이에 맞춰 렌더하며 카메라는 플레이어를 따라 가로로 추적한다.
- 조사 설명은 필요할 때만 하단 카드로 확장하고 평상시에는 목표·여행 원·시각·조사 수만 표시한다.
- 전체 63개 자동검사와 실제 Chrome 320·375·390·430px 밝은/어두운 검사를 통과했다.
  전체 높이 점유율, HUD 안전영역, 44px 조작, 이동 보간·연타 큐, 포털 왕복·재진입·저장 보존·콘솔 오류 0개를 확인했다.
- 결제 UI·API 키·개인정보 수집·외부 전송은 추가하지 않았다.
- 상위권 품질 지시: https://github.com/okometsbu-beep/topik-quest/issues/76
- 모바일 검증: https://github.com/okometsbu-beep/topik-quest/actions/runs/33244717959
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/ (병합 뒤 v71 확인)
- 되돌리기 기준: v70 main `16377ed7ff5de7027aa9386d2def8b831b95f7ff`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 현재 실제 이동 구역은 입국장·교통센터·공항철도 대합실 세 곳이다. 서울 전체를 한 캔버스로 늘리지 말고 포털로 구역을 연결한다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
