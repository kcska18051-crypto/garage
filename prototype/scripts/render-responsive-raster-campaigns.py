"""Offline raster layout. Website consumes only complete flattened WebP artwork.
Photography: imagegen assets. Typography/CTA are baked here, never HTML/CSS layers.
"""
import json, math, shutil
from pathlib import Path
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
ROOT=Path(__file__).resolve().parents[1]
CFG=json.loads((ROOT.parent/'artifacts/banner-review-v24/production.json').read_text(encoding='utf-8'))
for group in ('refs','bgs'):
 for key,value in CFG[group].items():
  if not Path(value).is_absolute(): CFG[group][key]=str(ROOT.parent/value)
OUT=ROOT/'public/style-check/review-assets/raster-responsive-v24'; OUT.mkdir(parents=True,exist_ok=True)
MASTERS=ROOT.parent/'artifacts/banner-review-v24/masters'; MASTERS.mkdir(exist_ok=True)
FONT=ROOT/'public/style-check/fonts/Manrope-Variable.ttf'
S=2
@lru_cache(None)
def font(size,weight=500):
 f=ImageFont.truetype(str(FONT),round(size*S))
 try:f.set_variation_by_axes([weight])
 except Exception:pass
 return f

def wrap(text,size,width,weight=500):
 f=font(size,weight); lines=[]; line=''
 for word in text.rstrip('.').split():
  nxt=(line+' '+word).strip()
  if line and f.getlength(nxt)>width*S:lines.append(line);line=word
  else:line=nxt
 if line:lines.append(line)
 return lines

def write(draw,lines,pos,size,weight,color,leading):
 x,y=pos
 for line in lines:
  draw.text((round(x*S),round(y*S)),line,font=font(size,weight),fill=color,anchor='lt')
  y+=leading
 return y

def bg(w,h,scene,cream=False):
 image=ImageOps.fit(Image.open(CFG['bgs'][scene]).convert('RGB'),(w*S,h*S),Image.Resampling.LANCZOS)
 color=(255,250,239) if cream else (247,249,248)
 image=Image.blend(image,Image.new('RGB',image.size,color),.25)
 mask=Image.new('L',image.size);d=ImageDraw.Draw(mask)
 if w>1000:box=((w/2-435)*S,-h*.6*S,(w/2+435)*S,h*1.6*S)
 else:box=(-w*.08*S,-h*.5*S,w*1.08*S,h*1.5*S)
 d.ellipse(tuple(round(x) for x in box),fill=220)
 mask=mask.filter(ImageFilter.GaussianBlur(42*S))
 return Image.composite(Image.new('RGB',image.size,color),image,mask)

def subject(image,ref,box):
 x,y,w,h=box
 product=Image.open(CFG['refs'][ref]).convert('RGBA')
 product.thumbnail((round(w*S),round(h*S)),Image.Resampling.LANCZOS)
 px=round((x+w/2)*S-product.width/2);py=round((y+h/2)*S-product.height/2)
 image.paste(product,(px,py),product)
 return [px/S,py/S,(px+product.width)/S,(py+product.height)/S]

def button(draw,label,x,y,size=15,height=34,arrow=True):
 f=font(size,650);tw=f.getlength(label)/S;w=tw+28+(23 if arrow else 0)
 draw.rounded_rectangle((round(x*S),round(y*S),round((x+w)*S),round((y+height)*S)),radius=round(8*S),fill='#ffcc00')
 bbox=f.getbbox(label);th=bbox[3]-bbox[1]
 draw.text((round((x+14)*S),round((y+height/2)*S-th/2)),label,font=f,fill='#202721',anchor='lt')
 if arrow:
  ax=x+w-26;ay=y+height/2
  draw.line([(round(ax*S),round(ay*S)),(round((ax+13)*S),round(ay*S))],fill='#202721',width=3)
  draw.line([(round((ax+8)*S),round((ay-5)*S)),(round((ax+13)*S),round(ay*S)),(round((ax+8)*S),round((ay+5)*S))],fill='#202721',width=3)
 return w

manifest=[]
for item in CFG['specs']:
 id=item['id'];ref=item['ref'];hero=id.startswith('hero-');paired=id in ['banner-season','banner-paint'];service=item['kind']=='service'
 scene='paint' if ref=='paint' else 'service' if ref in ['service','compressor'] else 'workshop'
 cream=ref in ['paint','rental']
 if service:
  w,h=453,216;im=bg(w,h,scene,cream);d=ImageDraw.Draw(im)
  title=wrap(item['title'],22,417,650)
  desc=wrap(item['text'],18,244,450)
  y=28
  start=y
  y=write(d,title,(18,y),22,650,'#232a27',28)+12
  y=write(d,desc,(18,y),18,450,'#525b55',24)+16
  y=max(y,156)
  bw=button(d,item['cta'],18,y,16,34,False)
  art=subject(im,ref,(278,55,157,149))
  safe=[18,min(start,art[1]),435,max(y+34,art[3])]
 else:
  w,h=(1376,208) if hero else (690,160) if paired else (1392,160)
  im=bg(w,h,scene,cream);d=ImageDraw.Draw(im)
  x,copyw,ts,ps,cta=(390,360,30,16,16) if hero else (105,270,22,14,14) if paired else (410,340,26,14,14)
  title=wrap(item['title'],ts,copyw,650);desc=wrap(item['text'],ps,copyw,450)
  tl,pl=ts*1.16,ps*1.35;bh=34 if hero else 30
  total=len(title)*tl+len(desc)*pl+bh+16;y=(h-total)/2
  if y<5:raise ValueError(f'Copy overflow {id}: {total}')
  if not hero and not paired:
   # Shared text anchors; reserve two lines even when copy uses one.
   start=12
   write(d,title,(x,start),ts,650,'#232a27',30)
   write(d,desc,(x,82),ps,450,'#525b55',19)
   y=126;bh=28
  else:
   start=y;y=write(d,title,(x,y),ts,650,'#232a27',tl)+7
   y=write(d,desc,(x,y),ps,450,'#525b55',pl)+9
  bw=button(d,item['cta'],x,y,cta,bh)
  box=(752,8,316,192) if hero else (385,7,200,146) if paired else (700,6,300,148)
  art=subject(im,ref,box)
  safe=[min(x,art[0]),min(start,art[1]),max(x+copyw,art[2]),max(y+bh,art[3])]
 desktop=OUT/(id+'-desktop.webp');im.save(desktop,'WEBP',quality=93,method=6)
 im.save(MASTERS/(id+'-desktop.png'))
 manifest.append({'id':id,'variant':'desktop','width':w*S,'height':h*S,'safeBox':[round(v*S) for v in safe],'bytes':desktop.stat().st_size})
 mobile=OUT/(id+'-mobile.webp')
 if service:
  shutil.copyfile(desktop,mobile)
  manifest.append({**manifest[-1],'variant':'mobile'})
 else:
  shutil.copyfile(ROOT/'public/style-check/review-assets/raster-v22'/(id+'.webp'),mobile)
  old=json.loads((ROOT/'public/style-check/review-assets/raster-v22/manifest.json').read_text())
  old=next(o for o in old if o['id']==id)
  manifest.append({**old,'variant':'mobile'})
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Exported desktop/mobile finished rasters for',len(CFG['specs']),'campaigns')
