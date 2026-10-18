"""Display SVG derivatives and reviewed redraws; preserve original source bytes."""
import hashlib, json, pathlib, re, sys, unicodedata, xml.etree.ElementTree as ET
ROOT = pathlib.Path(__file__).resolve().parent.parent
check = '--check' in sys.argv
sha = lambda b: hashlib.sha256(b).hexdigest()
mapping = {}; audit = []
redraw_dir = ROOT/'content/question-visual-redraws'
redraws = json.loads((redraw_dir/'manifest.json').read_text(encoding='utf-8'))
for directory in ('original', 'original-neutral', 'legacy-original'):
    for path in sorted((ROOT/'assets'/directory).glob('*.svg')):
        source = path.read_text(encoding='utf-8')
        tree = ET.fromstring(source)
        view = [float(x) for x in tree.attrib.get('viewBox','0 0 720 480').split()]
        # No re-layout of answer-bearing geometry. Shading follows the existing palette.
        colors = sorted(set(re.findall(r'fill="(#[0-9a-fA-F]{6})"', source)))
        gradients = []
        result = source
        for index, color in enumerate(colors):
            rgb = [int(color[i:i+2],16) for i in (1,3,5)]
            if max(rgb)-min(rgb)<12 or sum(rgb)/3<95: continue
            light = '#' + ''.join(f'{round(c+(255-c)*.26):02x}' for c in rgb)
            dark = '#' + ''.join(f'{round(c*.84):02x}' for c in rgb)
            gid = f'hqShade{index}'
            gradients.append(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0.75" y2="1"><stop offset="0" stop-color="{light}"/><stop offset="0.55" stop-color="{color}"/><stop offset="1" stop-color="{dark}"/></linearGradient>')
            # Text and stroke colors retain their original contrast and chart keys.
            result = re.sub(r'<(?:path|rect|ellipse|circle|polygon)\b[^>]*>', lambda m:m[0].replace(f'fill="{color}"',f'fill="url(#{gid})"'), result)
        fonts=[]
        def typography(m):
            tag=m[0]
            if tag.startswith('<text'):
                tag=re.sub(r'font-family="[^"]*"','font-family="Malgun Gothic, Noto Sans CJK KR, sans-serif"',tag)
                if 'font-family=' not in tag:tag=tag.replace('<text','<text font-family="Malgun Gothic, Noto Sans CJK KR, sans-serif"',1)
            return tag
        result=re.sub(r'<text\b[^>]*>',typography,result)
        if gradients: result=result.replace('>','><defs>'+''.join(gradients)+'</defs>',1)
        # Two measured mobile-font overflows: shrink only the overflowing line, never its text.
        if path.name=='O06-I-R-42.svg': result=result.replace('font-size="28" font-weight="400" fill="#3d6853">천이 찢어지지 않은 우산을 가져오세요.', 'font-size="25" font-weight="400" fill="#3d6853">천이 찢어지지 않은 우산을 가져오세요.')
        if path.name=='practical-card-f15e623bd1f8.svg': result=result.replace('font-size="19" font-weight="500" text-anchor="start">이 시간에는 계단을 이용해 주세요.', 'font-size="17" font-weight="500" text-anchor="start">이 시간에는 계단을 이용해 주세요.')
        # Exact text/geometry comparison is deliberately independent of the visual makeover.
        derived=ET.fromstring(result)
        def semantics(t):
            return [(e.tag,{k:v for k,v in e.attrib.items() if k not in ('fill','font-family','font-size')},(e.text or '').strip(),(e.tail or '').strip()) for e in t.iter() if e.tag.split('}')[-1] not in ('defs','linearGradient','stop')]
        assert semantics(tree)==semantics(derived),path
        relative=path.relative_to(ROOT).as_posix(); target='assets/question-polish/'+directory+'-'+path.name
        redraw = redraws.get(relative)
        if redraw:
            assert sha(path.read_bytes()) == redraw['sourceSha256'], relative
            result = (redraw_dir/redraw['file']).read_text(encoding='utf-8')
            derived = ET.fromstring(result)
            text_nodes = lambda t: [''.join(e.itertext()) for e in t.iter() if e.tag.split('}')[-1] == 'text']
            assert text_nodes(tree) == text_nodes(derived), relative
            assert not any(e.tag.split('}')[-1] in ('script','foreignObject','image') for e in derived.iter()), relative
        data=result.encode('utf-8')
        if check: assert (ROOT/target).read_bytes()==data,target
        else:
            (ROOT/target).parent.mkdir(parents=True,exist_ok=True);(ROOT/target).write_bytes(data)
        mapping[relative]={'src':target,'sourceSha256':sha(path.read_bytes()),'sha256':sha(data)}
        audit.append({'source':relative,'derivative':target,'textAndGeometryPreserved':not bool(redraw),'textPreserved':True,'reviewedRedraw':bool(redraw),'shadedColors':0 if redraw else len(gradients),'viewBox':[float(x) for x in derived.attrib['viewBox'].split()]})
assert set(redraws).issubset(mapping), 'Redraw source missing'
catalog={'version':1,'scope':'Display derivatives; original source bytes and text retained; three reviewed object redraws alter geometry','bySource':mapping}
payload='window.HARUMAL_QUESTION_VISUALS='+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+';\n'
target=ROOT/'data/question-visual-polish-v1.js'
if check:assert target.read_text(encoding='utf-8')==payload
else:target.write_text(payload,encoding='utf-8')
report=ROOT/'docs/qa/question-visual-polish-audit.json'
if not check:report.write_text(json.dumps({'svgCount':len(audit),'files':audit},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'svgCount':len(audit),'geometryPreservedCount':len(audit)-len(redraws),'reviewedRedrawCount':len(redraws),'textPreserved':True,'check':check}))
