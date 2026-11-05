#!/usr/bin/env python3
"""Decode the four exact dialogue repair files; this does not certify pronunciation."""
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'audio/listening/dialogue-register-v1'
sha = lambda b: hashlib.sha256(b).hexdigest()
corpus_bytes = (FOLDER / 'corpus.json').read_bytes()
spec = json.loads(corpus_bytes)
assert spec['questionCount'] == 2 and spec['clipCount'] == 4
files = []
for row in spec['corpus']:
    assert sha(row['text'].encode())[:16] == row['id']
    for voice in row['voices']:
        relative = f"audio/listening/dialogue-register-v1/{voice}/{row['id']}.mp3"
        path = ROOT / relative
        data = path.read_bytes()
        decoded = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-acodec', 'pcm_f32le', '-ac', '1', '-ar', '44100', '-'], capture_output=True, check=True).stdout
        samples = np.frombuffer(decoded, dtype=np.float32)
        assert samples.size > 8820 and np.isfinite(samples).all()
        peak, rms = float(np.abs(samples).max()), float(np.sqrt(np.mean(samples * samples)))
        assert .01 < peak < 1 and rms > .001
        measurement = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'loudnorm=I=-18:TP=-2:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, check=True, text=True)
        metrics = json.loads(re.findall(r'\{[^{}]+\}', measurement.stderr)[-1])
        lufs, tp, lra = float(metrics['input_i']), float(metrics['input_tp']), float(metrics['input_lra'])
        assert all(math.isfinite(v) for v in [lufs,tp,lra]) and -30 < lufs < -8 and tp < 0
        files.append({'id': row['id'], 'voice': voice, 'text': row['text'], 'textSha256': sha(row['text'].encode()), 'file': relative, 'sha256': sha(data), 'bytes': len(data), 'duration': round(samples.size / 44100, 6), 'decodeVerified': True, 'peak': round(peak, 6), 'rms': round(rms, 6), 'integratedLufs': lufs, 'truePeakDb': tp, 'loudnessRangeLu': lra})
assert len(files)==4
manifest = {'version':1,'verified':True,'decodeVerified':True,'humanPronunciationReview':False,'actualListeningPerformed':False,'corpusSha256':sha(corpus_bytes),'model':spec['model'],'modelRevision':spec['modelRevision'],'questionCount':2,'fileCount':4,'files':files}
(FOLDER/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(f"Verified {len(files)} exact dialogue files; {sum(x['bytes'] for x in files)} bytes; {sum(x['duration'] for x in files):.2f}s. Pronunciation remains unverified.")
