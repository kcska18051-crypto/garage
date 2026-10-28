import { StyleCheckHeaderSymbol } from './StyleCheckHeaderSymbol'
import { RoundedIcon } from './RoundedIcon'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SearchBox } from './SearchBox'
import { PaintServiceLink } from './PaintServiceLink'

export function MobileHeader({ compact = false, compareCount = 0, region, onRegion, menuOpen, onMenu, onCatalog, searchSuspended = false }: { compact?: boolean; compareCount?: number; region: string; onRegion(): void; menuOpen: boolean; onMenu(): void; onCatalog(): void; searchSuspended?: boolean }) {
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onMenu() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, onMenu])
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
