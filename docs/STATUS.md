# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v61 · original TOPIK/Shorts expansion and instructor explanations
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

## 다음 우선순위

1. 새 연습 문항에서 실제 학습자가 자주 틀리는 선택지와 해설 구간을 먼저 확인한다.
2. 근거가 확인된 유형부터 같은 기준으로 오리지널 문항과 유형별 풀이법을 추가한다.
3. 실제 기기 수치가 없으면 가격 퀘스트 난이도·가격·보상은 유지한다.

## 이번 운영 변경

- WSL 상주 루프 대신 GitHub Issues + PR + CI + Pages + scheduled task 구조를 사용한다.
- 한 바퀴에 작업 하나와 PR 하나만 허용한다.
- GitHub Pages는 품질 게이트 통과 후 자동 배포하며 양대 앱스토어 자동 배포는 금지한다.
- 서울맵·NPC 퀘스트·아바타 꾸미기를 장기 재방문 구조로 삼되 학습이 본체라는 경계를 유지한다.
- 결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀·외부 결제 링크를 앱 어디에도
  만들지 않는다. 별도 수익화 논의와 사용자의 명시적 승인 뒤에만 재검토한다.

## 다음 한 작업

새 연습 문항의 실제 오답 근거가 들어오면, 가장 많이 막히는 유형 하나의 문항·해설 품질을
먼저 보강한다. 식별정보 없이 유형·선택지·해설 도움 여부만 검토한다.

## v61 검증 및 배포

- 고정 모의고사 12세트는 바꾸지 않고 TOPIK I 28개와 TOPIK II 28개의 오리지널 유형별
  연습 문제를 추가해 런타임 문제은행을 2,144개로 늘렸다.
- Shorts는 TOPIK I 172개, TOPIK II 116개로 늘리고 단어·숙어·문법·표현의 일본어 해설에
  의미·문맥·기억법을 넣었다.
- 객관식 해설은 정답 근거 → 오답 함정 → 유형별 풀이법으로 통일하고, TOPIK II 쓰기
  51–54번은 실용문 빈칸·설명문 빈칸·도표 요약·논술 전략을 각각 제공한다.
- runtime contract v61, JavaScript 52개 구문, 16,768개 다국어 셔플 조합과 전체 48개 검사를
  통과했다. 기존 단어장·게임·복습·여행·설정 기록도 보존했다.
- 실제 Chrome에서 320·375·390·430px, Shorts 강사형 해설, Travel 전체 회귀, 터치·재접속,
  가로 넘침과 콘솔 오류 0개를 확인했다.
- 결제 UI·API 키·개인정보 수집·외부 전송은 추가하지 않았다.
- 변경 PR: https://github.com/okometsbu-beep/topik-quest/pull/59
- 배포 주소: https://okometsbu-beep.github.io/topik-quest/
- 되돌리기 기준: v60 main `aa03c80158136a7fac2b0c42649282de8638b060`

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub 문서와 Issue가 유일한 기억이다.
- UI 변경은 CI와 실제 모바일 증거가 모두 있어야 병합할 수 있다.
- 로컬 지표는 서버로 수집되지 않으므로 사용자 기기에서 직접 확인한 값만 밸런스 근거로 쓸 수 있다.
- `malbitStoryV1`은 기존 진행을 지키는 Travel Mode 호환 저장 키이므로 이름을 바꾸거나 삭제하면 안 된다.
- 기존 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
