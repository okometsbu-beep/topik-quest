# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v97 · A05 full grammar translation separated from teacher note
- Current candidate: v98 · A06 Travel full-screen viewport and safe-area ownership
- Core content: 2,144 original items, including a 56-item set-0 practice expansion
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: Japanese beginner completes one appropriate learning step, recalls it, and finds review/next learning
- Autonomous runtime: GitHub-connected scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- Beginner grammar covers core sentence order and major particle, tense, politeness, negation, connective,
  modifier, irregular, and speech-level transformations with per-rule writing practice.
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
- Game hub and trail checks for 44px controls, 10px support copy, symmetry, overflow, theme consistency,
  contrast, and direct 320/375/390/430px screenshot review
- Home hero, level controls, learning cards, weekly goal, and bottom navigation use the same semantic
  light/dark surfaces and four-width visual gate without a mixed-theme shell
- Shorts question, choice, graded feedback, instructor coaching, and save proposal use one theme-aware
  semantic visual owner with unanswered/graded four-width gates
- Random Practice TOPIK I·II questions, choices, grading, translation, and instructor coaching use
  the same light/dark semantic surfaces with unanswered/graded four-width gates
- Random Practice distinguishes reviewed, automatic, and unavailable full translations. A failed
  Japanese translation can never be presented as translated text by echoing the Korean source.
- Review TOPIK I·II filters, queue, retry, requested translation, grading, and option elimination use
  the same light/dark semantic surfaces with resolution/re-entry four-width gates
- Travel exploration separates Seoul world/district/zone/collision/POI/portal data from route learning events
- Incheon Airport T1 arrivals supports tile movement, collision, camera tracking, investigations, and event entry
- Incheon Airport T1 transport center is a separate 48×36 tile zone connected to Arrivals by one bidirectional portal
- Incheon Airport T1 Airport Railroad concourse is a third 48×36 tile zone connected to the transport center
- Travel respects system/light/dark appearance; map art is unfiltered and actors remain separate layers
- Travel movement keeps the map DOM alive for a 110ms player step, 160ms camera follow, ordered rapid
  input, pointer-held repetition, silent collision stopping, and reduced-motion fallback
- Travel exploration uses a full-height map surface with aspect-correct world art, horizontal camera
  tracking, overlaid location/objective/status HUD, and bottom-corner movement/action controls
- Travel RPG owns and locks its full-screen viewport without inheriting the ordinary Travel page's
  42px bottom scroll range. Hub and map headers include the top safe-area inset, and every entry/back
  transition resets legacy page scroll before the learner moves or investigates.
- The default traveler uses one preloaded 8×4 transparent sprite sheet: down/left/right/up rows,
  four idle frames, four 12fps walk frames, and one shared foot anchor. Movement changes the row and
  frame in place without swapping image URLs, opacity, brightness, or map DOM.
- The camera has 1.2× vertical overscan, follows both axes around interior tiles, and snaps to valid
  map bounds without a transition when the mobile viewport resizes, preventing empty-edge flashes.
- Travel maps render ground, foot-depth actors, and upper foreground as separate DOM layers. Tall
  signs, kiosks, ticket gates, machines, and planters reuse the exact map pixels through bounded
  silhouettes, cross actors at their object baseline, and own collision cells in the same zone data.
- Travel actors use a separate shadow layer between the ground and actor layers. Player and visible
  NPC shadows share their actor's foot coordinate and depth, move without replacing DOM, and never
  use a character filter or a scene-wide dark overlay.
- Travel zones declare bounded lamp and screen highlights as data. They render in an independent
  environment layer between ground and contact shadows, cover less than 8% of the map in total,
  and never filter, tint, or darken the original map art.
- Travel portal, investigation, NPC entry, reward, and return actions share a short cue plan. The
  current map DOM stays visible, cue animation touches only the active marker/card/HUD element,
  reduced-motion resolves immediately, and sound/vibration adapters run only after explicit opt-in.
- Travel zones use a 48×36 semantic tile layer. Each cell resolves through a catalog entry owning its
  atlas coordinates, terrain, walkability, and layer; no full-map image element is painted at runtime.
- Player and visible NPCs share a near-one-tile scale, NPCs have idle motion, world markers scale from
  tile variables, and the world stacking context cannot cover the HUD.
- D-pad and investigation controls are translucent, text-free SVG controls. Direction buttons keep moving
  while held, release cleanly, and movement never rebuilds the ground or sprite DOM.
- Travel hold controls suppress iOS callout, text selection, and icon dragging without disabling
  pointer-held movement or selection in ordinary learning copy.
- The first reusable Korean streetscape atlas owns 16 independent 64px source tiles for granite
  sidewalks, asphalt roads, four straight curb boundaries, crosswalks, tactile paving, and lane marks.
  Each catalog entry declares atlas coordinates, terrain, walkability, ground layer, orientation, and
  four edge materials; an isolated 12×8 fixture proves composition without changing airport zones.
- A purpose-named sibling atlas adds four outer and four inner curb corners plus their straight arms.
  Each corner declares its kind, orientation, two perpendicular curb exits, walkability, and four edge
  materials; a separate 12×8 fixture validates outer and inner 90-degree compositions.
- A second sibling atlas adds four oriented T junctions, four cross-center variants, four approaches,
  and reusable road surfaces. A 20×12 fixture proves all T closed sides and every T/cross entry direction
  without adding a playable zone.
- A building-entrance sibling atlas adds four thresholds, four stair variants, four step-free ramps,
  and four transparent upper facades. Ground entries own sidewalk/building edges and accessibility;
  upper entries own a 40px actor baseline, proven in an isolated fixture without changing airport zones.
- A decoration sibling atlas adds blank projecting signs, awnings, planters, and street details as
  16 transparent upper entries. Every prop owns an actor baseline and explicit collision footprint;
  only seven floor-standing props block one cell, proven without changing playable zones.
- A non-playable 12×10 Seoul street block composes only IDs from the five reusable ground, corner,
  junction, entrance, and decoration catalogs. Named walk routes validate matching edge materials;
  upper placements resolve catalog baselines and collision footprints without copying their metadata.
- Two non-playable blocks now compose east-to-west only when both road ports face opposite directions,
  share one material, remain walkable, occupy adjacent cells, and keep every touching seam compatible.
- Two non-playable blocks also compose north-to-south under the same port, material, walkability,
  adjacency, and full-seam contract; both orientations remain isolated from playable Travel zones.
- Four non-playable blocks compose as a 2×2 grid only when all four internal links, both full seam
  axes, and eight unique external exits remain compatible; the grid is still isolated from Travel zones.
- Travel stamina starts at 10,000 steps and is saved inside the existing exploration record. Only a
  successful tile move spends one step; collisions are free, and 0 opens a dedicated full-screen rest scene.
- One-hour rest returns the traveler to the current zone spawn with full stamina while preserving route
  answers, discoveries, rewards, wallet, inventory, and lifetime exploration steps.
- The first airport NPC now holds a five-turn Korean exchange before a keyword choice. Translation is
  requested-only, wrong choices reveal two saved hint stages, and re-entry resumes the same conversation.
- Arrivals has a separate 3×4-tile cheongsachorong welcome prop with a declared two-cell collision
  footprint. Investigation teaches `어서 오세요` with a reviewed beginner note and grants 200 travel won once.
- Every airport zone is capped at 1,728 ground tiles, 256 upper tiles, and 2,048 live board DOM nodes.
  Mobile movement must keep p95 frame time at or below 34ms and frames above 50ms to at most 15%.

## 다음 우선순위

1. [출시 청사진 #110](https://github.com/okometsbu-beep/topik-quest/issues/110)이 #76 서울 맵 확장보다 우선이다.
2. 새 P0·명백한 정답 오류 → 긴급 지시 → 일반 지시 → 이 문서 순서로, 의존성이 풀린 최소 작업 하나만 고른다.
3. A01–A12는 감사에서 발견한 미해결 후보다. 기존 시각/기능 검사 통과가 교육 정확성이나 출시 합격을 뜻하지 않는다.

## 2026 출시 마감 초안 · #110 합격 기준 유지

- 9/13 전면 감사·범위·외부 의존성 확인; 9/27 핵심 학습 동선·P0/P1·백업 안정화.
- 10/11 교육/번역·유형별 풀이·복습·한 RPG 코스 품질; 10/18 기능 동결·출시 후보.
- 10/19–11/2 동의한 실제 테스터 베타; 11/2–11/15 심사/수정 버퍼.
- 11/17 조건부 첫 공개 목표, 지연 시 12/1 대체 검토. Android 일정은 실제 의존성으로 별도 판단한다.
- 주 마감마다 완료/미완료·증거·위험·다음 목표를 기록한다. 12명 중 10명 첫 학습 성공·9명 다음/복습 발견은
  #110의 소규모 목표이며 대표 통계가 아니다. 실제 1일/7일 회상과 공개 후 14일 안정화도 필요하다.
- 계정 가입/결제/신원·서명 키·외부 테스터 초대·개인정보 수집·스토어 제출/공개는 별도 승인 대상이다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

A07: Travel 첫 화면에서 행동 목표보다 앞서는 운영 지표를 접거나 통계 영역으로 옮기고, 첫 행동을
`누구에게/어디서/무엇을` 해야 하는지 명확히 한다. 새 P0/명백한 정답 오류가 있으면 앞당긴다.

## 이번 작업 · A06 Travel 전체화면 헤더/안전영역

- 기준 main/라이브는 v97 `6b8f5e48dea0d3b14276e5cda9478e84dc6e5483`; v98에서 A06 한 건을 준비한다.
- 일반 Travel 화면의 42px 하단 패딩이 100dvh RPG 자식과 합쳐져 문서에 정확히 42px 스크롤 여유를
  만들었고, 그 상태에서 `旅マップ` 버튼과 상단 HUD가 화면 위로 밀리는 원인을 코드와 감사 DOM 값으로 재현했다.
- RPG 활성 상태가 화면 높이·overflow·padding을 직접 소유하도록 하고, 허브/일반 Travel 헤더와 RPG HUD의
  top safe-area를 분리했습니다. Home에서 Travel 진입할 때도 기존 스크롤을 즉시 초기화한다.
- 회귀 검사는 기존 320/375/390/430px 양쪽 테마 외에 42px 스크롤 시도, 가로 회전, 키보드 높이 축소,
  세로 복원을 순환하며 상단 헤더가 뷰포트 안에 있고 RPG 문서 스크롤이 0인지 확인한다.
- 기존 `malbitStoryV1`과 모든 저장 루트, 이동/카메라/held input/포털/문항/보상, 라이트/다크는 변경하지 않았다.
- 로컬 Node v24.19.0: Travel 집중 검사 25/25, 빠른 검사 78/78, diff 검사 통과. 로컬 환경에는
  Chrome/Chromium이 없어 실제 화면은 PR CI 산출물에서 확인하며, 확인 전에는 병합하지 않는다.
- Linux Chrome 4개 폭·양쪽 테마, 전체 검사, 실제 배포는 아직 미검증이다. 실제 iPhone/Android의 notch,
  Safari 주소창, OS 키보드와 회전도 미검증이다.
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/ (v98 병합 후 확인 대상).
- 배포 전 되돌리기 기준: v97 `6b8f5e48dea0d3b14276e5cda9478e84dc6e5483`. 최종 squash SHA와
  Pages 결과는 #110 진행 기록에 남긴다.

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 현재 실제 이동 구역은 입국장·교통센터·공항철도 대합실 세 곳이다. 서울 전체를 한 캔버스로 늘리지 말고 포털로 구역을 연결한다.
- 기본 여행자만 4방향 애니메이션이며 해금 의상은 기존 정적 이미지로 안전하게 대체한다.
- 새 구역은 키 큰 오브젝트의 실루엣·기준선·충돌 셀을 함께 선언하지 않으면 검증을 통과할 수 없다.
- P3 레이어 기반은 완료됐지만 광원은 현재 정적 하이라이트뿐이며 날씨·시간대 변화는 아직 없다.
- v77 연출 계약은 공항 탐험 흐름부터 적용한다. 명동 NPC·보상 화면 연결과 실제 음원 선택 UI는 아직 없다.
- 거리 블록 동서·남북·2×2 검증 맵은 비플레이 fixture다. 실제 서울 구역이나 학습 성과로 집계하지 않는다.
- 첫 공항 NPC만 장문 대화·단어 퀴즈 계약에 편입됐다. 한국 조사물도 첫 청사초롱 한 개뿐이며
  다른 NPC와 조사물은 후속이다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
