# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v71 · map-first full-screen exploration shell and minimal HUD
- Current candidate: v72 · four-direction traveler idle/walk sprite and 12fps walking
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
- The default traveler uses one preloaded 8×4 transparent sprite sheet: down/left/right/up rows,
  four idle frames, four 12fps walk frames, and one shared foot anchor. Movement changes the row and
  frame in place without swapping image URLs, opacity, brightness, or map DOM.
- The camera has 1.2× vertical overscan, follows both axes around interior tiles, and snaps to valid
  map bounds without a transition when the mobile viewport resizes, preventing empty-edge flashes.

## 다음 우선순위

1. 지면·배우·상단 전경을 분리하고 오브젝트 가림·Y-depth·충돌 규칙을 만든다.
2. 그림자·빛·환경 효과를 별도 레이어로 만든다.
3. 실제 학습자가 자주 틀리는 유형 근거를 정리한 뒤 TOPIK·Shorts 문항을 추가한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

지면/배경, 배우, 상단 전경 DOM 레이어를 분리한다. 키 큰 기계·표지·화단은 발 위치와
Y-depth에 따라 캐릭터를 자연스럽게 가리고, 통과 불가 타일은 충돌 데이터와 일치시킨다.
검은 덧칠, 새 구역, 학습 문항, 추가 스킨 애니메이션은 같은 작업에 넣지 않는다.

## v72 후보 검증 및 배포

- 기본 여행자 하나에 4방향 idle 4프레임과 walk 4프레임을 연결하고 걷기를 정확히 12fps로 고정했다.
- 모든 프레임의 발을 같은 접지점에 맞췄고, 방향 전환과 이동 중에도 같은 DOM·같은 PNG를 유지한다.
- 프레임에서 opacity·filter·밝기를 바꾸지 않으며 sprite PNG를 시작 전에 미리 읽어 걷는 중 번쩍임을 막는다.
- 실제 화면 검토에서 잘린 원격 PNG를 발견해 365,968바이트 투명 팔레트로 최적화했고,
  원격과 로컬 Git blob `2563733a9b47aaa93637258522771dbaee56d9fe`가 일치함을 확인했다.
- 320px 리사이즈 때 카메라 보간 중 빈 가장자리가 보이던 문제는 전환 없는 경계 재계산으로 막았다.
- 전체 63개 자동검사와 실제 Chrome 320·375·390·430px 밝은/어두운 검사를 통과했다.
  네 방향 프레임, 12fps, 온전한 캐릭터 크기, 중앙 발 접지, 무점멸, 카메라 경계,
  포털 왕복·재진입·저장 보존·콘솔 오류 0개를 확인했다.
- 결제 UI·API 키·개인정보 수집·외부 전송은 추가하지 않았다.
- 상위권 품질 지시: https://github.com/okometsbu-beep/topik-quest/issues/76
- 모바일 검증: https://github.com/okometsbu-beep/topik-quest/actions/runs/33248170532
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/ (병합 뒤 v72 확인)
- 되돌리기 기준: v71 main `8a55d4b0c55f7f7f473b2c9129ff7757a8e9e31a`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 현재 실제 이동 구역은 입국장·교통센터·공항철도 대합실 세 곳이다. 서울 전체를 한 캔버스로 늘리지 말고 포털로 구역을 연결한다.
- 기본 여행자만 4방향 애니메이션이며 해금 의상은 기존 정적 이미지로 안전하게 대체한다.
- 기계·표지·화단의 전경 가림과 Y-depth는 아직 없으므로 다음 작업 전까지 캐릭터와 겹쳐 보일 수 있다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
