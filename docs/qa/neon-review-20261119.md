# 네온(Neon) 점검 6건 처리 기록 — 2026-11-19

점검 원문: `downloads/하루말-제미나이-네온-점검-2026-11-19.md` (제미나이 심층 분석 Neon, v176 `778d7d4` 스냅샷 기준).
이 문서는 그 6건을 저장소에서 어떻게 처리했는지, 무엇을 검증했고 무엇을 검증하지 못했는지 적는다.

릴리스는 두 단계다.
- v177 (PR #250): ①②③④⑥ — 입력·렌더/감시·캐시·번역·표기.
- v178 (이 브랜치): ⑤ — 자모 획순 안내 전체, 쓰기 S01–S06 첫 소단원, 오디오 2.06초 정지 조사 결과.

## ① 입력창 예외 처리 — `app-touch.js`

- `input`, `textarea`, `[contenteditable]` 안에서는 `contextmenu`·`selectstart`·`copy`·`cut`·`paste`를 더 이상 가로채지 않는다. 커서 이동용 길게 누르기, 붙여넣기, 복사가 브라우저 기본 동작으로 돌아온다.
- 정지 상태 400ms 뒤 `blur()`를 강제하던 `touchstart`/`touchmove` 로직을 통째로 제거했다. 비입력 영역의 기존 터치 콜아웃 억제와 학습 텍스트(`.selectable`, `.vocab-zone`) 선택 예외는 그대로다.
- 회귀: `tests/native-vocabulary-selection.test.cjs`(4건), `tests/vocab-test.test.cjs`의 클립보드 억제 테스트를 새 동작 기준으로 바꿨다.
- 실기기 확인은 하지 않았다. iOS Safari 롱프레스를 쓴 실제 붙여넣기는 물리 기기에서만 확인된다.

## ② 렌더 래핑·감시 중복 정리 — `site-patch-core.js`, `site-patch.js`, `app-polish-v22/24/33/34/35.js`, `review-visual-system.js`, `random-practice-visual-system.js`

- `app-polish-v33/34/35.js`의 `patchVersion()`을 삭제했다. 이 함수는 설정 화면 배지를 실제 버전 대신 `v33`/`v34`/`v35`로 덮어쓰고 있었다(실제 배지는 `v176`이어야 한다). 세 파일 모두 렌더마다 마지막에 실행되므로 사용자가 보는 값이 항상 틀린 값이었다.
- `document.body` 전체를 감시하던 `MutationObserver` 4개(v22·v24·review·random)를 `site-patch-core.js`의 단일 감시자로 모았다. 각 모듈은 `window.tqOnBodyChange(callback)`으로 콜백만 등록하고, 감시자는 DOM 변화 폭주마다 rAF 한 번으로 등록 콜백을 순서대로 실행한다.
- `window.render` 래핑은 **이번 릴리스에서 합치지 않았다.** 한 단계로 모으는 구현(모든 런타임 로드 후 단일 후처리 단계 설치)을 만들었지만, CI의 플래시카드 브라우저 검사에서 단어장 화면의 `hfEntry` 카드가 사라지는 회귀가 나와 되돌렸다. 각 레이어는 예전처럼 렌더 뒤 자기 패치를 한 번 감싸 실행하며, 래퍼가 두 번 설치되지 않는 것은 그대로다. 이 합치기는 화면별 브라우저 확인이 가능한 환경에서 다시 시도해야 한다(아래 "남은 범위" 참고).
- 회귀: `tests/compat-layer-consolidation.test.cjs`(3건 — body 감시자 단일 소유, 하드코딩 배지 금지, 레이어별 래퍼 1회), `tests/v33-runtime`, `v34-runtime`, `v35-runtime`, `visual-system`, `home-visual-system`, `shorts-visual-system`, `random-practice-visual-system`, `review-visual-system`, `startup-navigation`, `runtime-contract`, `vocab-flashcards` 통과.
- 남은 범위: ① `window.render` 래핑 7개를 하나의 후처리 단계로 모으는 일(위 회귀 때문에 보류), ② `app-polish-v22~v35`의 패치 함수를 목적별 소유 파일로 옮겨 파일 자체를 없애는 일. 둘 다 화면 회귀를 즉시 볼 수 있는 브라우저 환경에서 단계별로 진행해야 한다.

## ③ 서비스 워커 `SHELL` 동기화 — `sw.js`

- 프리캐시를 실제 런타임 기준으로 다시 적었다. 빠져 있던 핵심 파일(`harumal-ui.js`, `travel-adventure.js`, `travel-mode.js`, `travel-rpg-engine.js`, `beginner-grammar.js`, `vocab-editor.js`, `vocab-test.js`, `vocab-flashcards.js`, `haruman-mascot.js`, `topik1.js`, `learning-features.js`, `site-patch-core.js`, `storage-guard.js`, `product-polish.js`, `product-growth.js`, `app-polish-v22/24/33/34/35.js`, `question-bank-engine.js`, `tts-quality.js`, `listening-audio.js`, `listening-player.js`, `practice-results.js`, `question-tools.js`, `shorts-cycle.js`, `vocabulary-*.js`, `writing-answers.js`, `app-touch.js` 등)을 넣었다.
- 퇴역 에셋 `assets/art/malbit-home-hero.webp`를 `SHELL`에서 뺐다. 코드에서 쓰는 곳이 `prototypes/malbit-case-files.html`(비배포 프로토타입)뿐임을 확인했다. 하루만 v1 8종과 v2 12종 아트는 `assets/art/haruman/manifest.json`·`ui-manifest-v2.json` 계약과 `haruman-mascot.test.cjs`가 요구하므로 그대로 유지했다. RPG 거리 아틀라스 5종과 여행 아바타·스태미나 이미지도 실제 데이터(`data/travel-tiles-korean-street*.js`, `data/travel-pack-seoul-001.js`)가 참조하므로 유지했다.
- 캐시 접두사를 `malbit-v` → `harumal-v`로 바꾸고, 이전 접두사 캐시는 `activate`에서 계속 지운다(`RETIRED_CACHE_PREFIX`). 이에 맞춰 `scripts/check-question-image-release.mjs`는 접두사를 `sw.js`에서 읽도록 바꾸고, `tests/worker-migration-server.test.cjs`의 소스 단언을 갱신했다.
- 문항 은행·듣기 오디오·문항 이미지·인트로 영상은 프리캐시에 넣지 않았다. 크고 선택적이며 첫 사용 시 fetch 핸들러가 캐시한다.
- 회귀: `npm run check:runtime`(102개 런타임·SHELL 존재·버전 일치), `tests/runtime-contract.test.cjs`, `harumal-ui`, `haruman-mascot`, `haruman-intro`, `worker-migration-server` 통과.

## ④ MyMemory 외부 번역 호출 제거 — `legacy-core.js`, `learning-features.js`, `product-polish.js`, `app-polish-v24.js`

- `legacy-core.js`의 `translateCached()`에서 `api.mymemory.translated.net` 호출을 삭제했다. 이제 이 함수는 (1) 같은 언어면 원문, (2) 이미 저장된 번역 캐시(단, `MYMEMORY WARNING` 같은 실패 문구는 제외), (3) 그 밖에는 대상 언어의 "번역 준비 중" 안내만 돌려준다. 네트워크를 타지 않으며 준비 중 안내를 번역으로 캐시하지 않는다.
- 쓰이지 않게 된 `splitText()`도 제거했다.
- `learning-features.js` 수동 단어장: 외국어 입력을 한국어로 자동 변환하던 경로를 없애고, 한국어 표제어를 직접 입력하라는 안내로 바꿨다. 기계 번역된 표제어가 단어장에 저장되던 위험을 없앤다.
- `product-polish.js`의 예문·말하기 번역은 "번역 중…" 대신 "번역 준비 중" 상태를 즉시 보여 준다. `app-polish-v24.js`의 랜덤 실전 전체 번역은 이미 `random-practice-translation.js`가 소유한 정책에 `translate:null`로 넘겨 검수 번역 또는 그 정책의 준비 중 문구만 쓰게 했고, 해설은 검수 번역이 없으면 준비 중 안내 + 한국어 원문을 함께 보여 준다.
- 회귀: `tests/external-translation-removal.test.cjs`(3건 — 런타임 어디에도 해당 호스트 없음, 네트워크 미사용, 캐시·원문 경로), `tests/vocabulary-translation.test.cjs`(기존 클라우드 워커 경로, 계속 `enabled:false`), `tests/vocabulary-library.test.cjs`.
- 참고: `vocabulary-translation.js`의 Cloudflare 워커 경로(`harumal-vocabulary.okometsbu.workers.dev`, `enabled:false`)는 MyMemory가 아니며 여전히 비활성이다.

## ⑤ 학습 콘텐츠 공백

### 자모 획순 안내 — `app-polish-v35.js`

- 필기 연습이 제공하는 40자 전부에 획순 안내가 있다. 기존 6개 모음에 더해 34개(복모음·겹모음·기본 자음·쌍자음)를 네 언어로 추가했다.
- 방향은 학교에서 흔히 쓰는 순서를 적었고, 교재에 따라 달라지는 글자(ㅈ·ㅊ·ㄹ·ㅌ·ㅉ 등)가 있으므로 패널 안내문에 "획순 안내 방향은 교재에 따라 다를 수 있어요"를 네 언어로 명시했다.
- 낱글자가 아닌 음절(단어·문장 연습)은 "글자 전체의 획순 안내는 아직 없어요"로 남겼다. 추측한 순서를 넣지 않는다.
- 회귀: `tests/stroke-hints.test.cjs`(4건 — 40자 전부 안내 있음, 언어별로 다름, 음절은 정직한 안내, 교재 차이 문구), `tests/v35-runtime.test.cjs` 갱신.

### 쓰기 S01–S06 — `data/writing-curriculum.js`, `writing-curriculum-engine.js`, `writing-curriculum.js`, `data/writing-curriculum-locales.js`, `writing-curriculum-i18n.js`

- S01~S06 각각에 첫 소단원을 넣었다. 한 소단원은 연습 2문항 + 독립 전이 1문항이다.
  - S01 하나의 사실을 완결된 문장으로
  - S02 조사로 역할과 관계 표시하기
  - S03 서술어의 형태와 호응 유지하기
  - S04 시점·부정·판단 강도 조절하기
  - S05 필요한 정보를 한 문장에 더하기
  - S06 절로 대상을 한정하고 내용 묶기
- 각 문항은 한국어 사실, 일본어 뜻, 모범 문장 2개, 정규식 구성 요소 검사(그 단어·조사·활용·수식어가 있는지)만 가진다. 의미·자연스러움·숙달은 자동 판정하지 않는다(`meaningPolicy: not_automatically_verified`). 없는 구성 요소는 그 능력에 맞는 한 문장 안내로 돌려준다.
- 지도(node)는 S01~S06에 "첫 소단원 열기"를 제공하고, 과정 화면에 "문장 기초 소단원" 여섯 개를 추가했다. 나머지 S08~S12·D01~D02는 계속 "드릴 준비 중"으로 남는다.
- 기존 원인 쓰기 코스(S07)의 단계 순서·완료 판정·지연 공개는 그대로다. 엔진과 UI는 안내 코스를 `nodeId==='S07'`로 한정해, 새 소단원이 코스 단계에 섞이지 않는다.
- 데이터 문구 51개와 UI 문구 29개를 네 언어 사전(`data/writing-curriculum-locales.js`, `writing-curriculum-i18n.js`)에 넣었다.
- 회귀: `tests/writing-foundation-units.test.cjs`(6건), `writing-content`(8), `writing-content-locales`(4), `writing-localization`(23), `writing-flow`(19), `writing-usability`(9), `writing-review`(14), `writing-polite-variants`(9), `writing-curriculum`(16) 전부 통과.
- 남은 공백: 각 소단원은 3문항뿐이고, S07처럼 형태 묶음·혼합·변형·교정·확장 단계를 갖춘 완전한 단원이 아니다. 문항을 늘리는 일은 콘텐츠 작업으로 남아 있다.

### 오디오 2.06초 정지 — 결론: 이 저장소에서 안전하게 고칠 수 없음 (파일·근거 명시)

- 대상: `audio/listening/original-v10/F1/800786a0a81d1d16.mp3` (O09-II-L-41 / O09-II-L-42 공용, 55.33초, 443,288바이트, 64kbps 모노).
- 실측: ffmpeg silencedetect(-35dB, 0.4초 이상)로 55.33초 클립에서 정지 구간이 7.29–8.85초(1.56초), 23.91–25.50초(1.59초), 30.39–31.06초(0.68초), **40.49–42.62초(2.13초)**, 끝 54.83–55.33초(0.50초)에 있다. 문서의 "2.06초"는 이 40.49초 구간과 같은 곳이다(측정 임계값 차이).
- 원인: 이 클립은 문장 단위로 합성한 음성을 이어 붙인 결과이고, 문장 사이에 1.5초 안팎의 간격이 규칙적으로 들어간다. 40.49초 구간만 2.13초로 조금 길다. 재생 코드가 만드는 정지가 아니라 **음원 파일 안에 박힌 구간**이다.
- 도구로 자르는 것 자체는 가능하다. ffmpeg으로 40.49–42.62초를 잘라 붙이면 53.20초 클립이 되고, 시험 삼아 만들어 두었다(`workspace 바깥 임시 파일, 저장소 미포함`). 그러나 이 파일은 공개된 음원이고, 저장소는 이 바이트를 `audio/listening/original-v10/generation-records`·`manifest`·`corpus`·`data/original-listening-audio-v10.js`의 해시로 동결해 "이 녹음이 검수된 그 녹음"임을 보증한다. 바이트를 손으로 바꾸면 그 증거 사슬(생성 기록의 `bytes`·`sha256`)을 손으로 다시 써야 하고, 이는 저장소가 스스로 정한 "생성 기록을 손으로 고치지 않는다"는 경계를 넘는다.
- 따라서 이번 릴리스에서는 음원을 바꾸지 않았다. 해결 경로는 둘 중 하나다.
  1. 오프라인 합성 파이프라인으로 이 문장을 다시 생성하고, 생성 기록·매니페스트·코퍼스·카탈로그를 재생성한 뒤 실제 청취 검수를 거쳐 발행한다(문서·해시 체인 정합 유지).
  2. 사용자가 "제공된 녹음을 편집해도 된다"고 승인하면, 위 ffmpeg 절단 + 생성 기록 재작성 + 청취 검수 없음(문서에 명시)을 한 릴리스로 진행한다.
- 이 판단은 저장소 규칙(음원 바이트 동결·생성 기록 무결성)과 "검수하지 않은 것을 검수했다고 쓰지 않는다"는 원칙에 근거한다.

## ⑥ 문서·브랜드 표기 동기화 (v177)

- `docs/STATUS.md`: v156에서 멈춰 있던 기록에 v157~v176과 2026-11-19 병합분(#249)을 채웠다. 근거는 해당 병합 커밋과 `docs/HANDOFF.md`의 같은 제목 절이다.
- `README.md`, `AGENTS.md`: 제품명을 `하루말 · HARUMAL`로 맞추고, 저장소·저장 키·레거시 식별자는 그대로 둔다는 점을 명시했다.
- `index.html`: 복구 로그 태그를 `[HARUMAL recovery]`로 바꿨다. 사용자 노출 복구 문구는 PR #249에서 이미 네 언어 정직 안내로 바뀌어 있었다.
- `sw.js`: 캐시 접두사 `harumal-v`.
- `docs/HANDOFF.md`: v177·v178 절 추가.

## 공통 한계

- 이 작업 환경에는 Node 22를 직접 내려 받아 설치했고, Chrome이 없어 로컬 헤드리스 브라우저 검증을 하지 못했다. 실제 화면·오프라인·모바일 검증은 `Verify MALBIT` CI(실제 Chrome·모바일 390×844·여러 폭)와 배포 후 라이브 확인에 의존한다.
- 저장소의 자산(audio 200MB, assets 191MB)을 모두 받지 않고 필요한 파일만 체크아웃했으므로, 자산 바이트를 요구하는 로컬 검사(`v3 video`, `v168 media`, SFX, 문항 이미지, 듣기 카탈로그 등 63건)는 이 환경에서 원래부터 실패한다. 이 실패는 이번 변경과 무관하며 CI에서 판정한다.
