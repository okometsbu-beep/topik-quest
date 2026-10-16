#!/usr/bin/env python3
"""Offline stock-voice synthesis from the frozen original listening corpus only.

Uses already installed official pinned Supertonic helper/model files. No network,
downloads, learner data, answer options or explanations are passed to inference.
Any explicitly held corpus rows are skipped. Three-role scripts use the approved
F2 stock preset for a separate moderator voice.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--model-dir', type=Path, required=True)
parser.add_argument('--helper-dir', type=Path, required=True)
parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'audio/listening/original-v1')
args = parser.parse_args()
sys.path.insert(0, str(args.helper_dir.resolve()))
import numpy as np
import onnxruntime as ort
import soundfile as sf
from helper import TextToSpeech, load_cfgs, load_onnx_all, load_text_processor, load_voice_style

corpus_bytes = (args.output / 'corpus.json').read_bytes()
spec = json.loads(corpus_bytes)
corpus = spec['corpus']
opts = ort.SessionOptions()
opts.intra_op_num_threads = 2
opts.inter_op_num_threads = 1
onnx = str(args.model_dir / 'onnx')
tts = TextToSpeech(load_cfgs(onnx), load_text_processor(onnx),
                   *load_onnx_all(onnx, opts, ['CPUExecutionProvider']))
progress = args.output / '.generation-progress.json'
completed = {(row['id'], row['voice']): row for row in json.loads(progress.read_text())} if progress.exists() else {}
for row in corpus:
    for voice, reused in row.get('reuseFiles', {}).items():
        source = Path(__file__).resolve().parents[1] / reused['file']
        assert hashlib.sha256(source.read_bytes()).hexdigest() == reused['sha256']
        completed[(row['id'], voice)] = {'id': row['id'], 'voice': voice, 'textSha256': hashlib.sha256(row['text'].encode()).hexdigest(), 'sha256': reused['sha256'], 'reusedFrom': reused['file']}
for voice in sorted({voice for row in corpus if not row.get('heldForCastReview') for voice in row['voices']}):
    folder = args.output / voice
    folder.mkdir(parents=True, exist_ok=True)
    style = load_voice_style([str(args.model_dir / 'voice_styles' / f'{voice}.json')])
    for index, row in enumerate(corpus):
        if voice not in row['voices'] or row.get('heldForCastReview') or voice in row.get('reuseFiles', {}):
            continue
        assert re.fullmatch(r'[a-f0-9]{16}', row['id'])
        assert hashlib.sha256(row['text'].encode()).hexdigest()[:16] == row['id']
        target = folder / (row['id'] + '.mp3')
        previous = completed.get((row['id'], voice))
        if target.exists() and previous and hashlib.sha256(target.read_bytes()).hexdigest() == previous['sha256'] and previous.get('textSha256') == hashlib.sha256(row['text'].encode()).hexdigest():
            continue
        np.random.seed(20261015 + index)
        wav, duration = tts(row['text'], 'ko', style, 8, 1.0)
        samples = wav[0, :int(tts.sample_rate * duration[0].item())]
        assert np.isfinite(samples).all() and np.max(np.abs(samples)) >= .005
        temporary = args.output / '.current.wav'
        sf.write(temporary, samples, tts.sample_rate, subtype='PCM_16')
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(temporary),
                        '-af', 'loudnorm=I=-18:TP=-2:LRA=7', '-ar', '44100', '-ac', '1',
                        '-codec:a', 'libmp3lame', '-b:a', '64k', str(target)], check=True)
        temporary.unlink()
        completed[(row['id'], voice)] = {'id': row['id'], 'voice': voice,
                                       'textSha256': hashlib.sha256(row['text'].encode()).hexdigest(),
                                       'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}
        progress.write_text(json.dumps(list(completed.values()), indent=2))
        print(f'{len(completed)}/{spec["clipCount"]}: {voice} {row["id"]} ({len(row["text"])} chars)', flush=True)
eligible = [(row['id'], voice) for row in corpus if not row.get('heldForCastReview') for voice in row['voices']]
record = {'version': 1, 'sourceSnapshotSha256': spec['sourceSnapshotSha256'],
          'corpusSha256': hashlib.sha256(corpus_bytes).hexdigest(),
          'model': spec['model'], 'modelRevision': spec['modelRevision'],
          'referenceHelperSha256': hashlib.sha256((args.helper_dir / 'helper.py').read_bytes()).hexdigest(),
          'voiceStyleSha256': {voice: hashlib.sha256((args.model_dir / 'voice_styles' / f'{voice}.json').read_bytes()).hexdigest() for voice in sorted({voice for _, voice in eligible})},
          'provider': 'CPUExecutionProvider', 'language': 'ko', 'denoisingSteps': 8, 'speed': 1.0,
          'seedBase': 20261015, 'seedRule': 'seedBase + corpus row index',
          'encoding': 'ffmpeg loudnorm I=-18:TP=-2:LRA=7; 44100 Hz mono libmp3lame 64 kbps',
          'files': [completed[key] for key in eligible]}
(args.output / 'generation-records.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
print('Eligible synthesis complete. Decode and verify all files before building the catalog.')
