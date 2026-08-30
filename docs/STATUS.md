# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v80 · Travel airport NPC dialogue lesson
- Current candidate: v80 · Travel airport NPC dialogue lesson
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
- Game hub and trail checks for 44px controls, 10px support copy, symmetry, overflow, theme consistency,
  contrast, and direct 320/375/390/430px screenshot review
- Home hero, level controls, learning cards, weekly goal, and bottom navigation use the same semantic
  light/dark surfaces and four-width visual gate without a mixed-theme shell
- Shorts question, choice, graded feedback, instructor coaching, and save proposal use one theme-aware
  semantic visual owner with unanswered/graded four-width gates
- Random Practice TOPIK I·II questions, choices, grading, translation, and instructor coaching use
  the same light/dark semantic surfaces with unanswered/graded four-width gates
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
- Travel stamina starts at 10,000 steps and is saved inside the existing exploration record. Only a
  successful tile move spends one step; collisions are free, and 0 opens a dedicated full-screen rest scene.
- One-hour rest returns the traveler to the current zone spawn with full stamina while preserving route
  answers, discoveries, rewards, wallet, inventory, and lifetime exploration steps.
- The first airport NPC now holds a five-turn Korean exchange before a keyword choice. Translation is
  requested-only, wrong choices reveal two saved hint stages, and re-entry resumes the same conversation.

## 다음 우선순위

1. 한국적 조사 오브젝트와 재사용 서울 타일셋, 모바일 성능 예산을 확장한다.
2. 실제 오답 근거를 모아 TOPIK I·II와 Shorts 문항·강사형 해설을 유형별로 확장한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

입국장에 한국적인 조사 오브젝트 하나를 타일·충돌·학습 보상 계약으로 추가하고, 기존 세 구역
DOM/frame 성능 예산을 수치로 고정한다. 새 구역·스태미너 조정·TOPIK 문항 확장은 넣지 않는다.

## v80 후보 검증 및 배포

- 공항 직원과 한국어 다섯 턴을 이어 간 뒤 `교통`을 직접 고른다. 선택지 번역은 제출 전
  숨기고, 번역은 학습자가 요청한 현재 대화와 단서에만 표시한다.
- 첫 오답은 뜻 범주, 두 번째 오답은 복합어 분해 단서를 제공한다. 대화 턴·오답 횟수·번역
  요청은 기존 `malbitStoryV1` 에피소드 안에 저장되어 재접속·재진입 뒤 이어진다.
- 정답 해설은 근거·세 오답의 뜻과 함정·복합 표지어 풀이법을 한국어·일본어로 검증했다.
- 전체 검사 66개와 Travel 집중 검사 20개를 통과했다. 실제 Chrome에서 320·375·390·430px,
  밝은·어두운 테마, 58개 화면, 375×667 첫 선택지 노출을 확인했고 콘솔 오류는 0건이다.
- 기존 답안·지갑·수집품·스태미너·탐험 기록과 저장 키를 유지했다. 결제 UI·API 키·개인정보
  전송은 추가하지 않았다.
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/ (모바일 CI와 병합 뒤 v80 확인)
- 되돌리기 기준: v79 main `a2dbf083a158989e6943cbad09dcb385a8ba6146`

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
- 현재 공항 3개 구역은 기존 원화를 마이그레이션 아틀라스로 쓰되 런타임은 타일 ID별로만
  그린다. 서울 구역을 늘리기 전 반복 가능한 한국 거리 타일셋과 DOM/frame 성능 예산이 필요하다.
- 첫 공항 NPC만 장문 대화·단어 퀴즈 계약에 편입됐다. 다른 NPC와 추가 한국 조사물은 후속이다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
