# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v66 · Review visual system and mobile regression gate
- Current candidate: none
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

## 다음 우선순위

1. Vocabulary의 목록·상세·편집 화면을 같은 의미 기반 토큰과 시각 게이트로 옮긴다.
2. 그다음 실제 학습자가 자주 틀리는 유형 근거를 정리해 새 연습 문항 작업의 범위를 확정한다.
3. 새 연습 문항은 실제 학습자가 자주 틀리는 유형 근거가 확인된 뒤 추가한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

Vocabulary 화면 하나를 대상으로 목록·검색·필터·상세·편집 카드의 폭·간격·정렬·색과
44px 조작부를 같은 시각 계약으로 옮기고, 단어장 및 복습 기록을 유지한다.

## v66 검증 및 배포

- Review의 TOPIK I·II 급수 필터, 오답 목록, 재도전, 요청형 전체 번역, 채점과 선택지별 소거
  해설을 밝은 공통 표면으로 통일하고 44px 조작부와 10px 이상 보조문구를 적용했다.
- 목적 기반 `review-visual-system.js`가 최종 시각 소유자가 됐으며 v33 테마 호환 bridge는
  한 곳에 격리하고 개수를 테스트해 새 override 누적을 막았다.
- 정답 재도전은 해당 항목 하나만 해결 처리하고 목록 재진입 뒤 나머지 오답을 그대로 유지한다.
- runtime contract v66, JavaScript 62개 구문, 전체 58개 검사를 통과했다. 기존 문제·해설·정답,
  단어장·게임·복습·여행·설정 기록은 바꾸지 않았다.
- 실제 Chrome에서 목록·필터·미응답 재도전·일본어 전체 번역·채점·상세 해설을
  320·375·390·430px로 검사해 돌출·비대칭·44px 미만 조작부·10px 미만 문구·어두운 타일이
  없음을 확인하고 화면 35장을 직접 검토했다. 해결 처리와 목록 재진입을 유지했고 콘솔 오류는 0개였다.
- 결제 UI·API 키·개인정보 수집·외부 전송은 추가하지 않았다.
- 추적 Issue: https://github.com/okometsbu-beep/topik-quest/issues/68
- 변경 PR: 제출 전
- 검증: https://github.com/okometsbu-beep/topik-quest/actions/runs/33211525974
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v65 main `d52f7f5f6ddd3bb4d04ff41d473cdf0d9f73b26c`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
