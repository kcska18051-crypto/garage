import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { RoundedIcon } from './RoundedIcon'
import { MobileMenuRegion } from './MobileMenuRegion'
import './UnifiedMobileMenu.css'
import { ActionsDropdown } from './ActionsDropdown'
export function MobileSiteMenu({ region, onRegion, onClose, onCatalog }: { region: string; onRegion(): void; onClose(): void; onCatalog(): void }) {
 const panel=useRef<HTMLElement>(null)
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null
  document.body.classList.add('mobile-site-menu-open')
  panel.current?.querySelector<HTMLButtonElement>('button')?.focus()
  const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab')return;const nodes=[...panel.current!.querySelectorAll<HTMLElement>('a[href],button')];const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
  window.addEventListener('keydown',trap)
  return()=>{document.body.classList.remove('mobile-site-menu-open');window.removeEventListener('keydown',trap);if(previous?.isConnected)previous.focus({preventScroll:true})}
 },[])
 const items=[['Профиль','/profile','profile'],['Сравнение','/compare','compare'],['Услуги','/services','service'],['Подбор автоэмали','/services/paint-matching','paint'],['Акции','/actions','sale'],['Доставка и оплата','/delivery','delivery'],['Контакты','/contacts','contacts']]
 return createPortal(<section className="unified-site-menu" role="dialog" aria-modal="true" aria-label="Мобильное меню" ref={panel}><div className="unified-menu-toolbar"><h2>Меню</h2><button type="button" className="unified-menu-close" aria-label="Закрыть меню" onClick={onClose}>×</button></div><MobileMenuRegion region={region} onRegion={onRegion}/><nav className="unified-menu-links" aria-label="Разделы сайта"><button type="button" onClick={onCatalog}><RoundedIcon name="catalog"/><span>Каталог</span><b aria-hidden="true">›</b></button>{items.map(([label,href,icon])=>href==='/actions'?<ActionsDropdown key={href} drawer onNavigate={onClose}/>:<Link to={href} key={href} onClick={onClose}><RoundedIcon name={icon}/><span>{label}</span><b aria-hidden="true">›</b></Link>)}</nav></section>,document.body)
}
