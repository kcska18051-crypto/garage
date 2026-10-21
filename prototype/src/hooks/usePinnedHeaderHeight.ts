import {useLayoutEffect,type RefObject} from 'react'

// Measure only the fixed desktop row, not the header's in-flow spacer.
export function usePinnedHeaderHeight(header:RefObject<HTMLElement|null>,compact:boolean) {
  useLayoutEffect(()=>{
    const desktop=header.current?.querySelector<HTMLElement>('.desktop-header')
    if(!desktop) return
    const root=document.documentElement
    const previous=root.style.getPropertyValue('--catalog-pinned-header-height')
    const update=()=>{
      const style=getComputedStyle(desktop)
      const bottom=style.position==='fixed' && style.display!=='none' ? desktop.getBoundingClientRect().bottom : 0
      root.style.setProperty('--catalog-pinned-header-height',`${Math.max(0,bottom)}px`)
    }
    update()
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(update)
    observer?.observe(desktop)
    window.addEventListener('resize',update)
    return ()=>{
      observer?.disconnect()
      window.removeEventListener('resize',update)
      if(previous) root.style.setProperty('--catalog-pinned-header-height',previous)
      else root.style.removeProperty('--catalog-pinned-header-height')
    }
  },[header,compact])
}
