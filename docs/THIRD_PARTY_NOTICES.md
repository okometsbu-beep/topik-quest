# Third-party notices

## Pre-generated Korean listening audio

`audio/listening/v1/` contains synthetic speech generated offline from the official
[Supertonic 3 snapshot](https://huggingface.co/supertone-oss-archive/supertonic-3/tree/aafc6e32416a594460b32413efc49d7fe4ce6d46).
Female preset F1 and male preset M1 are synthetic stock voices, not imitations of named people.

- Model license: [BigScience Open RAIL-M](licenses/supertonic-openrail-m.txt), including use restrictions.
- Reference inference code: [Supertone archive](https://github.com/supertone-oss-archive/supertonic), [MIT copy](licenses/supertonic-code-mit.txt).
- Build runtime: ONNX Runtime, MIT. Build-only audio encoding uses FFmpeg; no FFmpeg binary is bundled.

The public application serves generated MP3s. It does not load Supertonic model weights or
send learner text to a model service. Generic device speech remains OS-dependent.
The model upstream is archived with development/support ended. Names are attribution,
not endorsement. Details and exact audio coverage are in `audio/listening/v1/README.md`.

## Historical optional local model source

`neural-tts.js` is retained as legacy source but is not loaded by the current application.
Its previous optional browser pack used the Kyumdroid FP16 conversion, OpenRAIL-M model terms,
and ONNX Runtime Web (MIT). The current UI exposes no download or activation for this model.
