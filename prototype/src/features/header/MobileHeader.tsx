import { HeaderPhoneButton, HeaderPhoneDialog } from './HeaderPhoneButton'
import {regionalPhoneLabel} from '../../data/regionalPhones'
import { isApprovedChrome } from '../../app/approvedHomepage'
import { MobileSiteMenu } from './MobileSiteMenu'
import { StyleCheckHeaderSymbol } from './StyleCheckHeaderSymbol'
import { RoundedIcon } from './RoundedIcon'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DemoLink as Link } from '../../app/DemoLink'
import { SearchBox } from './SearchBox'
import { PaintServiceLink } from './PaintServiceLink'

export function MobileHeader({ compact = false, compareCount = 0, region, onRegion, menuOpen, onMenu, onCatalog, searchSuspended = false }: { compact?: boolean; compareCount?: number; region: string; onRegion(): void; menuOpen: boolean; onMenu(): void; onCatalog(): void; searchSuspended?: boolean }) {
  const [phoneOpen,setPhoneOpen]=useState(false)
  const isStyleCheck = isApprovedChrome(useLocation().pathname)
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onMenu() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, onMenu])
  if (isStyleCheck) {
    const search = <button type="button" aria-label="Открыть поиск" onClick={() => document.querySelector<HTMLInputElement>('.mobile-header .search-box input')?.focus({preventScroll:true})}><RoundedIcon name="search" /></button>
    const main = (showSearch: boolean) => <div className="reference-mobile-main"><button type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={onMenu}><RoundedIcon name="menu" /></button><Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link>{showSearch && search}<HeaderPhoneButton region={region} onOpen={()=>setPhoneOpen(true)} ariaLabel="Выбрать телефон магазина"><RoundedIcon name="phone" /></HeaderPhoneButton></div>
    return <div className="mobile-header review-mobile-header reference-mobile-header">
      {compact && <div className="review-mobile-pinned">{main(true)}</div>}
      {main(false)}{!compact&&<div className="mobile-contact-line"><button type="button" onClick={onRegion} aria-label={`Ваш город: ${region}. Изменить город`}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>{region}</span><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><HeaderPhoneButton region={region} onOpen={()=>setPhoneOpen(true)} ariaLabel="Телефоны магазинов">{regionalPhoneLabel(region)}</HeaderPhoneButton></div>}{phoneOpen&&<HeaderPhoneDialog region={region} onClose={()=>setPhoneOpen(false)}/>}<SearchBox suspended={searchSuspended} />
      {menuOpen && <MobileSiteMenu region={region} onRegion={onRegion} onClose={onMenu} onCatalog={onCatalog} />}
    </div>
  }
  return (
    <div className="mobile-header">
      {compact && <div className="review-mobile-pinned"><Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link><div><Link to="/compare" aria-label={`Сравнение${compareCount ? ': ' + compareCount : ''}`}><RoundedIcon name="compare" />{compareCount > 0 && <b>{compareCount}</b>}</Link><button type="button" aria-label="Открыть поиск" onClick={() => document.querySelector<HTMLInputElement>('.mobile-header .search-box input')?.focus({ preventScroll: true })}><RoundedIcon name="search" /></button><button type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={onMenu}><RoundedIcon name="menu" /></button></div></div>}
      <div className="mobile-header__top"><button onClick={onMenu} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen}><StyleCheckHeaderSymbol name="menu" symbol="☰" /></button><Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link><button className="mobile-region" onClick={onRegion} aria-label="Выбрать город"><StyleCheckHeaderSymbol name="location" symbol="⌖" /> <span>{region}</span></button></div>
      <SearchBox suspended={searchSuspended} />
      <PaintServiceLink className="paint-service-link--mobile" />
      {menuOpen && <nav className={compact ? "mobile-menu review-mobile-menu-pinned" : "mobile-menu"} aria-label="Мобильное меню"><p className="eyebrow">Навигация</p><button type="button" onClick={onCatalog} aria-haspopup="dialog">Каталог<span>→</span></button>{[['Услуги', '/services'], ['Акции', '/actions'], ['Доставка и оплата', '/delivery'], ['Контакты', '/contacts']].map(([label, href]) => <Link key={label} to={href} onClick={onMenu}>{label}<span>→</span></Link>)}<a href="tel:+70000000000">+7 (000) 000-00-00</a></nav>}
    </div>
  )
}
