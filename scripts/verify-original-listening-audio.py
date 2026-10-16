#!/usr/bin/env python3
"""Measure the frozen original pack and its exact synthesis-input/file mapping.

These checks are technical evidence only. They cannot prove pronunciation,
spoken meaning, naturalness, voice distinction or physical-device playback.
"""
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
parser.add_argument('--allow-pending', action='store_true')
parser.add_argument('--check', action='store_true', help='Verify without rewriting the existing manifest')
parser.add_argument('--output', type=Path, default=ROOT / 'audio/listening/original-v1')
args = parser.parse_args()
folder = args.output.resolve()
assert folder.parent == ROOT / 'audio/listening' and re.fullmatch(r'original-v[1-9]\d*', folder.name)
corpus_bytes = (folder / 'corpus.json').read_bytes()
spec = json.loads(corpus_bytes)
assert spec['sourceSnapshotSha256'] == hashlib.sha256((folder / 'source-snapshot.json').read_bytes()).hexdigest()
expected = [(row, voice) for row in spec['corpus'] for voice in row['voices']]
record_file = folder / 'generation-records.json'
record_bytes = record_file.read_bytes() if record_file.exists() else b''
record = json.loads(record_bytes) if record_bytes else {'files': []}
if record_bytes:
    assert record['sourceSnapshotSha256'] == spec['sourceSnapshotSha256']
    assert record['corpusSha256'] == hashlib.sha256(corpus_bytes).hexdigest()
    assert record['modelRevision'] == spec['modelRevision']
else:
    assert args.allow_pending, 'Generation records are required for verification'
progress = {(row['id'], row['voice']): row for row in record['files']}
assert len(progress) == len(record['files'])


def check(item):
    row, voice = item
    assert hashlib.sha256(row['text'].encode()).hexdigest()[:16] == row['id']
    reused = row.get('reuseFiles', {}).get(voice)
    file = ROOT / reused['file'] if reused else folder / voice / (row['id'] + '.mp3')
    relative = str(file.relative_to(ROOT))
    if row.get('heldForCastReview'):
        return {'id': row['id'], 'voice': voice, 'file': relative, 'status': 'held_for_cast_review'}
    if not file.exists():
        return {'id': row['id'], 'voice': voice, 'file': relative, 'status': 'missing'}
    data = file.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if reused:
        assert digest == reused['sha256'], f'Reused file mismatch: {relative}'
    assert progress[(row['id'], voice)]['sha256'] == digest, f'Generation file mismatch: {relative}'
    assert progress[(row['id'], voice)]['textSha256'] == hashlib.sha256(row['text'].encode()).hexdigest(), f'Generation input mismatch: {relative}'
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels,bit_rate', '-of', 'json', str(file)], capture_output=True, check=True, text=True)
    streams = json.loads(probe.stdout)['streams']
    assert len(streams) == 1
    stream = streams[0]
    assert stream['codec_name'] == 'mp3' and int(stream['sample_rate']) == 44100 and stream['channels'] == 1
    assert int(stream['bit_rate']) == 64000
    decoded = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(file), '-f', 'f32le', '-acodec', 'pcm_f32le', '-ac', '1', '-ar', '44100', '-'], capture_output=True, check=True).stdout
    samples = np.frombuffer(decoded, dtype=np.float32)
    assert samples.size > 8820 and np.isfinite(samples).all(), f'Empty or invalid waveform: {relative}'
    peak = float(np.abs(samples).max())
    rms = float(np.sqrt(np.mean(samples * samples)))
    assert .01 < peak < 1 and rms > .001, f'Silent or clipped waveform: {relative}'
    measurement = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(file), '-af', 'loudnorm=I=-18:TP=-2:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, check=True, text=True)
    metrics = json.loads(re.findall(r'\{[^{}]+\}', measurement.stderr)[-1])
    integrated_lufs = float(metrics['input_i'])
    true_peak_db = float(metrics['input_tp'])
    loudness_range = float(metrics['input_lra'])
    assert all(math.isfinite(value) for value in [integrated_lufs, true_peak_db, loudness_range])
    assert -30 < integrated_lufs < -8 and true_peak_db < 0, f'Out-of-range audio level: {relative}'
    duration = samples.size / 44100
    return {'id': row['id'], 'voice': voice, 'file': relative, 'status': 'decode_verified', 'textSha256': hashlib.sha256(row['text'].encode()).hexdigest(), 'bytes': len(data), 'sha256': digest, 'codec': stream['codec_name'], 'sampleRate': int(stream['sample_rate']), 'channels': stream['channels'], 'bitRate': int(stream['bit_rate']), 'duration': round(duration, 4), 'peak': round(peak, 6), 'rms': round(rms, 6), 'integratedLufs': integrated_lufs, 'truePeakDb': true_peak_db, 'loudnessRangeLu': loudness_range, 'charactersPerSecond': round(len(row['text']) / duration, 3)}


def inspect(item):
    try:
        return check(item)
    except Exception as error:
        row, voice = item
        file = row.get('reuseFiles', {}).get(voice, {}).get('file', f"audio/listening/{folder.name}/{voice}/{row['id']}.mp3")
        return {'id': row['id'], 'voice': voice, 'file': file, 'status': 'invalid', 'error': str(error)}


with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    rows = list(executor.map(inspect, expected))
missing = [row for row in rows if row['status'] == 'missing']
held = [row for row in rows if row['status'] == 'held_for_cast_review']
invalid = [row for row in rows if row['status'] == 'invalid']
files = [row for row in rows if row['status'] == 'decode_verified']
hash_counts = {}
for row in files:
    hash_counts[row['sha256']] = hash_counts.get(row['sha256'], 0) + 1
duplicates = sorted(key for key, count in hash_counts.items() if count > 1)
actual = {str(file.relative_to(ROOT)) for file in folder.glob('*/*.mp3')}
extra = sorted(actual - {row['file'] for row in rows})
verified = not missing and not held and not invalid and not extra and not duplicates
file_names = {row['file'] for row in files}
covered = [id for id, entry in spec['byId'].items() if all(segment.get('pause') or segment['file'] in file_names for segment in entry['segments'])]
rate_warnings = [row['file'] for row in files if not 1.5 <= row['charactersPerSecond'] <= 16]
report = {'version': 1, 'status': 'verification_failed' if invalid or extra or duplicates else 'pending_generation' if missing or held else 'technically_verified_listening_review_pending', 'sourceSnapshotSha256': spec['sourceSnapshotSha256'], 'corpusSha256': hashlib.sha256(corpus_bytes).hexdigest(), 'model': spec['model'], 'modelRevision': spec['modelRevision'], 'voices': sorted({voice for row, voice in expected}), 'questionCount': spec['questionCount'], 'coveredQuestionCount': len(covered), 'coveredQuestionIds': covered, 'expectedFileCount': spec['clipCount'], 'fileCount': len(files), 'missingFileCount': len(missing), 'heldFileCount': len(held), 'invalidFileCount': len(invalid), 'decodeVerified': verified, 'loudnessMeasured': verified, 'synthesisInputMappingVerified': verified, 'scriptToAudioMeaningVerified': False, 'humanPronunciationReview': False, 'physicalDevicePlaybackVerified': False, 'serviceActivationPerformed': False, 'totalBytes': sum(row['bytes'] for row in files), 'totalDuration': round(sum(row['duration'] for row in files), 4), 'files': files, 'missing': missing, 'held': held, 'invalid': invalid, 'unexpectedFiles': extra, 'duplicateAudioHashes': duplicates, 'durationRateReviewWarnings': rate_warnings}
report['generationRecordsSha256'] = hashlib.sha256(record_bytes).hexdigest() if record_bytes else None
if folder.name != 'original-v1':
    report['packId'] = folder.name
    report['newClipCount'] = spec['newClipCount']
    report['reusedClipCount'] = spec['reusedClipCount']
output = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
if args.check:
    assert (folder / 'manifest.json').read_text() == output, 'Existing manifest does not match current verification'
else:
    (folder / 'manifest.json').write_text(output)
print(json.dumps({key: value for key, value in report.items() if key not in ['files', 'missing', 'held', 'invalid', 'coveredQuestionIds']}, ensure_ascii=False))
if invalid or extra or duplicates or ((missing or held) and not args.allow_pending):
    raise SystemExit('Audio pack is not fully technically verified. No service activation was performed.')
