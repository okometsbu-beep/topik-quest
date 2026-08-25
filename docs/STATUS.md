# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v48
- Current candidate: v49 · meaningful Seoul Station first action
- Core content: 2,088 original items
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: finish the first Game or Travel step within ten minutes
- Autonomous runtime: GitHub-connected ChatGPT Scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- independent Seoul Travel Mode and Wordlight Expedition
- Seoul Station → City Hall → Gwanghwamun route with six missions, three stamps, and three
  learning-earned avatar looks
- durable recovery snapshot for vocabulary, game, review, beginner, travel, and settings records
- editable vocabulary details with safe AI integration boundary
- one detailed global TTS setting with device fallback and optional local neural pack
- token-minimal repository handoff, focused verification lanes, GitHub CI and Pages deployment
- Seoul learning-RPG and payment-free avatar reward north star documented

## 다음 우선순위

1. 서울역을 장면 넘기기가 아닌 작은 탐험 허브로 만들어, 지도 위 장소를 직접 선택하고
   이동한 뒤 NPC 또는 학습 행동을 시작하게 한다.
2. 첫 여행 코스의 정답·해설·일본어 번역을 문맥 단위로 표본 검수한다.
3. 첫 코스 완료율·무료 의상 장착률·다음 날 재방문을 개인정보 없이 로컬 계측한다.

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

## v48 후보 검증

- 전체 자동검사 44/44 통과, 2,088개 원본 문제와 runtime v48 무결성 통과
- 390×844 모바일 브라우저에서 여행 홈 → 서울역 도착 → 6개 미션 → 경로 완료를 직접 조작
- 경로 완료 뒤 무료 아바타 3종 해금과 새로고침 뒤 여행 진행 복원을 확인
- 기존 단어장 표본과 게임 진행을 넣은 뒤 새로고침해 그대로 남는 것을 확인
- 결제 UI, 페이지 오류, 런타임 오류 없음

## v49 후보 검증

- 결과가 없던 여행자 성향 선택을 서울역 듣기·읽기 미션의 실제 순서 선택으로 교체
- 일본어 화면에서 선택 결과, 326×69px 터치 영역, 뒤로가기, 재진입과 선택 유지 확인
- 두 경로 모두 6개 미션 완주, 기존 `tracker` 저장값 호환, 단어장·여행 기록 유지 확인
- 집중 테스트 39개와 Travel 테스트 6개 통과, 브라우저 콘솔 오류 없음

## 초기 두 바퀴 사전 검증

1. Prompt contract dry run: 필수 기억 파일, 다섯 절, 한 작업 제한, PAUSE, 커밋 순서,
   배포 경계를 자동검사했고 통과했다.
2. Repository regression dry run: runtime v46·46개 JavaScript 구문·2,088개 문제은행·전체
   37개 테스트를 검사했고 모두 통과했다.

예약 작업을 켠 뒤 첫 두 **실제 독립 세션**도 결과를 검토하고, 범위가 넓거나 시각 검증이
누락되면 즉시 task를 일시정지한 뒤 prompt를 수정한다.

## 다음 한 작업

서울역 지도에 2~3개 장소 노드를 두고, 사용자가 직접 한 곳을 눌러 이동한 뒤 첫 학습 행동을
시작하는 작은 탐험 허브를 만든다.

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub의 문서와 Issue가 유일한 기억이다.
- 공개 Issue에 비밀정보를 적으면 안 된다.
- UI 변경은 CI만으로 시각 품질을 보증할 수 없으므로 병합 전 모바일 확인이 필수다.
- 서울 전체 지도와 다량의 스킨을 먼저 만들면 학습·재방문 검증 없이 제작비만 커질 수 있다.
- 기존 임시 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
- `malbitStoryV1`은 이름과 달리 기존 진행을 지키는 Travel Mode 호환 저장 키이므로
  이름을 바꾸거나 삭제하면 안 된다.
- v49의 첫 선택은 실제 미션 순서를 바꾸지만 여행 전체는 아직 선형 장면 구조다. 다음 작업은
  콘텐츠를 늘리기 전에 지도 이동과 장소 선택을 실제 플레이로 만들어야 한다.
