## 2026-10-09 v162 listening player candidate

- Shared recorded/device transport with Stop, metadata-based cumulative timeline, study seeking and 0.75/1/1.25/1.5 speed. TOPIK I/II and growth use the same cancellation generation.
- Exam play rights begin on actual playback, recover on failure, and remain used after intentional stop. Missing recordings offer explicit retry/device speech. Device duration/seeking is unavailable and labelled accordingly.
- Existing 363 MP3 files and learning/reward data stay unchanged. Translation remains disabled. Runtime/cache version is 162.
- Recovered PC snapshot: 433 tests and Chrome dialogue, TOPIK I/II, failure/device fallback, cancellation and 16 component layouts were reported passing. Latest cloud integration: 438 tests, v162 runtime and 152 JS syntax checks pass. Current cloud Chromium is blocked by socket EPERM and HTTP smoke by localhost ECONNREFUSED; latest actual-browser CI is pending. Physical devices and human pronunciation remain unverified.
- Growth hearing evidence requires uninterrupted completed playback; seeking or cancellation never grants heard evidence or rewards. The obsolete owner-specific fallback loops were removed. CI now includes real-MP3 progress/stop, four rates, 16 player layouts and a real growth listening completion.
- Travel browser assertion now expects Review for travelAdventureReview/travelRecall and Home otherwise, with exactly one active tab, matching harumal-ui.js.

## 2026-10-09 v161 three-tab UI candidate

- New final UI owner `learning-hub.js`/`.css`: Learn, Review, Vocabulary; compact status → Profile; gear → accessible settings bottom sheet; progressive course path and practice hierarchy.
- New `harumalLearningPathV1` preferences are in recovery/backup, with legacy path fallback. Existing engines and evidence remain. Coins are earned-only; full advanced curriculum and shop/stickers remain explicit gaps.
- Vocabulary-only Shorts filtering, stable-index adapter, retired card-selection migration and travel Back fix. Generated diary empty-state WebP is included offline.
- Release scope and verification: `docs/qa/three-tab-ui-v161.md`. Remote Chrome CI artifact verification is required before merge.

## 2026-10-08 v160 growth learning and activity reward candidate

- Current release candidate adds an opt-in 11-recipe/22-task growth library and activity XP/coins. It is selected authored content, not full-bank conversion. Existing navigation, question bank, Shorts format and learner roots remain.
- New source owners: `learning-rewards.js`; `data/growth-learning.js`, `growth-learning-engine.js`, `growth-learning.js`, `growth-learning.css`; `growth-learning-entrypoints.js`. Existing grading owners call the reward API only at valid submission/completion events.
- Activity levels use cumulative `50*(L-1)*L` thresholds; difficulty awards are 10/2, 15/3, 25/5 and 40/8 XP/coins. Growth completion adds 20/4 (learn) or 30/6 (transfer). No shop/payment and no language proficiency certification.
- Browser-local immutable event keys protect reward union across tabs; new progress roots participate in recovery/backup. Assistance, repeated known content, fresh transfer evidence and free-writing limitations remain explicit. No historical rewards are backfilled.
- Release evidence, scope and limitations: `docs/qa/growth-rewards-v160.md`. Local headless Chromium is sandbox-denied; use the existing pre-merge GitHub Actions Chrome harness and inspect its growth/mobile artifacts before deployment. User desktop is not required.

## 2026-10-07 v157 작문 코너 발행 후보

- v156 main `7e8fc7df22f11d80fe739a910fb5fdda70372ec2` 위에 문장 능력 지도와 첫 원인 소단원 37문항을 구현했다. 발행 승인을 받아 기존 GitHub Actions/Pages 경로로 검증·발행한다.
- 연습·수정·새 상황 첫 답·다른 날 확인·목표 형태·의미 자기점검을 분리한다. 자유 문장의 의미 숙달을 자동 확정하지 않는다. 미래 능력 노드는 문항 준비 중으로 표시한다.
- 새 저장 루트 `harumalWritingCurriculumV1`은 기존 단어장·즐겨찾기·진도와 독립적이며 회복/백업 경로에 추가했다. 다중 탭·병합·초고·반복·지연·XSS 회귀 포함 전체 228/228 및 HTTP smoke 통과.
- 브라우저는 localhost에서 `ERR_BLOCKED_BY_CLIENT`; 우회하지 않았으며 실제 렌더링/모바일/오프라인 E2E는 미검증이다. 원격 main을 기준으로 발행하며 PC 전용 변경은 포함하지 않는다. 원격 CI 모바일 검수와 배포 후 공개 앱 검증은 별도 증거로 남긴다.
- 세부: `docs/qa/writing-curriculum-v157-candidate.md`. 실제 발행 SHA와 CI/Pages 검증 결과는 완료 후 기록한다.

## 2026-10-02 v156 공통 UI 공개 완료 / 다음 범위

- PR #227 → main 86697e6bf57f9ecfaf4ecc8b2e37713ae70c2ddc, Pages 성공 및 live v156 smoke4+51파일/Cloud Chrome 주요 동작 확인. 후보와 PR CI 모두 성공(모바일341장/오류0·baseline·네 언어 focus). 실제 실기기 확인은 아니다.
- 로컬 EPERM을 우회하지 않고 기존 원격 검증을 사용했다. 전체 작업 차단 아님. 공개 버전의 검증 방법은 앞으로도 원격 CI artifact 시각 검수 + live smoke/직접 동작 확인.
- 승인 28보드/84구성의 완전 일치는 미완료다. 공통 적용과 개별 완료를 분리해 기록하며 다음은 docs/qa/approved-ui-28-board-contract-20261002.md에 따른 남은 보드별 owner 수정/검수. 기존 데이터·모드·은행·인트로 완주/화이트아웃/타이틀/스킵 없음 유지.
- 상세 증거 STATUS / docs/qa/approved-ui-shared-v156.md / #226. 되돌리기: PR #227 revert / v155 a201d0e35602b9430dbeabc3b2bf6983dcb4197b. #110 실제 학습자·14일 안정화 게이트는 아직 합격 아님.

## 2026-10-02 검사 환경 정정 / 앱 공통 UI v156 후보

- 기존 로컬 HTTP/Chrome EPERM을 우회하지 않았다. 기존 GitHub Actions Ubuntu Node22/Chrome에서 후보 전체 모바일 341장/오류0 검증이 가능하며, 제품 PR을 금지하는 전체 차단은 해소됐다. 로컬 차단과 실제 iPhone/Android 미검증은 유지한다.
- 전체 공통 UI + 오늘/학습 CTA/내 기록 설정/단어장 첫 카드/작문·문법 대비 적용. 승인 28보드 계약을 축소하지 않으며 개별 완전 일치는 아직 미완료다. 검증 범위와 남은 범위는 docs/qa/approved-ui-shared-v156.md / STATUS / #226.
- v156 후보를 CI 합격 뒤 Pages 배포하고 실제 버전/자산/동작 검증. 인트로 영상 완주→화이트아웃→타이틀/스킵 없음, 기존 저장 데이터와 모드 유지. 복귀 기준 v155 a201d0e35602b9430dbeabc3b2bf6983dcb4197b.

## 2026-10-02 최종 승인 UI 범위: 28개 보드 / 하루만 12종

- 사용자의 “딱 요대로 … 똑같이 업데이트”는 마지막 하루만 포함 28보드/84구성에 대한 구현 승인이다. 재디자인하거나 6화면으로 축소하지 않는다.
- 기준: docs/qa/approved-ui-28-board-contract-20261002.md. 각 보드 해시, 원본 해시, owner, 포즈/위치 사양을 고정했다. 예시 점수/기록은 실제 저장 상태와 연결하며 기존 모드/2,088은행/진도/백업 보존.
- 기존 v156 후보는 일부만 구현됐고 필수 모바일 검수가 차단됐다. 새 코드/PR/배포로 확장하지 않고 먼저 후보 시각/동작 검수 환경을 확보한다. 공개 v155 유지. 이번 문서 동기화는 구현 완료 증거가 아니다.

## 2026-10-02 최신 사용자 승인 UI / 작업 방향

- #226의 전체 감사와 승인한 여섯 화면 UI를 기준으로 기능/UI 보완을 진행한다. 단순 문항 수 확대는 다음 작업이 아니다.
- 확정 하루만 소스는 ui-source-v3.2, 공부 포즈는 귀여운 표정으로 책을 보는 최종 한 장. 12종 전달 자산 후보와 입문 레이아웃 후보는 docs/qa/approved-ui-haruman-v156-candidate.md / STATUS 참조.
- 현재 공개 main은 v155 그대로. 후보 자동검사 합격과 모바일 화면 합격을 구분하며, 브라우저/로컬 서버 권한 차단 때문에 아직 PR/배포하지 않았다.

## 2026-10-01 v155 TOPIK II scale/state Shorts deployed · #224

- Four stable-ID cards add `확대`, `축소`, `유지`, and `중단`, distinguishing making a scale larger, making it smaller, keeping the current state, and stopping an activity in progress. ko/ja/en/zh selected-choice feedback and optional evidence/trap/method coaching are local.
- Existing IDs, the original 2,088-item bank, `topikQuestShortsV1`, and learner records remain unchanged. Inventory is 432 rows / 306 exact families (I 152, II 154); pre-existing duplicate/structural counts remain and no answer conflict was added.
- Local content 51/51 and full 185/185 pass. [PR #224 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36777452399) passes four widths/two themes, wrong-answer, expanded coaching, and reload restore. Artifact `11126636409` has 481 screenshots; the new 390px light wrong-answer and dark full-coaching states were inspected. This is browser emulation, not a physical device.
- [PR #224](https://github.com/okometsbu-beep/topik-quest/pull/224) squash `590eaaaf6bf8ff21b68b7f6c1548e9c97e670795`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36778602468) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36778601347) pass. Live v155 serves 4 base + 51 runtime files, the changed Shorts asset SHA-256 `bd07fb7f466efd024c05cea9f516a9691086b8d04d6c4facfd58a1c72ab99ffc` matches main, and all four new IDs are present.
- Rollback is #224 revert or v154 `58e5251cfee99f2d650a7effc95c6b767d2d0703`. Physical iPhone/Android, native-language/educator review, learner timing, and D1/D7 recall remain unverified. If no P0/answer error appears, the next testable bounded shortage is four TOPIK I items.

## 2026-10-01 v154 TOPIK I morning-routine Shorts deployed · #222

- Four stable-ID cards add `일어나다`, `씻다`, `갈아입다`, and `준비하다`, distinguishing rising from bed, washing with water, changing clothes, and getting needed things ready. ko/ja/en/zh selected-choice feedback and optional evidence/trap/method coaching are local.
- Existing IDs, the original 2,088-item bank, `topikQuestShortsV1`, and learner records remain unchanged. Inventory is 428 rows / 302 exact families (I 152, II 150); pre-existing duplicate/structural counts remain and no answer conflict was added.
- Local content 50/50 and full 184/184 pass. [PR #222 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36738114875) passes four widths/two themes, wrong-answer, expanded coaching, and reload restore. Artifact `11110255353` has 479 screenshots; the two new representative states were inspected. This is browser emulation, not a physical device.
- [PR #222](https://github.com/okometsbu-beep/topik-quest/pull/222) squash `99772e910a744f813ba8a0d8236ba694093103c6`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36742809499) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36742810718) pass. Live v154 serves 4 base + 51 runtime files, the changed Shorts asset hash matches main, and all four new IDs are present.
- Rollback is #222 revert or v153 `ace86c3600080693ac440dcaaf373f141fa1f960`. Physical iPhone/Android, native-language/educator review, learner timing, and D1/D7 recall remain unverified. If no P0/answer error appears, the next testable bounded shortage is four TOPIK II items.

## 2026-09-30 v153 TOPIK II policy/review-noun Shorts deployed · #220

- Four stable-ID cards add `대책`, `효과`, `한계`, and `과제`, distinguishing a response to a problem, a result after action, a boundary preventing full achievement, and a future issue. ko/ja/en/zh selected-choice feedback and optional evidence/trap/method coaching are local.
- Existing IDs, the original 2,088-item bank, `topikQuestShortsV1`, and learner records remain unchanged. Inventory is 424 rows / 298 exact families (I 148, II 150); pre-existing duplicate/structural counts remain and no answer conflict was added.
- Local content 49/49 and full 183/183 pass. [PR #220 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663079992) passes four widths/two themes, wrong-answer, expanded coaching, and reload restore. Artifact `11075044000` has 477 screenshots; the two new representative states were inspected. This is browser emulation, not a physical device.
- [PR #220](https://github.com/okometsbu-beep/topik-quest/pull/220) squash `d21a6d6d27351c6c9b98d8a276d2fa82aaedb310`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663836834) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663836084) pass. Live v153 serves 4 base + 51 runtime files, the changed Shorts asset hash matches main, and all four new IDs are present.
- Rollback is #220 revert or v152 `efaf145a0c8be0430fcbeb4ebc10e295463fc8b7`. Physical iPhone/Android, native-language/educator review, learner timing, and D1/D7 recall remain unverified. If no P0/answer error appears, the next testable bounded shortage is four TOPIK I items.

## 2026-09-30 v152 TOPIK I object-action Shorts deployed · #218

- Four stable-ID cards add `찾다`, `잃어버리다`, `가져오다`, and `가져가다`, distinguishing finding, losing, bringing here, and taking away. ko/ja/en/zh selected-choice feedback and optional evidence/trap/method coaching are local.
- Existing IDs, the original 2,088-item bank, `topikQuestShortsV1`, and learner records remain unchanged. Inventory is 420 rows / 294 exact families (I 148, II 146); pre-existing duplicate/structural counts remain and no answer conflict was added.
- Local content 48/48 and full 182/182 pass. [PR #218 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36631648511) passes four widths/two themes, wrong-answer, expanded coaching, and reload restore. Artifact `11063266098` has 475 screenshots; the two new representative states were inspected. This is browser emulation, not a physical device.
- [PR #218](https://github.com/okometsbu-beep/topik-quest/pull/218) squash `f2c80190290cb450a0f79abe59f76f2c1e2eee16`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36632864545) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36632863379) pass. Live v152 serves 4 base + 51 runtime files, and the changed Shorts asset hash matches main.
- Rollback is #218 revert or v151 `b6fa7c4bc670c6fabe3f608c6477e40d1b4c0672`. Physical iPhone/Android, native-language/educator review, learner timing, and D1/D7 recall remain unverified. If no P0/answer error appears, the next testable bounded shortage is four TOPIK II items.

## 2026-09-30 v151 TOPIK II argument-role Shorts deployed · #216

- Four stable-ID cards add `주장`, `근거`, `반박`, and `결론`, distinguishing a position, its support, a challenge, and a final judgment. ko/ja/en/zh selected-choice feedback and optional evidence/trap/method coaching are local.
- Existing IDs, the original 2,088-item bank, `topikQuestShortsV1`, and learner records remain unchanged. Inventory is 416 rows / 290 exact families (I 144, II 146); pre-existing duplicate/structural counts remain and no answer conflict was added.
- Local content 47/47 and full 181/181 pass. [PR #216 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36590876365) passes four widths/two themes, wrong-answer, expanded coaching, and reload restore. Artifact `11043988217` has 473 screenshots; the two new representative states were inspected. This is browser emulation, not a physical device.
- [PR #216](https://github.com/okometsbu-beep/topik-quest/pull/216) squash `c91510535188b273f8177a449415c4b607773f6d`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36592147626) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36592145973) pass. Live v151 serves 4 base + 51 runtime files, and the changed Shorts asset hash matches main.
- Rollback is #216 revert or v150 `69523389d740a5b3f4f0ad0c8c97d355f906d601`. Physical iPhone/Android, native-language/educator review, learner timing, and D1/D7 recall remain unverified. If no P0/answer error appears, the next testable bounded shortage is four TOPIK I items.

## 2026-09-29 v150 인트로 화이트 아웃·타이틀 배포 완료

- 사용자 지시 한 작업: 영상의 실제 `ended` → 500ms 화이트 아웃(600ms 뒤 다음 단계) → 첨부한 하루말/harumal 투명 PNG의 450ms 등장·총 1600ms 표시 → 300ms 페이드 → 홈. 스킵 없이 완주하며 영상 아래 중복 텍스트는 제거했다.
- 제목 원본 PNG 1448×1086/419846 bytes를 그대로 사용했다. 영상·학습 데이터·테마는 보존한다. 앱 숨김 시 영상과 타이틀 단계의 남은 시간을 정지/복귀하며 이미지 실패에는 텍스트 대체를 표시한다.
- Linux Node24: 전체 180/180·집중 17/17·quick 164/164 통과. [브랜치 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36566102824)의 Ubuntu/Node22/Chrome에서 320/375/390/430px×라이트/다크 전후 48장 직접 확인(artifact `11032810613`), 모바일 회귀 330장·앱 오류0·네 언어 홈/단어장 통과. 지연 시작+0.25배속 실제 재생은 약 12.58초 자연 종료→13.18초 타이틀→15.08초 해제다.
- 배포: [PR #214](https://github.com/okometsbu-beep/topik-quest/pull/214) squash `9711a29fc8dbba17469ec5ce23520f39f37902d5`. [PR CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36567235015)·[Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36568177772) 성공. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36568178589).
- 라이브 https://okometsbu-beep.github.io/topik-quest/ v150: 기본4개+런타임51개 HTTP 정상, 새 PNG 포함 핵심6자산 SHA-256 일치. Chrome DOM에서 영상 2.792/2.792 `ended=true`→화이트 아웃→타이틀 단계(원본 이미지 naturalWidth 1448)→패널 제거/홈과 스킵 버튼0을 확인했다. 전환 시각 합격 근거는 위 CI 캡처이며 실제 기기로 세지 않는다.
- 되돌리기는 #214 revert 또는 v149 main `2455b14a8a0c7f6e10664787d43e2803e2ada55e`. 미검증: 실제 iPhone/Android 자동재생·숨김 복귀·시각 전환. 다음 한 작업은 실기기에서 같은 완주/화이트 아웃/타이틀/홈 흐름 확인이다.

## 2026-09-29 v149 인트로 완주·스킵 제거 배포 완료

- 정상 재생은 `ended`→220ms 페이드로 종료한다. 버튼/터치/Escape/60초 재진입 생략과 800ms/3380ms 고정 제한 제거. 숨김→복귀는 일시정지→이어 재생이다. 15초간 실제 재생 위치 정지나 미디어 오류만 실패 복구하며 reduced-motion/save-data는 유지한다.
- 로컬 전체 176/176·집중 13/13. GitHub Chrome 실제 지연 1.2초+0.25배속 약 12.6초 완주·터치/Escape 무시, 네 폭/두 테마 후보 재생·홈 16장 직접 검수. 브랜치 CI 36558468041 전체 성공: 모바일 회귀 314장·오류0, 네 언어 홈/단어장, 타일 검사.
- 배포 완료: [PR #212](https://github.com/okometsbu-beep/topik-quest/pull/212) squash `d1462c0ec42b2130fe4943044c148c7351750f8c`. [PR CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36559532619)와 [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36560518105) 성공. [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36560519170).
- 라이브 https://okometsbu-beep.github.io/topik-quest/ v149: 기본4개+런타임51개 HTTP 정상, 핵심5자산 SHA-256 일치. 재방문 Chrome에서 영상 재생(currentTime 0.091/2.792, 스킵 버튼0)→홈 전환·부트 해제를 확인했다. 앱 콘솔 오류는 없고 브라우저 확장 metadata 오류는 별도로 구분했다.
- 최종 집중 artifact `11029069773`의 수정 전·후 네 폭/두 테마 재생·홈 32장 직접 비교 완료. 실제 iPhone/Android로 세지 않는다. 되돌리기는 #212 revert 또는 v148 `04ce35079aac54e3c4f0ee77154eaa7191d6a2cc`.
- 세부 `docs/qa/haruman-intro-completion-v149.md`, Issue #110. 실제 iPhone/Android 자동재생·숨김 복귀는 미검증. 다음은 실기기 확인. 영상 자체 540px/2.833초와 학습 저장은 불변.

## 2026-09-29 v148 영상 인트로

- 제공된 하루만 영상의 15–82F를 540px/2.833초 무음 인트로로 적용. 알파 검사 WebM → 배경 합성 MP4, 터치 스킵, 800ms 로딩 제한, 220ms 페이드.
- 60초 이내 같은 탭 재진입/reduced-motion/save-data에서는 생략. 필수 오프라인 캐시에 영상을 넣지 않으며 기존 학습 데이터 보존.
- Node 전체 171/171 통과. iPhone/Android 실기기 및 브라우저 시각 검증은 미완료. 세부: `docs/qa/haruman-video-intro-v148.md`.

## 2026-09-29 하루말 무료·무제한 TTS 후보 결정 · 구현 전

- `MALBIT_TTS`와 `neural-tts.js`를 확인한 결과, 현재 공통 파사드는 유지되지만 생성 오디오 캐시·한국어 표시/발화 정규화·native 실행기는 없다. Supertonic 3 FP16 웹 팩은 약 230MB이고 모바일/저메모리 세션을 차단한다.
- 첫 프로토타입 후보는 **Supertonic 3 Korean INT8 + sherpa-onnx native**다. 공식 sherpa 경로의 Android APK·Swift/Kotlin API를 이용해 iOS/Android 실기기에서 cold/warm 생성, peak RAM, RTF, 오프라인 재생을 측정한다. Ppaso-TTS v8은 Apache-2.0 경량 비교군으로만 둔다.
- OpenRAIL-M 제한과 Supertonic upstream archived 상태 때문에 상업·스토어 기본 엔진 채택은 법률/교육 품질/실기기 게이트 뒤로 미룬다. Qwen3-TTS 0.6B는 공식 CUDA 지향 경로라, Kokoro는 공식 카드에서 한국어가 확인되지 않아, Piper KSS는 확인된 모델이 비상업 라이선스라 1차 모바일 후보에서 제외한다.
- 이번 변경은 문서-only이며 v147 자산·저장 데이터·문항은행·버전을 건드리지 않았다. 결정표와 공식 링크는 `docs/qa/tts-feasibility-20260929.md`, 다음 한 작업은 작은 native INT8 harness다. 실기기·모어 화자·법률 검수 전에는 오프라인/무제한을 통과로 표시하지 않는다.

## 2026-09-28 v147 TOPIK I directional-action Shorts deployed · #208

- Adds four bounded stable-ID cards for `올라가다`, `내려가다`, `들어가다`, and `나오다`. They distinguish low→high, high→low, outside→inside, and inside→outside movement.
- ko/ja/en/zh meaning, example, fixed choices, selected-choice feedback, decisive evidence, all distractor traps, and a reusable start/destination method are bundled locally.
- Existing Shorts IDs, `topikQuestShortsV1`, the original 2,088-item bank, and learner records remain unchanged. Candidate inventory is 412 rows / 286 exact families (I 144, II 142); 126 redundant rows, 30 duplicate groups, 15 structural flags, no answer conflicts, and zero comprehensive approvals remain.
- Focused vocabulary plus generated-inventory checks pass 36/36. Node 24 full checks pass 163/163 with v147, 51 ordered runtime files, and valid bank hashes. [PR #208 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36401590122) passes the full suite and 320/375/390/430px light/dark browser emulation. Artifact `10961036393` was inspected for the new Japanese wrong-answer light and full-coaching dark screens; this is not physical-device evidence. Ledger: `docs/qa/shorts-review-s04-topik1-directional-actions.md`.
- Deployment: [PR #208](https://github.com/okometsbu-beep/topik-quest/pull/208) squash `390eb8d36a8cd00b71d40bfb4c6e24fb02ff53a9`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36403169176) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36403167908) pass. Live v147 serves 4 base + 51 runtime files; four public asset hashes match main and all four new IDs are present.
- Rollback baseline is v146 `3cf9154b38a54f1cd9e0200912b98055ca82eb52`. Physical devices, native review, learner timing, and delayed recall remain unverified. After release, the next bounded shortage returns to TOPIK II because reviewed exact families become I 144 / II 142.

## 2026-09-28 v146 TOPIK II analysis-noun Shorts deployed · #206

- Adds four bounded stable-ID cards for `경향`, `요인`, `현상`, and `전망`. They distinguish a repeated pattern, a causal factor, an observed event, and a future outlook.
- ko/ja/en/zh meaning, example, fixed choices, selected-choice feedback, decisive evidence, all distractor traps, and a reusable role/time method are bundled locally.
- Existing Shorts IDs, `topikQuestShortsV1`, the original 2,088-item bank, and learner records remain unchanged. Candidate inventory is 408 rows / 282 exact families (I 140, II 142); 126 redundant rows, 30 duplicate groups, 15 structural flags, no answer conflicts, and zero comprehensive approvals remain.
- Local full checks pass 162/162 and focused vocabulary plus generated-inventory checks pass 35/35. [PR #206 CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36372605082) passes the full suite and 320/375/390/430px light/dark browser emulation. Artifact `10949651981` was inspected for the new Japanese wrong-answer light and full-coaching dark screens; this is not physical-device evidence. Pages and live remain unverified before merge. Ledger: `docs/qa/shorts-review-s04-topik2-analysis-nouns.md`.
- Deployment: [PR #206](https://github.com/okometsbu-beep/topik-quest/pull/206) squash `c2a7fdc0babbe3f4459d2890266643aa6bbb151e`; [main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36373602998) and [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36373602518) pass. Live v146 serves 4 base + 51 runtime files, and all 11 changed-file SHA-256 values match main.
- Rollback is PR #206 revert or v145 `e6ecafa6a53edabcbe5304837660f6c76d5137a6`. Physical devices, native review, learner timing, delayed recall, and full offline recovery remain unverified. Next bounded shortage is TOPIK I because reviewed exact families are now I 140 / II 142.

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

## 2026-09-28 v144 sentence-omission 교육 품질

- 두 번째 입문 문법의 일본어 `meaning` 두 개가 전문 번역이 아닌 설명으로 쓰이던 P1을 수정했다.
  완전한 대화 번역과 `講師メモ`를 분리하고, 문맥상 누구/무엇인지 분명할 때만 주어·목적어를
  생략하며 불명확하면 생략하지 않는다는 목표·코칭을 명시했다. 공식도 생략 표시로 정정했다.
- 문법 ID, 변형 정답, 7단위 손쓰기 문구, 저장 스키마와 원본 문제은행은 바꾸지 않았다.
- PR #203 CI `36350624194`: 전체 157/157, content 44/44, quick 136/136, JS 93파일,
  v144 런타임 49파일·은행 해시, Chrome 320/375/390/430px×두 테마 통과. artifact
  `10942027914` 311장 중 새 390px 라이트/다크 2장을 직접 확인했다. 실기기·모어 화자·실학습자
  10분/D1/D7은 미검증이다. 병합 전 되돌리기 기준은 v143
  `a5e36aeba8578526aec34cba5af5084f670e94d6`이다.
- 다음: 새 P0·정답 오류가 없으면 두 번째 문법의 오답→정답과 손쓰기 중단→재진입 한 경로를 검증한다.

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

## 2026-09-27 v141 scene-led travel · #195

- Direct user instruction replaces the default travel RPG with a dialogue adventure. New owners:
  `travel-adventure.js`, `travel-adventure.css`, `data/travel-adventure-seoul-v1.js`.
- Four scenes per TOPIK I/II level: airport, train, station, lodging. Three dialogue turns, optional
  translation, clue, chosen reply, specific evidence/traps/method, retry and self-assessed recall.
- `malbitStoryV1.adventureV1` is additive. Keep old episodes/avatar/wallet/inventory/metrics and
  bank IDs. The old course is archived for users with records. Older backups without the new
  field retain it through `HARUMAL_ADVENTURE.mergeImport`; supplied adventure records restore.
- `scripts/travel-adventure-checks.mjs` verifies the new default; old mobile fixtures explicitly
  enter the archive. Reload readiness now observes the new document, not the departing DOM.
- Candidate CI `36278924981` passes 153/153 tests, the full mobile regression and tile asset check;
  console errors 0. Of 273 artifact images, the 16 adventure images were manually reviewed.
  PR #196 tracks the final merge gate; do not count all artifact images as manually reviewed.
- Evidence boundary and content map: `docs/qa/travel-adventure-v141.md`. Final CI, screenshots,
  deployment SHA and live checks: https://github.com/okometsbu-beep/topik-quest/issues/195.
  Live: https://okometsbu-beep.github.io/topik-quest/ ; rollback v140 main
  `adef36a5565a4260f8545ea6c7c2e6ee0fd7c255`.
- No official difficulty certification, physical-device/native educator/real learner retention
  result is claimed. No external tester invitation or personal-data collection occurred.
- Next: verify dialogue length, clue discovery and recall return. Do not resume #76 map expansion;
  this instruction and #110 learning-quality gates take precedence.

## 2026-09-27 v140 handwriting resume evidence

- Public v140 clean ja-JP Chrome completed the first grammar transformation, traced `한`, exited to
  Today, hard-reloaded, and re-entered Beginner → Grammar. It restored `1/8`, current `국`, and `2/8`;
  no product defect reproduced.
- PR #192 squash `33e5764577b1024b977a84facb651c51a6bfc7ef` locks the storage and browser contract.
  Local full checks pass 147/147; PR CI `36271774104` passes all four mobile widths in both themes.
  Its post-merge main run `36272108773` lost the Chrome target twice and is not a pass.
- PR #193 squash `6e9c868280aa14dd0e51acbc66be23d755b13a41` keeps all eight responsive assertions while
  retaining only representative 390px light/dark images. PR CI `36272553741`, final main CI
  `36272893017`, and Pages `36272892547` pass. Live v140 is HTTP 200 and its index,
  beginner-grammar runtime, and checker hashes match main.
- No runtime behavior, version, item, durable key, or learner record changed. Regression-only rollback
  is `a9835474d026a6a10de6b62439b021a9597cf71f`; product rollback remains v139
  `3b9626a642428f845c95f574d55fd4ec29361bd6`.
- Physical iPhone/Android, native Japanese/educator review, and real learner 10-minute/D1/D7 recall
  remain unverified. Next: complete the first grammar lesson and verify its completion marker and
  next-learning CTA advance to the next grammar rather than repeating the same item.

## 2026-09-26 하루말 v140 배포

- v139에서 ja-JP 입문 문법 변형 답안을 입력한 뒤 오늘로 이탈·hard reload·코스 재진입하면 초안이 사라지는 P1을 재현했다.
- 기존 `malbitBeginnerV1.grammarV1`에 문법별 초안만 추가 저장한다. 이탈·오답은 보존하고 정답 제출 때만 제거한다.
- PR #190 squash `cfb0209eac2f983abfc70c02eb3e5f02679da864`; 전체 146/146, v140 런타임 46개·은행 해시 통과.
- 최종 PR CI `36251060265`; artifact `10909650658` 255장 중 초안 복원 8조합을 직접 확인했다.
  최초 CI `36250924092`의 reload 대기 누락은 실패로 보존하며 제품 통과로 세지 않는다.
- main CI `36251490583`, Pages `36251490375`, 라이브 v140 HTTP smoke와 핵심 4자산 해시가 통과했다.
  공개 Chrome에서 `저는 한국어` 입력→이탈→hard reload→학습/입문/문법 재진입 뒤 동일 값을 확인했다.
- 데이터·문항·모드 불변. 복귀 기준은 v139 제품 `3b9626a642428f845c95f574d55fd4ec29361bd6`.
- 실제 iPhone/Android·일본어 모어 화자·실학습자 회상은 미검증이다. 손쓰기 재진입 위치는 위 2026-09-27 회귀 증거로 고정했다.

# MALBIT compact handoff

This is the short continuity record for future work. Use it with `AGENTS.md`; do not reconstruct
these facts from conversation history or the large TOPIK source bundle.

## Current user priority · learning renewal v132

The user explicitly authorized a major product/marketing/UI update. v132 is deployed through
PR #174 at c4045c8358acbfb505c9df01d70dbaa3c5e026e3. Historical checkpoint `2073709`
restores the prior environment's lost v132 work: goal-led Home, correct TOPIK session resume,
eight localized Travel coaches, and answer-hidden phrase practice with persisted drafts and
24-hour unaided / 10-minute assisted recall. Existing modes and durable roots remain intact.
The prior screenshot translation/readability repairs are included. Full-bank pedagogy is not complete.
Linux Node 24.19.0: quick 122/122, content 37/37, full 138/138, v132 runtime45, original bank hashes pass.
Branch CI 36073840735 at 69e2ad4 passes Ubuntu/Node 22/Chrome mobile emulation; artifact
10839034278 contains 174 screens. Home and recall at all four widths/two themes, Travel feedback
and Random Practice were inspected. Final review corrected a false morphological rejection of
뿐더러 using the National Institute of Korean Language dictionary; the same reported item now
has a focused ko/ja browser gate. Final PR CI 36075457096 passes (177 screens; authored Japanese
grammar meaning/glosses inspected). Main CI 36075858880 and Pages 36075858066 succeed.
Public Chrome 1363×936 verifies v132/48 script versions, ko/ja Home and beginner CTA→Hangul.
It also exposes pre-existing wide-screen Travel clipping: full-viewport map inside 560px parents.
Production v133 removes only RPG parent max-width and adds wide-screen hit-testing.
Local 138/138/runtime and same-session HTTP base3/runtime45 pass. CI 36076470585
lost its Chrome target; not a pass. Run 36076910462 passes the unchanged product code; artifact
10839744095 has 179 screens. Both wide themes and mobile Travel visuals inspected; four-width
mobile/preservation gates pass. PR #175 final CI 36077342411 passed before squash
cbbd1b5615f374a70708e4dde07000d942a2e8cc; main CI 36077673880 and Pages 36077673424 succeed.
Live v133: 48 scripts, all six HUD/direction hit-tests, clicking and arrow-key movement, NPC
conversation→correct answer→hidden-model writing→draft reload→comparison→24h recall notice pass.
Production v134 fixes only the RPG global keyboard router: focused native controls keep Enter/Space,
while map Enter/E still performs interaction. PR #177 CI 36089328672 passes 138/138 plus Chrome;
artifact 10845017916 contains 179 screens. Squash c15309cda11259e6f190f6cd5be9f5a6e0ae60c5,
main CI 36089816552 and Pages 36089816437 succeed. Public Chrome verifies v134/48 scripts,
language Enter/Space and map-back Enter; four core live assets match main by SHA-256. The first PR CI 36089091135 failed because its CDP touch
emulation did not synthesize native button clicks; it is not a pass. The final gate directly asserts
that focused controls are not prevented or rerouted and that map shortcuts remain consumed.
Production v135 re-clamps the camera from the mounted full-bleed viewport immediately and after layout.
PR #179 CI 36117974374 passes 138/138 plus Chrome; artifact 10856190822 has 181 screens and the
1363×936 initial light/resumed dark frames have no uncovered edge. Squash
e57a7769861c7fe34b839335f356f6e62deaee47; main CI 36118461882 and Pages 36118461431 pass.
Live v135 HTTP passes base3/runtime45 and four core assets match main by SHA-256. Runs 36116613167
and 36117009893 correctly failed while the gap remained; run 36117342467 passed camera coverage but
lost its Chrome target twice later and is not a pass.
Production v136 fixes one first-session P1: a clean Japanese browser previously inherited
the hard-coded Korean default. With no saved core state, the first supported value from
`navigator.languages` now selects ko/ja/en/zh and unsupported locales fall back to Korean. Any saved
language, vocabulary, game unlock, and other learner progress remains authoritative. A failing ja-JP
startup test preceded the fix. Local full checks pass 139/139 with runtime45 and bank hashes intact.
PR #182 was squash merged as 92286d97ad0496058a2f9b31125d870b0678205f. PR CI 36192414083
attempt 2, main CI 36193245892, and Pages 36193245705 pass. The first PR attempt failed the existing
Myeongdong reload assertion once; the unchanged rerun passed, so the first attempt is not counted as a
product pass. Final artifact 10888733726 has 183 screens; clean ja-JP first-visit light/dark frames were
inspected in the same candidate's successful push artifact 10888805318. Live HTTP reports v136 with
base3/runtime45, and index/site-patch/sw/legacy-core/home-visual-system match main by SHA-256. This is
emulation, not physical-device or native-speaker evidence. Narrow rollback: v135
e57a7769861c7fe34b839335f356f6e62deaee47.
Production v137 fixes the next first-session P1: beginner progress survived, but the last Hangul
sub-step did not, so a Japanese learner returning from consonants, writing, or reading landed on
vowels. The existing `malbitBeginnerV1` root now stores only an additive `activeTab`; no key, item ID,
or learner record was replaced. CI also exposed and then verified a related accessibility defect:
all four beginner tabs are now at least 44px high. Local full checks pass 141/141 with runtime45 and
bank hashes intact. PR #184 CI 36214614737 passes Ubuntu/Node22/Chrome at 320/375/390/430px in both
themes; artifact 10897265326 has 191 screens and the eight Japanese re-entry frames were inspected.
Squash 3f6b0cf39d57fbb6ef8569d36acbf14d05880d6f, main CI 36214920852, and Pages 36214920326 pass.
Live HTTP reports v137/base3/runtime45; index/site-patch/sw/app-polish-v33/app-polish-v34 match main.
Public Chrome restores `2. 子音`, `文字 1/20 習得`, learned `ㄱ`, and a 44px active tab after reload.
The failed CI runs remain evidence: 36214079062 found the small targets; 36214262897 and 36214515877
found reload-render races in the checker and are not product passes. Narrow rollback is v136
92286d97ad0496058a2f9b31125d870b0678205f. Next, if no P0 or answer error appears, verify one
Japanese beginner grammar transformation draft through exit/re-entry.
The synthetic QA flow is not a real learner result. Local and public HTTP checks are separate from browser interaction.
Whole-renewal rollback: v131 fadd25392e75f055c6deebf026ec77b8d597c96b. Narrow v137 rollback: v136.
See `docs/qa/learning-renewal-v132.md` and STATUS.
Native review, physical devices, and actual learner success/retention remain unverified.
`docs/qa/beginner-validation-protocol.md` now fixes the consent-safe execution contract: 12 adults,
10-minute first success, three-expression 10-minute/D1/D7 no-hint recall, next/review discovery,
physical iPhone/Android coverage, interventions, missing data, aggregate reporting, and a public-repo
raw-data ban. This is preparation only; no tester was contacted and no learner data was collected.
Starting the test requires explicit user approval of invitation/consent, private storage/access/deletion,
the D1/D7 reminder channel, and any recording (default none). Until then, continue only other safe #110
quality work and never substitute more question counts or synthetic users for learner evidence.

## Immediate user priority · #129

- Completed in v110 through PR #130. Product commit is `a0f852517ae72b3371ca9ab6c6fc3936c09ddda3`;
  v109 `b84e596129956e0e70328910c22917b9a8bfbb5c` is the rollback baseline.
- `writing-answers.js` defines schema 2 `{answers:{giyeok,nieun}}`, preserving `legacyText`.
  Labelled ㄱ/ㄴ strings split; unlabelled text stays in the first field with a migration notice.
- Owning core renders/binds two fields for 51/52, estimates each blank separately, and snapshots
  answers/model comparisons under existing `topikQuestV8.writingHistory` for Review.
- Product wrappers use per-field readiness; long-form 53/54 stays string-based.
- Recovery now counts `writingHistory` as durable core progress. A writing-only snapshot previously
  had zero weight and could be lost after an empty-core reset. Failing-then-passing coverage also
  verifies that a current writing history is not replaced by an older snapshot.
- Sep 12 follow-up: Node v24.19.0 focused 10/10, quick 95/95, full 110/110; local and live HTTP
  smoke pass base 3/runtime 45 at v110.
- Branch CI `34701329686` passed the repository's Linux Chrome gate at 320/375/390/430px in both themes:
  two keyed fields, touch input, independent save, reload restore, bounded score, split Review, and legacy notice.
  Artifact `10300595038` screenshots were inspected. This is emulation, not iPhone/Android hardware or real IME proof.
- PR and main CI `34702111845` passed. Its first main attempt lost the Chrome target; the unchanged rerun
  passed all 110 checks. Live public UI shows two labelled fields and preserves different ㄱ/ㄴ values after
  next/back navigation. Physical iPhone/Android and real IME remain unverified.

## Prior release history · 2026-09-23 (next-task notes below are historical)

- Source of truth: [release blueprint #110](https://github.com/okometsbu-beep/topik-quest/issues/110).
  It supersedes #76 map expansion until core learning quality gates pass. A01–A12 remain audit findings,
  not resolved items; existing feature/visual checks do not certify translation or teaching accuracy.
- Production v131 appends four bounded TOPIK I housework-action cards (`청소하다`, `빨래하다`,
  `설거지하다`, `요리하다`) without changing earlier IDs, the original bank, or Shorts storage.
  Production inventory is 404 rows / 278 exact families (I 140, II 138), with 126 redundant rows,
  30 duplicate groups, 15 structural candidates, 0 answer conflicts, and 0 approvals. Local focused
  vocabulary+inventory checks pass 34/34, content checks pass 37/37, and the full release check passes
  131/131 with the v131 45-file runtime contract. PR #172 evidence CI `35745761618` passes Linux
  Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first
  flow, and reload restoration. Artifact `10702339056` screens `00dm`/`00dn` were inspected. Final PR
  CI `35746609645` passed. PR #172 was squash merged as
  `fadd25392e75f055c6deebf026ec77b8d597c96b`; main CI `35747146849` and Pages
  `35747145718` succeeded. Live HTTP smoke reports v131 with 3 base + 45 runtime files, the four
  core assets match main, and all four new IDs are present. Public cloud Chrome verified Japanese
  wrong-answer feedback, the next CTA, and reload restoration. Physical devices, native review,
  learner timing, D1/D7 recall, audio, and full offline recovery remain unverified. Ledger:
  `docs/qa/shorts-review-s04-topik1-housework-actions.md`; product rollback is v130
  `bfc3f89121f3477a964f474ec378391b3c37dbf8`. With no new P0 or clear answer error, the next
  bounded task is a four-card TOPIK II shortage review because it has fewer reviewed exact sets
  (I 140, II 138).
- Production v130 appends four bounded TOPIK II change-adverb cards (`점차`, `일시적으로`,
  `지속적으로`, `급격히`) without changing earlier IDs, the original bank, or Shorts storage.
  Production inventory is 400 rows / 274 exact families (I 136, II 138), with 126 redundant rows,
  30 duplicate groups, 15 structural candidates, 0 answer conflicts, and 0 approvals. Local focused
  vocabulary+inventory checks pass 33/33, content checks pass 36/36, and the full release check passes
  130/130 with the v130 45-file runtime contract. PR #170 evidence CI `35682292167` passes Linux Chrome
  320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first flow,
  and reload restoration. Artifact `10675775494` screens `00dk`/`00dl` were inspected. Final PR CI
  `35683030397` passed. PR #170 was squash merged as `bfc3f89121f3477a964f474ec378391b3c37dbf8`;
  main CI `35683433183` and Pages `35683432875` succeeded. Live HTTP returns 200, and
  `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` hashes match main with all four
  new IDs present. Physical devices, native review, learner timing, D1/D7 recall, audio, and full
  offline recovery remain unverified. Ledger: `docs/qa/shorts-review-s04-topik2-change-adverbs.md`;
  product rollback is v129
  `8a33bd6025243187d3f569e3ddd85f432ed4cc94`.
- Production v124 separates an explicit comparison baseline (`-에 비해(서)`), a degree not inferior
  to the reference (`-에 못지않게`), equal degree (`-만큼`), and an extreme degree demonstrated by
  a result (`-(으)ㄹ 정도로`). It appends four stable IDs without changing the original bank or
  Shorts storage schema. Production inventory is 376 rows / 250 exact families (I 124,
  II 126), with 126 redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals.
  Node 24 focused vocabulary+inventory checks pass 27/27, content checks 30/30, and the full release
  check 124/124 with the v124 45-file runtime contract. Local Chrome/Chromium is unavailable. PR #158
  evidence CI `35434058774` passes Linux Chrome 320/375/390/430px light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10581702595` screens
  `00cy`/`00cz` were inspected. Final PR CI `35434477757` passed on an unchanged failed-job rerun after
  its first Chrome target closed. PR #158 was squash merged as `10bb264f48b75754c10456f33236d3352f6ba5a0`;
  main CI `35434734289` and Pages `35434733945` succeeded. Live HTTP smoke reports v124 with 3 base +
  45 runtime files. Public Chrome rendered the Japanese `-만큼` card, submitted a deliberate wrong answer,
  restored locked feedback after reload, and exposed the detailed evidence, traps, and reusable method.
  `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` hashes match main. Product rollback is
  v123 `cdefae5b00748f2df360f99050d66ea0c079495d`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik2-degree-comparison.md`; native review,
  learner timing/recall, physical devices, audio, and full offline recovery remain unverified.
- v111 adds four TOPIK I counters: `명` for people, `개` for general objects,
  `병` for bottles, and `권` for books/notebooks. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-counters.md`. Node 24 content 17/17, inventory 2/2, and full
  release checks 111/111 pass. PR #132 final CI `34735351694` passes the same 111/111 plus Linux Chrome
  emulation at 320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching and reload
  restoration. Artifact `10311116003` screenshots `00bx`/`00by` were inspected. The first attempt ended
  on external HTTP 429 and the second on an existing non-deterministic reload assertion; neither reproduced
  on the successful unchanged run. PR #132 was squash merged; main CI `34735492655` passed unchanged on
  rerun after its first Chrome target closed, and Pages `34735492297` succeeded. Live HTTP smoke reports
  v111 with 3 base + 45 runtime files; the four IDs and `data/shorts-levels.js` hash match main.
- Latest #110 instruction: C01–C06 content quality, first applied as S01–S05 Shorts, outranks A08/#76.
  S01 adds `docs/qa/shorts-audit.md`, generated ID/content-hash inventory and `scripts/audit-shorts.cjs`.
  Production v128 has 392 runtime rows but only 266 distinct question-choice sets (I 132, II 134),
  retaining 30 duplicate groups and 15 structural review candidates. Comprehensive content approvals
  remain 0/392, not 392 passed questions.
  Production v126 appends four stable TOPIK II stance-adverb IDs for `간신히`, `차라리`, `도무지`,
  and `미처`. It has 384 runtime rows / 258 exact sets (I 128, II 130), while the existing
  126 redundant rows, 30 duplicate groups, 15 structural candidates, and 0 approvals remain unchanged.
  Local focused checks pass 29/29, content 32/32, and full release 126/126. PR #162 CI `35501505213`
  passes Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching,
  next-first flow, and reload restoration. Artifact `10602636471` screens `00dc`/`00dd` were inspected.
  Final CI `35501808421`, main CI `35502032804`, and Pages `35502032361` passed. Live HTTP smoke and
  public-browser verification passed; product rollback was v125.
  Production v127 appends four stable TOPIK I wearing-action IDs for `입다`, `신다`, `쓰다`, and
  `끼다`. It has 388 runtime rows / 262 exact sets (I 132, II 130), while the existing
  126 redundant rows, 30 duplicate groups, 15 structural candidates, and 0 approvals remain unchanged.
  Local focused checks pass 30/30, content 33/33, and full release 127/127 with the v127 45-file
  runtime contract. PR #164 CI `35518597198` passes Linux Chrome 320/375/390/430px light/dark,
  Japanese wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. Artifact
  `10606903965` screens `00de`/`00df` were inspected. Final CI `35518989721`, main CI `35519244108`,
  and Pages `35519243649` passed. PR #164 was squash merged as
  `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`. Live HTTP and four core-asset hash checks passed;
  product rollback is v126.
  Production v128 appends four stable TOPIK II scope-relation IDs for `-을/를 제외하고`,
  `-을/를 대신해(서)`, `-에 관계없이`, and `-을/를 비롯해(서)`. It has 392 runtime rows / 266
  exact sets (I 132, II 134), while the existing 126 redundant rows, 30 duplicate groups, 15 structural
  candidates, and 0 approvals remain unchanged. Local focused checks pass 31/31, content 34/34, and
  full release 128/128 with the v128 45-file runtime contract. PR #166 evidence CI `35556820642` and
  final CI `35557160438` pass Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10621001103` screens `00dg`/`00dh`
  were inspected. PR #166 was squash merged as `6840bd478937ebb524f59ec8b68c203f41a1fb46`;
  main CI `35557469515` and Pages `35557469072` passed. Live HTTP, four core-asset hash checks, and
  public-browser verification passed; product rollback is v127. Production v129 adds four bounded
  TOPIK I transit-action sets at `8a33bd6025243187d3f569e3ddd85f432ed4cc94`; PR #168 final CI,
  main CI, Pages, live smoke, core-asset hashes, and public-browser verification passed. Product rollback
  is v128, and the next bounded task is a four-card TOPIK II shortage review.
  Audit-only curated IDs must NOT replace saved numeric indices without the S03 migration contract.
- Production v123 extends the bounded S04 lane with four TOPIK I basic-negation cards (`안`, `못`,
  `아니에요`, `없어요`). It uses stable IDs, fixed choice-specific ko/ja/en/zh feedback, bundled
  examples, and evidence→traps→negation-role coaching. Production inventory is 372 rows / 246 exact
  families (I 124, II 122), with 15 structural flags unchanged. Node 24 focused vocabulary+inventory
  26/26, content 29/29, full release 123/123, and the v123 45-file runtime contract pass. PR #156 CI
  `35417933793` covers 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded
  coaching, next-first flow, and reload restoration. Artifact `10576448286` screens `00cw`/`00cx` were
  inspected; final PR CI `35418170909` also passed. PR #156 was squash merged as
  `cdefae5b00748f2df360f99050d66ea0c079495d`; main CI `35418404159` and Pages `35418403561`
  succeeded. Live HTTP smoke reports v123 with 3 base + 45 runtime files. Public Chrome rendered the
  Japanese `없어요` card, submitted a deliberate `못` error, restored locked feedback after reload,
  and exposed the detailed evidence, traps, and reusable method. `index.html`, `site-patch.js`, `sw.js`,
  and `data/shorts-levels.js` hashes match main. Local Chrome/Chromium and physical devices remain
  unavailable. Product rollback is v122 `16048fd8f67700f96575d85119614a0db3e8a9cc`. The bounded ledger
  is `docs/qa/shorts-review-s04-topik1-basic-negation.md`.
- Production v121 extends the bounded S04 lane with four TOPIK I polite-interaction cards that
  distinguish an item request, positive action request, prohibition, and shared suggestion. It uses
  stable IDs, fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→speech-goal
  coaching. Production inventory is 364 rows / 238 exact families (I 120, II 118), with 15 structural
  flags unchanged. Its bounded ledger is `docs/qa/shorts-review-s04-topik1-polite-interaction.md`.
- Production v122 extends the bounded S04 lane with four TOPIK II formal-relation marker cards. It uses
  stable IDs, fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→noun-role
  coaching. Production inventory is 368 rows / 242 exact families (I 120, II 122), with 15 structural
  flags unchanged. Its bounded ledger is `docs/qa/shorts-review-s04-topik2-formal-relation.md`.
- S03 v101 (PR #120) migrates schema-2 numeric Shorts progress to stable card/family IDs without
  replacing `topikQuestShortsV1`. It cycles 162 exact question-choice families before intentional repeats,
  prioritizes newly added families, avoids the current/recent family, and labels exhausted-cycle items as review.
  Original 288 rows, answers, mock placement and all learner roots remain unchanged. Node quick 83/83 and PR CI
  `34494776380` passed; direct Linux Chrome evidence covers 320/375/390/430px light/dark, cycle exhaustion,
  visible Japanese review disclosure and reload restoration.
- S04 v102 adds four TOPIK I time-adverb cards with explicit stable IDs, fixed reviewed choice sets,
  concise selected-choice feedback and optional evidence→traps→method coaching in ko/ja/en/zh. Inventory and
  automated/AI review details are in `docs/qa/shorts-review-s04-time.md`; human review and learner timing stay open.
  Local Node v24 and branch CI `34532452034` pass 97/97; that CI also covers Linux Chrome emulation at
  320/375/390/430px in both themes, concise wrong-answer recovery, expanded coaching and reload restoration.
  Bundled ko/ja/en/zh examples render without network translation. Physical devices remain unverified.
- S04 v103 adds four TOPIK II connective-adverb cards for result, contrast, addition and limiting
  condition. Each uses one short relation judgment, fixed reviewed choices, choice-specific ko/ja/en/zh feedback,
  bundled full examples, and evidence→traps→method coaching. The bounded review ledger is
  `docs/qa/shorts-review-s04-topik2-linkers.md`. Local Node 22 and PR #122 CI `34557440568` pass 98/98;
  that CI also covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong feedback,
  expanded coaching and reload restoration. Physical devices and learner timing remain unverified.
- S04 v104 adds four TOPIK II cause/concession grammar cards that distinguish bad cause, beneficial cause,
  actual contrary result, and hypothetical concession. Each uses one short two-axis judgment, fixed reviewed choices,
  choice-specific ko/ja/en/zh feedback, bundled full examples, and evidence→traps→method coaching. The bounded review
  ledger is `docs/qa/shorts-review-s04-topik2-cause-concession.md`. Focused inventory checks pass 8/8,
  content checks 11/11, and local Node 22 plus PR #123 CI `34583234297` full release checks pass 99/99.
  That CI covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Physical devices and learner timing are unverified.
- S04 v105 adds four TOPIK II inference/evidence grammar cards that separate an observed-clue guess,
  open possibility, strong certainty, and speaker intention followed by a request. Each has a stable ID, fixed
  choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→method coaching. The bounded review
  ledger is `docs/qa/shorts-review-s04-topik2-inference-evidence.md`. Focused checks pass 9/9, local Node 22 and
  PR #124 CI `34586448188` pass 100/100. That CI covers 320/375/390/430px Linux Chrome emulation in both themes,
  selected-wrong feedback, expanded coaching, next-first flow and reload restoration. Physical devices,
  native-language review and learner timing remain unverified.
- S04 v106 adds four TOPIK I everyday-location word cards that distinguish across a road, directly
  beside one place, between two places, and the nearby area. Each has a stable ID, fixed choice-specific
  ko/ja/en/zh feedback, bundled examples, and evidence→traps→reference-point/distance coaching. The bounded
  review ledger is `docs/qa/shorts-review-s04-topik1-location.md`. Focused data and inventory checks pass 10/10,
  while local Node 22 and PR #125 CI `34615296081` full checks pass 101/101. That CI covers 320/375/390/430px
  Linux Chrome emulation in both themes, selected-wrong feedback, expanded coaching, next-first flow and reload
  restoration. Physical devices, native-language review and learner timing remain unverified.
- S04 v107 adds four TOPIK II reported-speech grammar cards that distinguish statements/facts,
  questions, commands/requests, and suggestions to act together. Each has a stable ID, fixed choice-specific
  ko/ja/en/zh feedback, bundled examples, and evidence→traps→original-sentence-function coaching. The bounded
  review ledger is `docs/qa/shorts-review-s04-topik2-reported-speech.md`. Focused data/inventory checks pass
  11/11, content checks pass 14/14, and local Node 22 plus PR #126 CI `34647756064` full release checks
  pass 102/102. That CI rerun covers 320/375/390/430px Linux Chrome emulation in both themes,
  selected-wrong feedback, expanded coaching, next-first flow and reload restoration.
  Physical devices, native-language review and learner timing remain unverified.
- S04 v108 adds four TOPIK I frequency-adverb cards that separate every time, high frequency,
  some occasions, and zero degree/frequency with a negative expression. Each has a stable ID, fixed
  choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→frequency-scale coaching.
  The bounded review ledger is `docs/qa/shorts-review-s04-topik1-frequency.md`. Focused data/inventory checks
  pass 12/12, content checks pass 15/15, and local Node 22 plus PR #127 CI `34669739020` full release checks
  pass 103/103. That CI covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong
  feedback, expanded coaching, next-first flow and reload restoration.
  Physical devices, native-language review and learner timing remain unverified.
- S04 v109 added four TOPIK II state/change grammar cards that separate a circumstance-led new action,
  adjective quality change, action in progress, and the remaining result state of a completed action. Each has a
  stable ID, fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→state-function
  coaching. The bounded review ledger is `docs/qa/shorts-review-s04-topik2-state-change.md`. Focused data and
  inventory checks pass 13/13, content checks pass 16/16, and local Node 24 full checks pass 104/104.
  PR #128 CI `34671148823` rerun also passes 104/104 and covers 320/375/390/430px Linux Chrome
  emulation in both themes, selected-wrong feedback, expanded coaching, next-first flow and reload restoration.
  Its first attempt ended only on an unrelated external-resource HTTP 429; the unchanged rerun passed.
  Physical devices, native-language review and learner timing remain unverified.
- S04 v112 adds four TOPIK II condition-relation grammar cards that distinguish an actual-event
  condition followed by a request, a necessary prerequisite, an undecided supposition, and a warning about
  continuing behavior. Each has a stable ID, fixed choice-specific ko/ja/en/zh feedback, bundled examples,
  and evidence→traps→following-clause coaching. The bounded review ledger is
  `docs/qa/shorts-review-s04-topik2-conditions.md`. Focused data checks pass 13/13 and inventory checks pass 2/2;
  full release checks pass 112/112. PR #134 final CI `34765253730` passes the same checks plus Linux Chrome
  emulation at 320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching and reload
  restoration. Artifact `10320915051` screenshots `00bz`/`00cb` were inspected. PR #134 was squash merged as
  `b42d0759a6b98c363f77f6ac72be527e742e8707`; main CI `34765463888` and Pages `34765463632` succeeded.
  Live HTTP smoke reports v112 with 3 base + 45 runtime files, and the four IDs plus
  `data/shorts-levels.js` and `site-patch.js` hashes match main. Local Chrome was unavailable; this evidence is CI
  emulation, not physical iPhone/Android. Product rollback is v111
  `5cbb6773f9cb78c6ab4bd6791165841126038707`.
- S04 v113 adds four TOPIK I question-word cards that distinguish a person, a place, a day/time,
  and a price/amount. Each has a stable ID, fixed choice-specific ko/ja/en/zh feedback, bundled examples,
  and evidence→traps→target-category coaching. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-question-words.md`. Node 24 content checks pass 19/19 and full release
  checks pass 113/113. PR #136 CI `34783191274` passes the same 113/113 plus Linux Chrome emulation at
  320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching, next-first flow and reload
  restoration. Artifact `10325594505` screens `00cc`/`00cd` were inspected. Final PR CI `34783447830`
  also passed. PR #136 was squash merged as `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`;
  main CI `34783696587` passed on unchanged rerun after its first Chrome target closed, and Pages
  `34783696240` succeeded. Live HTTP smoke reports v113 with 3 base + 45 runtime files; the four IDs plus
  `data/shorts-levels.js` and `site-patch.js` hashes match main. Product rollback is v112
  `b42d0759a6b98c363f77f6ac72be527e742e8707`.
- v114 adds four TOPIK II completion/experience grammar cards that distinguish total completion,
  a final result after a long process, past experience, and preparation completed and kept ready. Stable IDs,
  fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→post-action coaching are
  recorded in `docs/qa/shorts-review-s04-topik2-completion-experience.md`. Node 24 focused content checks pass
  20/20, inventory checks pass 2/2, and full release checks pass 114/114. PR #138 CI `34826401968` unchanged
  rerun passes 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching,
  next-first flow and reload restoration with 104 screenshots and zero browser errors. The first attempt stopped
  at the pre-existing state-change reload assertion before the new cards; artifact `10339933219` screens
  `00ce`/`00cf` from the unchanged passing run were inspected. Final PR CI `34827184679` also passed;
  PR #138 was squash merged as `655f8715fc080a9e14b7cea00d34b0a0911a099c`. Main CI `34827681146`
  and Pages `34827680006` succeeded. Live HTTP smoke reports v114 with 3 base + 45 runtime files; all
  four IDs plus `data/shorts-levels.js` and `site-patch.js` hashes match main. Product rollback is v113
  `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`. Physical devices, native-language review and learner
  timing are unverified.
- Production v115 adds four TOPIK I particle-role cards that distinguish a movement destination, an action
  location, a means or method, and a human recipient. Stable IDs, fixed choice-specific ko/ja/en/zh feedback,
  bundled examples, and evidence→traps→verb-plus-noun-role coaching are recorded in
  `docs/qa/shorts-review-s04-topik1-particles.md`. Node 24 content checks pass 21/21, inventory checks pass
  2/2, and full release checks pass 115/115. PR #140 final CI `34861683365` passes 320/375/390/430px Linux
  Chrome emulation in both themes, selected-wrong feedback, expanded coaching, next-first flow and reload
  restoration. Artifact `10354814262` screens `00cg`/`00ch` were inspected. An earlier concurrent push run
  failed only at the unrelated Travel 390x844 step while the unchanged PR run passed; the final run with the
  particle-specific visual contract passed. PR #140 was squash merged as
  `05e84b401330074bf3432339859169cc156d6357`; main CI `34862095120` and Pages `34862094068`
  succeeded. Live HTTP smoke reports v115 with 3 base + 45 runtime files, and all four IDs plus
  `data/shorts-levels.js` and `site-patch.js` hashes match main. Product rollback is v114
  `655f8715fc080a9e14b7cea00d34b0a0911a099c`. Physical devices, native-language review and learner
  timing are unverified.
- Production v116 adds four TOPIK II action judgment/constraint cards that distinguish no remaining
  alternative, worth doing, required action, and unnecessary action. Stable IDs, fixed choice-specific
  ko/ja/en/zh feedback, bundled examples, and evidence→traps→action-judgment coaching are recorded in
  `docs/qa/shorts-review-s04-topik2-judgment-constraint.md`. Node 24 content checks pass 22/22 and inventory
  checks pass 2/2, and full release checks pass 116/116. PR #142 final CI `34925330780` passes
  320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching, next-first flow
  and reload restoration. Artifact `10380265217` screens `00ci`/`00cj` were inspected. Two earlier
  documentation-head attempts raced by finding an earlier card's restored feedback element before its text
  rendered; the verification harness now waits for non-empty content. PR #142 was squash merged as
  `0b93456fc400ff47b378c6e15b1384bc6187e8f2`; main CI `34925644900` and Pages `34925644352`
  succeeded. A cache-bypassed public Chrome load used runtime scripts at `?v=116`; the public
  `data/shorts-levels.js` contained all four IDs and terms. Product rollback is v115
  `05e84b401330074bf3432339859169cc156d6357`. Local Chrome, physical devices, native-language review,
  learner timing and delayed recall remain unverified.
- Production v117 adds four TOPIK I
  demonstrative cards for `이것·그것·저것·어느 것`, mapping speaker-near, listener-near/already-mentioned,
  far-from-both, and choose-among-many to Japanese `これ·それ·あれ·どれ`. Stable IDs, fixed
  choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→object-relation coaching are
  recorded in `docs/qa/shorts-review-s04-topik1-demonstratives.md`. Focused vocabulary and generated-inventory
  checks pass 20/20, content checks pass 23/23, and the full Node 24 release check passes 117/117. Production
  inventory is 348 rows / 222 exact sets, with no increase to 126 redundant rows,
  30 duplicate groups, 15 structural flags, or zero answer conflicts. PR #144 CI `34986620849` passes
  117/117; its 320/375/390/430px Linux Chrome
  light/dark run also covers selected-wrong feedback, expanded coaching, next-first flow and reload restoration.
  Artifact `10403494820` screens `00ck`/`00cl` were inspected. The prior run `34986362108` stopped before
  browser checks because the connector upload truncated the generated inventory JSON; replacing that blob
  with exact local bytes made the remote and locally checked trees identical. Final evidence-only PR CI
  `34987279723` also passed. PR #144 was squash merged as
  `a14dd083f3afd64142990ae1d829df985cbf8db3`; main CI `34987826662` and Pages `34987825941`
  succeeded. Live uses `?v=117`, loads 3 base + 45 runtime files, exposes the four stable IDs, and matches
  main SHA-256 for `data/shorts-levels.js`, `site-patch.js`, and `sw.js`. Product rollback is v116
  `0b93456fc400ff47b378c6e15b1384bc6187e8f2`. Physical devices, native-language review, learner timing,
  delayed recall, audio and full offline recovery remain unverified.
  Quantity alone is not progress, and a new P0 or clear
  wrong answer takes precedence. At least 28 I / 30 II additional distinct sets remain even before suitability review for the 140/level
  planning floor; this is not the final expansion target. Timing 5–15 seconds is unmeasured and never forced.
- Production v118 adds four TOPIK II plan-stage cards separating considering, personal intention,
  an already-made decision, and a fixed schedule. Focused content 24/24, inventory 2/2, and full release
  118/118 pass on Node 24. PR #146 final CI `35051427873` passes the same checks plus
  320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching, next-first flow,
  and reload restoration. Artifact `10429495520` screens `00cm`/`00cn` were inspected. PR #146 was
  squash merged as `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`; main CI `35051754654` and
  Pages `35051754080` succeeded. A cache-bypassed public Chrome load uses `?v=118`, exposes all four
  stable IDs, and matches main SHA-256 for `data/shorts-levels.js`, `site-patch.js`, and `sw.js`.
  Product rollback is v117 `a14dd083f3afd64142990ae1d829df985cbf8db3`. Physical devices,
  native-language review, learner timing, and delayed recall remain unverified. The bounded ledger is
  `docs/qa/shorts-review-s04-topik2-plan-stage.md`.
- Production v119 adds four TOPIK I basic-tense cards. They separate a repeated present habit, completed past action,
  action in progress, and future plan using `매일 아침·어제·지금·내일` as decisive cues. Production inventory is 356 rows / 230
  exact sets (I 116, II 114) with no new duplicate, structural flag, or answer conflict. Node 24 focused
  vocabulary+inventory 22/22, content 25/25, full release 119/119, and v119 runtime 45-file checks pass.
  PR #148 CI `35203602934` passes the same checks plus 320/375/390/430px Linux Chrome light/dark,
  selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10489585088`
  screens `00co`/`00cp` were inspected. Final PR CI `35204050921` passed on unchanged retry after the existing
  Travel Chrome target closed once. PR #148 was squash merged as `584b42f86b062eb18932aac541ed2ffcfc3b723d`;
  main CI `35204749013` and Pages `35204747120` succeeded. Live HTTP smoke reports v119 with 3 base + 45
  runtime files. Public Chrome entered Shorts, submitted a wrong answer, and restored locked feedback after reload;
  the four IDs are public and `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` hashes match main.
  Product rollback is v118 `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-basic-tense.md`. Physical devices, native-language review, learner timing,
  delayed recall, audio, and full offline recovery remain unverified. Do not treat added quantity as educational approval.
- Production v120 adds four TOPIK II time-relation cards separating immediate succession, a later action after
  completion, overlapping actions, and an action before its reference event. Production inventory is 360 rows / 234
  exact sets (I 116, II 118), with no new duplicate, structural flag, or answer conflict. Node 24 focused
  vocabulary+inventory 23/23, content 26/26, full release 120/120, and v120 runtime 45-file checks pass.
  PR #150 CI `35275144430` covers 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10520142804` screens `00cq`/`00cr`
  were inspected; final PR CI `35275712725` also passed. PR #150 was squash merged as
  `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`; main CI `35276178355` and Pages `35276177552`
  succeeded. Live v120 loads 3 base + 45 runtime files, exposes all four stable IDs, and restores locked
  wrong-answer feedback after reload. Product rollback is v119 `584b42f86b062eb18932aac541ed2ffcfc3b723d`.
  The bounded ledger is `docs/qa/shorts-review-s04-topik2-time-relation.md`. Physical devices,
  native-language review, learner timing, delayed recall, audio, and full offline recovery remain unverified.
- Production v121 adds four TOPIK I polite-interaction cards separating an item request, positive action request,
  prohibition, and shared suggestion. Production inventory is 364 rows / 238 exact sets (I 120, II 118), with
  no new duplicate, structural flag, or answer conflict. Node 24 focused vocabulary+inventory 24/24, content
  27/27, full release 121/121, and v121 runtime 45-file checks pass. PR #152 CI `35328201976` covers
  320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching, next-first flow,
  and reload restoration. Artifact `10539553980` screens `00cs`/`00ct` were inspected; final PR CI
  `35328740574` also passed. PR #152 was squash merged as
  `4ab4628791d4524f6f9cb88b813a84e010bbe922`; main CI `35329196677` and Pages `35329196286`
  succeeded. Public Chrome loads v121 scripts, renders TOPIK I Shorts choices, and exposes all four stable IDs
  in `data/shorts-levels.js?v=121`. Product rollback is v120
  `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-polite-interaction.md`. Physical devices, native-language review,
  learner timing, delayed recall, audio, and full offline recovery remain unverified.
- Production v122 adds four TOPIK II formal-relation marker cards separating information source, varying
  standard, means/channel, and passive agent/formal cause. Production inventory is 368 rows / 242 exact sets
  (I 120, II 122), with no new duplicate, structural flag, or answer conflict. Node 24 focused
  vocabulary+inventory 25/25, content 28/28, full release 122/122, and v122 runtime 45-file checks pass.
  PR #154 CI `35360830953` covers 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10554394352` screens `00cu`/`00cv`
  were inspected; final PR CI `35361581234` also passed. PR #154 was squash merged as
  `16048fd8f67700f96575d85119614a0db3e8a9cc`. Main CI `35362016106` passed on an unchanged failed-job
  rerun after the existing Travel 390×844 browser step failed once; Pages `35362015443` succeeded.
  Public Chrome loads v122 with 3 base + 45 runtime scripts, exposes all four stable IDs, and restores locked
  Japanese wrong-answer feedback after reload. The public `index.html` hash matches main. Product rollback is
  v121 `4ab4628791d4524f6f9cb88b813a84e010bbe922`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik2-formal-relation.md`. Physical devices, native-language review,
  learner timing, delayed recall, audio, and full offline recovery remain unverified.
- Current one task after checking new P0 and clear wrong-answer reports: review one bounded four-card
  TOPIK I missing-type set, because its 124 distinct sets trail TOPIK II's 126. Do not treat added
  quantity as educational approval.
- Follow start → understand → recall/speak/write → review → next learning for Japanese beginners, and
  passage evidence → specific distractor traps → reusable solving method for TOPIK I/II.
- 2026 draft gates: Sep 13 audit/scope/dependencies; Sep 27 core flow/P0/P1/backup; Oct 11 teaching,
  language, review and one RPG course; Oct 18 freeze/RC; Oct 19–Nov 2 real beta; Nov 2–15 review buffer.
  Nov 17 is conditional first public release, Dec 1 a fallback review date, not a promised approval.
- Report evidence and gaps at each weekly gate. #110's 12-person beta targets (10 first-step successes,
  9 next/review discoveries) are small-sample goals, never QA-seed statistics or industry benchmarks.
  Actual day-1/day-7 recall, real iPhone/Android evidence, and approved post-release 14-day stability remain open.
- Autonomous publishing is GitHub Pages only. Store accounts/payment/identity, signing keys, external
  tester invitations, personal-data collection, store submission and publication need separate owner approval.
  Stop on PAUSE. Only pause the recurring loop for owner stop, all-work blockage, or completed #110 gates.
- Current-pass checks, documentation PR/merge and live verification belong in #110's progress comment.
  Unseen states and unrun tests must remain unverified, including corpus-wide translation completeness,
  corpus-wide explanation and grammar correctness, A06/A07 physical-mobile reproduction, actual iPhone/Android, audio, offline recovery,
  and real learner delayed recall. Corpus-wide grammar-translation correctness remains unverified beyond A05.

## Stable product state

- Production is a dependency-free static PWA in `okometsbu-beep/topik-quest`, hosted on GitHub
  Pages. It must remain usable without login.
- Browser progress is local-first. Existing storage keys, saved questions, vocabulary, review
  intervals, game state, and settings are compatibility contracts.
- The runtime bank contains 2,144 original practice items: the immutable 2,088-item generated bank
  plus 56 type-focused items in `data/question-bank-practice-v1.js`. Generated bank parts are build
  output and must not be opened or edited for non-content work.
- Travel Mode is an independent Seoul learning-adventure below Game Mode and cannot overwrite a
  timed mock exam. Its first route is Incheon Airport T1 → Seoul Station → Myeongdong.
- Travel scenes compose generated pixel-art backgrounds, player skins, NPCs, props/rewards, and UI
  tiles as separate layers. Do not bake characters into backgrounds or replace travel art with emoji;
  keep localized and accessible text as HTML above the generated surfaces.
- Travel exploration uses `data/travel-map-seoul-v1.js` for world/district/zone/collision/POI/portal data
  and the DOM-free `travel-rpg-engine.js` for movement. Add Seoul one verified zone and portal at a time;
  never duplicate the engine inside a route pack or draw the whole city as one untestable canvas.
- The first spatial slice has separate Incheon Airport T1 Arrivals, Transport Center, and Airport Railroad
  Concourse zones joined by bidirectional portal connections. Player zone, position, facing, steps, and discovery IDs are stored
  under the existing route episode's `exploration` field in `malbitStoryV1`; rewards are one-time.
- Beginner missions follow situation → action → visible world reaction → reward or recoverable time
  cost. The first route varies the input as dialogue, sign hotspot, and ticket-machine action instead
  of presenting six visually identical worksheets.
- Hangul Start keeps its existing reading and recognized-handwriting progress in `malbitBeginnerV1` and
  adds grammar only under the nested `grammarV1` field. `data/beginner-grammar-v1.js` owns a reviewed
  9-chapter, 64-lesson absolute-beginner course covering word order, particles, tense, speech endings,
  negation, connective endings, modifiers, 받침-dependent selection, contraction, honorifics, counters,
  and major irregular conjugations. Every lesson must show the condition and contrasting form branches,
  original examples, a common trap, a typed transformation drill, and per-Hangul-unit handwriting; both
  practices are required for completion. Keep Korean/Japanese/English/Chinese coaching in the data owner.
- Before grading, Travel answer choices expose Korean only; the selected and correct translations are
  revealed afterward. NPC quests use multi-turn dialogue, and free composition accepts a reviewed set
  of meaningful non-canonical sentences for a limited smaller reward.
- The first airport NPC lesson saves a five-turn Korean exchange, requested-only translation, the first
  wrong keyword, and two progressive hint stages inside the existing route episode. Re-entry resumes the
  same turn; a hinted resolution remains an honest missed first attempt for score and review.
- Arrivals owns one independent 3×4-tile cheongsachorong welcome prop. Its two collision cells are declared
  with the visual, its investigation teaches `어서 오세요` without treating `어서` as a hurry command,
  and its 200-travel-won reward is idempotent under the existing discovery contract.
- Bank, Game, and Travel explanations follow evidence → distractor/selected-choice analysis → reusable
  type-solving tip. TOPIK II writing uses separate short-fill, expository-fill, graph-summary, and essay
  plans. Game battle rendering must not force `scrollIntoView` or smooth page scrolling.
- Myeongdong follow-ups now progress from free NPC composition to Hangul sign building and a Korean
  price-board budget quest. The budget quest uses only game travel won, records one idempotent
  `street-food` spend under `malbitStoryV1`, and states that stall prices can vary.
- Travel Mode keeps privacy-free local funnel counters under `malbitStoryV1.metrics`: route starts,
  first completions, first Myeongdong entries, first collectible-exchange sessions, and the Myeongdong
  price quest's starts, first clears, pre-clear wrong submissions, and aggregate wallet-after-clear.
  The on-device Travel card shows derived rates and average remaining travel won; no event, identifier,
  timestamp, device detail, or counter leaves the browser.
- Travel UI follows the saved system/light/dark preference. Do not force `colorScheme`, paint a whole mode
  bright, or use a near-black placeholder tile as scenery. Map art stays unfiltered while cards, controls,
  text, borders, and focus states use theme tokens. Every UI change must pass both Travel themes plus
  320/375/390/430px containment, symmetry, 44px touch-target, console, and durable-storage checks.
- Travel zones use a 48×36, 25px tile contract. Every ground cell references an explicit catalog entry
  with atlas coordinates, terrain, walkability, and layer; the browser paints individual tiles and never
  a full-map `<img>`. Legacy 12×9 saved coordinates migrate once to version 2 without changing the storage key.
- `data/travel-tiles-korean-street-v1.js` owns the first reusable Seoul streetscape catalog independently
  from the airport migration maps. Its 4×4 WebP atlas contains 16 64px source tiles for sidewalks, roads,
  straight curb boundaries, crosswalks, tactile paving, and lane marks. Every entry declares terrain,
  walkability, orientation, ground layer, and four edge materials; a non-playable 12×8 fixture is the
  mobile seam/theme gate and must not be added to `world.zones` as a shortcut.
- Purpose-named corner and junction sibling catalogs extend that foundation without changing the airport
  world. The corner sheet owns four inner and four outer turns; the junction sheet owns four oriented T
  centers, four cross variants, approaches, and a 20×12 all-entry fixture. T centers expose three road
  exits plus one closed sidewalk edge, while cross centers expose four traversable exits.
- The building-entrance sibling catalog owns thresholds, stairs, step-free ramps, and transparent upper
  facades. A separate decoration sibling catalog owns 16 text-free signs, awnings, planters, and street
  details. Every decoration declares its actor baseline, upper occlusion, and collision footprint; only
  seven floor-standing props block one cell. Both catalogs remain isolated from playable airport zones.
- `data/travel-block-korean-street-v1.js` composes a non-playable 12×10 Seoul block using only IDs from
  the five reusable catalogs. Its validator resolves each catalog-owned edge, walkability, upper baseline,
  and collision footprint; it rejects unknown IDs, broken named routes, invalid ports, and footprint drift.
- The same owner composes isolated 12×10 blocks east-to-west, north-to-south, and as a four-block
  2×2 grid. Its adjacency validator rejects
  overlapping blocks, mismatched full seams, reused or non-adjacent ports, non-opposing directions,
  different materials, non-walkable endpoints, incomplete internal links, and reused external exit
  coordinates while keeping every fixture out of playable zones.
- Travel movement keeps the live tile and sprite DOM in place for a 110ms player step and 160ms camera
  follow. Pointer-held SVG direction controls repeat until release, blocked movement stops silently, and
  reduced-motion devices settle immediately without map opacity, filter, or brightness changes. The five
  map controls and their SVG children suppress iOS callout, selection, and drag while ordinary learning
  copy remains selectable.
- Travel exploration stores a versioned 10,000-step stamina record inside the existing episode
  `exploration` field. Only successful movement spends stamina; blocked input is free and exhausted input
  is ignored. At 0%, a separate unfiltered 4:3 rest-lounge image owns the full-height game-over screen.
  One-hour rest resets only stamina and position to the current zone spawn while retaining discoveries,
  rewards, route answers, wallet, inventory, and lifetime exploration steps.
- The default `traveler-blue` skin owns one optimized transparent 8×4 sprite sheet. Rows are
  down/left/right/up; columns 0–3 are a 4fps idle loop and 4–7 are a 12fps walk loop. Every frame uses
  the same `.5,.9375` foot anchor and one preloaded image URL, so movement must not swap `src`, opacity,
  filter, or brightness. Player and visible NPC containers share the same near-one-tile scale; NPC art
  has an idle loop. Clear/perfect reward skins intentionally keep the prior static fallback.
- Travel exploration is map-first: the 4:3 world stays aspect-correct at full viewport height, the camera
  follows both axes around interior tiles with 1.2× vertical overscan, and location, objective, travel
  status, D-pad, and interaction controls are compact overlays. Viewport resizing snaps camera bounds
  before restoring movement interpolation so no empty edge flashes. Investigation copy expands only
  while a discovery is open.
- Travel zones declare upper-foreground silhouettes, object baselines, and collision cells together.
  Ground, foot-depth actors, and upper foreground render as separate DOM layers; signs, kiosks, ticket
  gates, machines, and planters reuse exact pixels from the unfiltered map rather than a dark overlay.
  The entire world is an isolated stacking context below HUD controls, so scaled Y-depth cannot cover UI.
- Player and visible NPC contact shadows render in their own layer between ground and actors. Each
  shadow shares the actor's foot coordinate and depth, stays the same DOM node through movement, and
  uses a small bounded pixel oval instead of a baked image filter or scene-wide dark paint.
- Each Travel zone can declare bounded lamp, screen, or window highlights with position, size, color,
  and strength. They render in a separate environment layer between ground and contact shadows;
  validation rejects out-of-bounds effects, opacity above 0.65, and mobile coverage large enough to
  become a scene-wide tint. The original map, actors, and foreground remain unfiltered.
- Travel world data owns the mobile performance budget: at most 1,728 ground tiles, 256 upper tiles,
  and 2,048 live board DOM nodes per zone. The real-Chrome movement probe samples 47 animation frames
  and rejects p95 above 34ms or more than 15% of frames above 50ms.
- Travel exploration exposes one reusable cue plan for portal enter/arrive, investigation discovery,
  first reward, NPC entry, and return. Each 70–220ms state animates only the active control, marker,
  reward text, or location HUD; the map and viewport never receive opacity, brightness, or filter
  animation. `MALBIT_TRAVEL_CUE_HOOKS` is an opt-in adapter boundary: sound and vibration callbacks are
  ignored unless their individual booleans are explicitly enabled, and reduced-motion settles at once.
- Game Mode now uses semantic spacing, type, surface, border, and accent tokens through the purpose-named
  `game-visual-system.js` final owner. Equipment, rarity, stage, run-slot, and map-node tiles follow the
  saved system/light/dark preference and must stay readable rather than near-black. CI checks both themes
  at 320/375/390/430px for symmetry, overflow, 44px controls, 10px copy, contrast, and screenshot evidence.
- Home uses the same semantic contract through `home-visual-system.js`. The hero remains scenic, while
  level controls, Quick Practice, full mock, speaking, weekly-goal, and bottom-navigation surfaces resolve
  to white cards only in light mode and navy surfaces in dark mode. CI rejects a mixed light/dark shell.
- Shorts uses `shorts-visual-system.js` as the final visual owner for question, choice, graded feedback,
  instructor coaching, and save-proposal surfaces. All use the shared theme tokens; CI checks light and dark
  unanswered/graded cards at all four widths while preserving coaching and the existing progress root.
- Random Practice uses `random-practice-visual-system.js` as the final visual owner for both TOPIK I and II
  headers, stats, questions, choices, graded states, translations, and expandable coaching. These resolve
  through the same light/dark surface and state tokens; CI checks both themes without changing stored sessions
  or the Japanese evidence → distractor → type-solving structure.
- Review uses `review-visual-system.js` as the final visual owner for its TOPIK I/II filter, queue, retry sheet,
  requested translation, graded state, and detailed option elimination. Queue and sheet surfaces follow the
  selected theme; CI checks both themes, resolution, and re-entry while preserving `malbitWrongReviewV3`.
- The old Story Mode is retired from product UI. Travel Mode deliberately keeps the legacy
  `malbitStoryV1` root and scene IDs so saved answers, clears, and best scores migrate in place.
- `storage-guard.js` keeps a last-known-good `malbitRecoverySnapshotV1` of durable learner roots.
  Backup import is additive for keys missing from old files; only the explicit full-reset action
  may clear the recovery snapshot.
- Vocabulary cards open `vocab-editor.js` for multilingual meanings, simple Korean definitions,
  examples/translations, origins, notes, TTS, source, and review metadata.
- Vocabulary automatic fill preserves manual edits. `MALBIT_AI_ADAPTER` is only a safe integration
  boundary; the current static app has no generative-AI server or provider key.

## Known gaps and deferred work (audit defects are tracked in #110)

- No account or cloud sync: clearing browser storage or changing devices does not carry progress.
- Real AI-generated examples and etymology require a server-side endpoint. The current fallback uses
  reviewed local data and automatic translation where available.
- TTS defaults to an optional zero-fee local neural pack: ten Supertonic 3 voices, learner-friendly
  `0.82` speed, an explicit one-time ~230 MB download, and no text upload or client API key. The
  pack is lazy, separately cached, removable, and falls back to ranked device voices if absent or
  unsupported. Mobile and low-memory browsers never initialize the large ONNX sessions because the
  fp16 CPU path can exceed mobile tab memory; they use device TTS and can remove an existing pack.
  All voice and speed controls stay in the single detailed More-screen setting.
- A returning GitHub Pages tab can briefly show the previous release while its service worker swaps;
  closing and reopening the tab completes the update without deleting progress.
- Travel has static bounded highlights but no weather or time-varying environment effects yet. Future
  effects must reuse the independent environment layer and must never simulate night with a black scene overlay.
- The cue contract currently owns airport exploration interactions. Myeongdong dialogue/reward screens
  still need to adopt the same states; no audio files or persistent sound/vibration controls ship yet.
- Current airport tile catalogs migrate the existing three backgrounds into explicit per-cell atlas entries.
  The reusable Korean street foundation now covers straight segments, typed inner and outer curb corners,
  T/cross junctions, building entrances, decorative upper layers, one validated block, and east-west,
  north-south, plus 2×2 neighboring-block compositions. An isolated Seoul street zone data contract is
  deferred behind #110 core learning gates; these fixtures are not playable Seoul learning progress.
  Other NPCs still need the keyword-learning contract, and the cheongsachorong is only the first Korean
  investigation object.

## Execution defaults

- A request to explain, review, or plan is read-only.
- A request to modify means implement and verify locally.
- A request that explicitly includes deployment means: one version bump for public asset changes after the coherent batch (none for docs-only changes),
  full check, mobile flow check, branch/PR, CI, merge, and live smoke.
- The connected GitHub integration can publish without GitHub CLI. Do not ask the user to install
  `gh` merely because it is absent inside a temporary workspace.
- Autonomous development uses a standalone GitHub-connected ChatGPT Scheduled task at Asia/Seoul
  00:00, 06:00, 12:00, and 18:00. Durable instructions live in `loop/PROMPT.md`, product intent in
  `docs/DESIGN.md`, current state in `docs/STATUS.md`, and phone input in `[AI 지시]` GitHub Issues.
- Each autonomous pass handles one bounded task and at most one PR. Passing changes may deploy to
  GitHub Pages; App Store and Google Play publishing stay disabled until signed release lanes exist.
- Payment UX is quarantined. Until a separate monetization discussion and explicit user approval,
  do not add prices, purchase/subscription buttons, paid locks, Premium/Plus labels, upsells, external
  payment links, or placeholder stores anywhere in the app.
- Ignore `TOPIK_public_sources_bundle*.zip` unless the requested change actually concerns question
  content, provenance, or rebuilding the bank.

## Compact task packet

Before editing, reduce each request internally to four lines: outcome, owning files, acceptance
check, and whether release is requested. If those are inferable, proceed without a clarification
round trip.

- 2026-09-27 후보 271a04e: 전체 155/155, 모바일/오프라인/타일 검사 성공.
  CI 36289452148은 모든 검사·증거 업로드 성공 후 5분 제한으로 cancelled.
  검사를 삭제하지 않고 job 한도만 8분으로 조정한다. 최종 병합/배포 증거는 #197에서 확인.
## 2026-09-28 v143 M09 purpose coaching

- Production v143 fixes only `M09-I-R-34`: `위해서` is purpose via `V-기 위해서`; `부터`,
  `처럼`, and `때문에만` now have distinct start-point, similarity, and cause-plus-restriction
  traps in ko/ja/en/zh, followed by a reusable purpose-vs-cause method.
- Original item ID, answer, bank, durable roots, and modes are unchanged. Local and CI checks pass
  155/155 with runtime v143 (49 files) and valid bank hashes. Chrome emulation covers ko/ja,
  light/dark, and 320/375/390/430px; four representative 390px frames were manually reviewed.
- PR #199 squash `c9f6df6610dd829d575f26c377b5a3b02c705a17`; PR CI `36330127258`, main CI
  `36330472495`, and Pages `36330472634` pass. Live core/explanation hashes match main. Rollback:
  v142 `9496f84c7f0a405cf1311e3f8e8a8aa78cdd5a7c`.
- One branch attempt lost the Chrome target; the unchanged retry passed and is the evidence. Physical
  iPhone/Android, native Japanese/educator review, and real learner 10-minute/D1/D7 recall remain unverified.
- Next bounded task: if no P0 or answer error appears, verify ja-JP first grammar completion advances
  completion state and the next-learning CTA instead of repeating the same item.

## 2026-09-28 v143 first grammar completion continuity

- A clean ja-JP Chrome journey now completes every requirement in `sentence-order`: transformation,
  quiz, and all eight handwriting units. It asserts the completion banner and enabled `次へ`, opens
  `sentence-omission`, then verifies the catalog and hard-reload re-entry keep that second lesson as
  the next target instead of repeating the completed first lesson.
- No runtime defect reproduced, so product files, item IDs, durable roots, and public version remain
  v143. PR #201 squash `2132a7e31f80a6fb6ea18bea563775a84c4cf6e8` changes tests only.
- Local and PR CI checks pass 156/156 with runtime v143 (49 files) and valid bank hashes. GitHub Ubuntu
  headless Chrome covers 320/375/390/430px in light and dark; the 390px completion frames were directly
  reviewed. Pages and live HTTP smoke pass at v143 with 4 base and 49 runtime files.
- One initial assertion still expected only the later copula completion and was corrected to preserve
  both completed IDs. One PR attempt and the first main attempt lost the Chrome target; unchanged reruns
  are retained as the final evidence, not the failed attempts.
- Physical iPhone/Android, native Japanese/educator review, and real learner 10-minute/D1/D7 recall
  remain unverified. Narrow rollback is a revert of #201; product rollback remains v142
  `9496f84c7f0a405cf1311e3f8e8a8aa78cdd5a7c`.
- Next bounded task: if no P0 or answer error appears, audit only `sentence-omission` Japanese goals,
  examples, coaching, transformation, and handwriting workload before any content expansion.
