# 번역 문맥·재검토 로컬 수정

기준: main `7d174f39d227dfbe8fee04e80b7c3bd9db8afddd` (v162).
브랜치: `agent/translation-context-fix-20261009`.

## 변경

- 번역 문맥 선택을 `translationContext` 명시값 → 원문 `context` → 첫 `examples[].ko` → legacy `example` 순으로 통일했다. 명시된 빈 문맥은 오래된 원문으로 되돌아가지 않는다.
- 예문을 직접 수정·삭제·이동하면 `translationContext`와 legacy `example`을 동기화한다. 원문 `context`는 보존한다. 번역 전에 보여 주는 동의창은 이 선택된 문맥을 사용한다.
- 편집 중 예문·품사·언어·뜻·메모 등이 달라졌거나 화면을 닫으면 이전 응답을 적용하지 않는다. 뜻 보기 경로도 예문·문맥·품사·수동 출처 변경을 확인한다.
- “뜻 다시 확인”은 cloud 캐시를 건너뛴다. 로컬 검수 문법/동일 예문 자료는 우선 유지하며, cloud 요청에는 기존 동의/Turnstile 절차가 그대로 필요하다.
- 캐시 네임스페이스는 `v2-gemma-4-26b-a4b-it-prompt1`이다. 모델/프롬프트 또는 캐시 의미 계약 변경 시 같이 갱신한다. 이전 캐시는 삭제하지 않고 새 요청에서 사용하지 않는다.
- 기존 자동 오류 판별에 목표 언어를 전달하며 캐시의 단어까지 정확히 일치해야 자동 오류로 인정한다. 수동 작성/수정 이력이 있는 뜻은 여전히 자동 교체하지 않는다.

## 보존

원래 단어장 항목은 편집 초안과 분리한다. 취소는 원래 수동 뜻을 보존한다. 번역 실패나 취소는 정상 캐시를 삭제하지 않는다. 복습 기한·횟수·다른 언어 뜻·메모·원문을 유지한다. 전체 저장소 초기화나 마이그레이션은 없다.

## 검증과 남은 단계

- 단위 회귀: 충돌하는 원문/예문, 편집 문맥, 강제 재검토 및 취소, 이전 캐시 보존, 요청 중 예문/품사/언어/화면 변경, 수동 뜻과 학습 기록 보존.
- 전체 `npm run check`: 대비 패치 통합 및 v163 증가 후 466/466 통과 (runtime·syntax 포함). 집중 번역/편집 회귀 43/43 통과. 로컬 HTTP smoke v163, 4 base + 67 runtime 파일 통과.
- frontend `enabled:false`, Worker `ENABLED:false` 유지. Worker 파일과 계정 설정은 변경하지 않았다.
- 실제 브라우저 동작, 실제 Turnstile, 실제 모델 의미 품질은 아직 검증하지 않았다. 합성 fixture 통과는 모델 정확도 증거가 아니다.
- 원격 게시·활성화·배포 전 별도 검토가 필요하다. 발행용 공개 자산 버전은 v163으로 한 번 증가했다. 원격 게시 및 배포는 아직 하지 않았다.


## 대비 패치 통합

`853a2f583b90a47095d27cc6e4790651fc0984e8`의 듣기 헤더 대비 수정 두 파일을 cherry-pick했다. `harumal-ui.css`와 `tests/harumal-ui.test.cjs`에 5줄을 추가한다. 통합 커밋은 `00faf12`이며 번역 수정 커밋은 `35e4f61`이다. 커밋 한정 자동화 작성자 설정을 사용했고 전역 Git 설정은 변경하지 않았다.

## 실제 브라우저·Turnstile 검증 경로

- 사용 가능한 cloud browser를 실제 조회했다. 공개 하루말 앱은 열리고 학습 홈 DOM을 확인할 수 있다. 공개 앱 확인은 아직 미게시인 이 후보의 UI 통과 증거가 아니다.
- 같은 cloud browser에서 후보의 `http://127.0.0.1:4187/`은 `ERR_CONNECTION_REFUSED`였다. 이 경로의 후보 브라우저 QA는 수행하지 못했다. 별도 동일 프로세스 로컬 서버/HTTP smoke는 4188에서 정상 통과했다. 두 결과를 혼동하지 않는다.
- 게시 승인 후 기존 `.github/workflows/verify.yml`의 Ubuntu Chrome 경로가 후보 브라우저 회귀의 구체적 경로다. `scripts/check-travel-mobile.mjs`는 기존 Home/Vocabulary·선택 범위 회귀와 모바일 스크린샷을 수행한다. 새 번역 동의/편집 지연 경로의 실브라우저 검증은 추가 브라우저 시나리오 또는 수동 QA가 필요하다. 현재 VM 단위 검사를 실제 브라우저 통과로 세지 않는다.
- 실제 Turnstile은 현재 disabled Worker가 인증보다 먼저 차단하므로, 그대로는 end-to-end 확인할 수 없다. 실제 운영용 AI를 켜는 대신 별도 승인된 검증 환경에서 추론을 실행하지 않는 검증 경로를 먼저 마련하거나, 한정된 합성 평가 활성화 승인을 받아야 한다. hostname/action 검증과 동의 흐름을 유지한다. 현재 설정/서버는 바꾸지 않았다.
- 공개 앱은 cloud browser에서 접근되므로 지금 사용자 컴퓨터 연결이 필수라는 증거는 없다. 실 CAPTCHA가 나오면 해당 CAPTCHA 해결 승인 또는 사용자 직접 처리가 필요할 수 있다. Cloudflare 계정 로그인/새 검증 배포 권한이 없으면 그 단계에서만 필요한 조치를 요청한다. 비밀키를 채팅으로 요청하지 않는다.

## 신규 브라우저 mock 시나리오

`scripts/vocabulary-translation-browser-checks.mjs`를 기존 Chrome 회귀 실행기에 연결했다. localhost에서만 합성 단어장과 가짜 Turnstile·fetch를 사용하며 외부 모델 엔드포인트를 호출하지 않는다. 동의 전 무전송, 동의 전/검증 도중 취소, 늦은 proof 콜백 무시, 예문 변경 후 늦은 응답 무시, 수정 문맥 preview/전송, 저장 전 원본 보존, 저장/재열기, 재검토 캐시 우회 후 취소 보존을 검사한다. 390/320px 스크린샷은 기존 mobile artifact에 포함된다.

실행: `HARUMAL_TRANSLATION_ONLY=1 node scripts/check-travel-mobile.mjs`. 기본 전체 Chrome 검사에서도 호출된다. 로컬 Chrome 실행은 `socket() failed: Operation not permitted`로 차단되어 중단했다. GitHub Actions의 실제 Chrome 결과를 확인해야 하며, 로컬 정적 검사 통과를 브라우저 통과로 보고하지 않는다. 실제 Turnstile 및 모델 품질 평가는 별도 미실행 상태다.
