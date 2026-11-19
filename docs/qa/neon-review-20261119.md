# 네온(Neon) 점검 6건 처리 기록 — 2026-11-19 (v177)

점검 원문: `downloads/하루말-제미나이-네온-점검-2026-11-19.md` (제미나이 심층 분석 Neon, v176 `778d7d4` 스냅샷 기준).
이 문서는 그 6건을 저장소에서 어떻게 처리했는지, 무엇을 검증했고 무엇을 검증하지 못했는지 적는다.

## 이번 릴리스(v177) 범위 — ①②③④⑥

### ① 입력창 예외 처리 — `app-touch.js`

- `input`, `textarea`, `[contenteditable]` 안에서는 `contextmenu`·`selectstart`·`copy`·`cut`·`paste`를 더 이상 가로채지 않는다. 커서 이동용 길게 누르기, 붙여넣기, 복사가 브라우저 기본 동작으로 돌아온다.
- 정지 상태 400ms 뒤 `blur()`를 강제하던 `touchstart`/`touchmove` 로직을 통째로 제거했다. 비입력 영역의 기존 터치 콜아웃 억제와 학습 텍스트(`.selectable`, `.vocab-zone`) 선택 예외는 그대로다.
- 회귀: `tests/native-vocabulary-selection.test.cjs`(4건), `tests/vocab-test.test.cjs`의 클립보드 억제 테스트를 새 동작 기준으로 바꿨다.
- 실기기 확인은 하지 않았다. iOS Safari 롱프레스를 쓴 실제 붙여넣기는 물리 기기에서만 확인된다.

### ② 렌더 래핑·감시 중복 정리 — `site-patch-core.js`, `site-patch.js`, `app-polish-v22/24/33/34/35.js`, `review-visual-system.js`, `random-practice-visual-system.js`

- `app-polish-v33/34/35.js`의 `patchVersion()`을 삭제했다. 이 함수는 설정 화면 배지를 실제 버전 대신 `v33`/`v34`/`v35`로 덮어쓰고 있었다(실제 배지는 `v176`이어야 한다). 세 파일 모두 렌더마다 마지막에 실행되므로 사용자가 보는 값이 항상 틀린 값이었다.
- `document.body` 전체를 감시하던 `MutationObserver` 4개(v22·v24·review·random)를 `site-patch-core.js`의 단일 감시자로 모았다. 각 모듈은 `window.tqOnBodyChange(callback)`으로 콜백만 등록하고, 감시자는 DOM 변화 폭주마다 rAF 한 번으로 등록 콜백을 순서대로 실행한다.
- `window.render`를 겹겹이 감싸던 7개 레이어를 하나의 후처리 단계로 모았다. 각 레이어는 `window.tqAfterRender(callback)`으로 등록만 하고, `site-patch.js`가 모든 런타임 파일을 읽은 직후 `tqInstallAfterRender()`로 래퍼 하나를 설치한다. 등록 순서(로드 순서)대로 한 번씩 실행되며, `render()`가 없는 환경(단독 모듈 테스트)에서는 예전처럼 스스로 감싼다.
- 회귀: `tests/compat-layer-consolidation.test.cjs`(4건 — body 감시자 단일 소유, 하드코딩 배지 금지, 등록 순서·1회 실행, 부트스트랩 설치 지점), `tests/v33-runtime`, `v34-runtime`, `v35-runtime`, `visual-system`, `home-visual-system`, `shorts-visual-system`, `random-practice-visual-system`, `review-visual-system`, `startup-navigation`, `runtime-contract` 통과.
- 남은 범위: `app-polish-v22~v35`의 기능을 목적별 파일로 완전히 흡수해 파일 자체를 없애는 일은 하지 않았다. 이번 변경은 "겹친 래퍼와 감시자"를 하나로 모은 단계이고, 다음 단계는 각 레이어의 패치 함수를 소유 파일로 옮기는 별도 작업이다.

### ③ 서비스 워커 `SHELL` 동기화 — `sw.js`

- 프리캐시를 실제 런타임 기준으로 다시 적었다. 빠져 있던 핵심 파일(`harumal-ui.js`, `travel-adventure.js`, `travel-mode.js`, `travel-rpg-engine.js`, `beginner-grammar.js`, `vocab-editor.js`, `vocab-test.js`, `vocab-flashcards.js`, `haruman-mascot.js`, `topik1.js`, `learning-features.js`, `site-patch-core.js`, `storage-guard.js`, `product-polish.js`, `product-growth.js`, `app-polish-v22/24/33/34/35.js`, `question-bank-engine.js`, `tts-quality.js`, `listening-audio.js`, `listening-player.js`, `practice-results.js`, `question-tools.js`, `shorts-cycle.js`, `vocabulary-*.js`, `writing-answers.js`, `app-touch.js` 등)을 넣었다.
- 퇴역 에셋 `assets/art/malbit-home-hero.webp`를 `SHELL`에서 뺐다. 코드에서 쓰는 곳이 `prototypes/malbit-case-files.html`(비배포 프로토타입)뿐임을 확인했다. 하루만 v1 8종과 v2 12종 아트는 `assets/art/haruman/manifest.json`·`ui-manifest-v2.json` 계약과 `haruman-mascot.test.cjs`가 요구하므로 그대로 유지했다. RPG 거리 아틀라스 5종과 여행 아바타·스태미나 이미지도 실제 데이터(`data/travel-tiles-korean-street*.js`, `data/travel-pack-seoul-001.js`)가 참조하므로 유지했다.
- 캐시 접두사를 `malbit-v` → `harumal-v`로 바꾸고, 이전 접두사 캐시는 `activate`에서 계속 지운다(`RETIRED_CACHE_PREFIX`). 이에 맞춰 `scripts/check-question-image-release.mjs`는 접두사를 `sw.js`에서 읽도록 바꾸고, `tests/worker-migration-server.test.cjs`의 소스 단언을 갱신했다.
- 문항 은행·듣기 오디오·문항 이미지·인트로 영상은 프리캐시에 넣지 않았다. 크고 선택적이며 첫 사용 시 fetch 핸들러가 캐시한다.
- 회귀: `npm run check:runtime`(102개 런타임·SHELL 존재·버전 일치), `tests/runtime-contract.test.cjs`, `harumal-ui`, `haruman-mascot`, `haruman-intro`, `worker-migration-server` 통과.

### ④ MyMemory 외부 번역 호출 제거 — `legacy-core.js`, `learning-features.js`, `product-polish.js`, `app-polish-v24.js`

- `legacy-core.js`의 `translateCached()`에서 `api.mymemory.translated.net` 호출을 삭제했다. 이제 이 함수는 (1) 같은 언어면 원문, (2) 이미 저장된 번역 캐시(단, `MYMEMORY WARNING` 같은 실패 문구는 제외), (3) 그 밖에는 대상 언어의 "번역 준비 중" 안내만 돌려준다. 네트워크를 타지 않으며 준비 중 안내를 번역으로 캐시하지 않는다.
- 쓰이지 않게 된 `splitText()`도 제거했다.
- `learning-features.js` 수동 단어장: 외국어 입력을 한국어로 자동 변환하던 경로를 없애고, 한국어 표제어를 직접 입력하라는 안내로 바꿨다. 기계 번역된 표제어가 단어장에 저장되던 위험을 없앤다.
- `product-polish.js`의 예문·말하기 번역은 "번역 중…" 대신 "번역 준비 중" 상태를 즉시 보여 준다. `app-polish-v24.js`의 랜덤 실전 전체 번역은 이미 `random-practice-translation.js`가 소유한 정책에 `translate:null`로 넘겨 검수 번역 또는 그 정책의 준비 중 문구만 쓰게 했고, 해설은 검수 번역이 없으면 준비 중 안내 + 한국어 원문을 함께 보여 준다.
- 회귀: `tests/external-translation-removal.test.cjs`(3건 — 런타임 어디에도 해당 호스트 없음, 네트워크 미사용, 캐시·원문 경로), `tests/vocabulary-translation.test.cjs`(기존 클라우드 워커 경로, 계속 `enabled:false`), `tests/vocabulary-library.test.cjs`.
- 참고: `vocabulary-translation.js`의 Cloudflare 워커 경로(`harumal-vocabulary.okometsbu.workers.dev`, `enabled:false`)는 MyMemory가 아니며 여전히 비활성이다.

### ⑥ 문서·브랜드 표기 동기화

- `docs/STATUS.md`: v156에서 멈춰 있던 기록에 v157~v176과 2026-11-19 병합분(#249)을 채웠다. 근거는 해당 병합 커밋과 `docs/HANDOFF.md`의 같은 제목 절이다.
- `README.md`, `AGENTS.md`: 제품명을 `하루말 · HARUMAL`로 맞추고, 저장소·저장 키·레거시 식별자는 그대로 둔다는 점을 명시했다.
- `index.html`: 복구 로그 태그를 `[HARUMAL recovery]`로 바꿨다. PR #249에서 사용자 노출 복구 문구는 이미 네 언어 정직 안내로 바뀌어 있었다.
- `sw.js`: 캐시 접두사 `harumal-v`.
- `docs/HANDOFF.md`: v177 절 추가.

## ⑤ 미완성 커리큘럼·콘텐츠 — 상태

- 쓰기 S01~S06, 자모 획순 33개, 오디오 2.06초 정지는 별도 변경으로 처리한다(같은 날 후속 PR). 결과와 검증 범위는 이 문서의 아래 절에 이어 적는다.

## 공통 한계

- 이 작업 환경에는 Node 22를 직접 내려 받아 설치했고, Chrome이 없어 로컬 헤드리스 브라우저 검증을 하지 못했다. 실제 화면·오프라인·모바일 검증은 `Verify MALBIT` CI(실제 Chrome·모바일 390×844·여러 폭)와 배포 후 라이브 확인에 의존한다.
- 저장소의 자산(audio 200MB, assets 191MB)을 모두 받지 않고 필요한 파일만 체크아웃했으므로, 자산 바이트를 요구하는 로컬 검사(`v3 video`, `v168 media`, SFX, 문항 이미지, 듣기 카탈로그 등)는 이 환경에서 원래부터 실패한다. 이 실패는 이번 변경과 무관하며 CI에서 판정한다.
