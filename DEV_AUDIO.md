# MALBIT audio pipeline

## Listening source priority

The web app should play uploaded audio before browser TTS.

1. `audio/topik2/q001.mp3`
2. `audio/topik2/q001.m4a`
3. `audio/topik2/q001.aac`
4. `audio/topik2/q001.webm`
5. Device Korean TTS fallback

Use the same numbering through `q050`.

## Recommended production path

For the most natural result, use a human recording or generate high-quality Korean neural/HD TTS outside the static GitHub Pages site, then upload the rendered audio files. Do not embed cloud API keys in client-side GitHub Pages code.

A good future backend candidate is Azure Speech because it supports Korean HD/neural voices and Korean pronunciation assessment (`ko-KR`).

## Speaking model audio

Optional speaking reference audio uses:

- `audio/speaking/p001.mp3`
- `audio/speaking/p002.mp3`
- ...

Uploaded model audio is preferred over device TTS.

## Developer studio

The public navigation does not show the recording studio. The development route is intended to be accessed with `?dev=studio`. Since GitHub Pages is static hosting, this is only a hidden route, not real authentication. Real developer-only access requires a backend or authenticated admin surface.
