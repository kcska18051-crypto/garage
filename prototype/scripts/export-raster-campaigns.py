"""Export finished imagegen creatives: resample and extend background pixels only.
Never draws typography, CTA, product or decorative layers: these are in source PNG.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT.parent / 'artifacts/banner-review-v22/generation.json'
OUT = ROOT / 'public/style-check/review-assets/raster-v22'
OUT.mkdir(parents=True, exist_ok=True)
items = json.loads(MANIFEST.read_text(encoding='utf-8'))
for item in items:
    kind = item['kind']
    if item['id'].startswith('hero-'):
        canvas_size, creative_size = (2752,416),(552,368)
    elif kind == 'wide':
        canvas_size, creative_size = (2784,320),(480,320)
    elif kind == 'portrait':
        canvas_size, creative_size = (1440,902),(480,720)
    else:
        canvas_size, creative_size = (906,432),(906,432)
    image = Image.open(item['source']).convert('RGB')
    image.thumbnail(creative_size,Image.Resampling.LANCZOS)
    w,h=image.size
    cw,ch=canvas_size
    x,y=(cw-w)//2,(ch-h)//2
    canvas=Image.new('RGB',canvas_size)
    canvas.paste(image,(x,y))
    if x: canvas.paste(image.crop((0,0,1,h)).resize((x,h)),(0,y))
    if cw-x-w: canvas.paste(image.crop((w-1,0,w,h)).resize((cw-x-w,h)),(x+w,y))
    if y: canvas.paste(canvas.crop((0,y,cw,y+1)).resize((cw,y)),(0,0))
    if ch-y-h: canvas.paste(canvas.crop((0,y+h-1,cw,y+h)).resize((cw,ch-y-h)),(0,y+h))
    target=OUT/(item['id']+'.webp')
    canvas.save(target,'WEBP',quality=94,method=6)
    item.update(width=cw,height=ch,safeBox=[x,y,x+w,y+h],bytes=target.stat().st_size)
public_manifest=[{key:item[key] for key in ('id','width','height','safeBox','bytes')} for item in items]
(OUT/'manifest.json').write_text(json.dumps(public_manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Exported {len(items)} self-contained raster files, {sum(i["bytes"] for i in items):,} bytes')
