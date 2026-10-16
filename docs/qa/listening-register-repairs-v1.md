# Listening register repairs: local generation, 2026-10-15

## Scope and evidence

- Exact scope: M01–M12, TOPIK II listening questions 09–20, 144 unchanged IDs.
- Sixty shared spoken strings switch inconsistent sentence-final plain forms to formal
  polite forms within the same speaker's turn. The factual propositions are preserved.
- The separate contextual set of twenty all-plain expert responses / 360 IDs is excluded.
- The independent AI text review covered all sixty replacement strings. Its digest is
  `a59118104e0dc4ec7e4522475ce900e86f80c9736489417c271665ed5ec02414`.
  The exact source record also binds each original and replacement full script by SHA-256.
- No native-speaker/teacher review, actual listening, or physical-device playback occurred.

## Protected content and explanation check

All 144 original passages are empty. Only the proposed `script` field changes. Original
packed rows, IDs, instructions, options, answer indices, Korean/Japanese explanations,
progress storage, the existing exact-script audio catalog, all 363 active MP3s and ten
compatibility MP3s are preserved.

An automated scan of all 144 source Korean/Japanese explanations found no full changed
sentence directly quoted. Five representative questions were also read with their four
choices, answer and explanations: M01-II-L-09, M01-II-L-13, M01-II-L-17,
M06-II-L-16 and M12-II-L-20. The speech-level correction does not change their answer
propositions. Written answer options may retain standard plain-form statements. There are
no `bankCoach` override records for these 144 IDs. This check is not a full content-quality
or translation audit.

## Additional voice-metadata finding

All 48 questions M01–M12-II-L-17–20 explicitly ask for the woman's central opinion, but
each original script has one speaker turn and exactly one M1 catalog segment. This was
established from authored instructions and synthesis metadata, not perceived voice gender
from listening or an inference from the fictional speaker's name.

Examples:

- M01-II-L-17, urban heat island: original M1 / `963aaef575932302`.
- M06-II-L-20, emergency messages: original M1 / `1411b3be2d30681b`.
- M12-II-L-20, used-goods trading: original M1 / `0b25858973636e2e`.

These 48 questions reuse twenty of the sixty changed strings. Their new generation inputs
now select F1 while preserving the explicit question wording. The source separately records
`originalVoices: ["M1"]`, the approved casting correction, and its exact question IDs.
All sixty new clips therefore use the F1 preset; unchanged dialogue turns can still use existing
M1 files. This follows the corrected generation metadata. The new files have now been generated
and automatically verified; no perceived-voice assessment from listening was performed.
The original M1 files and catalog remain unchanged.

## Existing build environment and provisioning specification

- Available: Python 3.12.14, numpy 2.3.5, FFmpeg, PyYAML.
- At the initial inspection, `onnxruntime`, `soundfile`, `librosa`, the local Supertonic
  model and reference `helper.py` were absent. After approval, the pinned model/helper and
  minimal inference packages were provisioned in a separate build-only virtual environment.
  Librosa is unused by this path and was not installed. System packages were not changed.
- The baseline repository has no Python requirements or lockfile. Its package-lock has no npm
  dependencies. The existing generation script directly imports numpy, onnxruntime,
  soundfile and the reference helper. The official helper imports numpy and onnxruntime;
  it needs no remote synthesis service.
- [Official Python requirements](https://raw.githubusercontent.com/supertone-oss-archive/supertonic/main/py/requirements.txt)
  specify ONNX Runtime 1.23.1, NumPy at least 1.26, SoundFile at least 0.12.1,
  librosa at least 0.10, and PyYAML at least 6. The upstream repository also has `uv.lock`;
  no upstream full lockfile or wheel payload was downloaded. A smaller build-only dependency
  set has now been checked against official PyPI metadata and pinned as a proposal below.
- The official model is `supertone-oss-archive/supertonic-3`, fixed revision
  `aafc6e32416a594460b32413efc49d7fe4ce6d46`, already specified by the app's pipeline.
  The [pinned official model metadata](https://huggingface.co/api/models/supertone-oss-archive/supertonic-3/tree/aafc6e32416a594460b32413efc49d7fe4ce6d46?recursive=true)
  reports exactly 398,960,003 bytes for the selected four ONNX files, `onnx/tts.json`,
  `onnx/unicode_indexer.json`, F1/M1 voice presets and model license. The existing generator
  opens both preset files even when this correction corpus needs only new F1 recordings.
- [Official reference code](https://github.com/supertone-oss-archive/supertonic/tree/main/py)
  is archived. Official GitHub metadata identifies the proposed helper commit as
  `1e9799e964ea4c0dad7cde993b65c3c813a7b373`: `py/helper.py` is 15,027 bytes and its
  MIT license is 1,070 bytes. The exact Git blob hashes are recorded; validate them after
  authorized retrieval and review the pinned helper before execution.
- Model terms: the existing OpenRAIL-M notice; reference code: existing MIT notice.
  Local copies are in `docs/licenses`. No new agreement, paid service, credentials,
  remote code execution, upload or deployment is part of this preparation.

The approved setup uses an isolated build-only virtual environment, the specified standard
registry wheels, and the fixed official model/helper. The entire download set was verified
against the recorded byte counts and SHA-256 or Git blob hashes before execution. `pip check`
passed. No packages, model weights or binaries are added to the static site.

The exact approval specification is `docs/qa/listening-audio-provisioning-v1.json`, with
all verified official URLs, metadata-declared file sizes, four model LFS SHA-256 values,
small-file Git blob hashes, and twelve compatible CPython 3.12 Linux x86_64 wheels.
The proposed hash-pinned requirements are `docs/qa/listening-audio-build-requirements.proposed.txt`.
Dependency markers and version ranges were checked against the full twelve-package set.
ONNX Runtime 1.23.1, NumPy 2.3.5, SoundFile 0.13.1 and their nine necessary dependencies
total 43,025,093 wheel bytes. Librosa and PyYAML are not imported by this generator/helper
path and are not included in the minimal proposal. FFmpeg already exists.

The verified download payload is 442,001,193 bytes (about 442 MB decimal), excluding
transport overhead, virtual-environment disk expansion and generated output audio. The
provisioning proposal remains as the original metadata snapshot; the subsequent execution
record is `docs/qa/listening-audio-execution-v1.json`. Public downloads needed no new API
credentials. Synthesis ran locally on CPU; authored text and learner data were not sent to
an external text-to-speech API.

## Validation status

- Reproducible builder and focused tests cover exact ID scope, exact-script replacement,
  review digest, immutable pending flags, no progress writes, old files and bank hashes,
  new/old segment-path separation, and rejection of source drift.
- The final manifest reports expected files 60, verified files 60, missing 0, invalid 0,
  no duplicate audio hashes, and 9,565,040 total MP3 bytes. `decodeVerified` and
  `loudnessMeasured` are true. Audio-to-text meaning, human pronunciation and physical-device
  verification flags remain false.
- `--allow-pending` is a preparation mode only. Normal verification must fail until every
  expected audio file exists and passes decoding. No runtime activation has occurred.
- Before synthesis, normal verification correctly rejected the sixty missing files. After
  synthesis, all sixty files passed decoding, finite-waveform checks, duration, SHA-256,
  integrated loudness and true-peak checks. Generation-progress records match every output.
- Correction, engine-integration and existing-audio tests passed 21/21 after generation;
  the final content lane passed 106/106. Original-bank and original-audio hashes still match.
- A separate freshly synthesized M1/F1 two-turn M01-II-L-09 preview is 17.2577 seconds and
  207,874 bytes. It measures -19.48 LUFS and -2.90 dBTP. Those values establish file/level
  checks only; no claim of listening or natural pronunciation is made.
