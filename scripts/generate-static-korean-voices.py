#!/usr/bin/env python3
"""Generate the bounded, authored Korean corpus with official local Supertonic assets.

No model download, credentials, remote synthesis, or user vocabulary export occurs here.
Install numpy, soundfile and onnxruntime, and provide the separately downloaded official
MIT reference helper.py and the pinned model snapshot described in audio/listening/v1/README.md.
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
parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'audio/listening/v1')
args = parser.parse_args()
sys.path.insert(0, str(args.helper_dir.resolve()))
import numpy as np
import onnxruntime as ort
import soundfile as sf
from helper import TextToSpeech, load_cfgs, load_onnx_all, load_text_processor, load_voice_style

corpus = json.loads((args.output / 'corpus.json').read_text())['corpus']
opts = ort.SessionOptions()
opts.intra_op_num_threads = 2
opts.inter_op_num_threads = 1
onnx = str(args.model_dir / 'onnx')
tts = TextToSpeech(load_cfgs(onnx), load_text_processor(onnx),
                   *load_onnx_all(onnx, opts, ['CPUExecutionProvider']))
progress = args.output / '.generation-progress.json'
rows = []
if progress.exists():
    rows = json.loads(progress.read_text())
completed = {(r['id'], r['voice']): r for r in rows}
for voice in ['F1', 'M1']:
    folder = args.output / voice
    folder.mkdir(parents=True, exist_ok=True)
    style = load_voice_style([str(args.model_dir / 'voice_styles' / f'{voice}.json')])
    for index, row in enumerate(corpus):
        if voice not in row['voices']:
            continue
        if not re.fullmatch(r'[a-f0-9]{16}', row['id']):
            raise ValueError('Invalid corpus ID')
        if hashlib.sha256(row['text'].encode()).hexdigest()[:16] != row['id']:
            raise ValueError('Corpus text hash mismatch')
        target = folder / (row['id'] + '.mp3')
        previous = completed.get((row['id'], voice))
        if target.exists() and previous and hashlib.sha256(target.read_bytes()).hexdigest() == previous['sha256']:
            continue
        np.random.seed(20261009 + index)
        wav, duration = tts(row['text'], 'ko', style, 8, 1.0)
        samples = wav[0, :int(tts.sample_rate * duration[0].item())]
        if not np.isfinite(samples).all() or np.max(np.abs(samples)) < .005:
            raise ValueError('Invalid generated waveform')
        temporary = args.output / '.current.wav'
        sf.write(temporary, samples, tts.sample_rate, subtype='PCM_16')
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(temporary),
                        '-af', 'loudnorm=I=-18:TP=-2:LRA=7', '-ar', '44100', '-ac', '1',
                        '-codec:a', 'libmp3lame', '-b:a', '64k', str(target)], check=True)
        temporary.unlink()
        completed[(row['id'], voice)] = {'id': row['id'], 'voice': voice,
                                       'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}
        progress.write_text(json.dumps(list(completed.values()), indent=2))
        print(f'{voice} {index + 1}/{len(corpus)}', flush=True)
print('Generation complete. Decode/verify every clip and rebuild the manifest before release.')
