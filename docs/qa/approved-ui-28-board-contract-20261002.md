# 승인한 하루만 UI 28개 보드 적용 기준 · 2026-10-02

최신 직접 지시: “딱 요대로 하나도 틀리지말고 똑같이 업데이트 부탁해”. 기준은 하루만을 사용한 마지막 28개 보드(84개 화면 구성)다. 이전 6개 화면 시안은 기준을 대신하지 않는다. 재디자인하지 않고 승인한 메뉴 순서·계층·카드·캐릭터 역할을 구현한다.

## 현재 구현/배포와 승인 범위는 별개

- main: `a201d0e35602b9430dbeabc3b2bf6983dcb4197b`, 라이브 https://okometsbu-beep.github.io/topik-quest/ v155 유지.
- 기존 후보: `3a7b6fdfa7a2d4b06c80de390eb0c224d0929e55`, `agent/loop-20261002-haruman-ui`, v156. 12종 투명 자산·입문 hero만 제한 반영. 28개 보드 전체가 구현됐다는 뜻이 아니다.
- 이번 변경은 승인 사양과 진행 기록만 고정한다. 제품 코드·버전·공개 배포를 바꾸지 않는다.
- 읽은 최신 main: AGENTS/PROMPT, STATUS/INBOX/DESIGN/HANDOFF; #110/#226. 열린 PAUSE와 PR 없음. 최신 main과 기존 후보의 비교는 ahead 2 / behind 0.
- 검사 환경: Linux Node 24.19.0, `npm run check:runtime` v156/51 ordered files/은행 해시 통과. 모바일 브라우저·터치·콘솔·실기기는 이번에 실행하지 않았다.
- 기존 차단: agent-browser `Failed to bind socket: Operation not permitted`, Chrome `socket() failed: Operation not permitted (1)`, 로컬 HTTP smoke `ECONNREFUSED`. 같은 차단을 재시도하거나 다른 권한 경로로 우회하지 않았다.
- 연결 도구의 commit status는 statuses=[], commit workflow runs는 PR-triggered만 반환하는 도구에서 빈 목록이다. 이를 CI 성공·실패·push workflow 부재로 단정하지 않는다.

## 고정 구현 계약

- 하단 5탭: 오늘 / 학습 / 단어장 / 복습 / 내 기록. 여행·숏츠는 오늘의 보조 카드로 접근하며 기존 모드/기록 유지. 집중 설정·쓰기 편집에서는 시안대로 하단 탭 숨김.
- 국기 언어 선택, 민트/크림/남색 화면과 카드 계층, full-width 학습 제목·주 CTA, 포즈별 배치. 320px에서 한글 단어를 캐릭터 옆 좁은 열로 밀지 않는다.
- 모든 캐릭터는 승인한 투명 제작 소스 12종과 대응 WebP를 사용한다. 생성 시안에서 새 얼굴을 추출하지 않는다. 공부는 책을 보는 귀여운 최종 한 장만 사용한다.
- 시험/쓰기/정책/초기화는 작은 차분한 안내. 정답/완료 포즈는 실제 제출·완료 뒤에만 표시. 사람 NPC·게임 영웅·몹·기존 지도 유지.
- 기존 인트로 영상의 ended → 화이트아웃 → 제공 타이틀 → 홈, 스킵 없음, 길게 누르기 차단 유지.
- 시안 예시 점수/날짜/복습 수/성취는 실제 저장 상태로 대체한다. 원본 2,088문항·ID·학습/복습/단어장/여행/게임/설정/백업 저장 계약 유지.
- 시안의 새 통합 복습/코스/TTS/오프라인 상태는 화면 그림만으로 구현됐다고 하지 않는다. 새 연결은 기능별 최소 작업과 검사로 증명한다.

## 보드별 owner와 정확한 배치

아래 owner는 최초 확인 경로이며 후속 override를 함께 확인한다. 모든 보드는 아직 시안 대비 구현·모바일 검수 **대기**다.

| 보드 | 대상 | 최초 owner | 시안 SHA-256 |
|---|---|---|---|
| 01-home-learn-record | 오늘 · 학습 · 내 기록 | `harumal-ui.js` / `harumal-ui.css` | `768f094da791d4218ab404d9462c05394ad9568e70a700818582fb56cb6ca284` |
| 02-hangul | 한글 입문 · 글자 · 손글씨 | `app-polish-v33.js` / `harumal-ui.css` | `0d588d63be4451eaedd91d20ef0e4e9333ecacaecd409dd33f21625fe517a348` |
| 03-grammar | 문법 · 이해 · 사용과 회상 | `beginner-grammar.js` / `harumal-ui.css` | `4ff381f7621d475f50f0267bc696fcf415c8b961620e4034da52f7f261baf06e` |
| 04-vocabulary | 플래시카드 · 보관함 · 단어 추가 | `learning-features.js` / `product-polish.js` / `harumal-ui.css` | `4d12bf996ea3eca9350d012748b883b2cc43ac32146259582d0975e4fb41e972` |
| 05-vocabulary-test-review | 단어 시험 · 결과 · 통합 복습 | `vocab-test.js` / `learning-features.js` | `1673d04dce5eff03bab73b4324cbf27e8eb5644fd60acad310e774160724ac66` |
| 06-review-states | 복습 회상 · 피드백 · 빈 상태 | `learning-features.js` / `review-visual-system.js` | `98500c6f7f271a09aef21f0fc94ee6f2fc0db56c84b9274a334b0a61b2c06299` |
| 07-topik-reading | TOPIK 유형 코스 · 문제 · 해설 | `harumal-ui.js` / `topik1.js` / `legacy-core.js` | `11ea27642419c8b8ce3c1731261c79fd1b186dd32dcd8c46c9fe166d301a01bb` |
| 08-audio-speaking | 듣기 · 대화 음원 · 말하기 | `tts-quality.js` / `product-polish.js` | `c99f30a24a66c4656efb2a7cb9302d7640871c0c41c24ebcc91b1b0075fb8fed` |
| 09-mock-exam | 모의시험 준비 · 풀이 · 결과 | `topik1.js` / `legacy-core.js` | `05acb1891a9116eb9ba4c4f99a6b5c7592ff73234dc29368bf68e0427bc3a46a` |
| 10-writing | TOPIK 쓰기 51–52 · 53 · 54 | `legacy-core.js` / `writing-answers.js` | `8a1f1951557e48b12e616a4d67d6ee8f9f65f6f4c8153457279712545f2f2f56` |
| 11-shorts | 숏츠 문제 · 해설 · 회상 | `topik1.js` / `shorts-visual-system.js` | `728b3cb08bf687e26801471edbf2f2bf927b60fc1851de968977f94241525329` |
| 12-travel | 여행 코스 · 대화 · 응답 | `travel-adventure.js` / `travel-adventure.css` | `3e6b71093a52b7414c751c2dceccdd3673b70920ed59f9388d40feedce92ead7` |
| 13-game | 게임 허브 · 지도 · 학습 전투 | `legacy-core.js` / `site-patch-core.js` | `3570f582ab29e44b1f9a81e7f730ad62a5c63240c3b5cd0589bf8dad24ff1d59` |
| 14-settings | 설정 · 음성 · 백업 | `product-polish.js` / `product-growth.js` | `74428134ebdc353dccb9b928cac68afefa21ac95a371d0b7df225a0c79e84dc8` |
| 15-help-intro | 도움말 · 공통 오류 · 인트로 | `haruman-intro.js` / `haruman-intro.css` / `product-growth.js` | `2b709690367f9cb9f250df140704e98965373d9c7323485f90a2dd40b56754fa` |
| 16-record-writing-review | 통계 · 작문 복습 · 수업 완료 | `harumal-ui.js` / `writing-answers.js` / `product-polish.js` | `511157a211ade658f35af433cbd7ba92e77684fb1184f8d30a03cc7923535ec0` |
| 17-consonant-reading-test-result | 자음 · 한 글자 읽기 · 단어 시험 결과 | `app-polish-v33.js` / `vocab-test.js` | `02052728c3bda228df149b700ebcda0103b68c7f5e733127c21d4fc487711285` |
| 18-game-extras | 원정 일시정지 · 장비 · 잠긴 경로 | `legacy-core.js` / `site-patch-core.js` | `b9eb13a018ab433d1ecfef6b079cb2e935096a81f1f398465735a9d7901e6840` |
| 19-language-policy-report | 국기 선택 · 정책 상세 · 문제 신고 | `harumal-ui.js` / `product-growth.js` / `question-bank-engine.js` | `2aaf92f04c2685096c605ff8143ae311f7a34031c6a6eb15a404a9e0307958c1` |
| 20-random-practice | 랜덤 연습 · 풀이 · 미응시 결과 | `topik1.js` / `legacy-core.js` | `e5b8ab0fae40b34ec45f628009064f5fba86e3138c746401cd5d15d56dc2f7a4` |
| 21-vocab-utilities | 단어 정원 · 추가 확인 · 표현 저장 | `learning-features.js` / `product-polish.js` | `cb90e148e76e8d764b3ebd9645651ffc2c0da87b6b1d3d71826a82907da29433` |
| 22-learning-settings | 학습 목표 · 복습 알림 · 출제 구성 | `product-polish.js` / `product-growth.js` | `e1da8c77bd807c86e53ccb8e28de33971348a3afcbb7c410f207fa4377ab967b` |
| 23-backup-safety | 복원 미리보기 · 복원 오류 · 초기화 확인 | `storage-guard.js` / `product-polish.js` | `a203f88369f015c7be32a1b93aeb544f143ac427d3ddc4af9e6107480e6dbd67` |
| 24-audio-offline-states | 음원팩 · 생성 대기 · 복구 상태 | `tts-quality.js` / `neural-tts.js` / `sw.js` | `df9f16032a6097c44e46f0abd0d9b0e3ad6470ba037520e6c6802a4738b73e25` |
| 25-travel-recall | 여행 단서 · 회상 · 장면 완료 | `travel-adventure.js` / `travel-adventure.css` | `b6a631a196d54ee141907be942ecd3c6b0db9dab2a6f63b10b4e0cb74ad3a49f` |
| 26-writing-details | 쓰기 52 · 작성 조건 · 답안 편집 | `legacy-core.js` / `writing-answers.js` | `5d2f6371d61da334c71795a745ea2fd325e5a99884bb710e97647d558c1e8a95` |
| 27-start-return-update | 첫 시작 · 재방문 · 업데이트 대기 | `harumal-ui.js` / `site-patch-core.js` / `sw.js` | `253ffa691814cca3e62dff5beac122f24f3d74e9c0b7418de77b143b44edfe36` |
| 28-legacy-travel | 이전 여행 코스 · 여행자 · 현장 조작 | `travel-mode.js` | `c772f86ba1771b81a17142c199c36c4e91354e54e35cd7266a3aa502c2083c25` |

### 포즈/위치 사양

#### 01-home-learn-record · 오늘 · 학습 · 내 기록

- 제작 소스: home-study-v3-2, lesson-welcome-v3, progress-proud-v3
- 배치: Today: approved prone studying image ONE occurrence only, eyes on book, friendly concentration, 112–128px in a reserved separate hero space below full-width heading. Learn: 80px peek-and-wave welcoming Haruman by course section header. My record: 80px folded-arms proud Haruman in empty header space. Replace all previous generic mascots, including shorts/travel thumbnail characters, with exact Haruman identity. No cramped title next to mascot.

#### 02-hangul · 한글 입문 · 글자 · 손글씨

- 제작 소스: lesson-welcome-v3, vocab-reading-v3
- 배치: Beginner course: 112px tilted peek-and-wave smiling greeting. Vowel screen: small 64px attentive reading Haruman near explanation header, not near phoneme answer. Handwriting: 56px curious companion near instruction only, canvas remains empty and unobstructed.

#### 03-grammar · 문법 · 이해 · 사용과 회상

- 제작 소스: vocab-reading-v3, review-thinking-v3
- 배치: Course list: 80px sitting reading Haruman by header. Understanding: 64px reading companion beside example section heading. Usage: 56px side-profile thinking Haruman looks toward task; it must not point at the correct choice or expose the answer.

#### 04-vocabulary · 플래시카드 · 보관함 · 단어 추가

- 제작 소스: vocab-reading-v3, review-thinking-v3
- 배치: Replace both wrong generic round mascots. Flashcard header uses exact sitting-with-book Haruman 80–88px. Collection header has 64px thoughtful side-profile. Add word focused form has only 48px reading Haruman in upper header corner; do not occupy or cover input/labels.

#### 05-vocabulary-test-review · 단어 시험 · 결과 · 통합 복습

- 제작 소스: review-thinking-v3, answer-correct-v3, lesson-welcome-v3
- 배치: Test setup: small thinking Haruman by header, task clear. Answer question: 48px thinking in neutral progress header only, NO celebratory character before answer submission, NO pointing to correct answer. Review queue: small welcoming Haruman 64px at section heading. Preserve test question/meaning and existing options.

#### 06-review-states · 복습 회상 · 피드백 · 빈 상태

- 제작 소스: review-thinking-v3, answer-correct-v3, review-empty-v3
- 배치: Retrieval: exact side-profile thinking Haruman 64px above input in reserved gap, no hints to correct answer. Confirmed correct result: 88px playful diagonal high-five wink next to feedback heading. Completed review: 144px exact reclining-with-crossed-feet wink Haruman, distinct from studying pose, above completion title. Bottom menu where shown must be five tabs 오늘/학습/단어장/복습/내 기록 with 복습 active.

#### 07-topik-reading · TOPIK 유형 코스 · 문제 · 해설

- 제작 소스: vocab-reading-v3, review-thinking-v3, answer-correct-v3
- 배치: Type course list: 72px sitting reading Haruman by header. Active reading question: very small 48px neutral thinking Haruman in header only, passage and choices dominant, no hints. Explanation after submit: 64px high-five beside feedback header without obscuring evidence.

#### 08-audio-speaking · 듣기 · 대화 음원 · 말하기

- 제작 소스: audio-listening-v3, lesson-welcome-v3, answer-retry-v3
- 배치: Listening practice: 96px exact right-profile headphones Haruman by audio player. Speaking rehearsal: 80px welcoming companion by prompt. Recording review: 64px encouraging cheek-rest thumb-up Haruman near feedback, not fake pronunciation accuracy. Keep mic consent and actual text controls.

#### 09-mock-exam · 모의시험 준비 · 풀이 · 결과

- 제작 소스: review-thinking-v3, vocab-reading-v3, progress-proud-v3
- 배치: Mock setup: 64px thinking companion beside introductory header. Active timed exam: only 32–40px silent reading Haruman in empty header corner, no animation or hints, no layout shift. Result: 88px proud folded-arms beside result summary only, do not imply passed exam or invented score.

#### 10-writing · TOPIK 쓰기 51–52 · 53 · 54

- 제작 소스: vocab-reading-v3, review-thinking-v3, answer-retry-v3
- 배치: 51/52: 48px reading companion upper header, not inserted in answer field. 53 chart: 48px thinking companion header, must not overlap chart/legend or suggest evidence. 54 composing: 48px reading companion header, full text area and submission controls unchanged. No huge mascot on writing task.

#### 11-shorts · 숏츠 문제 · 해설 · 회상

- 제작 소스: shorts-quiz-v3, answer-correct-v3, lesson-complete-v3
- 배치: Shorts setup/task: 88px exact one-foot balancing phone-and-shh Haruman in heading space, mischievous. Submitted correct feedback: 88px high-five wink. Session finished: 128px joyful upside-down somersault Haruman above summary. Different pose and gaze in all three, no answer cues before submit.

#### 12-travel · 여행 코스 · 대화 · 응답

- 제작 소스: travel-journey-v3, review-thinking-v3, audio-listening-v3
- 배치: Course hub: 112px exact back-three-quarter travel Haruman turning to viewer, beside route heading; preserve actual scene background/people. Clues: 56px thoughtful Haruman near clue-section header. Dialogue: 64px headphones companion near audio row, keep male/female human dialogue speakers distinct; Haruman is guide, not every NPC.

#### 13-game · 게임 허브 · 지도 · 학습 전투

- 제작 소스: lesson-welcome-v3, review-thinking-v3, answer-correct-v3
- 배치: Game hub: 88px greeting Haruman guide in learning goal card; keep original RPG hero art. Map: 48px thinking guide by objective, do not cover tiles/path. Learning battle: only 48px neutral thinking in header before answer; high-five only if existing feedback is after correct answer. Do not replace monster/hero artwork with Haruman.

#### 14-settings · 설정 · 음성 · 백업

- 제작 소스: audio-listening-v3, progress-proud-v3
- 배치: Settings categories: tiny 48px calm folded-arms Haruman by page heading. Audio: 88px headphones Haruman by audio preview. Backup: tiny 48px reassuring folded-arms Haruman upper heading only, never next to destructive reset as celebration. Remove any overwrite/replace-record option; restoration is merge-only.

#### 15-help-intro · 도움말 · 공통 오류 · 인트로

- 제작 소스: lesson-welcome-v3, answer-retry-v3
- 배치: Help: 80px tilted peek-and-wave guide above help cards. Intro storyboard: preserve provided wordmark and exact final logo, replace any generic opening character with supplied original Haruman; character animation finishes then whiteout then logo, no skip. Error: 96px cheek-rest thumb-up encouraging Haruman, gently mischievous and not jubilant, plus actionable retry.

#### 16-record-writing-review · 통계 · 작문 복습 · 수업 완료

- 제작 소스: progress-proud-v3, vocab-reading-v3, lesson-complete-v3
- 배치: Stats: 80px folded-arms proud companion in header; no invented progress. Saved writing review: tiny 48px reading companion header, original answer area dominant. Learning complete: 128px upside-down somersault with smiling expression above completion heading; no money/leaderboard.

#### 17-consonant-reading-test-result · 자음 · 한 글자 읽기 · 단어 시험 결과

- 제작 소스: lesson-welcome-v3, vocab-reading-v3, answer-retry-v3
- 배치: Consonant: 64px greeting guide in header. Combination reading: 64px book-reading companion in margin below main glyph, do not hide glyph. Vocabulary test finished: 112px cheerful cheek-rest thumb-up encouragement, no fake score/completion condition. Varied gaze and posture.

#### 18-game-extras · 원정 일시정지 · 장비 · 잠긴 경로

- 제작 소스: answer-retry-v3, progress-proud-v3, review-thinking-v3
- 배치: Pause: 72px encouraging cheek-rest thumb-up by pause heading. Equipment: 48px folded-arms companion in title space, retain equipment symbols. Locked path: 80px thinking companion next to unlock explanation, not celebrating unlock, keep locks and original progression.

#### 19-language-policy-report · 국기 선택 · 정책 상세 · 문제 신고

- 제작 소스: lesson-welcome-v3, vocab-reading-v3, answer-retry-v3
- 배치: Language picker: tiny 40px welcoming Haruman at sheet title only; language names/flags clear. Privacy: tiny 32px calm reading Haruman near heading only, legal body dominant no comic speech bubble. Report: 48px encouraging thumb-up companion in header above inputs, no pressure to share scores/audio.

#### 20-random-practice · 랜덤 연습 · 풀이 · 미응시 결과

- 제작 소스: review-thinking-v3, vocab-reading-v3, answer-retry-v3
- 배치: Random setup: 80px thinking Haruman near header. Active question: 40px reading companion in header, no answer cues. Unattempted/empty result: 104px reassuring cheek-rest thumb-up, not jubilant, keep ungraded/no fabricated score.

#### 21-vocab-utilities · 단어 정원 · 추가 확인 · 표현 저장

- 제작 소스: vocab-reading-v3, review-thinking-v3
- 배치: Garden: 88px reading Haruman among heading only, no claim that saved count means memory achievement. Addition preview: 56px thinking side-profile beside header, original-to-lemma comparison unobstructed. Save expression: 48px reading Haruman by sheet title, primary form clear.

#### 22-learning-settings · 학습 목표 · 복습 알림 · 출제 구성

- 제작 소스: progress-proud-v3, review-empty-v3, review-thinking-v3
- 배치: Goal settings: 56px folded-arms proud Haruman at upper-right reserved header. Reminder OFF: 56px relaxed reclining Haruman near explanatory heading; do not imply notification activated. Random configuration: 48px thinking side-profile upper heading. No bottom tab bar in these focused settings screens, all choices unchanged.

#### 23-backup-safety · 복원 미리보기 · 복원 오류 · 초기화 확인

- 제작 소스: vocab-reading-v3, answer-retry-v3, review-thinking-v3
- 배치: Restore preview: 48px reading Haruman by title, merge-only preservation. Restore error: 104px encouraging cheek-rest thumb-up in unused middle illustration area, replace abstract red document illustration but keep error color signifier small. Reset confirmation: at most 32px sober thinking Haruman at title; NO celebration, keep danger explanation, unchecked acknowledgement and disabled action.

#### 24-audio-offline-states · 음원팩 · 생성 대기 · 복구 상태

- 제작 소스: audio-listening-v3, answer-retry-v3
- 배치: Audio packs: 64px headphones companion by page heading. Waiting/loading: 104px exact headphones listening Haruman integrated above spinner, no fake percent. Playback unavailable: 112px encouraging cheek-rest thumb-up in existing illustration space replacing huge abstract mute symbol; mute icon stays small. Do not claim unverified offline or engine capability.

#### 25-travel-recall · 여행 단서 · 회상 · 장면 완료

- 제작 소스: travel-journey-v3, review-thinking-v3, lesson-complete-v3
- 배치: Scene clues: 64px travel turning-back guide by heading, preserve travel people and scenery. Recall: 64px thinking Haruman above task, do not show model answer prematurely. Completed scene: 112px upside-down joyful somersault above completion heading, review-link checkbox and next scene remain clear.

#### 26-writing-details · 쓰기 52 · 작성 조건 · 답안 편집

- 제작 소스: vocab-reading-v3, review-thinking-v3, answer-retry-v3
- 배치: Writing52: tiny 40px reading Haruman upper title row; text areas remain primary. Condition review: 48px thinking Haruman by header, not expert grading. Edit answer: 40px reassuring cheek-rest thumb-up top corner only, preserve undo/clear/unsaved state and NO bottom tabs.

#### 27-start-return-update · 첫 시작 · 재방문 · 업데이트 대기

- 제작 소스: lesson-welcome-v3, home-study-v3-2, review-thinking-v3
- 배치: First start: 112px tilted peek-and-wave Haruman below headline in dedicated space, not narrowing headline. Return: use approved prone-reading image 104px in continuation card reserved header; eyes exactly on book, no frown, compact body. Update waiting: 72px side-profile thinking Haruman at sheet title, preserve save-before-apply controls and no skip intro button.

#### 28-legacy-travel · 이전 여행 코스 · 여행자 · 현장 조작

- 제작 소스: travel-journey-v3, progress-proud-v3, review-thinking-v3
- 배치: Legacy course: 88px turning-back travel guide beside route heading. Avatar selection: small 48px folded-arms Haruman by page heading, preserve the three ORIGINAL human avatars, do not replace them with Haruman. Field interaction: 56px thinking Haruman beside textual objective list; preserve map artwork, no NPC replacement or locked progression invention.

## 승인 원본 체크섬

```json
[
  {
    "file": "haruman-answer-correct-v3.png",
    "sha256": "80eca0aa9c4a48b2b54d4fe57863fa827032458e275e3ab645ea2f70448260f0",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-answer-retry-v3.png",
    "sha256": "53af49ecffe8f9f70f9ba80cafa214de193d1e72a06625abbb216c70647bc299",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-audio-listening-v3.png",
    "sha256": "1372cca9c05cf4ce6d32b993c20b3308796943675cd43a0fd63032afb6d9c5f2",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-home-study-v3-2.png",
    "sha256": "15a7b845d558dc7eaf5e40e2af549c176a344c250dd3b7b7d042771d28a80475",
    "size": [
      1536,
      1024
    ]
  },
  {
    "file": "haruman-lesson-complete-v3.png",
    "sha256": "d64f89315b413612f6e3b334a0e6163a881c7123086b825a9a0f2328d7793232",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-lesson-welcome-v3.png",
    "sha256": "86be1682c589725b6cf35b36dd7ff796df5257b3884a1d6fd036c845b2dd9b4f",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-progress-proud-v3.png",
    "sha256": "a1f633d4c2208ff758dccdd02f4c7a3b2a68d006ac2bd12b40117dbc4513b3a3",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-review-empty-v3.png",
    "sha256": "61201d1568afbac3f9428b77270c9719f81b69a6e632e2c230d6d557a95eb86a",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-review-thinking-v3.png",
    "sha256": "2d978d65f7ac1769376108b94071a459686163e41b1467109f06b78dc06d008d",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-shorts-quiz-v3.png",
    "sha256": "7adefcf6bd2f3d28d2a4d7616e1e53d28bd5e955fbe098c019c6b64512077dd1",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-travel-journey-v3.png",
    "sha256": "4fed53b606f7ea32e02129f74db015427d23b7b5a80d45ab0c1be579e5b0e63b",
    "size": [
      1254,
      1254
    ]
  },
  {
    "file": "haruman-vocab-reading-v3.png",
    "sha256": "870e358c689ef0d24e342d0daeb46e473cff1b1a5138da0fb9040211bf55b478",
    "size": [
      1254,
      1254
    ]
  }
]
```

## 합격과 다음 작업

1. 기존 후보의 320/375/390/430px × 라이트/다크 전후를 실제 브라우저에서 보고 겹침/제목 줄바꿈/CTA/뒤로/재진입/콘솔/저장 보존을 검수한다. 생성 시안은 실행 증거가 아니다.
2. 이후 01번의 오늘/학습/내 기록 구성을 소유 파일별 최소 작업으로 적용하고, 02–28번 하위 화면을 같은 방식으로 이어간다. P0/확정 정답 오류가 있으면 먼저 처리한다. F49 복수 정답은 아직 의심 관찰이며 정답키 검증 전 수정하지 않는다.
3. 기능 추가·통합이 필요한 화면은 UI 그림과 별도로 실제 상태 계약을 검증한다. 음성/오프라인/점수/백업 상태를 가짜로 표시하지 않는다.
4. 필수 모바일 검사 가능 전 PR/병합/배포 없음. 검사 가능한 환경에는 HTTP 서버·Chrome 소켓과 4개 폭/2테마 캡처·동작 확인이 필요하다.
5. 복귀: 이번 문서 커밋 revert; 기존 제품 후보 revert 또는 main a201d0e. 공개 앱 변경 없음.
