"""Finish V23 raster files with imagegen side scenery; no live CSS/HTML art layers."""
import json
from pathlib import Path
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
IN=ROOT/'public/style-check/review-assets/raster-v22'
OUT=ROOT/'public/style-check/review-assets/raster-v23'
config=json.loads((ROOT.parent/'artifacts/banner-review-v23/backgrounds.json').read_text(encoding='utf-8'))
scenes={name:Image.open(item['source']).convert('RGB') for name,item in config.items()}
mapping={'hero-intro':'workshop','hero-paint':'paint','hero-service':'service','banner-season':'workshop','banner-paint':'paint','banner-compressors':'service','banner-workshop':'workshop'}
for name,scene in mapping.items():
    original=Image.open(IN/(name+'.webp')).convert('RGB');w,h=original.size
    background=ImageOps.fit(scenes[scene],(w,h),Image.Resampling.LANCZOS,centering=(.5,.5))
    # Lock the central 1000px, including the complete mobile view through 430px.
    # Fade only decorative outer margins into photographic wings.
    values=[]
    for x in range(w):
        distance=abs(x-(w-1)/2)
        t=max(0,min(1,(distance-500)/300))
        values.append(round(255*t*t*(3-2*t)))
    mask=Image.new('L',(w,1));mask.putdata(values);mask=mask.resize((w,h))
    result=Image.composite(background,original,mask)
    result.save(OUT/(name+'.webp'),'WEBP',quality=94,method=6)
manifest=json.loads((IN/'manifest.json').read_text(encoding='utf-8'))
for item in manifest:item['bytes']=(OUT/(item['id']+'.webp')).stat().st_size
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Updated seven wide rasters; central content and other six files preserved')
