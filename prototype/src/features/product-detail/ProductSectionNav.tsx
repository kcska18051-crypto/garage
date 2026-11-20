import {useEffect,useRef,useState} from 'react'
import {productDetail} from '../../data/productDetailData'
export function ProductSectionNav(){
 const [active,setActive]=useState('description'),nav=useRef<HTMLElement>(null)
 useEffect(()=>{
  let frame=0
  const update=()=>{frame=0;const boundary=Math.max((nav.current?.getBoundingClientRect().bottom??100)+20,130);let current=productDetail.sections[0].id;for(const section of productDetail.sections){const element=document.getElementById(section.id);if(element&&element.getBoundingClientRect().top<=boundary)current=section.id}setActive(current)}
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule()
  return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame)}
 },[])
 useEffect(()=>{const root=nav.current,link=root?.querySelector<HTMLElement>(`a[href="#${active}"]`);if(root&&link){const a=link.getBoundingClientRect(),b=root.getBoundingClientRect();if(a.left<b.left||a.right>b.right)root.scrollLeft+=a.left-b.left-12}},[active])
 return <nav ref={nav} className="product-anchor-nav" aria-label="Разделы товара">{productDetail.sections.map(section=><a key={section.id} href={`#${section.id}`} aria-current={active===section.id?'location':undefined} onClick={()=>setActive(section.id)}>{section.label}</a>)}</nav>
}
