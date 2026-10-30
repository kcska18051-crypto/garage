import { StyleCheckHeaderSymbol } from './StyleCheckHeaderSymbol'
import { RoundedIcon } from './RoundedIcon'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchBox } from './SearchBox'
import { PaintServiceLink } from './PaintServiceLink'

export function MobileHeader({ compact = false, compareCount = 0, region, onRegion, menuOpen, onMenu, onCatalog, searchSuspended = false }: { compact?: boolean; compareCount?: number; region: string; onRegion(): void; menuOpen: boolean; onMenu(): void; onCatalog(): void; searchSuspended?: boolean }) {
  const isStyleCheck = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onMenu() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, onMenu])
  if (isStyleCheck) {
    const search = <button type="button" aria-label="Открыть поиск" onClick={() => document.querySelector<HTMLInputElement>('.mobile-header .search-box input')?.focus({preventScroll:true})}><RoundedIcon name="search" /></button>
    const main = <div className="reference-mobile-main"><button type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={onMenu}><RoundedIcon name="menu" /></button><Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link>{search}<a href="tel:+70000000000" aria-label="Позвонить: +7 (000) 000-00-00"><RoundedIcon name="phone" /></a></div>
    return <div className="mobile-header review-mobile-header reference-mobile-header">
      {compact && <div className="review-mobile-pinned">{main}</div>}
      {main}<SearchBox suspended={searchSuspended} />
      {menuOpen && <nav className={compact ? 'mobile-menu review-mobile-menu-pinned' : 'mobile-menu'} aria-label="Мобильное меню"><button type="button" onClick={onRegion} aria-label="Выбрать город">{region}<span>Изменить город</span></button><button type="button" onClick={onCatalog} aria-haspopup="dialog">Каталог</button>{[['Профиль','/profile'],['Сравнение','/compare'],['Услуги','/services'],['Подбор автоэмали','/services/paint-matching'],['Акции','/actions'],['Доставка и оплата','/delivery'],['Контакты','/contacts']].map(([label,href])=><Link key={href} to={href} onClick={onMenu}>{label}</Link>)}<a href="tel:+70000000000">+7 (000) 000-00-00</a></nav>}
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
