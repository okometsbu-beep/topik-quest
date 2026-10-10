#!/usr/bin/env python3
"""Decode every bundled speech clip and rebuild its byte/hash/waveform manifest."""
import concurrent.futures,subprocess,json,hashlib,pathlib,numpy as np
from datetime import datetime, timezone
root=pathlib.Path(__file__).resolve().parents[1];audio=root/'audio/listening/v1';spec=json.loads((audio/'corpus.json').read_text());corpus=spec['corpus'];expected=[(row,voice) for row in corpus for voice in row['voices']]
def check(item):
 row,voice=item;path=audio/voice/(row['id']+'.mp3');raw=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-acodec','pcm_f32le','-ac','1','-ar','44100','-'],capture_output=True,check=True).stdout;s=np.frombuffer(raw,dtype=np.float32)
 assert s.size>8820 and np.isfinite(s).all(),str(path)+' empty/invalid';peak=float(np.abs(s).max());rms=float(np.sqrt(np.mean(s*s)));assert peak>.01 and rms>.001,str(path)+' silence';assert peak<1,str(path)+' clipping'
 b=path.read_bytes();return {'id':row['id'],'voice':voice,'file':str(path.relative_to(root)),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'duration':round(s.size/44100,4),'peak':round(peak,6),'rms':round(rms,6)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:rows=list(ex.map(check,expected))
assert len(rows)==spec['clipCount'] and len({r['sha256'] for r in rows})==spec['clipCount']
repairs=json.loads((root/'docs/qa/generated-korean-audio-repairs-v165.json').read_text())['corpus_repairs']
legacy=[check(({'id':r['old_id']},voice)) for r in repairs for voice in r['voices']]
assert not ({r['id'] for r in legacy}&{r['id'] for r in rows})
assert sum(len(list((audio/v).glob('*.mp3'))) for v in ['F1','M1'])==len(rows)+len(legacy)
out={'version':1,'generatedAt':datetime.now(timezone.utc).date().isoformat(),'model':'supertone-oss-archive/supertonic-3','modelRevision':'aafc6e32416a594460b32413efc49d7fe4ce6d46','voices':['F1','M1'],'questionCount':spec['questionCount'],'scriptCount':spec['scriptCount'],'textCount':len(corpus),'fileCount':len(rows),'totalBytes':sum(r['bytes'] for r in rows),'decodeVerified':True,'humanPronunciationReview':False,'physicalIOSPlaybackVerified':False,'files':rows}
out['retainedLegacyFiles']=legacy
(audio/'manifest.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in out.items() if k not in ['files','retainedLegacyFiles']},ensure_ascii=False),flush=True)
