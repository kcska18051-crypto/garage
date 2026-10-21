import {useLayoutEffect,type RefObject} from 'react'
import {boundedFilterGeometry} from '../features/catalog/boundedFilterGeometry'

// Fixed only after the real column reaches the header, bounded by the entire main,
// not by the shorter product grid. Slot preserves the actual filter column size.
export function usePageBoundedFilter(slotRef:RefObject<HTMLDivElement|null>,sidebarRef:RefObject<HTMLElement|null>,enabled:boolean){
  useLayoutEffect(()=>{
    const slot=slotRef.current,sidebar=sidebarRef.current
    if(!enabled||!slot||!sidebar)return
    const boundary=slot.closest('main')??slot.closest('.catalog-listing')
    const scroll=sidebar.querySelector<HTMLElement>('.catalog-listing__filter-scroll')
    const reset=sidebar.querySelector<HTMLElement>('.catalog-listing__filter-reset')
    if(!boundary||!scroll||!reset)return
    const previous=boundary.getAttribute('data-catalog-filter-boundary')
    let frame=0,disposed=false
    const clear=()=>{
      for(const key of ['position','top','left','width','height','max-height'])sidebar.style.removeProperty(key)
      sidebar.removeAttribute('data-pinned')
    }
    const update=()=>{
      frame=0
      if(disposed)return
      if(window.innerWidth<768){clear();slot.style.removeProperty('height');boundary.removeAttribute('data-catalog-filter-boundary');return}
      if(!boundary.hasAttribute('data-catalog-filter-boundary'))boundary.setAttribute('data-catalog-filter-boundary','')
      const rect=slot.getBoundingClientRect()
      if(rect.width<=0)return
      const rootStyle=getComputedStyle(document.documentElement)
      const gap=parseFloat(rootStyle.fontSize)*.75
      const resetStyle=getComputedStyle(reset)
      const naturalHeight=scroll.scrollHeight+reset.getBoundingClientRect().height+(parseFloat(resetStyle.marginTop)||0)
      const geometry=boundedFilterGeometry({slotTop:rect.top,boundaryBottom:boundary.getBoundingClientRect().bottom,headerBottom:parseFloat(rootStyle.getPropertyValue('--catalog-pinned-header-height'))||0,viewportHeight:window.innerHeight,naturalHeight,gap,minHeight:180})
      slot.style.height=`${geometry.reserveHeight}px`
      if(!geometry.fixed){clear();return}
      sidebar.dataset.pinned='true'
      Object.assign(sidebar.style,{position:'fixed',top:`${geometry.top}px`,left:`${rect.left}px`,width:`${rect.width}px`,height:`${geometry.height}px`,maxHeight:`${geometry.height}px`})
    }
    const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(update)}
    const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(schedule)
    for(const element of [slot,sidebar,boundary,reset,scroll.firstElementChild])if(element)resize?.observe(element)
    const rootChanges=new MutationObserver(schedule)
    rootChanges.observe(document.documentElement,{attributes:true,attributeFilter:['style']})
    const filterChanges=new MutationObserver(schedule)
    filterChanges.observe(scroll,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['open']})
    window.addEventListener('scroll',schedule,{passive:true})
    window.addEventListener('resize',schedule)
    update()
    return()=>{
      disposed=true;cancelAnimationFrame(frame);resize?.disconnect();rootChanges.disconnect();filterChanges.disconnect()
      window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)
      clear();slot.style.removeProperty('height')
      if(previous===null)boundary.removeAttribute('data-catalog-filter-boundary');else boundary.setAttribute('data-catalog-filter-boundary',previous)
    }
  },[slotRef,sidebarRef,enabled])
}
