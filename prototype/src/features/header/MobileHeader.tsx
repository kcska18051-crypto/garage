import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SearchBox } from './SearchBox'

export function MobileHeader({ region, onRegion, menuOpen, onMenu }: { region: string; onRegion(): void; menuOpen: boolean; onMenu(): void }) {
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onMenu() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, onMenu])
  return (
    <div className="mobile-header">
      <div className="mobile-header__top"><button onClick={onMenu} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen}>☰</button><Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link><button className="mobile-region" onClick={onRegion} aria-label="Выбрать город">⌖ <span>{region}</span></button></div>
      <SearchBox />
      {menuOpen && <nav className="mobile-menu" aria-label="Мобильное меню"><p className="eyebrow">Навигация</p>{[['Каталог', '/catalog'], ['Услуги', '/services'], ['Акции', '/actions'], ['Магазины', '/shops'], ['Доставка и оплата', '/delivery'], ['Контакты', '/contacts']].map(([label, href]) => <Link key={label} to={href} onClick={onMenu}>{label}<span>→</span></Link>)}<a href="tel:+70000000000">+7 (000) 000-00-00</a></nav>}
    </div>
  )
}
