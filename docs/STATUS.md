## 2026-09-30 v153 TOPIK II 정책·검토 명사 숏츠 배포 완료 · #220

- #110 S04의 부족 유형 한 묶음으로 `대책·효과·한계·과제` 4카드를 안정 ID로 추가했다. 문제에 대한 해결 행동·실행 뒤 결과·충분히 달성하지 못하는 경계·앞으로 해결할 일이라는 시간과 역할 한 판단만 구분한다.
- ko/ja/en/zh 뜻·예문·보기·선택별 오답 이유와 `정답 근거 → 오답 함정 → 재사용 풀이`를 로컬에 묶었다. 기존 ID, 원본 2,088문항, `topikQuestShortsV1`과 학습 기록은 변경하지 않았다.
- 재고는 424행/298 정확 질문-보기군(I 148, II 150). 기존 중복 126행·30군, 구조 후보 15개, 정답 충돌 0, 종합 승인 0/424는 변하지 않았다.
- 로컬 content 49/49, 전체 183/183 통과. [PR #220 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663079992)의 Ubuntu/Node22/Chrome에서 320/375/390/430px×라이트/다크, 일본어 오답·펼친 해설·저장 복원을 포함한 477장을 생성했다. artifact `11075044000`의 새 오답 라이트와 펼친 해설 다크 2장을 직접 확인했으며 실기기로 세지 않는다.
- 배포: [PR #220](https://github.com/okometsbu-beep/topik-quest/pull/220) squash `d21a6d6d27351c6c9b98d8a276d2fa82aaedb310`. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663836834)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663836084) 성공. 라이브 https://okometsbu-beep.github.io/topik-quest/ v153은 기본4개+런타임51개 HTTP 정상이고 Shorts 자산 SHA-256가 main과 일치하며 새 ID 4개가 존재한다.
- 되돌리기는 #220 revert 또는 v152 main `efaf145a0c8be0430fcbeb4ebc10e295463fc8b7`. 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 동의한 학습자의 풀이 시간·D1/D7 회상은 미검증이다. 다음 검사 가능한 한 작업은 새 P0·정답 오류가 없으면 더 적어진 TOPIK I 부족 유형 4문항의 제한 검수다.

## 2026-09-30 v152 TOPIK I 물건 동작 숏츠 배포 완료 · #218

- #110 S04의 부족 유형 한 묶음으로 `찾다·잃어버리다·가져오다·가져가다` 4카드를 안정 ID로 추가했다. 찾아 발견·소지품 분실·이쪽으로 가져오기·이곳에서 가져가기라는 물건 상태/방향 한 판단만 구분한다.
- ko/ja/en/zh 뜻·예문·보기·선택별 오답 이유와 `정답 근거 → 오답 함정 → 재사용 풀이`를 로컬에 묶었다. 기존 ID, 원본 2,088문항, `topikQuestShortsV1`과 학습 기록은 변경하지 않았다.
- 재고는 420행/294 정확 질문-보기군(I 148, II 146). 기존 중복 126행·30군, 구조 후보 15개, 정답 충돌 0, 종합 승인 0/420은 변하지 않았다.
- 로컬 content 48/48, 전체 182/182 통과. [PR #218 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36631648511)의 Ubuntu/Node22/Chrome에서 320/375/390/430px×라이트/다크, 오답·펼친 해설·저장 복원을 포함한 475장을 생성했다. artifact `11063266098`의 새 일본어 오답 라이트와 펼친 해설 다크 2장을 직접 확인했으며 실기기로 세지 않는다.
- 배포: [PR #218](https://github.com/okometsbu-beep/topik-quest/pull/218) squash `f2c80190290cb450a0f79abe59f76f2c1e2eee16`. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36632864545)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36632863379) 성공. 라이브 https://okometsbu-beep.github.io/topik-quest/ v152는 기본4개+런타임51개 HTTP 정상이며 Shorts 자산 SHA-256가 main과 일치한다.
- 되돌리기는 #218 revert 또는 v151 main `b6fa7c4bc670c6fabe3f608c6477e40d1b4c0672`. 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 동의한 학습자의 풀이 시간·D1/D7 회상은 미검증이다. 다음 검사 가능한 한 작업은 새 P0·정답 오류가 없으면 더 적어진 TOPIK II 부족 유형 4문항의 제한 검수다.

## 2026-09-30 v151 TOPIK II 논증 명사 숏츠 배포 완료 · #216

- #110 S04의 부족 유형 한 묶음으로 `주장·근거·반박·결론` 4카드를 안정 ID로 추가했다. 입장 제시·입장 뒷받침·다른 주장 반증·검토 뒤 최종 판단이라는 한 역할만 구분한다.
- ko/ja/en/zh 뜻·예문·보기·선택별 오답 이유와 `정답 근거 → 오답 함정 → 재사용 풀이`를 로컬에 묶었다. 기존 문항 ID, 원본 2,088문항, `topikQuestShortsV1`과 학습 기록은 변경하지 않았다.
- 재고는 416행/290 정확 질문-보기군(I 144, II 146). 기존 중복 126행·30군, 구조 후보 15개, 정답 충돌 0, 종합 승인 0/416은 변하지 않았다.
- 로컬 content 47/47, 전체 181/181 통과. [PR #216 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36590876365)의 Ubuntu/Node22/Chrome에서 320/375/390/430px×라이트/다크, 오답·펼친 해설·저장 복원을 포함한 473장을 생성했다. artifact `11043988217`의 새 일본어 오답 라이트와 펼친 해설 다크 2장을 직접 확인했으며 실기기로 세지 않는다.
- 배포: [PR #216](https://github.com/okometsbu-beep/topik-quest/pull/216) squash `c91510535188b273f8177a449415c4b607773f6d`. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36592147626)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36592145973) 성공. 라이브 https://okometsbu-beep.github.io/topik-quest/ v151은 기본4개+런타임51개 HTTP 정상이며 `data/shorts-levels.js` SHA-256가 main과 일치한다.
- 되돌리기는 #216 revert 또는 v150 main `69523389d740a5b3f4f0ad0c8c97d355f906d601`. 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 동의한 학습자의 풀이 시간·D1/D7 회상은 미검증이다. 다음 검사 가능한 한 작업은 새 P0·정답 오류가 없으면 더 적어진 TOPIK I 부족 유형 4문항의 제한 검수다.

## 2026-09-29 v150 인트로 화이트 아웃·타이틀 배포 완료

- 사용자 지시 한 작업: 영상의 실제 `ended` → 500ms 화이트 아웃(600ms 뒤 다음 단계) → 첨부한 하루말/harumal 투명 PNG의 450ms 등장·총 1600ms 표시 → 300ms 페이드 → 홈. 스킵 없이 완주하며 영상 아래 중복 텍스트는 제거했다.
- 제목 원본 PNG 1448×1086/419846 bytes를 그대로 사용했다. 영상·학습 데이터·테마는 보존한다. 앱 숨김 시 영상과 타이틀 단계의 남은 시간을 정지/복귀하며 이미지 실패에는 텍스트 대체를 표시한다.
- Linux Node24: 전체 180/180·집중 17/17·quick 164/164 통과. [브랜치 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36566102824)의 Ubuntu/Node22/Chrome에서 320/375/390/430px×라이트/다크 전후 48장 직접 확인(artifact `11032810613`), 모바일 회귀 330장·앱 오류0·네 언어 홈/단어장 통과. 지연 시작+0.25배속 실제 재생은 약 12.58초 자연 종료→13.18초 타이틀→15.08초 해제다.
- 배포: [PR #214](https://github.com/okometsbu-beep/topik-quest/pull/214) squash `9711a29fc8dbba17469ec5ce23520f39f37902d5`. [PR CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36567235015)·[Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36568177772) 성공. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36568178589).
- 라이브 https://okometsbu-beep.github.io/topik-quest/ v150: 기본4개+런타임51개 HTTP 정상, 새 PNG 포함 핵심6자산 SHA-256 일치. Chrome DOM에서 영상 2.792/2.792 `ended=true`→화이트 아웃→타이틀 단계(원본 이미지 naturalWidth 1448)→패널 제거/홈과 스킵 버튼0을 확인했다. 전환 시각 합격 근거는 위 CI 캡처이며 실제 기기로 세지 않는다.
- 되돌리기는 #214 revert 또는 v149 main `2455b14a8a0c7f6e10664787d43e2803e2ada55e`. 미검증: 실제 iPhone/Android 자동재생·숨김 복귀·시각 전환. 다음 한 작업은 실기기에서 같은 완주/화이트 아웃/타이틀/홈 흐름 확인이다.

## 2026-09-29 v149 인트로 완주·스킵 제거 배포 완료

- 사용자 지시로 정상 재생은 실제 `ended` 뒤에만 220ms 페이드한다. 800ms 로딩/3380ms 전체 제한과 버튼·터치·Escape·60초 재진입 스킵을 제거했다. 백그라운드는 일시정지 후 같은 위치에서 이어 재생한다.
- 오류/자동재생 거부 또는 **15초간 재생 위치가 진행하지 않을 때**만 실패 복구한다. 모션 감소·데이터 절약 예외와 540px/2.833초 영상 자산, 모든 학습 기록은 유지한다.
- Linux Node24 전체 176/176·집중 13/13 통과. GitHub Ubuntu/Node22/Chrome에서 실제 1.2초 지연 시작+0.25배속 재생이 약 12.6초 뒤 자연 종료하고 220ms 뒤 해제됐다. 터치/Escape 무시·빠른 재진입과 320/375/390/430px×두 테마를 검사하고 후보 재생/홈 16장을 직접 확인했다. [브랜치 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36558468041) 전체 성공: 모바일 회귀 314장·콘솔 오류 0건, 네 언어 홈/단어장과 타일 검사.
- 배포 완료: [PR #212](https://github.com/okometsbu-beep/topik-quest/pull/212) squash `d1462c0ec42b2130fe4943044c148c7351750f8c`. [PR CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36559532619)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36560518105) 성공. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36560519170).
- 라이브 https://okometsbu-beep.github.io/topik-quest/ v149: 기본4개+런타임51개 HTTP 정상, 핵심5자산 SHA-256 일치. 재방문 Chrome에서 영상 재생(currentTime 0.091/2.792, 스킵 버튼0)→홈 전환·부트 해제를 확인했다. 앱 콘솔 오류는 없고 브라우저 확장 metadata 오류는 별도로 구분했다.
- 최종 집중 artifact `11029069773`의 수정 전·후 네 폭/두 테마 재생·홈 32장 직접 비교 완료. 실제 iPhone/Android로 세지 않는다. 되돌리기는 #212 revert 또는 v148 `04ce35079aac54e3c4f0ee77154eaa7191d6a2cc`.
- 미검증: 실제 iPhone/Android의 자동재생·백그라운드 복귀. 다음 한 작업은 실제 기기에서 완주·복귀 확인이며, 원본 애니메이션 길이 재편집은 이번 변경에 포함하지 않는다.

## 2026-09-29 하루말 무료·무제한 TTS 후보 결정 · 구현 전

- 현재 `MALBIT_TTS`·`neural-tts.js`를 전수 확인했다. 기기 `speechSynthesis` fallback과 데스크톱 전용 약 230MB Supertonic 3 FP16 브라우저 팩은 유지되지만, 생성 오디오 캐시·한국어 숫자/날짜 정규화·native runtime은 아직 없다.
- 첫 프로토타입 후보를 **Supertonic 3 Korean INT8 + sherpa-onnx native**로 고정했다. Android APK와 Swift/Kotlin API가 있는 공식 경로라 iOS/Android cold/warm/RAM/오프라인을 측정할 수 있다. 상업·스토어 채택은 OpenRAIL-M 제한, archived upstream, 실기기·법률 검수 전 보류한다. Ppaso-TTS v8은 Apache-2.0 경량 비교군, Qwen3/Kokoro/Piper는 1차 모바일 후보에서 제외했다.
- 이번 회차는 docs-only 결정 작업이다. 모델 파일·의존성·공개 자산·버전·저장 스키마는 변경하지 않았다. 상세 비교/공식 근거/다음 harness 게이트는 `docs/qa/tts-feasibility-20260929.md`에 기록했다.
- 미검증: 실제 iPhone/Android, 한국어 교정자 청취, INT8 모델 크기·peak RAM·RTF·배터리, 완전 오프라인 복구, 법률 자문. 다음 한 작업은 세 문장·숫자/날짜/단위·외래어·긴 문장과 캐시/취소를 측정하는 최소 native harness다.

## 2026-09-28 v147 TOPIK I 방향 이동 숏츠 배포 완료 · #208

- #110 S04의 부족 유형 한 묶음으로 `올라가다·내려가다·들어가다·나오다` 4카드를 안정 ID로 추가했다. 낮음→높음, 높음→낮음, 밖→안, 안→밖이라는 한 판단만 요구한다.
- ko/ja/en/zh 예문·보기·선택별 오답 이유·정답 근거·재사용 풀이를 함께 제공한다. 기존 문항 ID, 원본 2,088문항, `topikQuestShortsV1`과 학습 기록은 변경하지 않는다.
- 후보 재고는 412행/286 정확 질문-보기군(I 144, II 142). 중복 126행·30군, 구조 후보 15개, 정답 충돌 0, 종합 승인 0/412는 변하지 않았다.
- 집중 vocabulary+inventory 36/36, 전체 163/163, v147 런타임 51파일과 은행 해시가 로컬 Node24에서 통과했다. [PR #208 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36401590122)의 Ubuntu/Node22/headless Chrome에서도 전체 검사와 320/375/390/430px·라이트/다크 회귀가 통과했다. artifact `10961036393` 중 새 일본어 오답 라이트·전체 해설 다크 2장을 직접 확인했으며 실기기로 세지 않는다.
- 배포: [PR #208](https://github.com/okometsbu-beep/topik-quest/pull/208) squash `390eb8d36a8cd00b71d40bfb4c6e24fb02ff53a9`, [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36403169176)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36403167908) 성공. 라이브 v147은 기본 4개+런타임 51개 HTTP 정상이며 핵심 공개 4자산 SHA-256이 main과 일치하고 새 ID 4개가 모두 존재한다.
- 되돌리기 기준은 직전 v146 `3cf9154b38a54f1cd9e0200912b98055ca82eb52`. 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 동의한 학습자의 풀이 시간·D1/D7 회상은 미검증이다. 세부 경계: `docs/qa/shorts-review-s04-topik1-directional-actions.md`.
- 다음 한 작업: 새 P0·명백한 정답 오류가 없으면 정확 질문-보기군이 더 적어진 TOPIK II 부족 유형 4문항을 제한 검수한다.

## 2026-09-28 v146 TOPIK II 분석 명사 숏츠 배포 완료 · #206

- #110 S04의 부족 유형 한 묶음으로 `경향·요인·현상·전망` 4카드를 안정 ID로 추가했다. 반복 흐름·결과 원인·관찰된 일·미래 예상이라는 한 판단만 요구한다.
- ko/ja/en/zh 예문·보기·선택별 오답 이유·정답 근거·재사용 풀이를 함께 제공한다. 기존 문항 ID, 원본 2,088문항, `topikQuestShortsV1`과 학습 기록은 변경하지 않는다.
- 후보 재고는 408행/282 정확 질문-보기군(I 140, II 142). 중복 126행·30군, 구조 후보 15개, 정답 충돌 0, 종합 승인 0/408은 변하지 않았다.
- 로컬 전체 162/162와 집중 vocabulary+inventory 35/35 통과. [PR #206 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36372605082)의 Ubuntu/Node22/headless Chrome에서도 전체 검사와 320/375/390/430px·라이트/다크 모바일 회귀가 통과했다. artifact `10949651981` 중 새 일본어 오답 라이트·전체 해설 다크 2장을 직접 확인했으며 실제 기기로 세지 않는다. Pages·라이브는 병합 전이라 미검증이다.
- 배포: [PR #206](https://github.com/okometsbu-beep/topik-quest/pull/206) squash `c2a7fdc0babbe3f4459d2890266643aa6bbb151e`, [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36373602998)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36373602518) 성공. 라이브 v146은 기본 4개+런타임 51개 HTTP 정상이며 변경 11파일 SHA-256이 main과 일치한다.
- 되돌리기: #206 revert 또는 직전 v145 `e6ecafa6a53edabcbe5304837660f6c76d5137a6`. 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 동의한 학습자의 풀이 시간·D1/D7 회상은 미검증이다. 세부 경계: `docs/qa/shorts-review-s04-topik2-analysis-nouns.md`.
- 다음 한 작업: 새 P0·명백한 정답 오류가 없으면 검수 수가 더 적어진 TOPIK I 부족 유형 4문항을 제한 검수한다.

## 2026-09-28 v145 홈·단어장 배포 완료 · #204

- 국기 언어 선택, 하단 단어장 고정, 홈 여행·숏츠 바로가기. 캐릭터를 제목 위 별도 줄로 옮기고 크림 배경을 제거했다. 한국어 단어 단위 줄바꿈과 좁은 화면 제목 크기를 보정했다.
- 저장 단어 최대 10개 뜻→한국어 입력 시험, 마지막 채점·오답 재시험·중단/새로고침 복구. `topikQuestV8.vocabExam`에 추가 저장하며 기존 단어·SRS·백업·문항을 보존한다.
- 네이티브 선택·컨텍스트·클립보드 억제와 입력 필드 정지한 길게 누르기 처리를 추가했다. 일반 입력·앱 단어 저장 제스처는 유지하며 실제 iOS 편집 메뉴·IME는 미검증이다.
- 기존 프레임 영상 다운로드는 HTTP 502로 실패했다. 대문은 같은 투명 캐릭터의 **임시 CSS 탄성 동작**이며 원본 영상 이식 완료가 아니다. reduced-motion 정지·로딩 완료 즉시 해제.
- 검사: 로컬 Node24/Chromium153에서 320/375/390/430px × 두 테마 × ko/ja/en/zh 집중 경로 통과(105장). 홈32장 접촉시트와 주요 단어장/시험/복습 화면 직접 확인. GitHub Ubuntu/Node22/headless Chrome의 [PR CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36362486464) 전체161/161, 기존 모바일293장·오류0, 새 집중 경로·타일 검사가 통과했다. 전체 artifact416장을 모두 직접 검토했다고 주장하지 않는다.
- 초기 CI의 명시적 reload 문맥 전환 오류와 이전 단어장 탭 기대값을 수정했다. 로컬 전체 모바일 실행은 외부 번역 서비스 ERR_EMPTY_RESPONSE로 245장에서 실패했으며 통과로 세지 않는다. 최종 전체 모바일 합격 증거는 위 CI다.
- 배포: [PR #204](https://github.com/okometsbu-beep/topik-quest/pull/204) squash `4a6710761e8ed9bbad440e2ec86cc7e0d32881a6`, [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36362901464) 성공. main 회귀검사: https://github.com/okometsbu-beep/topik-quest/actions/runs/36362901730 .
- 라이브 https://okometsbu-beep.github.io/topik-quest/ v145: 기본4개+런타임51개 HTTP 정상, 변경 핵심10자산 SHA-256 일치. 재방문 Chrome에서 로딩 해제·국기 메뉴·빈 단어장 시험 안내·숏츠·홈 여행 진입을 실제 클릭했다. 실학습자 데이터는 추가하지 않았다.
- 되돌리기: #204 revert 또는 직전 v144 `d4647c8da2af6caf35a39e4d91bd0b605c41f524`. 미검증: 원본 애니메이션, iPhone/Android 실기기, iOS 편집 메뉴/IME, 모어 화자·실학습자 성과. 다음: 원본 영상 복구 후 교체 및 실기기 길게 누르기 확인. 세부 근거: `docs/qa/home-vocabulary-v145.md`, Issue #110.

## 2026-09-28 v144 문맥 생략 수업 번역·조건 정정

- 두 번째 입문 문법 `sentence-omission`에서 일본어 `meaning`이 완전한 번역 대신 수업 메모로
  쓰이고, 생략 가능 조건과 불가능한 경우가 모호하던 P1 교육 품질 결함을 실패 테스트로 고정했다.
- 두 대화의 일본어 전문 번역과 별도 `講師メモ`를 분리했다. 공식은 생략 자체를 표시하도록 고쳤고,
  목표·코치는 문맥상 누구/무엇인지 분명할 때만 주어·목적어를 생략하며 불명확하면 생략하지 않는다고
  명시했다. 변형 정답과 7단위 손쓰기 문구는 적정 범위로 판단해 바꾸지 않았다.
- 로컬 content 44/44, quick 136/136, 전체 157/157, JS 93파일 문법, v144 런타임 49파일과
  원본 은행 해시가 통과했다. PR #203 CI `36350624194`의 Ubuntu/Node22/headless Chrome에서
  320/375/390/430px×라이트/다크의 번역·메모·7단위 상태와 overflow를 검사했다. artifact
  `10942027914` 311장 중 새 390px 라이트/다크 2장을 직접 확인했다.
- 기존 문법 ID·변형 정답·저장 스키마·학습/여행/복습 기록·원본 문제은행은 불변이다. 실제
  iPhone/Android, 일본어 모어 화자/교육 전문가, 실제 학습자의 10분/D1/D7 회상은 미검증이다.
- 배포 후보는 PR #203이다. 병합 전 공개 앱은 v143이며 되돌리기 기준은
  `a5e36aeba8578526aec34cba5af5084f670e94d6`이다.
- 다음 한 작업: 새 P0·정답 오류가 없으면 clean ja-JP에서 두 번째 문법의 오답→정답 피드백과
  손쓰기 중도 종료·재진입을 한 경로만 검증한다.

## 2026-09-28 v143 입문 문법 첫 완주 → 다음 학습 계약

- clean ja-JP 상태에서 첫 문법 `sentence-order`의 변형·퀴즈·손쓰기 8/8을 끝낸 뒤
  완료 표시와 `次へ`가 두 번째 문법 `sentence-omission`으로 이동하는 실제 Chrome 경로를 고정했다.
  오늘 화면의 다음 학습 카드·목록 완료 표시·hard reload 뒤 재진입도 같은 다음 항목을 가리킨다.
- 제품 결함은 재현되지 않아 런타임·문항·저장 스키마·공개 버전은 v143 그대로다. PR #201 squash
  `2132a7e31f80a6fb6ea18bea563775a84c4cf6e8`는 테스트만 보강했다.
- 로컬과 PR CI에서 전체 156/156, v143 런타임 49개, 원본 은행 해시를 통과했다. GitHub Ubuntu의
  headless Chrome에서 320/375/390/430px×라이트/다크 완료 상태를 검사했고 390px 두 테마 화면을
  직접 확인했다. 실제 iPhone/Android·일본어 모어 화자·실제 학습자의 10분/D1/D7 회상은 미검증이다.
- 배포 자산 변경은 없다. Pages와 공개 HTTP smoke(v143, 기본 4개+런타임 49개)는 성공했다.
  좁은 되돌리기는 #201 revert이며 제품 복귀 기준은 v142
  `9496f84c7f0a405cf1311e3f8e8a8aa78cdd5a7c`다.
- 다음 한 작업: 새 P0·정답 오류가 없으면 두 번째 입문 문법 `sentence-omission`의 일본어 목표·예문·
  코칭과 변형/손쓰기 부담을 한 항목만 교육 품질 관점에서 검수한다.

## 2026-09-27 하루만 이모션 후보 v142 · #197

- 추가 검증: 전체 자동검사 155/155 및 전용 모바일 화면 30장 확인. 첫 CI의 오프라인 오류 4건은
  8종 캐시가 존재하지만 hard reload로 worker 제어가 해제된 상태에서 발생했다. 일반 재진입 뒤
  worker 제어·8종 캐시·오프라인 축하 이미지 로드를 명시적으로 검사한다. 최종 CI/공개 결과는 #197.

- 최신 사용자 교정을 반영해 B안 대신 기존 둥근 몸·세 갈래 머리 디자인의 8종을 분리했다.
- `haruman-mascot.js`가 오늘/학습/복습/내 기록/여행과 채점 피드백에 장식만 붙인다.
  팔다리 대비는 국소 크림 표면으로 해결. 두 테마·기존 문항/저장/모드 불변.
- 분리 중 이웃 손 조각을 발견해 연결 성분으로 다시 분리했다. PNG+WebP/원본/분리 스크립트 보존.
- Node quick135/135, 로더 검사 보정 뒤 집중5/5. 최종 CI·모바일 화면·배포는 #197에서 추적한다.
  현재 단계는 후보이며 실기기와 학습자 반응은 미검증. `docs/qa/haruman-emotions-v142.md` 참조.
- 복귀점 v141 `26efe0da7eee5d05812d3802ef8ada82151bdc3d`; 공개 https://okometsbu-beep.github.io/topik-quest/ .
- 다음: 후보 모바일 검수 후 공개 반영·캐시/라이브 자산 확인. 실제 기기 미검증은 유지한다.

## 2026-09-27 v141 여행 어드벤처 전환 · #195

- 사용자 직접 지시에 따라 기본 여행을 장면·대화·단서·응답으로 전환했다. 기존 걷기 RPG는
  저장 기록이 있는 경우의 접힌 이전 코스 보관함에 남기고, 신규 진입에는 지도·체력·재화를 노출하지 않는다.
- 공항→열차→서울역→숙소 4장면×2난도. TOPIK I은 실용 정보의 복수 조건, II는 간접 요청·예외·
  예약 조건을 판단한다. 정답 근거→오답별 함정→재사용 풀이, 요청형 번역, 제출 전 선택지 번역 숨김.
- 기존 `malbitStoryV1`에 `adventureV1`만 추가. 원래 여행/학습 기록과 원본 문제은행은 보존한다.
  난도별 저장·재시도·회상 초안/선택 문항 복원 및 구버전 백업의 새 여행 기록 보존을 검사한다.
- 검사 환경: Node 22와 GitHub Ubuntu의 headless Chrome 모바일 에뮬레이션. 4개 폭×두 테마,
  두 코스 완주·오답·Enter·재진입·회상 초안·이미 로드된 네 언어의 오프라인 표시가 대상이다.
  후보 CI `36278924981`에서 전체 153/153, 모바일 회귀와 타일 자산 검사 통과, 콘솔 오류 0.
  산출물 273장 중 새 어드벤처 화면 16장을 직접 검토했다. PR #196에서 최종 병합 검사를 진행한다.
  실제 기기, 일본어 교육 전문가, 실제 학습자의 첫 성공/10분/D1/D7 회상은 미검증이다.
- 세부 검수 범위: `docs/qa/travel-adventure-v141.md`. 최종 CI/배포 SHA/라이브 검사 증거는
  [#195](https://github.com/okometsbu-beep/topik-quest/issues/195)에 연결한다. 공개 주소는
  https://okometsbu-beep.github.io/topik-quest/ ; 복귀점 v140 `adef36a5565a4260f8545ea6c7c2e6ee0fd7c255`.
- 다음 작업: 새 여행의 대화 길이·단서 발견·복습 복귀를 검증한다. #76 RPG 맵 확장보다 이 전환과
  #110 학습 품질이 우선이며, 실제 외부 테스트는 기존 승인 경계와 프로토콜을 따른다.

## 2026-09-27 v140 입문 문법 손쓰기 재진입 계약 고정

- 공개 v140의 clean ja-JP 경로에서 첫 문법 변형 정답 `저는 한국어를 공부해요.`를 제출하고
  첫 손쓰기 `한`을 완료한 뒤 오늘로 이탈·hard reload·재진입했다. 완료 단위 `1/8`, 현재 글자 `국`,
  위치 `2/8`이 그대로 복원되어 제품 결함은 재현되지 않았다.
- PR #192 squash `33e5764577b1024b977a84facb651c51a6bfc7ef`가 저장 계약과 실제 브라우저 재진입을
  회귀검사로 고정했다. 로컬 전체 147/147, PR CI `36271774104`가 통과했고 320/375/390/430px×
  라이트/다크에서 상태·레이아웃을 검사했다.
- #192 병합 뒤 main CI `36272108773`은 Chrome target 종료로 두 번 실패해 통과로 세지 않는다.
  같은 검증 범위에서 저장 화면을 대표 390px 두 테마만 남기도록 안정화한 PR #193 squash
  `6e9c868280aa14dd0e51acbc66be23d755b13a41`의 PR CI `36272553741`, 최종 main CI
  `36272893017`, Pages `36272892547`은 성공했다. 반응형 상태 assertion 8조합은 모두 유지한다.
- 공개 앱은 제품 동작·버전·문항·저장 스키마를 바꾸지 않은 v140이다. HTTP 200이며
  index/beginner-grammar/checker SHA-256이 병합본과 일치한다. 좁은 회귀검사 복귀점은
  `a9835474d026a6a10de6b62439b021a9597cf71f`; 제품 복귀 기준은 v139
  `3b9626a642428f845c95f574d55fd4ec29361bd6` 그대로다.
- 미검증: 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 실제 첫 성공·10분/D1/D7 회상.
  다음은 첫 문법 완주 뒤 완료 표시와 다음 학습 CTA가 같은 항목을 반복하지 않고 다음 문법으로
  이어지는지 검증한다.

## 2026-09-26 하루말 v140 배포

- production v139에서 clean ja-JP 입문 문법 첫 변형 답안 `저는 한국어`를 입력한 뒤 오늘로
  이탈하고 hard reload·코스 재진입하면 빈 입력으로 돌아가던 P1 연속성 결함을 재현했다.
- 기존 `malbitBeginnerV1.grammarV1` 아래에 문법별 초안을 additive 저장한다. 중도 이탈·새로고침은
  복원하고 오답은 유지하며 정답 제출 때만 제거한다. 기존 root 필드·문항 ID·은행·학습 기록·모드는 보존한다.
- PR #190 squash `cfb0209eac2f983abfc70c02eb3e5f02679da864`; Linux Node24 전체 146/146,
  v140 런타임 46개와 2,088개 문제은행 해시가 통과했다.
- 최종 PR CI `36251060265` 성공. artifact `10909650658` 255장 중 초안 재진입
  320/375/390/430px×라이트/다크 8장을 직접 확인했다. `저는 한국어`·입력·확인 CTA·하단 내비게이션,
  대비와 overflow가 정상이다. 최초 CI `36250924092`는 reload 뒤 앱 함수 대기 누락으로 실패했으며 통과로 세지 않는다.
- main CI `36251490583`와 Pages `36251490375` 성공. 공개 HTTP smoke는 v140·기본 4개·런타임 46개를
  확인했고 index/beginner-grammar/site-patch/sw SHA-256이 병합본과 일치한다. 공개 Chrome에서 동일 초안을
  새로 입력하고 이탈·hard reload·학습→입문→문법→다음 학습 재진입 뒤 실제 값 복원을 확인했다.
- 복귀 기준: v139 제품 `3b9626a642428f845c95f574d55fd4ec29361bd6`; 실패 배포는 revert PR.
- 미검증: 실제 iPhone/Android, 일본어 모어 화자, 실제 첫 성공·10분/D1/D7 회상.
  QA 화면 수와 자동 입력을 학습 효과로 해석하지 않는다.
- 다음: 새 P0·정답 오류가 없으면 ja-JP 입문 문법 첫 손쓰기의 중도 종료·재진입에서 완료 단위와 현재 위치 보존을 검증한다.

# MALBIT autonomous loop status

Keep this file compact. Replace stale detail instead of appending an endless diary.

## 최우선 사용자 요청 · 제품·마케팅·UI 통합 개편

- 사용자가 대규모 업데이트와 UI 재개편을 직접 요청. 과거 Shorts 추가보다 우선하며 #110 정확성·저장 보존·모바일 게이트는 유지한다.
- 배포 v132: 가치 제안 → 오늘 학습 → 오답/여행 표현 복습 → 여행 활용 → TOPIK 준비. 보조 모드는 펼치기로 보존하고 숏츠 기록을 전체 학습 성과로 표시하지 않는다.
- 여행 첫 코스 8개 payload/9개 맥락의 4언어 근거·선택별 오답 이유·재사용 풀이, 예문 → 답 가리고 쓰기 → 비교 → 24시간/10분 복습을 구현. 예문 불일치를 문법 오답으로 판정하지 않는다.
- 기존 스크린샷 결함의 공통 여행 가독성·원문 echo/중복 번역·문법 4문항 해설 수정 포함. 전체 은행 해설 완료가 아니다.
- 실제 검사: Linux Node v24.19.0 전체 141/141, content 37/37, JS 84파일 문법, v137 런타임 45파일·원본 은행 해시 통과. 로컬 서버/검사를 같은 세션에서 실행해 HTTP 3개 기본+45개 런타임 통과(세션 간 서버 종료로 생긴 연결 거부와 구별). 입문 학습 위치·초안 복원·예문 공개/독립 입력 구별·중복 제출·여행 재시작 시 기록 보존·TOPIK II 중단 재개 검사 포함.
- 모바일: GitHub Actions Ubuntu/Node22/Chrome 에뮬레이션 320/375/390/430px×두 테마, 터치·회상 초안 새로고침·여행 복귀·기존 경로·콘솔 검사. 홈/회상 8조합과 여행/Random Practice 주요 화면 직접 확인. 실제 기기 증거와 구별한다.
- 최종 화면 검수로 “뿐더러 형태상 불가”와 “바람에→風の中で” 오류를 발견·수정. 동일 문법 4문항의 ja/en/zh 문맥 번역과 실제 섞인 보기 순서의 뜻을 제공한다. 전체 은행의 자동번역 정확성 인증은 아니다.
- 최종 v132: PR #174 squash `c4045c8358acbfb505c9df01d70dbaa3c5e026e3`. 최종 PR CI `36075457096`(177장, 일본어 문맥 번역 직접 확인), main CI `36075858880`, Pages `36075858066` 성공. 앞의 후보 검사는 이 최종 증거로 대체한다.
- 현재 production: v143, PR #199 `c9f6df6610dd829d575f26c377b5a3b02c705a17`, https://okometsbu-beep.github.io/topik-quest/ . 첫 문법 완주→다음 학습 계약은 테스트 PR #201 `2132a7e31f80a6fb6ea18bea563775a84c4cf6e8`로 고정했으며 공개 자산 변경은 없다.
- v136은 저장 상태가 없는 첫 방문에서 `navigator.languages`의 첫 지원 언어
  (ko/ja/en/zh)를 선택하고 지원하지 않는 언어는 한국어로 안전하게 되돌린다. 저장된 언어·게임·단어장
  기록은 계속 브라우저 설정보다 우선한다. 실패 테스트로 ja-JP의 기존 한국어 시작을 재현한 뒤 수정했다.
  Linux Node v24 전체 139/139와 v136 런타임 45파일·원본 은행 해시가 통과했다. GitHub Actions
  최종 PR CI는 Ubuntu/Node22/Chrome에서 320/375/390/430px×두 테마와 새 ja-JP 프로필의
  일본어 홈·입문 CTA를 통과했고 artifact `10888733726` 183장을 남겼다. 최초 화면 두 테마는 동일
  후보 push artifact `10888805318`에서 직접 확인했다. 첫 PR 시도는 기존 명동 허브 reload assertion이
  한 번 실패했고 동일 커밋 재실행이 통과했으므로 최초 실패를 제품 통과로 세지 않는다. 이는 브라우저
  에뮬레이션이며 실제 iPhone/Android 또는 일본어 모어 화자 검증이 아니다.
- v137은 일본어 입문자가 자음·쓰기·읽기에서 중단하고 홈/새로고침 뒤 `입문 학습의 계속`으로
  돌아오면 진도만 남고 첫 모음 탭으로 되돌아가던 P1 연속성 결함을 수정한다. 기존
  `malbitBeginnerV1`에 마지막 탭만 추가 저장하며 기존 키·문항·학습 기록은 보존한다. CI가 발견한
  입문 탭 4개의 44px 미만 터치 영역도 같은 화면 범위에서 수정했다. PR CI는 141/141 및
  320/375/390/430px×두 테마를 통과했고 artifact `10897265326` 191장 중 관련 8장을 직접 확인했다.
  앞선 CI `36214079062`는 작은 터치 영역을, `36214262897`·`36214515877`은 새로고침 뒤 DOM을
  기다리지 않은 검사 경합을 각각 실패로 보존하며 제품 통과로 세지 않는다. 공개 Chrome에서
  `site-patch.js?v=137`, `2. 子音`, `文字 1/20 習得`, 학습한 `ㄱ`, 44px 탭 복원을 확인했다.
- v133은 라이브에서 드러난 기존 560px 부모의 여행 지도 조작부 잘림만 수정. 실패→통과 정적 회귀, 1363×936 두 테마 실제 버튼 hit-test와 모바일 회귀 통과. CI `36076910462` artifact `10839744095` 179장 중 관련 화면 직접 확인. 첫 CI `36076470585` Chrome target 종료는 실패로 보존한다.
- v134는 RPG 전역 Enter/Space 조사 단축키가 초점된 지도·언어·이동 버튼의 네이티브 활성화를 가로채던 P1 접근성 결함만 수정한다. 초점 버튼은 키 이벤트를 소비하지 않고 빈 지도 Enter/E는 계속 조사로 라우팅한다. CI artifact `10845017916` 179장 중 390px·1363px 라이트/다크 Travel 화면을 직접 확인했다. 첫 PR CI `36089091135`는 터치 에뮬레이션 CDP가 네이티브 클릭을 합성하지 않은 검증 방식 실패이며 제품 통과가 아니다. 계약을 직접 측정한 최종 CI가 통과했다.
- v135는 최초 렌더가 존재하지 않는/아직 정착하지 않은 viewport 대신 720px fallback으로 카메라를 잡아 1363×936 오른쪽 약 208px를 비우던 P1만 수정한다. mounted viewport로 즉시 재계산하고 다음 animation frame에 다시 clamp한다. CI는 최초 진입·저장 재진입의 이동 전 보드 네 변 coverage를 수치로 검사한다. PR CI `36117974374` artifact `10856190822` 181장 중 두 넓은 화면과 320/375/390/430px×두 테마를 직접 확인했다. 앞선 `36116613167`·`36117009893`은 결함이 남아 실패했고, `36117342467` 두 시도는 카메라 통과 후 Chrome target 종료로 실패했으며 통과로 세지 않는다.
- 공개 HTTP: v137, 기본 3개와 런타임 45개 smoke 통과. `index.html`·`site-patch.js`·`sw.js`·`app-polish-v33.js`·`app-polish-v34.js` SHA-256이 main과 일치한다. 공개 저장소를 지우지 않고 PR Chrome의 clean-profile ja-JP 측정과 화면을 첫 방문 근거로 사용한다. 기존 여행 이동·학습 흐름도 자동 회귀로 유지된다. QA 입력이며 실제 학습자 성과가 아니다.
- 되돌리기: v137 좁은 수정은 v136 `92286d97ad0496058a2f9b31125d870b0678205f`; 전체 개편은 v131 `fadd25392e75f055c6deebf026ec77b8d597c96b`.
- 미검증: 실제 iPhone/Android, 일본어 모어 화자/교육 전문가, 실제 첫 학습 성공·D1/D7 회상. 합성 QA 기록은 실사용 지표가 아니다.
- 실제 학습자 검증 계약: `docs/qa/beginner-validation-protocol.md`. 12명 표본, 10분 첫 성공,
  세 표현 10분/D1/D7 회상, 다음 학습·복습 발견, 실기기 iPhone/Android, 개입·결측·집계 규칙을
  고정했다. 모집·초대·관찰·연락처/결과 수집은 시작하지 않았고 사용자 승인 전 금지한다.
- 다음 한 작업: 새 P0·정답 오류가 없으면 두 번째 입문 문법 `sentence-omission`의 일본어 목표·예문·
  코칭과 변형/손쓰기 부담을 한 항목만 검수한다. 실제 학습자 검증은 사용자 승인 전 시작하지 않고
  문항 수·가상 사용자를 학습자 증거로 대체하지 않는다.

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
- 다음 한 작업: 새 P0·명백한 정답 오류가 없으면 검수 수가 더 적은 TOPIK II 부족 유형
  4문항을 제한 검수한다.
- 이전 라이브(v132 이전): v131 `fadd25392e75f055c6deebf026ec77b8d597c96b`,
  https://okometsbu-beep.github.io/topik-quest/ . 제품 복귀 기준은 v130
  `bfc3f89121f3477a964f474ec378391b3c37dbf8`다.

## 현재 상태

- Production: GitHub Pages static PWA
- Production release: v143 · M09 purpose coaching (`c9f6df6610dd829d575f26c377b5a3b02c705a17`)
- Current priority: audit the second Japanese beginner grammar lesson's teaching quality and workload; no new question-count expansion
- Core content: 2,144 original items, including a 56-item set-0 practice expansion
- Primary user: Japanese-speaking complete Korean beginner
- First-session goal: Japanese beginner completes one appropriate learning step, recalls it, and finds review/next learning
- Autonomous runtime: GitHub-connected scheduled task, four fresh runs per day
- Long-term game direction: Seoul exploration quests and learning-earned avatar rewards; all payment UI deferred

## 최근 안정 기능

- TOPIK I·II, Shorts, Random Practice, full mock exams, Review, Vocabulary, Statistics
- Beginner grammar covers core sentence order and major particle, tense, politeness, negation, connective,
  modifier, irregular, and speech-level transformations with per-rule writing practice.
- Production v131 has 228 TOPIK I / 176 TOPIK II rows and only 140 / 138 distinct
  question-choice sets. These are inventory counts, not educational approvals.
- Production v124 adds four TOPIK II degree/comparison cards (`-에 비해(서)`, `-에 못지않게`,
  `-만큼`, `-(으)ㄹ 정도로`). Its generated inventory is 376 rows / 250 exact families
  (I 124, II 126), with the existing 15 structural flags unchanged.
  Fixed mock composition remains intact.
- Production v125 adds four TOPIK I clause-relation cards (`-(으)면서`, `-(으)니까`,
  `-(으)러`, `-는데`). Production inventory is 380 rows / 254 exact families (I 128, II 126),
  with 126 redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals.
- Production v126 adds four TOPIK II stance-adverb cards (`간신히`, `차라리`, `도무지`, `미처`).
  Production inventory is 384 rows / 258 exact families (I 128, II 130), with the existing 126
  redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals unchanged. Native review,
  learner timing/recall, and physical devices remain unverified. Local focused checks pass
  29/29, content 32/32, and full release 126/126. PR #162 CI `35501505213` passed Linux Chrome
  320/375/390/430px light/dark, Japanese wrong-answer feedback, detailed coaching, next-first flow, and
  reload restoration; artifact `10602636471` screens `00dc`/`00dd` were inspected. Final PR CI
  `35501808421`, main CI `35502032804`, and Pages `35502032361` passed. Live HTTP smoke reports
  v126 with 3 base + 45 runtime files; public Chrome verified Japanese `도무지`, a deliberate `미처`
  error, detailed coaching, and reload restoration. Product rollback is v125
  `91923d31206dfbe8695f5348050ab9834dafc478`.
- Production v127 adds four TOPIK I wearing-action cards (`입다`, `신다`, `쓰다`, `끼다`).
  Production inventory is 388 rows / 262 exact families (I 132, II 130), with the existing 126
  redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals unchanged. Native review,
  learner timing/recall, and physical devices remain unverified. Local focused checks pass 30/30,
  content 33/33, and full release 127/127 with the v127 45-file runtime contract. PR #164 evidence CI
  `35518597198` and final CI `35518989721` passed Linux Chrome 320/375/390/430px light/dark,
  Japanese wrong-answer feedback, detailed coaching, next-first flow, and reload restoration; artifact
  `10606903965` screens `00de`/`00df` were inspected. PR #164 was squash merged as
  `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`; main CI `35519244108` and Pages
  `35519243649` succeeded. Live HTTP reports v127, and `index.html`, `site-patch.js`, `sw.js`, and
  `data/shorts-levels.js` hashes match main with all four new IDs present. Product rollback is v126
  `39e2ac7d305d5e5acbfdd8308bf1075994c00d1c`.
- Production v128 adds four TOPIK II noun-scope relation cards (`-을/를 제외하고`,
  `-을/를 대신해(서)`, `-에 관계없이`, `-을/를 비롯해(서)`). Production inventory is
  392 rows / 266 exact families (I 132, II 134), with the existing 126 redundant rows, 30 duplicate
  groups, 15 structural flags, and 0 approvals unchanged. Native review, learner timing/recall, and
  physical devices remain unverified. Local focused checks pass 31/31, content 34/34, and full release
  128/128 with the v128 45-file runtime contract. PR #166 evidence CI `35556820642` and final CI
  `35557160438` passed Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback,
  detailed coaching, next-first flow, and reload restoration; artifact `10621001103` screens
  `00dg`/`00dh` were inspected. PR #166 was squash merged as
  `6840bd478937ebb524f59ec8b68c203f41a1fb46`; main CI `35557469515` and Pages
  `35557469072` succeeded. Live HTTP reports v128, and `index.html`, `site-patch.js`, `sw.js`, and
  `data/shorts-levels.js` hashes match main with all four new IDs present. Public Chrome verified
  TOPIK II Shorts entry, the new `-에 관계없이` card, deliberate wrong-answer feedback, expanded
  coaching, and reload restoration. Product rollback is v127
  `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`.
- Production v129 adds four TOPIK I transit-action cards (`타다`, `내리다`, `갈아타다`, `건너다`).
  Production inventory is 396 rows / 270 exact families (I 136, II 134), with the existing 126
  redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals unchanged. Native review,
  learner timing/recall, and physical devices remain unverified. Local focused checks pass 32/32,
  content 35/35, and full release 129/129 with the v129 45-file runtime contract. PR #168 evidence CI
  `35617795816` and final CI `35618582704` passed Linux Chrome 320/375/390/430px light/dark,
  Japanese wrong-answer feedback, detailed coaching, next-first flow, and reload restoration; artifact
  `10647651432` screens `00di`/`00dj` were inspected. PR #168 was squash merged as
  `8a33bd6025243187d3f569e3ddd85f432ed4cc94`; main CI `35619144734` and Pages
  `35619143631` succeeded. Live HTTP reports v129, and `index.html`, `site-patch.js`, `sw.js`, and
  `data/shorts-levels.js` hashes match main with all four new IDs present. Public Chrome verified
  TOPIK I Shorts entry, the new `타다` card, deliberate Japanese wrong-answer feedback, expanded
  coaching, and reload restoration. Product rollback is v128
  `6840bd478937ebb524f59ec8b68c203f41a1fb46`.
- Production v131 adds four TOPIK I housework-action cards (`청소하다`, `빨래하다`, `설거지하다`,
  `요리하다`). Production inventory is 404 rows / 278 exact families (I 140, II 138), with the
  existing 126 redundant rows, 30 duplicate groups, 15 structural flags, 0 answer conflicts, and
  0 approvals unchanged. Local focused checks pass 34/34, content 37/37, and full release 131/131
  with the v131 45-file runtime contract. PR #172 evidence CI `35745761618` and final CI
  `35746609645` passed Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback,
  detailed coaching, next-first flow, and reload restoration; artifact `10702339056` screens
  `00dm`/`00dn` were inspected. PR #172 was squash merged as
  `fadd25392e75f055c6deebf026ec77b8d597c96b`; main CI `35747146849` and Pages
  `35747145718` succeeded. Live HTTP smoke reports v131 with 3 base + 45 runtime files;
  `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` match main with all four new IDs.
  Public cloud Chrome verified Japanese wrong-answer feedback, next CTA, and reload restoration.
  Product rollback is v130 `bfc3f89121f3477a964f474ec378391b3c37dbf8`. Native review, learner
  timing/recall, physical devices, audio, and full offline recovery remain unverified.
- Production v130 adds four TOPIK II change-adverb cards (`점차`, `일시적으로`, `지속적으로`,
  `급격히`). Production inventory is 400 rows / 274 exact families (I 136, II 138), with the
  existing 126 redundant rows, 30 duplicate groups, 15 structural flags, 0 answer conflicts, and
  0 approvals unchanged. Local focused checks pass 33/33, content 36/36, and full release 130/130
  with the v130 45-file runtime contract. PR #170 evidence CI `35682292167` and final CI
  `35683030397` passed Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback,
  detailed coaching, next-first flow, and reload restoration; artifact `10675775494` screens
  `00dk`/`00dl` were inspected. PR #170 was squash merged as
  `bfc3f89121f3477a964f474ec378391b3c37dbf8`; main CI `35683433183` and Pages
  `35683432875` succeeded. Live HTTP returns 200, and `index.html`, `site-patch.js`, `sw.js`, and
  `data/shorts-levels.js` hashes match main with all four new IDs present. Product rollback is v129
  `8a33bd6025243187d3f569e3ddd85f432ed4cc94`. Native review, learner timing/recall, physical devices,
  audio, and full offline recovery remain unverified.
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

#129 긴급 작문 입력 분리와 v111–v131의 제한 검수 문항 배포·운영 문서 동기화는 완료됐다.
새 P0·명백한 정답 오류가 없으면 검수 수가 더 적은 TOPIK II 부족 유형 4문항을 제한 검수한다.
수량 자체를 교육 승인이나 출시 진척으로 보지 않는다.

## 완료 작업 · S04 TOPIK I 집안일 동사 숏츠 4문항

- v131 production은 `청소하다·빨래하다·설거지하다·요리하다`를 방·장소, 옷·수건, 식사 뒤 그릇,
  재료로 음식 만들기의 대상과 결과로 구분한다. 기존 ID, 원본 은행과
  `topikQuestShortsV1` 저장 구조는 보존한다.
- production 재고는 404행/278 정확 질문-보기군, I 140·II 138개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/404다.
- Node 24 집중 vocabulary+inventory 34/34, 콘텐츠 37/37, 전체 release check 131/131과
  v131 런타임 45개 계약을 통과했다. PR #172 evidence CI `35745761618`은 Linux Chrome
  320/375/390/430px 라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선,
  새로고침 복원을 통과했다. artifact `10702339056`의 `00dm`/`00dn` 화면을 직접 확인했다.
  최종 PR CI `35746609645`도 성공했다. PR #172를 squash merge한 production 커밋은
  `fadd25392e75f055c6deebf026ec77b8d597c96b`다. main CI `35747146849`와 Pages
  `35747145718`은 성공했다. 라이브 HTTP smoke는 v131, 기본 3개+런타임 45개를 확인했고
  핵심 자산 4개는 main과 일치하며 신규 ID 4개가 모두 존재한다. 공개 cloud Chrome에서
  일본어 오답 피드백·정답·다음 문제 CTA와 새로고침 복원을 확인했다.
  실제 일본어 모어 화자·교육 전문가, 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android도
  미검증이다. 제품 복귀 기준은 v130 `bfc3f89121f3477a964f474ec378391b3c37dbf8`다.
- 검수대장: `docs/qa/shorts-review-s04-topik1-housework-actions.md`.

## 완료 작업 · S04 TOPIK II 변화 양상 부사 숏츠 4문항

- v130 production은 시간 경과에 따른 점진 변화, 짧은 한시 상태, 긴 기간 지속, 짧은 시간의 큰 폭
  변화를 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는 보존한다.
- production 재고는 400행/274 정확 질문-보기군, I 136·II 138개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/400이다.
- Node 24 집중 vocabulary+inventory 33/33, 콘텐츠 36/36, 전체 release check 130/130과
  v130 런타임 45개 계약을 통과했다. PR #170 evidence CI `35682292167`은 Linux Chrome
  320/375/390/430px 라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선,
  새로고침 복원을 통과했다. artifact `10675775494`의 `00dk`/`00dl` 화면을 직접 확인했다.
  최종 PR CI `35683030397`도 성공했다. PR #170을 squash merge한 production 커밋은
  `bfc3f89121f3477a964f474ec378391b3c37dbf8`이다. main CI `35683433183`과 Pages
  `35683432875`도 성공했다. 라이브 HTTP는 200을 반환했고 핵심 자산 4개 해시와 신규 ID
  4개가 main과 일치했다. 실제 일본어 모어 화자·교육 전문가, 학습자 풀이시간/D1·D7 회상,
  실제 iPhone/Android는 미검증이다. 제품 복귀 기준은 v129
  `8a33bd6025243187d3f569e3ddd85f432ed4cc94`다.
- 검수대장: `docs/qa/shorts-review-s04-topik2-change-adverbs.md`.

## 완료 작업 · S04 TOPIK I 교통 이동 동사 숏츠 4문항

- v129 production은 `타다·내리다·갈아타다·건너다`를 승차·하차·환승·횡단의 이동 단계로
  구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는 보존한다.
- production 재고는 396행/270 정확 질문-보기군, I 136·II 134개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/396이다.
- Node 24 집중 vocabulary+inventory 32/32, 콘텐츠 35/35, 전체 release check 129/129와
  v129 런타임 45개 계약을 통과했다. PR #168 evidence CI `35617795816`은 Linux Chrome
  320/375/390/430px 라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선,
  새로고침 복원을 통과했다. artifact `10647651432`의 `00di`/`00dj` 화면을 직접 확인했다.
  최종 PR CI `35618582704`도 성공했다. 실제 일본어 모어 화자·교육 전문가, 학습자
  풀이시간/D1·D7 회상, 실제 iPhone/Android는 미검증이다.
- PR #168을 squash merge한 production 커밋은 `8a33bd6025243187d3f569e3ddd85f432ed4cc94`다.
  main CI `35619144734`와 Pages `35619143631`도 성공했다. 라이브 HTTP는 v129를 반환하고
  핵심 자산 4개 해시와 신규 ID 4개가 main과 일치했다. 공개 Chrome에서 TOPIK I 숏츠 진입,
  신규 `타다` 카드의 일본어 오답 피드백·상세 해설·새로고침 복원을 확인했다. 제품 복귀
  기준은 v128 `6840bd478937ebb524f59ec8b68c203f41a1fb46`이다.
- 검수대장: `docs/qa/shorts-review-s04-topik1-transit-actions.md`.

## 완료 작업 · S04 TOPIK II 범위 관계 숏츠 4문항

- v128 production은 `-을/를 제외하고·-을/를 대신해(서)·-에 관계없이·-을/를 비롯해(서)`를
  범위 제외·역할 대체·조건 무관·대표 예 포함으로 구분한다. 기존 ID, 원본 은행과
  `topikQuestShortsV1` 저장 구조는 보존했다.
- production 재고는 392행/266 정확 질문-보기군, I 132·II 134개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/392다.
- Node 24 집중 vocabulary+inventory 31/31, 콘텐츠 34/34, 전체 release check 128/128과
  v128 런타임 45개 계약을 통과했다. PR #166 evidence CI `35556820642`는 Linux Chrome
  320/375/390/430px 라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선,
  새로고침 복원을 통과했다. artifact `10621001103`의 `00dg`/`00dh` 화면을 직접 확인했다.
  최종 PR CI `35557160438`도 성공했다. 실제 일본어 모어 화자, 학습자 풀이시간/D1·D7 회상,
  실제 iPhone/Android는 미검증이다.
- PR #166을 squash merge한 production 커밋은 `6840bd478937ebb524f59ec8b68c203f41a1fb46`다.
  main CI `35557469515`와 Pages `35557469072`도 성공했다. 라이브 HTTP는 v128을 반환하고
  핵심 자산 4개 해시와 신규 ID 4개가 main과 일치했다. 공개 Chrome에서 TOPIK II 숏츠 진입,
  신규 `-에 관계없이` 카드의 오답 피드백·상세 해설·새로고침 복원을 확인했다. 제품 복귀 기준은
  v127 `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`다. 검수대장은
  `docs/qa/shorts-review-s04-topik2-scope-relations.md`다.

## 완료 작업 · S04 TOPIK I 착용 동사 숏츠 4문항

- v127은 `입다·신다·쓰다·끼다`를 몸의 옷·발의 신발/양말·머리의 모자·손의 장갑으로
  구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는 보존했다.
- production 재고는 388행/262 정확 질문-보기군, I 132·II 130개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/388이다.
- Node 24 집중 vocabulary+inventory 30/30, 콘텐츠 33/33, 전체 release check 127/127과
  v127 런타임 45개 계약을 통과했다. PR #164 CI `35518597198`은 Linux Chrome 320·375·390·
  430px 라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다.
  artifact `10606903965`의 `00de`/`00df` 화면을 직접 확인했다. 최종 PR CI `35518989721`도
  성공했다. 실제 일본어 모어 화자, 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android는 아직 미검증이다.
- PR #164를 squash merge한 production 커밋은 `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`다.
  main CI `35519244108`과 Pages `35519243649`도 성공했다. 라이브 HTTP는 v127을 반환하고
  핵심 자산 4개 해시와 신규 ID 4개가 main과 일치했다. 제품 복귀 기준은 v126
  `39e2ac7d305d5e5acbfdd8308bf1075994c00d1c`이다. 검수대장은
  `docs/qa/shorts-review-s04-topik1-wearing-actions.md`다.

## 완료 작업 · S04 TOPIK II 태도 부사 숏츠 4문항

- v126은 `간신히·차라리·도무지·미처`를 어려움 끝의 성취·덜 나쁜 대안·부정의 절대 강조·
  제때 하지 못함으로 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는 보존했다.
- production 재고는 384행/258 정확 질문-보기군, I 128·II 130개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/384다.
- Node 24 집중 vocabulary+inventory 29/29, 콘텐츠 32/32, 전체 release check 126/126과
  v126 런타임 45개 계약을 통과했다. PR #162 CI `35501505213`과 최종 CI `35501808421`은
  Linux Chrome 320·375·390·430px 라이트/다크, 일본어 선택 오답 설명, 상세 해설, 다음 문제 우선,
  새로고침 복원을 통과했다. artifact `10602636471`의 `00dc`/`00dd` 화면을 직접 확인했다.
- PR #162를 squash merge한 제품 커밋은 `39e2ac7d305d5e5acbfdd8308bf1075994c00d1c`이다.
  main CI `35502032804`와 Pages `35502032361`도 성공했다. 라이브 HTTP smoke는 v126 기본 3개+
  런타임 45개를 통과했고 핵심 자산 해시와 신규 ID 4개가 main과 일치했다. 공개 브라우저에서
  일본어 `도무지` 카드의 의도적 `미처` 오답, 선택별 피드백·상세 해설·새로고침 복원을 확인했다.
- 제품 복귀 기준은 v125 `91923d31206dfbe8695f5348050ab9834dafc478`이다. 실제 일본어 모어
  화자, 학습자 풀이시간/D1·D7 회상, 실제 iPhone/Android, 음성·완전 오프라인 복구는 미검증이다.
  검수대장은 `docs/qa/shorts-review-s04-topik2-stance-adverbs.md`다.

## 완료 작업 · S04 TOPIK I 기본 연결 표현 숏츠 4문항

- v125는 `-(으)면서·-(으)니까·-(으)러·-는데`를 동시 행동·이유 뒤 판단/요청·
  이동 목적·뒤말의 배경으로 구분한다. 기존 ID, 원본 은행과 `topikQuestShortsV1` 저장 구조는
  변경하지 않고 기존 TOPIK I 행 뒤에만 추가한다.
- ko/ja/en/zh 예문·선택 오답별 설명과 `결정적 근거 → 네 함정 → 절 관계` 풀이법을 내장했다.
- production 재고는 380행/254 정확 질문-보기군, I 128·II 126개다. 기존 중복 126행·30군,
  구조 후보 15개, 정답 충돌 0은 증가하지 않았고 전체 승인 수는 0/380이다.
- Node 24 집중 vocabulary+inventory 28/28, 콘텐츠 31/31, 전체 release check 125/125와
  v125 런타임 45개 계약을 통과했다. 로컬 Chrome/Chromium은 없지만 PR #160 CI
  `35469665976`과 최종 CI `35470007260`이 Linux Chrome 320·375·390·430px 라이트/다크, 일본어 선택 오답 설명,
  상세 해설, 다음 문제 우선, 새로고침 복원을 통과했다. artifact `10592252454`의
  `00da`/`00db` 화면을 직접 확인했다. PR #160을 squash merge한 production v125 제품 커밋은
  `91923d31206dfbe8695f5348050ab9834dafc478`이다. main CI `35470201592`와 Pages
  `35470200959`도 성공했다. 라이브 HTTP smoke는 v125 기본 3개+런타임 45개를 통과했고
  `index.html`, `site-patch.js`, `sw.js`, `data/shorts-levels.js` 해시가 main과 일치했다.
  공개 브라우저에서 일본어 TOPIK I Shorts의 신규 `-(으)면서` 카드에 의도적 `-(으)니까`
  오답을 제출한 뒤 선택별 피드백·정답·예문·상세 해설과 새로고침 잠금 상태 복구를 확인했다.
  제품 복귀 기준은 v124 `10bb264f48b75754c10456f33236d3352f6ba5a0`이다.
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

- 2026-09-27 후보 271a04e: 전체 155/155, 모바일/오프라인/타일 검사 성공.
  CI 36289452148은 모든 검사·증거 업로드 성공 후 5분 제한으로 cancelled.
  검사를 삭제하지 않고 job 한도만 8분으로 조정한다. 최종 병합/배포 증거는 #197에서 확인.
## 2026-09-28 v143 M09 목적 표현 해설 교정 · #199

- TOPIK I `M09-I-R-34`의 일반론적 오답 해설을 교정했다. `위해서`는 `V-기 위해서`의 목적,
  `부터`는 시작점, `처럼`은 유사·비교, `때문에만`은 원인+제한으로 구분하고 네 언어에
  정답 근거→각 오답 함정→목적/원인 재사용 풀이 순서를 제공한다.
- 원본 ID·정답·문제은행·저장 스키마는 불변. 로컬과 PR/main의 전체 155/155, v143 런타임
  49개·은행 해시, Chrome 모바일 회귀와 타일 검사가 통과했다. 새 화면은 ko/ja×두 테마×
  320/375/390/430px를 수치 검사했고 대표 390px 4장을 직접 검토했다.
- PR #199 squash `c9f6df6610dd829d575f26c377b5a3b02c705a17`; PR CI `36330127258`,
  main CI `36330472495`, Pages `36330472634` 성공. 공개 v143의 index/site-patch/sw/해설
  SHA-256이 병합본과 일치한다. 복귀점은 v142 `9496f84c7f0a405cf1311e3f8e8a8aa78cdd5a7c`.
- 첫 v143 브랜치 CI는 Chrome target 종료로 실패했고 동일 커밋 재실행이 통과했다. 실패를
  제품 통과로 세지 않는다. 실제 iPhone/Android, 일본어 모어 화자·교육 전문가, 실제 학습자의
  10분/D1/D7 회상은 미검증이다.
- 다음: 새 P0·정답 오류가 없으면 이미 예정된 ja-JP 입문 문법 완주→완료 표시→다음 학습 CTA를
  한 경로로 검증한다.
