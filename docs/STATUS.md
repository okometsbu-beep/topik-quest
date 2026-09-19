# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 긴급 사용자 요청 · #129

- 대상: TOPIK II 작문 51·52번 ㄱ/ㄴ 입력 완전 분리. Shorts 확충보다 우선.
- 완료: PR #130을 squash merge하고 v110을 GitHub Pages에 배포했다. 제품 커밋은
  `a0f852517ae72b3371ca9ab6c6fc3936c09ddda3`, 복귀 기준은 v109
  `b84e596129956e0e70328910c22917b9a8bfbb5c`다.
- 두 textarea, 개별 자동 저장/제출 조건/참고 점수/모범답안 비교/복습 스냅샷 구현.
- 기존 표지 있는 문자열은 분리, 무표지 문자열은 ㄱ에 원문 보존 + 확인 안내. 53·54 긴 글 및 원본 은행 불변.
- 2026-09-12 추가 검증: 작문 복습만 남은 복구 스냅샷을 `coreWeight`가 0으로 계산해 빈 core 복구를 놓치는 결함을 실패 테스트로 재현 후 수정. 기존 스냅샷이 최신 작문 기록을 덮어쓰지 않는 경우도 검사.
- 실제 검사: Linux Node v24.19.0, 집중 10/10·quick 95/95·전체 `npm run check` 110/110. 로컬 HTTP 3개 기본+45개 런타임 통과. PR CI와 main CI `34702111845`에서 Linux Chrome 320/375/390/430px×라이트/다크, 두 칸 터치 입력·독립 저장·새로고침 복원·참고 점수·복습 분리·구형 단일 답안 안내를 통과했다. main CI 첫 시도는 Chrome target 종료로 실패했으나 동일 커밋 재실행은 통과했다.
- 라이브 공개 브라우저: v110을 새로 불러온 TOPIK II → 쓰기만 → 51번에서 `ㄱ(기역) 답안`과 `ㄴ(니은) 답안` 두 textbox를 확인했다. 서로 다른 값을 입력하고 다음→이전 뒤에도 각각 유지됐다. HTTP smoke는 3개 기본+45개 런타임을 통과했다.
- 시각 증거: CI artifact `10300595038`의 `00bu-writing-two-blanks-light.png`, `00bv-writing-two-blanks-dark.png`, `00bw-writing-two-blanks-review-dark.png` 직접 확인. 실제 iPhone/Android 및 실제 IME는 미검증이며 에뮬레이션과 구별한다.
- 다음 한 작업: v125 TOPIK I 기본 연결 표현 후보의 검사·시각 증거·배포 검증.
- 현재 라이브/복귀 기준: v124 `10bb264f48b75754c10456f33236d3352f6ba5a0`,
  https://okometsbu-beep.github.io/topik-quest/ . 제품 복귀 기준은 v123
  `cdefae5b00748f2df360f99050d66ea0c079495d`이다.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v124 · four bounded TOPIK II degree/comparison Shorts (`10bb264f48b75754c10456f33236d3352f6ba5a0`)
- Current candidate: v125 · four bounded TOPIK I basic-connective Shorts
- Core content: 2,144 original items, including a 56-item set-0 practice expansion
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: Japanese beginner completes one appropriate learning step, recalls it, and finds review/next learning
- Autonomous runtime: GitHub-connected scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- Beginner grammar covers core sentence order and major particle, tense, politeness, negation, connective,
  modifier, irregular, and speech-level transformations with per-rule writing practice.
- Production v124 has 212 TOPIK I / 164 TOPIK II rows and only 124 / 126 distinct
  question-choice sets. These are inventory counts, not educational approvals.
- Production v124 adds four TOPIK II degree/comparison cards (`-에 비해(서)`, `-에 못지않게`,
  `-만큼`, `-(으)ㄹ 정도로`). Its generated inventory is 376 rows / 250 exact families
  (I 124, II 126), with the existing 15 structural flags unchanged.
  Fixed mock composition remains intact.
- Candidate v125 adds four TOPIK I clause-relation cards (`-(으)면서`, `-(으)니까`,
  `-(으)러`, `-는데`). Candidate inventory is 380 rows / 254 exact families (I 128, II 126),
  with 126 redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals.
- v120 adds four TOPIK II temporal-relation cards (`-자마자`, `-고 나서`, `-는 동안`,
  `-기 전에`). Its generated inventory is 360 rows / 234 exact families (I 116, II 118),
  with the existing 15 structural flags unchanged.
- v121 adds four TOPIK I polite-interaction cards (`주세요`, `-(으)세요`, `-지 마세요`,
  `-(으)ㄹ까요?`). Its generated inventory is 364 rows / 238 exact families (I 120, II 118),
  with the existing 15 structural flags unchanged.
- v122 adds four TOPIK II formal-relation marker cards (`-에 따르면`, `-에 따라(서)`,
  `-을/를 통해(서)`, `-에 의해(서)`). Its generated inventory is 368 rows / 242 exact families
  (I 120, II 122), with the existing 15 structural flags unchanged.
- Production v123 adds four TOPIK I basic-negation cards (`안`, `못`, `아니에요`, `없어요`).
  Its generated inventory is 372 rows / 246 exact families (I 124, II 122), with the existing
  15 structural flags unchanged. This is a bounded AI review, not human approval or learner evidence.
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
4. 9/10 최신 지시: C01–C06 콘텐츠 품질의 첫 대상은 S01–S05 숏츠다. A08/서울 확장보다
   짧은 한 판단·정답 납득·구체적 해설·완전 번역·중복 회피·검수된 문제량을 우선한다.

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

#129 긴급 작문 입력 분리와 v111–v124의 제한 검수 문항 배포·운영 문서 동기화는 완료됐다.
현재 한 작업은 v125 TOPIK I 기본 연결 표현 4문항 후보의 검사·시각 증거·배포 검증이다.
수량 자체를 교육 승인이나 출시 진척으로 보지 않는다.

## 진행 중 · S04 TOPIK I 기본 연결 표현 숏츠 4문항

- v125 후보는 `-(으)면서·-(으)니까·-(으)러·-는데`를 동시 행동·이유 뒤 판단/요청·
  이동 목적·뒤말의 배경으로 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는
  변경하지 않고 기존 TOPIK I 행 뒤에만 추가한다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 절 관계` 풀이법을 내장했다.
- 후보 재고는 380행/254 정확 질문-보기군, I 128·II 126개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/380이다.
- Node 24 집중 vocabulary+inventory 28/28, 콘텐츠 31/31, 전체 release check 125/125와
  v125 런타임 45개 계약을 통과했다. 모바일 CI는 진행 전이다.
  실제 일본어 모어 화자, 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik1-basic-connectives.md`다.

## 완료 작업 · S04 TOPIK II 정도·비교 관계 숏츠 4문항

- v124는 `-에 비해(서)·-에 못지않게·-만큼·-(으)ㄹ 정도로`를 명시적 기준과의 차이·
  기준에 뒤지지 않는 정도·같은 정도·결과로 드러나는 큰 정도로 각각 구분한다. 기존 ID,
  원본 은행과 `topikQuestShortsV1` 저장 구조는 변경하지 않고 기존 TOPIK II 행 뒤에만 추가한다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 기준/정도 관계` 풀이법을 내장했다.
- production 재고는 376행/250 정확 질문-보기군, I 124·II 126개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/376이다.
- Node 24 집중 vocabulary+inventory 27/27, 콘텐츠 30/30, 전체 release check 124/124와
  v124 런타임 45개 계약은 통과했다. 로컬 Chrome/Chromium은 없지만 PR #158 선행 CI
  `35434058774`가 Linux Chrome 320·375·390·430px 라이트/다크, 일본어 선택 오답 설명,
  상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact `10581702595`의
  `00cy`/`00cz` 화면을 직접 확인했다. 최종 PR CI `35434477757`은 Node 124/124 뒤 Chrome
  target이 한 번 종료됐지만 동일 커밋 실패 작업 재실행에서 성공했다. PR #158을 squash merge한
  production v124 제품 커밋은 `10bb264f48b75754c10456f33236d3352f6ba5a0`이다. main CI
  `35434734289`와 Pages `35434733945`도 성공했다. 라이브 HTTP smoke는 v124 기본 3개+런타임
  45개를 통과했고 `index.html`, `site-patch.js`, `sw.js`, `data/shorts-levels.js` 해시가 main과
  일치했다. 공개 브라우저에서 일본어 TOPIK II Shorts의 신규 `-만큼` 카드에 의도적 오답을
  제출한 뒤 선택별 피드백·정답·예문·상세 해설과 새로고침 잠금 상태 복구를 확인했다. 제품
  복귀 기준은 v123 `cdefae5b00748f2df360f99050d66ea0c079495d`이다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik2-degree-comparison.md`다.

## 완료 작업 · S04 TOPIK I 기초 부정 표현 숏츠 4문항

- v123은 `안·못·아니에요·없어요`를 일반 부정·능력/상황상 불가능·명사 정체 부정·
  사람/사물/시간의 부재와 각각 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는
  변경하지 않으며 기존 TOPIK I 행 뒤에만 추가한다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 부정 역할` 풀이법을 내장했다.
- production 재고는 372행/246 정확 질문-보기군, I 124·II 122개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/372다.
- Node 24 집중 vocabulary+inventory 26/26, 콘텐츠 29/29, 전체 release check 123/123과
  v123 런타임 45개 계약은 통과했다. 로컬에는 Chrome/Chromium 실행 파일이 없지만 PR #156
  선행 증거 CI `35417933793`이 Linux Chrome 320·375·390·430px 라이트/다크, 일본어 선택 오답 설명,
  상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact `10576448286`의 `00cw`/`00cx`
  화면을 직접 확인했고 최종 PR CI `35418170909`도 성공했다. PR #156을 squash merge한
  production v123 제품 커밋은 `cdefae5b00748f2df360f99050d66ea0c079495d`이다. main CI
  `35418404159`와 Pages `35418403561`도 성공했다. 공개 브라우저에서 일본어 `없어요` 카드의
  의도적 `못` 오답 제출·선택별 피드백·새로고침 복원·상세 근거/함정/풀이법을 확인했다.
  라이브 HTTP smoke는 v123 기본 3개+런타임 45개를 통과했고 `index.html`, `site-patch.js`,
  `sw.js`, `data/shorts-levels.js` 해시가 main과 일치했다. 제품 복귀 기준은 v122
  `16048fd8f67700f96575d85119614a0db3e8a9cc`이다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik1-basic-negation.md`다.

## 완료 작업 · S04 TOPIK II 격식 관계 표지 숏츠 4문항

- v122는 `-에 따르면·-에 따라(서)·-을/를 통해(서)·-에 의해(서)`로 정보원·변화 기준·
  수단/경로·피동 주체/격식 원인을 각각 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1`
  저장 구조는 변경하지 않는다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 앞 명사의 역할` 풀이법을 내장했다.
- production 재고는 368행/242 정확 질문-보기군, I 120·II 122개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/368이다.
- Node 24 집중 vocabulary+inventory 25/25, 콘텐츠 28/28, 전체 release check 122/122와 v122
  런타임 45개 계약은 통과했다. PR #154 CI `35360830953`도 Linux Chrome 320·375·390·430px
  라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다.
  artifact `10554394352`의 `00cu`/`00cv`를 직접 확인했고 최종 PR CI `35361581234`도 성공했다.
  PR #154를 squash merge한 production v122 제품 커밋은
  `16048fd8f67700f96575d85119614a0db3e8a9cc`이다. main CI `35362016106`은 첫 시도의 기존
  Travel 390×844 브라우저 단계가 간헐 실패했으나 동일 커밋 실패 작업 재실행에서 성공했고,
  Pages `35362015443`도 성공했다. 공개 브라우저에서 v122 기본 3개+런타임 45개, 새 ID 4개,
  일본어 오답 피드백·상세 해설·새로고침 복구를 확인했으며 `index.html` 해시가 main과 일치했다.
  제품 복귀 기준은 v121 `4ab4628791d4524f6f9cb88b813a84e010bbe922`이다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik2-formal-relation.md`다.

## 완료 작업 · S04 TOPIK I 정중한 상호작용 숏츠 4문항

- v121은 `주세요·-(으)세요·-지 마세요·-(으)ㄹ까요?`로 물건 요청·행동 요청/안내·금지
  요청·함께할 행동 제안을 각각 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는
  변경하지 않는다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 발화 목적` 풀이법을 내장했다.
- production 재고는 364행/238 정확 질문-보기군, I 120·II 118개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/364다.
- Node 24 집중 vocabulary+inventory 24/24, 콘텐츠 27/27, 전체 release check 121/121과 v121
  런타임 45개 계약은 통과했다. PR #152 CI `35328201976`도 Linux Chrome 320·375·390·430px
  라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다.
  artifact `10539553980`의 `00cs`/`00ct`를 직접 확인했고 최종 PR CI `35328740574`도 성공했다.
  PR #152를 squash merge한 production v121 제품 커밋은
  `4ab4628791d4524f6f9cb88b813a84e010bbe922`이며 main CI `35329196677`과 Pages
  `35329196286`이 성공했다. 공개 브라우저에서 v121 스크립트, TOPIK I Shorts 보기 렌더링과
  라이브 `data/shorts-levels.js?v=121`의 새 ID 4개를 확인했다. 제품 복귀 기준은 v120
  `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`이다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik1-polite-interaction.md`다.

## 완료 작업 · S04 TOPIK II 시간 관계 숏츠 4문항

- v120은 `-자마자·-고 나서·-는 동안·-기 전에`로 직후·완료 뒤·시간 겹침·기준 동작 전을
  각각 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는 변경하지 않는다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 시간축` 풀이법을 내장했다.
- production 재고는 360행/234 정확 질문-보기군, I 116·II 118개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/360이다.
- Node 24 집중 vocabulary+inventory 23/23, 콘텐츠 26/26, 전체 release check 120/120과 v120
  런타임 45개 계약은 통과했다. PR #150 CI `35275144430`도 Linux Chrome 320·375·390·430px
  라이트/다크, 선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact
  `10520142804`의 `00cq`/`00cr`을 직접 확인했고 최종 PR CI `35275712725`도 성공했다.
  PR #150을 squash merge한 production v120 제품 커밋은
  `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`이며 main CI `35276178355`와 Pages
  `35276177552`가 성공했다. 라이브 v120에서 기본 3개+런타임 45개, 새 ID 4개와 오답 제출 뒤
  새로고침 복구를 확인했다. 제품 복귀 기준은 v119 `584b42f86b062eb18932aac541ed2ffcfc3b723d`다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik2-time-relation.md`다.

## 완료 작업 · S04 TOPIK I 기초 시제 숏츠 4문항

- v119는 매일의 현재 습관·이미 끝난 과거·지금 진행 중·앞으로의 계획을 각각 구분한다.
  기존 입문 문법의 현재/과거/진행/미래 규칙과 일치시키며 기존 ID와 `topikQuestShortsV1` 저장 구조는
  변경하지 않는다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 시간 단서 → 네 함정 → 시간축` 풀이법을 내장했다.
- production 재고는 356행/230 정확 질문-보기군, I 116·II 114개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/356이다.
- Node 24 집중 vocabulary+inventory 22/22, 콘텐츠 25/25, 전체 release check 119/119과 v119
  런타임 45개 계약은 통과했다. PR #148 CI `35203602934`도 Linux Chrome 320·375·390·430px
  라이트/다크, 선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact
  `10489585088`의 `00co`/`00cp`를 직접 확인했다. 최종 PR CI `35204050921`은 기존 Travel Chrome
  target 종료로 한 번 실패한 뒤 같은 커밋 재실행에 성공했다. PR #148을 squash merge한 production
  v119 제품 커밋은 `584b42f86b062eb18932aac541ed2ffcfc3b723d`이며 main CI `35204749013`과
  Pages `35204747120`이 성공했다. 공개 Chrome에서 Shorts 진입·오답 제출·새로고침 복구를 확인했고,
  HTTP smoke는 기본 3개+런타임 45개를 통과했다. 공개 핵심 자산 4개의 SHA-256이 main과 일치한다.
  제품 복귀 기준은 v118 `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`이다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik1-basic-tense.md`다.

## 완료 작업 · S04 TOPIK II 계획 단계 문법 숏츠 4문항

- v118은 아직 고민 중·개인 의향·이미 내린 결정·날짜/일정 확정을 각각 구분한다. 기존 ID와
  `topikQuestShortsV1` 저장 구조는 변경하지 않는다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 계획 단계` 풀이법을 내장했다.
  첫 초안의 기존 원본 용어 `-(으)려던 참이다` 중복은 집중 검사에서 발견해 배포 전에 제외했다.
- production 재고는 352행/226 정확 질문-보기군, I 112·II 114개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/352다.
- Node 24 콘텐츠 24/24, 생성 재고 검사 2/2, 전체 release check 118/118과 v118 런타임 45개
  계약은 통과했다. PR #146 최종 CI `35051427873`도 Linux Chrome 320·375·390·430px 라이트/다크,
  선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact `10429495520`의
  `00cm`/`00cn`을 직접 확인했다. PR #146을 squash merge한 production v118 제품 커밋은
  `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`이다. main CI `35051754654`와 Pages
  `35051754080`이 성공했다. 캐시를 우회한 공개 브라우저에서 `?v=118`, 새 ID 4개와 Shorts 진입을
  확인했고 `data/shorts-levels.js`, `site-patch.js`, `sw.js` SHA-256이 main과 일치한다.
  제품 복귀 기준은 v117 `a14dd083f3afd64142990ae1d829df985cbf8db3`이다.
- 실제 일본어 모어 화자, 동의한 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik2-plan-stage.md`다.

## 완료 작업 · S04 TOPIK I 지시어 숏츠 4문항

- v117은 `이것·그것·저것·어느 것`을 화자 가까이·청자 가까이/이미 언급·화자와 청자
  모두에게서 멂·여럿 중 질문과 각각 매칭한다. 기존 ID와 `topikQuestShortsV1` 저장 구조는
  변경하지 않는다.
- 네 카드에는 ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 사람과 물건의 관계`
  풀이법을 내장했다. 일본어 `これ·それ·あれ·どれ` 대응을 명시하지만 실제 모어 화자 검수로
  집계하지 않는다.
- 후보 재고는 348행/222 정확 질문-보기군, I 112·II 110개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/348이다.
- Node 24 집중 vocabulary+inventory 20/20, 콘텐츠 23/23, 전체 release check 117/117을
  통과했다. PR #144 CI `34986620849`도 같은 117/117과 Linux Chrome 320·375·390·430px
  라이트/다크, 선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다.
  artifact `10403494820`의 `00ck`/`00cl` 화면을 직접 확인했다.
- 첫 PR run `34986362108`은 연결 경로가 생성 재고 JSON을 잘라 올려 브라우저 검사 전에
  실패했다. 후보 내용 검사는 통과했고, 해당 blob을 로컬과 같은 바이트로 교체한 뒤 원격 tree가
  로컬 검사 tree와 일치했으며 변경 없는 다음 run은 전체 통과했다. 최종 증거만 추가한 PR CI
  `34987279723`도 성공했다.
- PR #144를 squash merge한 production v117 제품 커밋은
  `a14dd083f3afd64142990ae1d829df985cbf8db3`이다. main CI `34987826662`와 Pages
  `34987825941`가 성공했다. 라이브에서 기본 3개+런타임 45개가 `?v=117`을 사용하며 Shorts
  진입과 새 ID 4개를 확인했다. `data/shorts-levels.js`, `site-patch.js`, `sw.js` 해시는 main과
  일치한다. 제품 복귀 기준은 v116 `0b93456fc400ff47b378c6e15b1384bc6187e8f2`이다.
- 실제 일본어 모어 화자, 동의한 초보자 풀이시간/D1·D7 회상, 실제 iPhone/Android, 오디오와
  전체 오프라인 복구는 미검증이다. CI 화면은 Linux Chrome 에뮬레이션이다.

## 완료 작업 · S04 TOPIK II 행동 판단·제약 문법 숏츠 4문항

- v116은 `-(으)ㄹ 수밖에 없다·-(으)ㄹ 만하다·-(으)ㄹ 필요가 있다·-(으)ㄹ 필요가 없다`를
  다른 선택 없음·해 볼 가치·해야 할 필요·하지 않아도 됨과 각각 매칭한다. 기존 ID와
  `topikQuestShortsV1` 저장 구조는 변경하지 않는다.
- 네 카드에는 ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 행동 판단`
  풀이법을 내장했다. 기존 카드와 중복된 최초 두 표현은 집중 검사에서 발견해 후보에서 제외했다.
- 재고는 344행/218 정확 질문-보기군, I 108·II 110개다. 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 여전히 0/344다.
- Node 24 콘텐츠 22/22·재고 2/2·전체 release check 116/116을 통과했다. PR #142 최종 CI
  `34925330780`도 Linux Chrome 320·375·390·430px 라이트/다크, 선택 오답 설명, 상세 해설,
  다음 문제 우선, 새로고침 복원을 통과했다. artifact `10380265217`의 `00ci`/`00cj`를 직접
  확인했다. 앞선 문서 커밋 CI는 서로 다른 기존 카드의 복구 직후 빈 피드백을 읽는 경합을
  드러냈고, 요소 존재뿐 아니라 내용 완료까지 기다리도록 검증 도구를 보강했다.
- PR #142를 squash merge한 제품 커밋은 `0b93456fc400ff47b378c6e15b1384bc6187e8f2`이다.
  main CI `34925644900`과 Pages `34925644352`가 성공했다. 공개 Chrome에서 캐시를 우회해
  라이브를 열었고 런타임 script가 `?v=116`을 사용했다. 공개 `data/shorts-levels.js`
  87,035문자에서 새 ID 4개와 네 표현을 확인했다. 제품 복귀 기준은 v115
  `05e84b401330074bf3432339859169cc156d6357`이다.
- 로컬 Chrome, 실제 일본어 모어 화자, 초보자 풀이시간/D1·D7 회상, 실제 iPhone/Android는
  미검증이며 에뮬레이션과 구별한다.

## 완료 작업 · S04 TOPIK I 조사 역할 숏츠 4문항

- v115는 `에·에서·(으)로·에게`를 이동 도착점·행동 장소·수단/방법·사람인 받는 대상과
  각각 매칭한다. 기존 ID와 `topikQuestShortsV1` 저장 구조는 변경하지 않는다.
- 네 카드에는 ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 동사+명사 역할`
  풀이법을 내장했다. AI 제한 검수이며 실제 언어 검수나 학습자 측정으로 집계하지 않는다.
- 재고는 340행/214 정확 질문-보기군, I 108·II 106개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았다. 전체 승인 수는 여전히 0/340이다.
- Node 24 콘텐츠 21/21, 재고 2/2, 전체 release check 115/115를 통과했다. PR #140 최종 CI
  `34861683365`는 320·375·390·430px 라이트/다크 Linux Chrome 에뮬레이션, 선택 오답 설명,
  상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact `10354814262`의 `00cg`/`00ch`
  화면을 직접 확인했다. 같은 첫 후보 커밋의 push CI `34860142562`는 Travel 390x844 단계에서
  실패했지만 변경 없는 PR CI `34860162071`은 전체 단계를 통과했고, 전용 시각 검사를 추가한
  최종 PR CI도 통과했다. PR #140을 squash merge한 제품 커밋은
  `05e84b401330074bf3432339859169cc156d6357`이다. main CI `34862095120`과 Pages
  `34862094068`이 성공했다. 라이브 HTTP smoke는 v115, 기본 3개+런타임 45개를 통과했고
  네 ID와 `data/shorts-levels.js`·`site-patch.js` SHA-256이 main과 일치한다. 제품 복귀 기준은
  v114 `655f8715fc080a9e14b7cea00d34b0a0911a099c`이다.
- 실제 일본어 모어 화자, 초보자 5–15초 풀이/D1·D7 회상, 실제 iPhone/Android는 미검증이다.

## 완료 작업 · S04 TOPIK II 완료·경험 문법 숏츠 4문항

- v114는 `-아/어 버리다·-(으)ㄴ 끝에·-아/어 본 적이 있다·-아/어 놓다`를 남김없는 완료,
  긴 과정 뒤 마지막 결과, 과거 경험, 미리 준비해 유지하는 상태와 각각 매칭한다.
- 네 카드는 안정 ID와 고정 선택지, ko/ja/en/zh 예문·선택 오답별 설명·결정적 근거→네 함정→
  끝난 뒤 강조점 풀이법을 내장한다. 기존 ID와 `topikQuestShortsV1` 저장 구조는 바꾸지 않는다.
- 후보 재고는 336행/210 정확 질문-보기군, I 104·II 106개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았다. 전체 승인 수는 여전히 0/336이다.
- Node 24 집중 검사는 콘텐츠 20/20, 재고 2/2를 통과했고 전체 release check도 114/114를 통과했다.
  PR #138 CI `34826401968`의 동일 커밋 재실행은 Linux Chrome 320·375·390·430px 라이트/다크,
  선택 오답·상세 해설·다음 문제 우선·새로고침 복원과 104개 화면을 오류 0으로 통과했다. 첫 시도는 새 카드에
  도달하기 전 기존 상태 변화 카드의 새로고침 단언에서 중단됐고, 무변경 재실행으로 간헐 실패임을 구별했다.
  artifact `10339933219`의 `00ce`/`00cf` 화면을 직접 확인했다.
  실제 일본어 모어 화자, 초보자 5–15초 풀이/D1·D7 회상, 실제 iPhone/Android도 미검증이다.
- PR #138 최종 CI `34827184679`도 성공했고 squash merge한 production 커밋은
  `655f8715fc080a9e14b7cea00d34b0a0911a099c`이다. main CI `34827681146`과 Pages
  `34827680006`이 성공했다. 라이브 HTTP smoke는 v114, 기본 3개+런타임 45개를 통과했고
  네 ID와 `data/shorts-levels.js`·`site-patch.js` 해시가 main과 일치한다. 제품 복귀 기준은
  v113 `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`이다.
- 다음 한 작업: 새 P0·명백한 정답 오류가 없으면 TOPIK I 부족 유형 4문항 제한 검수.

## 완료 작업 · S04 TOPIK I 의문사 숏츠 4문항 검수·확충

- v113은 사람·장소·날/시각·가격/금액을 각각 `누구·어디·언제·얼마`와 매칭하는 짧은
  카드 4개를 안정 ID로 추가한다. 기존 숏츠와 `topikQuestShortsV1` 저장 구조는 변경하지 않는다.
- 각 카드에 선택 오답별 설명, 결정적 예문→네 함정→묻는 대상 먼저 보기 풀이법, ko/ja/en/zh
  뜻·보기·예문·해설을 내장했다. AI 제한 검수이며 사람 언어 검수나 실제 학습자 측정으로 집계하지 않는다.
- 재고는 332행/206 정확 의미군, 레벨별 서로 다른 묶음은 I 104·II 102다. 기존 중복 126행,
  구조 후보 15개, 정답 충돌 0은 유지된다. 전체 승인 수는 여전히 0/332다.
- Node 24 콘텐츠 검사는 19/19, 전체 release check는 113/113 통과했다. 첫 전체 실행은 재고 총계
  계약이 기존 328행을 기대해 실패했고 실제 332행으로 갱신한 뒤 실패 검사와 전체 검사가 통과했다.
  PR #136 CI `34783191274`도 113/113과 320·375·390·430px 라이트/다크 Linux Chrome
  에뮬레이션, 선택 오답 해설·상세 해설·다음 문제 우선·새로고침 복원을 통과했다. artifact
  `10325594505`의 `00cc`/`00cd` 화면을 직접 확인했다. 최종 PR CI `34783447830`도 성공했고,
  PR #136을 squash merge한 production 커밋은 `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`이다.
  main CI `34783696587`은 첫 시도에서 Chrome target이 종료됐으나 같은 커밋 재실행에서 성공했고,
  Pages `34783696240`도 성공했다. 라이브 HTTP smoke는 v113, 기본 3개+런타임 45개를 통과했고
  `data/shorts-levels.js`, `site-patch.js` 해시와 새 네 ID가 main과 일치한다. 제품 복귀 기준은
  v112 `b42d0759a6b98c363f77f6ac72be527e742e8707`이다.
  실제 일본어 모어 화자, 학습자 5–15초 풀이/D1·D7 회상, 실제 iPhone/Android도 미검증이다.
- 다음 한 작업: 새 P0·명백한 정답 오류가 없으면 TOPIK II 부족 유형 4문항 제한 검수.

## 완료 작업 · S04 TOPIK II 조건 관계 숏츠 4문항 검수·확충

- v112에서 `-거든·-아/어야만·-(으)ㄴ/는다면·-다가는`을 실제 발생 뒤 부탁·지시,
  필수 조건, 미정 상황 가정, 계속할 때의 나쁜 결과 경고와 매칭하는 짧은 카드 4개를 안정 ID로
  추가했다. 기존 숏츠와 모든 학습 저장 루트는 변경하지 않는다.
- 각 카드에 선택 오답별 설명, 결정적 예문→네 함정→뒤 절 역할 풀이법, ko/ja/en/zh 뜻·보기·
  예문·해설을 내장했다. AI 제한 검수이며 사람 언어 검수나 실제 학습자 측정으로 집계하지 않는다.
- 재고는 328행/202 정확 의미군, 레벨별 서로 다른 묶음은 I 100·II 102다. 기존 중복 126행,
  구조 후보 15개, 정답 충돌 0은 유지된다. 전체 승인 수는 여전히 0/328이다.
- Node 24 데이터 검사 13/13, 재고 검사 2/2, 전체 release check 112/112를 통과했다. 로컬에는
  Chrome이 없어 시각 실행이 불가능했지만 PR #134 최종 CI `34765253730`에서 112/112와 320·375·390·430px
  라이트/다크 Linux Chrome 에뮬레이션, 선택 오답 해설·상세 해설·다음 문제 우선·새로고침 복원을
  통과했다. artifact `10320915051`의 `00bz`/`00cb` 화면을 직접 확인했다. PR #134를 squash
  merge한 production 커밋은 `b42d0759a6b98c363f77f6ac72be527e742e8707`이다. main CI
  `34765463888`과 Pages `34765463632`가 성공했다. 라이브 HTTP smoke는 v112, 기본 3개+런타임
  45개를 통과했고 `data/shorts-levels.js`, `site-patch.js` 해시 및 새 네 ID가 main과 일치한다.
  제품 복귀 기준은 v111 `5cbb6773f9cb78c6ab4bd6791165841126038707`이다. 실제 기기는 미검증이다.
- 다음 한 작업: 새 P0·명백한 정답 오류가 없으면 검수 수가 더 적은 TOPIK I 부족 유형 4문항.

## 이전 작업 · S04 TOPIK I 단위 명사 숏츠 4문항 검수·확충

- v111에서 `명·개·병·권`을 사람·일반 물건·병에 든 것·책/공책과 매칭하는
  짧은 카드 4개를 안정 ID로 추가했다. 기존 숏츠와 모든 학습 저장 루트는 변경하지 않는다.
- 각 카드에 선택 오답별 설명, 결정적 예문→네 함정→대상 먼저 보기 풀이법, ko/ja/en/zh 뜻·보기·
  예문·해설을 내장했다. AI 제한 검수이며 사람 언어 검수나 실제 학습자 측정으로 집계하지 않는다.
- 재고는 324행/198 정확 의미군, 레벨별 서로 다른 묶음은 I 100·II 98이다. 기존 중복 126행,
  구조 후보 15개, 정답 충돌 0은 유지된다. 전체 승인 수는 여전히 0/324다.
- Node 24 콘텐츠 검사 17/17, 재고 2/2, 전체 검사 111/111 통과. PR #132 최종 CI `34735351694`의
  동일 커밋 재실행에서 111/111과 320·375·390·430px 라이트/다크 Linux Chrome 에뮬레이션,
  선택 오답 해설·상세 해설·새로고침 복원을 통과했다. 첫 실행은 외부 리소스 HTTP 429, 두 번째는
  기존 인과·양보 복원 검사 비결정 실패였고 세 번째에서 재현되지 않았다. artifact `10311116003`의
  `00bx`/`00by` 화면을 직접 확인했다. PR #132를 squash merge한 production 커밋은
  `5cbb6773f9cb78c6ab4bd6791165841126038707`이다. main CI `34735492655` 첫 시도는 Chrome
  target 종료로 실패했으나 동일 커밋 재실행에서 111/111과 시각 검사를 통과했고, Pages
  `34735492297`도 성공했다. 라이브 HTTP smoke는 v111, 기본 3개+런타임 45개를 통과했으며
  새 네 ID와 `data/shorts-levels.js` 해시 일치를 확인했다. 제품 복귀 기준은 v110
  `a0f852517ae72b3371ca9ab6c6fc3936c09ddda3`다.

## 이전 작업 · S04 TOPIK II 상태·변화 숏츠 4문항 검수·확충

- 당시 기준 production v108 `d68ac0a8dac3fa3d4ab7355aec8b3b34cddeb082`, release v109. TOPIK II에
  `-게 되다·-아/어지다·-고 있다·-아/어 있다` 네 상태·변화 문법을 독립 안정 ID로 추가했다.
- 각 카드는 상황에 따른 새 행동, 성질 변화, 지금 진행 중인 동작, 끝난 동작의 결과 상태 중 하나만
  빠르게 판단한다. 고정 검수 선택지를 카드마다 섞되 기존 Shorts 저장 루트에서 순서를 복구한다.
  선택 오답의 기능을 먼저 설명한 뒤 상세 해설에서 결정적 예문→네 함정→상태 판별법을 제공한다.
- ko/ja/en/zh의 뜻·보기·선택 피드백·완전한 예문 번역·상세 해설을 함께 AI 검수했다. 새 정확 중복,
  구조 검토 후보 증가와 정답 충돌은 0이며 재고는 320행/194 정확 의미군, 레벨별 서로 다른 묶음은
  I 96·II 98이다. 이는 전체 승인 수가 아니며 이번 제한 검수 대상은 새 4개뿐이다.
- 원본 2,088문항, 연습 확장, 기존 숏츠 ID·정답·모의 위치와 모든 학습 저장 루트는 변경하지 않는다.
- 집중 데이터·재고 13/13, 콘텐츠 16/16, 로컬 Node 24 전체 검사 104/104를 통과했다.
  PR #128 CI `34671148823` 재실행도 104/104와 320·375·390·430px 라이트/다크 Linux Chrome
  에뮬레이션, 선택 오답 해설→상세 해설→다음 문제 우선→새로고침 복원을 통과했다. 첫 실행은
  무관한 외부 리소스 HTTP 429 한 건으로 끝났고 코드 변경 없는 재실행에서 재현되지 않았다.
- 실제 일본어 모어 화자 검수, 실제 초보자 5–15초 풀이·1일/7일 회상, 실제 iPhone/Android와
  네트워크 단절 복구는 미검증이다. 사람 검수 완료로 과장하지 않는다.

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
