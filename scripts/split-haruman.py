"""Crop the eight generated Haruman cuts; preserve drawing pixels and transparent edges.
Requires Pillow, numpy, scipy. Source is versioned so production cuts are reproducible.
"""
from pathlib import Path
from PIL import Image
import numpy as np
from scipy.ndimage import label, binary_dilation
import hashlib, json
root=Path(__file__).resolve().parent.parent
source=root/'assets/source/haruman-emotions-v1.png'
im=Image.open(source).convert('RGBA');pixels=np.array(im)
labels,_=label(pixels[:,:,3]>100)
names=['welcome','thinking','correct','retry','celebrate','encourage','journey','rest']
out=root/'assets/art/haruman';out.mkdir(parents=True,exist_ok=True);entries=[]
for i,name in enumerate(names):
    # Connected components prevent neighboring hands leaking across grid boundaries.
    components=[i+1]+([9,10,11] if name=='encourage' else [])
    mask=binary_dilation(np.isin(labels,components),iterations=2)
    frame=pixels.copy();frame[:,:,3]=np.where(mask,frame[:,:,3],0)
    cut=Image.fromarray(frame);box=cut.getbbox();cut=cut.crop(box)
    cut.thumbnail((288,288),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(320,320));canvas.alpha_composite(cut,((320-cut.width)//2,(320-cut.height)//2))
    canvas.save(out/(name+'-v1.webp'),format='WEBP',quality=90,method=4)
    canvas.save(out/(name+'-v1.png'),optimize=True)
    entries.append(dict(emotion=name,file=name+'-v1.webp',width=320,height=320,sourceRect=box,bytes=(out/(name+'-v1.webp')).stat().st_size))
(out/'manifest.json').write_text(json.dumps(dict(name='하루만',identity='Round apricot body, three attached rounded rays, bent tall centre ray, teal limbs; approved pre-ABC reference.',source='assets/source/haruman-emotions-v1.png',sourceSHA256=hashlib.sha256(source.read_bytes()).hexdigest(),frames=entries),ensure_ascii=False,indent=2)+'\n')
print('8 isolated transparent cuts:',sum(e['bytes'] for e in entries),'WebP bytes')
