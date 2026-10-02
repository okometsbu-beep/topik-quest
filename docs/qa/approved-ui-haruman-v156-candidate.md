# 승인 UI / 하루만 적용 후보 · 2026-10-02

## 대상과 범위

- #226 F04/F39, 최신 사용자 승인: 여섯 화면 UI 시안과 하루만 실제 제작 소스 v3.2.
- 한 작업: 새 투명 캐릭터 전달 자산과 입문 hero 배치. 전체 감사 48항목이나 여섯 화면의 완전한 개편 완료가 아니다.
- 기존 main/라이브: a201d0e35602b9430dbeabc3b2bf6983dcb4197b / v155.
- 후보 로컬 체크포인트: 58b125e, agent/loop-20261002-haruman-ui / v156.

## 변경

- 승인 PNG는 보존하고 배포용 WebP 12종을 생성: 총 177,038 bytes. 알파 채널·출처 SHA-256·용도는 assets/art/haruman/ui-manifest-v2.json.
- 공부 포즈는 최종 v3.2 한 장만 홈에 사용. 화면/피드백별 별도 포즈를 선택하고 기존 HARUMAN 감정 API도 호환 유지.
- 불투명 크림 바탕과 강제 크림 외곽 필터 제거. 제목과 이미지는 겹치지 않는 영역에 둔다.
- 입문 hero는 copy/art 명시적 grid 영역. 기존 '가' 장식 대신 캐릭터를 배치하고 340px 이하에서는 세로 배치한다.
- 캐릭터는 aria-hidden 장식이며 채점/진도 권한이 없다. 기존 8종, 인트로 영상·타이틀·스킵 없음, 모든 모드/문항/저장 스키마 보존.

## 실행한 검사

- Linux Node 24.19.0: quick 170/170, full 186/186, v156 runtime 51파일/원본 은행 해시, git diff --check 통과.
- WebP 총 용량·알파·모든 새 자산 SW 캐시 등록·경로 whitelist·재장식 중복 방지 검사 통과.
- cloud Chrome의 공개 v155 일본어 입문 화면을 실제 클릭해 기존 hero 결함을 재확인. 데스크톱 화면이며 후보 검증이 아니다.
- 로컬 agent-browser: daemon Failed to bind socket: Operation not permitted (os error 1).
- 공식 Chrome for Testing 154.0.8037.92: socket() failed: Operation not permitted (1); 후보 화면을 렌더링하지 못했다.
- 로컬 serve는 시작 메시지를 냈으나 HTTP smoke는 127.0.0.1:4173 ECONNREFUSED. HTTP smoke 실패로 기록한다.

## 미검증 / 출하 게이트

- 수정 전후 320/375/390/430px × 라이트/다크 화면, 모바일 터치/뒤로가기/재진입, 후보 콘솔 및 offline/reload 자산은 미검증.
- 실제 iPhone/Android, 일본어 교육 검수, 동의한 사용자 D1/D7 회상은 미검증.
- 권한 차단을 우회하지 않는다. PR/병합/배포 없음. 공개 주소 https://okometsbu-beep.github.io/topik-quest/ 는 v155 그대로.
- 필요한 다음 환경: 로컬 HTTP 서버와 Chrome 소켓이 허용되는 검사 환경. 후보의 네 폭/두 테마 실제 화면 및 동작을 확인한 뒤에만 PR/CI/병합/라이브 검증.
- 후보 되돌리기: 위 체크포인트 revert 또는 a201d0e. 라이브 변경 없음이라 공개 revert는 필요 없다.

## 남은 승인 방향

- 시안: 오늘(이어 할 수업·오늘 복습·숏츠/여행), 학습(유형별), 단어장(플래시카드/시험/보관함), 통합 복습, 수업(이해→사용→회상), 내 기록(진도·백업·설정).
- 시안 예시의 2/3단계·복습 3개·내일 등은 실제 상태 없이 제품에 넣지 않는다.
- F03 잘못된 TOPIK 과정 이동, F02/F01 작문 기준/자료 표시, 통합 복습과 TTS는 별도 작업으로 남는다. 새 문항 추가보다 감사의 제품 결함과 승인 UI를 우선한다.
