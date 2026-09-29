# 하루말 무료·무제한 한국어 TTS 타당성 결정 — 2026-09-29

## 결론

이번 회차에는 모델 파일, 앱 코드, 공개 버전을 바꾸지 않았다. 현재 하루말은 정적 GitHub Pages PWA이며 `MALBIT_TTS` 공통 경계를 이미 갖고 있다. 현재 선택지는 기기 `speechSynthesis` 또는 데스크톱에서만 허용하는 약 230MB Supertonic 3 FP16 브라우저 팩이다.

첫 프로토타입 후보는 **Supertonic 3 Korean INT8 + sherpa-onnx native runtime**으로 고정한다. sherpa-onnx의 공식 모델 카탈로그가 한국어·INT8 모델과 Android APK, Swift/Kotlin/Node API를 함께 제공하므로 iOS/Android 경계를 실제로 측정할 수 있는 가장 현실적인 후보이다. 다만 Supertonic 모델은 OpenRAIL-M 조건을 따르며, 모델 upstream은 보관(archived) 상태이므로 상업·스토어 출시 전 라이선스 검수와 유지보수 계획이 필수다.

**Ppaso-TTS v8**은 Apache-2.0·약 37MB ONNX의 상업용 안전성 비교군으로만 둔다. 한국어 전용이고 가볍지만 모델 카드가 로봇 같은 음색, 외래어·희귀어·긴 문장 한계를 명시하므로 하루말의 기본 음성으로 바로 채택하지 않는다. Qwen3-TTS와 Kokoro는 이번 모바일 1차 후보에서 제외한다.

## 현재 코드 경계

- `tts-quality.js`: 전 화면이 사용할 `window.MALBIT_TTS` 파사드, 기기 음성 선택, 재생 취소/직렬화, 속도 설정을 소유한다.
- `neural-tts.js`: 브라우저 Cache API에 Supertonic 3 FP16 모델과 ONNX Runtime Web을 내려받고 생성한다. 현재 팩은 생성 오디오 캐시가 없고, 모바일·저메모리 환경에서는 세션을 열지 않는다.
- `site-patch.js`/`sw.js`: 정적 런타임과 모델 캐시를 연결한다. 현재 구조만으로는 iOS/Android 시스템 음성의 오프라인 동작이나 일관된 음질을 보장할 수 없다.
- 일부 구형 화면에는 직접 `speechSynthesis` 호출이 남아 있어, 네이티브 엔진을 넣기 전에 공통 파사드로 수렴해야 한다.

현재 확인하지 않은 것: iPhone/Android 실기기 성능, 한국어 교사·모어 화자의 자연스러움 비교, cold/warm latency, 실시간 배율(RTF), peak RAM, 실제 INT8 다운로드 크기, 스토어 법률 검토.

## 후보 비교

| 후보 | 한국어/품질 판단 | 모바일·크기 판단 | 라이선스·재배포 | 결정 |
|---|---|---|---|---|
| Supertonic 3 FP16 browser | 한국어 포함 31개 언어, 현재 앱에 이미 연결됨 | 공식 자료는 CPU·99M 파라미터. 현재 웹 팩은 약 230MB이고 모바일 메모리 안전 때문에 차단 | 모델 OpenRAIL-M, 브라우저 예제/ORT는 MIT. upstream archived | 기존 호환 경로로 유지하되 1차 모바일 배포 후보 아님 |
| **Supertonic 3 INT8 + sherpa-onnx** | 같은 계열의 한국어·10음색, 품질은 실기기 청취 검증 필요 | 공식 sherpa 카탈로그에 INT8, Android APK, Swift/Kotlin API. 실제 APK/모델 크기·RAM을 측정해야 함 | 모델 OpenRAIL-M; sherpa-onnx 런타임 Apache-2.0 | **1차 native 프로토타입** |
| Ppaso-TTS v8 | 한국어 전용, 연음/받침 개선 주장. 음색이 로봇 같고 외래어·희귀어·긴 문장 한계 | 약 37MB ONNX CPU. 공식 모바일 앱 통합은 확인하지 못함 | Apache-2.0, NOTICE/attribution 필요 | 상업용 경량 비교군 |
| Qwen3-TTS 0.6B | 한국어 포함 10개 언어, 0.6B급. 긴 문장·자연스러움은 별도 청취 평가 필요 | 공식 사용법이 PyTorch/BF16/FlashAttention/CUDA 중심. iOS/Android 런타임·배포 경로가 없음 | Apache-2.0 | 데스크톱 품질 기준용, 모바일 1차 제외 |
| Kokoro 82M | 82M·Apache-2.0이지만 공식 모델 카드의 음색 목록은 영어이며 한국어 지원 근거가 없음 | 커뮤니티 ONNX/q8/q4는 브라우저 가능성이 있으나 한국어가 확인되지 않음 | Apache-2.0 | 한국어 후보에서 제외 |
| Piper KSS 계열 | 한국어 커뮤니티 모델이 있으나 기본 Piper 저장소에는 공식 한국어 경로가 없음 | 경량 ONNX 가능 | 확인한 KSS 모델은 CC-BY-NC-SA-4.0 | **상업 앱에서 제외** |
| 기기 `speechSynthesis` | OS 음성에 따라 한국어 발음·받침·속도가 달라짐 | 앱 용량 증가 없음, 즉시 실행. 오프라인 여부와 음성 존재는 OS 의존 | 앱이 모델을 재배포하지 않음 | 항상 남기는 호환 fallback |

## 목표 구조

1. `KoreanTextNormalizer`가 표시 텍스트와 `speakText`를 분리한다. 예: `3명→세 명`, `₩15,000→만 오천 원`; 날짜·시간·단위·영어 약어는 고정된 문맥별 규칙과 테스트 벡터로 관리한다.
2. `MALBIT_TTS`는 `device`, `supertonic-native`, `supertonic-web`, 향후 `ppaso-native` 어댑터만 노출한다. 화면은 엔진을 직접 부르지 않는다.
3. 생성 오디오는 IndexedDB에 WAV/PCM으로 캐시한다. 키는 `normalizedText + engine + modelRevision + voice + speed + punctuationMode`의 해시이며, LRU/용량 상한과 모델 제거 시 정리 규칙을 둔다. 시스템 음성은 오디오 버퍼를 보장하지 않으므로 캐시 대상이 아니다.
4. 동일 키는 single-flight로 합치고, 새 재생은 이전 재생을 취소한다. 일반 1.0x와 느린 0.72–0.80x를 공통 설정으로 제공하며 생성 단계 속도와 재생 속도를 구분해 검증한다.
5. 정적 PWA에서는 선택적 Web/WASM 팩으로 남기고, 진짜 양대 모바일 오프라인 보장은 Capacitor/Flutter/React Native 같은 native shell + sherpa-onnx/ONNX 경로의 별도 실험으로 검증한다. 모델을 앱에 무조건 번들하지 않는다.

## 다음 한 작업: 최소 프로토타입

별도 native shell을 즉시 제품에 넣지 않고, 먼저 INT8 모델·런타임을 작은 harness로 연결해 다음을 같은 조건에서 잰다.

- 문장: `안녕하세요`, `같이 가요`, `저는 오늘 친구를 만나러 가요.`
- 확장: 받침/연음, `3명`, `10월 3일`, `₩15,000`, 외래어, 20초 이상 문장
- 기록: 다운로드 바이트, cold/warm 생성 시간, RTF, peak RAM, 반복 재생 시간, 배터리/발열 관찰, iPhone·Android OS/칩/앱 버전
- 기능: 일반/느린 발음, 취소·재생 중첩 방지, 정규화 결과, 동일 문장 캐시 적중, 모델 삭제 후 기기 음성 fallback, 모델 설치 뒤 네트워크 차단 재생

다음 프로토타입은 측정과 실패 경계만 추가한다. 실제 기기와 법률 검수 전에는 `Supertonic 3 INT8`을 공개 기본 엔진으로 선언하거나 모델을 저장소에 커밋·번들하지 않는다.

## 출시 게이트

- OpenRAIL-M의 제한·고지·파생 모델 출처를 확인하고, Ppaso 선택 시 Apache NOTICE를 포함한다.
- iOS와 Android 실기기에서 첫 생성/반복 재생/오프라인 재생/취소를 각각 확인한다. 브라우저 에뮬레이션은 실기기 증거로 세지 않는다.
- 한국어 교정자 또는 모어 화자가 받침·연음·숫자/날짜/단위·외래어·긴 문장을 검수한다.
- 앱 용량, 모델 다운로드, peak RAM, RTF, 실패율, 저장공간 상한을 기록한다. 기준을 통과하지 못하면 기기 음성 fallback만 배포한다.

이 문서는 **결정·범위 고정 기록**이며 v147 제품 자산, 저장 데이터, 문제은행, 버전을 변경하지 않는다.

## 공식 근거

- [Supertone Supertonic 모델 카드](https://huggingface.co/Supertone/supertonic-3)
- [Kyumdroid Supertonic quantized card](https://huggingface.co/Kyumdroid/supertonic-3-quant)
- [sherpa-onnx Supertonic-3 Korean/INT8 docs](https://k2-fsa.github.io/sherpa/onnx/tts/supertonic-3.html)
- [sherpa-onnx repository](https://github.com/k2-fsa/sherpa-onnx)
- [Ppaso-TTS v8 model card](https://huggingface.co/akamotaco/ppaso-tts-v1)
- [Qwen3-TTS repository](https://github.com/QwenLM/Qwen3-TTS) · [0.6B model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice)
- [Kokoro model card](https://huggingface.co/hexgrad/Kokoro-82M)
- [Piper KSS Korean community card](https://huggingface.co/neurlang/piper-onnx-kss-korean)
