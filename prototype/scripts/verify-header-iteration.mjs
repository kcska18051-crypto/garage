import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
const base=process.env.HEADER_BASE||'http://127.0.0.1:4183/garage/'
// Before editing: HEADER_RECORD=1. After editing: reuse HEADER_OUTPUT and omit HEADER_RECORD.
const out=process.env.HEADER_OUTPUT||'artifacts/header-iteration-1'
await mkdir(out,{recursive:true})
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1})
async function open(path){await page.goto(base+path);await page.locator('.product-showcase').first().waitFor();const c=page.locator('.cookie-banner__actions button');if(await c.isVisible())await c.click();await page.waitForTimeout(500)}
async function snap(){return page.evaluate(()=>{
 const icon='.style-check-header-symbol'
 const path=e=>{const a=[];while(e&&e!==document.body){a.unshift(e.tagName+':'+[...e.parentElement.children].filter(x=>x.tagName===e.tagName&&!x.matches(icon)).indexOf(e));e=e.parentElement}return a.join('/')}
 const rect=e=>{const r=e.getBoundingClientRect();return [r.x+scrollX,r.y+scrollY,r.width,r.height].map(x=>Math.round(x*1000)/1000)}
 const visual=e=>{const s=getComputedStyle(e);return ['color','backgroundColor','backgroundImage','borderColor','borderRadius','fontFamily','fontSize','fontWeight','lineHeight','display','gridTemplateColumns','gap','padding','margin','boxShadow'].map(k=>s[k])}
 const header=[...document.querySelectorAll('.site-header,.site-header *,.mobile-bottom-nav,.mobile-bottom-nav *')].filter(e=>!e.matches(icon)&&!e.closest('.third-level-nav__measure')&&!e.matches('svg,svg *')&&e.getBoundingClientRect().width&&e.getBoundingClientRect().height&&getComputedStyle(e).visibility!=='hidden').map(e=>({path:path(e),cls:e.className,rect:rect(e)}))
 const outside=[...document.querySelectorAll('main,main *,footer,footer *')].filter(e=>!e.matches('img,svg,svg *,i,b')&&!e.closest('.hero__slide')&&e.getBoundingClientRect().width&&e.getBoundingClientRect().height).map(e=>({path:path(e),cls:e.className,visual:visual(e)}))
 return {header,outside,viewport:[innerWidth,innerHeight],scale:visualViewport.scale,dpr:devicePixelRatio,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}
})}
function diff(a,b){const m=new Map(a.map(x=>[x.path,x]));return b.flatMap(x=>{const q=m.get(x.path);if(!q)return [{added:x}];m.delete(x.path);if(x.rect&&x.rect.some((v,i)=>Math.abs(v-q.rect[i])>.25))return [{cls:x.cls,before:q.rect,after:x.rect}];if(x.visual&&JSON.stringify(x.visual)!==JSON.stringify(q.visual))return[{cls:x.cls,before:q.visual,after:x.visual}];return[]}).concat([...m.values()].map(x=>({missing:x})))}
const report=[]
try{for(const width of [1440,1366,1280,1024,768,390,375]){
 await page.setViewportSize({width,height:900});await open('');const original=await snap();await open('style-check/?v=header-audit');const styled=await snap();
 const differences=diff(original.header,styled.header)
 const file=out+'/before-'+width+'.json'
 let outside=[];if(process.env.HEADER_RECORD==='1')await writeFile(file,JSON.stringify(styled));else outside=diff(JSON.parse(await readFile(file,'utf8')).outside,styled.outside)
 const states=[]
 for(const state of ['compact','search']) {
  const capture=async(path)=>{await open(path);if(state==='compact')await page.evaluate(()=>scrollTo(0,500));else await page.locator(width<768?'.mobile-header .search-box input':'.desktop-header .search-box input').focus();await page.waitForTimeout(400);return snap()}
  const before=await capture('');const after=await capture('style-check/?v=header-state-audit');states.push({state,differences:diff(before.header,after.header)})
 }
 const r={width,states,scale:styled.scale,dpr:styled.dpr,headerElements:styled.header.length,differences,outsideDifferences:outside,overflow:styled.scrollWidth-styled.clientWidth};report.push(r);console.log(JSON.stringify(r))
 await writeFile(out+'/geometry-'+width+'.json',JSON.stringify({original,styled,result:r},null,2))
 }
 await writeFile(out+'/header-report.json',JSON.stringify(report,null,2));assert(report.every(r=>!r.differences.length&&!r.outsideDifferences.length&&!r.overflow&&r.states.every(s=>!s.differences.length)),'Header geometry or outside styles changed')
}finally{await browser.close()}
