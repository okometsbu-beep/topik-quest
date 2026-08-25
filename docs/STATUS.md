# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v48
- Current candidate: v49 · Incheon Airport T1 → Myeongdong travel adventure
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
- durable recovery snapshot for vocabulary, game, review, beginner, travel, and settings records
- editable vocabulary details with safe AI integration boundary
- one detailed global TTS setting with device fallback and optional local neural pack
- token-minimal repository handoff, focused verification lanes, GitHub CI and Pages deployment
- Seoul learning-RPG and payment-free avatar reward north star documented

## 다음 우선순위

1. 일본어 완전 초보자가 인천공항 첫 미션을 10분 안에 완료하는 흐름을 실제 모바일에서
   반복 점검하고 가장 큰 이탈 원인을 하나씩 제거한다.
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

## v49 후보 검증

- 전체 자동검사 44/44 통과, 2,088개 원본 문제와 runtime v49 무결성 통과 예정
- 인천공항·공항철도·서울시 공식 자료로 일반열차 4,750원/약 59분, 직통열차
  18,100원/약 43분, 중구 인터내셔널 택시 85,000원 및 T1 4C 승차 위치를 교차 검증
- 게임 재화임을 명시하고 실제 결제 UI는 추가하지 않음
- 13,000원 시작 + 정답당 2,000원 + 올클리어 5,000원 구조로 일반열차는 항상 가능,
  공항 3문제 전부 정답이면 직통열차 가능, 택시는 장기 목표로 유지
- 390×844 모바일 화면과 라이브 배포 검증 결과는 PR 전/병합 후에 각각 기록

## 초기 두 바퀴 사전 검증

1. Prompt contract dry run: 필수 기억 파일, 다섯 절, 한 작업 제한, PAUSE, 커밋 순서,
   배포 경계를 자동검사했고 통과했다.
2. Repository regression dry run: runtime v46·46개 JavaScript 구문·2,088개 문제은행·전체
   37개 테스트를 검사했고 모두 통과했다.

예약 작업을 켠 뒤 첫 두 **실제 독립 세션**도 결과를 검토하고, 범위가 넓거나 시각 검증이
누락되면 즉시 task를 일시정지한 뒤 prompt를 수정한다.

## 다음 한 작업

명동 도착 뒤 남은 여행 원으로 처음 살 수 있는 작은 수집품·경험 하나를 만들고, 시간대에
따라 선택지가 달라지도록 데이터 기반 이벤트 규칙을 첫 확장한다.

## 알려진 위험

- 웹 예약 작업은 로컬 폴더를 유지하지 않으므로 GitHub의 문서와 Issue가 유일한 기억이다.
- 공개 Issue에 비밀정보를 적으면 안 된다.
- UI 변경은 CI만으로 시각 품질을 보증할 수 없으므로 병합 전 모바일 확인이 필수다.
- 서울 전체 지도와 다량의 스킨을 먼저 만들면 학습·재방문 검증 없이 제작비만 커질 수 있다.
- 기존 임시 Plus·가격·결제 암시 UI가 새 화면에 재사용되지 않도록 계속 검사해야 한다.
- `malbitStoryV1`은 이름과 달리 기존 진행을 지키는 Travel Mode 호환 저장 키이므로
  이름을 바꾸거나 삭제하면 안 된다.
