#!/usr/bin/env python3
"""Verify the separate repair pack. Missing audio is explicit; this never activates it."""
import argparse
import concurrent.futures
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--allow-pending', action='store_true', help='Write an explicit incomplete report instead of failing on missing clips.')
args = parser.parse_args()
folder = ROOT / 'audio/listening/register-v1'
corpus_bytes = (folder / 'corpus.json').read_bytes()
spec = json.loads(corpus_bytes)
expected = [(row, voice) for row in spec['corpus'] for voice in row['voices']]


def check(item):
    row, voice = item
    assert hashlib.sha256(row['text'].encode()).hexdigest()[:16] == row['id']
    file = folder / voice / (row['id'] + '.mp3')
    if not file.exists():
        return {'id': row['id'], 'voice': voice, 'file': str(file.relative_to(ROOT)), 'status': 'missing'}
    decoded = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(file), '-f', 'f32le', '-acodec', 'pcm_f32le', '-ac', '1', '-ar', '44100', '-'], capture_output=True, check=True).stdout
    samples = np.frombuffer(decoded, dtype=np.float32)
    assert samples.size > 8820 and np.isfinite(samples).all(), f'Empty or invalid waveform: {file}'
    peak = float(np.abs(samples).max())
    rms = float(np.sqrt(np.mean(samples * samples)))
    assert .01 < peak < 1 and rms > .001, f'Silent or clipped waveform: {file}'
    data = file.read_bytes()
    for old_file in row['retainedOriginalFiles']:
        assert hashlib.sha256((ROOT / old_file).read_bytes()).digest() != hashlib.sha256(data).digest(), f'Old audio incorrectly reused: {file}'
    measurement = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(file), '-af', 'loudnorm=I=-18:TP=-2:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, check=True, text=True)
    metrics = json.loads(re.findall(r'\{[^{}]+\}', measurement.stderr)[-1])
    integrated_lufs = float(metrics['input_i'])
    true_peak_db = float(metrics['input_tp'])
    loudness_range = float(metrics['input_lra'])
    assert all(math.isfinite(value) for value in [integrated_lufs, true_peak_db, loudness_range]), f'Invalid loudness measurement: {file}'
    assert -30 < integrated_lufs < -8 and true_peak_db < 0, f'Unsafe or out-of-range audio level: {file}'
    return {'id': row['id'], 'voice': voice, 'file': str(file.relative_to(ROOT)), 'status': 'decode_verified', 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'duration': round(samples.size / 44100, 4), 'peak': round(peak, 6), 'rms': round(rms, 6), 'integratedLufs': integrated_lufs, 'truePeakDb': true_peak_db, 'loudnessRangeLu': loudness_range}


def inspect(item):
    try:
        return check(item)
    except Exception as error:
        row, voice = item
        return {'id': row['id'], 'voice': voice, 'file': f"audio/listening/register-v1/{voice}/{row['id']}.mp3", 'status': 'invalid', 'error': str(error)}


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    rows = list(executor.map(inspect, expected))
missing = [row for row in rows if row['status'] == 'missing']
invalid = [row for row in rows if row['status'] == 'invalid']
files = [row for row in rows if row['status'] == 'decode_verified']
hash_counts = {}
for row in files:
    hash_counts[row['sha256']] = hash_counts.get(row['sha256'], 0) + 1
duplicate_hashes = sorted(key for key, count in hash_counts.items() if count > 1)
actual = {str(file.relative_to(ROOT)) for voice in ['F1', 'M1'] for file in (folder / voice).glob('*.mp3')}
extra = sorted(actual - {row['file'] for row in rows})
verified = not missing and not invalid and not extra and not duplicate_hashes
report = {'version': 1, 'status': 'verification_failed' if invalid or extra or duplicate_hashes else 'pending_generation' if missing else 'decode_verified_pending_review', 'corpusSha256': hashlib.sha256(corpus_bytes).hexdigest(), 'model': spec['model'], 'modelRevision': spec['modelRevision'], 'questionCount': spec['questionCount'], 'expectedFileCount': spec['clipCount'], 'fileCount': len(files), 'missingFileCount': len(missing), 'invalidFileCount': len(invalid), 'decodeVerified': verified, 'loudnessMeasured': verified, 'scriptToAudioMeaningVerified': False, 'humanPronunciationReview': False, 'physicalDevicePlaybackVerified': False, 'activationAllowed': False, 'totalBytes': sum(row['bytes'] for row in files), 'files': files, 'missing': missing, 'invalid': invalid, 'unexpectedFiles': extra, 'duplicateAudioHashes': duplicate_hashes}
(folder / 'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: value for key, value in report.items() if key not in ['files', 'missing', 'invalid']}, ensure_ascii=False))
if invalid or extra or duplicate_hashes:
    raise SystemExit('Audio verification failed. No correction has been activated.')
if missing and not args.allow_pending:
    raise SystemExit('Audio generation incomplete. No correction has been activated.')
