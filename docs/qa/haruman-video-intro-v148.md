# 하루말 영상 인트로 v148

최신 topik-quest v147(66873b0) 위에 적용. 기술 스택: 정적 HTML/JavaScript PWA; 네이티브 iOS/Android 프로젝트는 없음.

## 동작
- 원본 15–82프레임, 0.625–3.458초를 사용: 깨어남 → 도약 → 착지 → 안정, 68프레임/24fps = 2.833초.
- 처음/일반 실행은 동일한 짧은 동작. 같은 탭에서 60초 이내 재진입(업데이트 재시작 포함)은 생략.
- 무음 및 playsinline, 1:1 object-fit:contain. 전체 화면 터치, 건너뛰기 버튼, Escape 지원.
- WebM VP9 디코딩 후 첫 프레임 모서리 알파를 검사. 알파 미지원/코덱 미지원은 H.264 MP4 선택.
- MP4는 제공된 투명 원본을 대문과 동일한 #f7f8f4에 합성. 투명판과 같은 밝은 배경을 사용해 다크 테마에서도 캐릭터 윤곽을 보존.
- 로딩 오류/자동재생 거부는 인트로 즉시 제거. 로딩 무응답은 800ms, 재생 정지는 최대 3.38초 + 220ms 페이드로 종료.
- 학습 앱 초기화는 독립적으로 계속 진행. 앱 스크립트가 아직 준비되지 않은 경우 기존 로딩 표시가 유지된다. 영상 때문에 앱 초기화를 기다리지는 않는다.
- 종료/스킵 시 220ms 페이드 후 비디오 자원을 해제. 백그라운드 이동 시 즉시 해제.
- reduced-motion, save-data 설정에서는 영상을 다운로드하지 않음. 기존 학습 저장소는 변경하지 않음.
- 선택 영상만 다운로드. 오프라인 필수 캐시/설치 대상에서 제외하여 영상 실패가 PWA 업데이트를 막지 않음. 오프라인에서는 영상 실패 후 기존 앱 사용.

## 자산
540×540, 24fps, 무음. MP4 88,453 bytes + WebM 374,513 bytes = 462,966 bytes(약 452 KiB).
원본 MP4 881,952 bytes; 원본 WebM 3,875,596 bytes. 원본/소스 ZIP은 배포에 포함하지 않음.

## 변경 파일
index.html: 실제 영상 대문, 초기 스크립트/스타일 연결, SW 갱신 때문에 메인 표시를 지연하지 않음.
haruman-intro.js / haruman-intro.css: 영상 수명주기, 알파 검사, 스킵/실패/페이드, 반응형 배치.
assets/video/haruman-intro-v1.mp4 / .webm: 앱용 최적화 자산.
sw.js: 선택 영상 캐시 우회, 새 스크립트/스타일 캐시, v148.
site-patch.js: 공유 버전 v148.
scripts/serve.mjs: 로컬 영상 MIME 지원.
package.json / tests/haruman-intro.test.cjs: 8개 실패/전환 경로 회귀 검사.
docs/HANDOFF.md: 변경/한계 인계.

## 검증
Node 24: 런타임 버전/문항은행 해시 정상, JS 구문 검사, 전체 171/171 통과(인트로 8개 포함).
FFmpeg로 68프레임/540×540/24fps/무음 및 WebM 알파를 검증. 실제 iPhone/Android 기기 재생, 메모리/FPS, 시각적 앱 전환은 미검증. 테스트의 DOM 모의 객체는 실제 브라우저 재생을 증명하지 않는다.

참고: https://webkit.org/blog/6784/new-video-policies-for-ios/ (muted/playsinline)
https://developer.chrome.com/blog/alpha-transparency-in-chrome-video (WebM alpha)
