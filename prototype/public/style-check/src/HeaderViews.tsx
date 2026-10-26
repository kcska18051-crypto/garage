import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SearchBox } from '../../../src/features/header/SearchBox'
import { useAuth } from '../../../src/state/AuthState'
import { PaintServiceLink } from '../../../src/features/header/PaintServiceLink'
import { headerQuickLinksConfig } from '../../../src/data/headerNavigationData'
import { Icon, type IconName } from './Icon'

export type HeaderCounts = { favorites: number; compare: number; cart: number }
export function Logo() { return <Link className="sc-logo" to="/style-check/" aria-label="Гараж, главная"><img src={new URL('../logo-from-brandbook.png', import.meta.url).href} alt="Гараж" /></Link> }
function Action({ to, label, icon, count }: { to: string; label: string; icon: IconName; count?: number }) {
  return <Link className="sc-header-action" to={to} aria-label={`${label}${count ? `: ${count}` : ''}`}><Icon name={icon} /><span>{label}</span>{!!count && <b>{count}</b>}</Link>
}
function Profile() {
  const auth = useAuth()
  return auth.isAuthenticated ? <Action to="/profile" label="Профиль" icon="user" /> : <button className="sc-header-action" onClick={() => auth.openAuth('login', { returnTo: '/profile' })} aria-label="Профиль"><Icon name="user" /><span>Профиль</span></button>
}
type DesktopProps = { region: string; onRegion(): void; counts: HeaderCounts; compact: boolean; catalogOpen: boolean; onCatalog(): void; searchSuspended?: boolean }
export function DesktopHeader({ region, onRegion, counts, compact, catalogOpen, onCatalog, searchSuspended }: DesktopProps) {
  return <div className={`desktop-header${compact ? ' desktop-header--compact' : ''}`}>
    {!compact && <div className="service-row"><button onClick={onRegion} aria-label="Выбрать город"><Icon name="pin" size={15} />{region}</button><nav aria-label="Сервисная навигация"><Link to="/delivery">Доставка и оплата</Link><Link to="/about">О компании</Link><Link to="/contacts">Контакты</Link></nav><a href="tel:+70000000000">+7 (000) 000-00-00 <small>Пн–Пт, 9:00–18:00</small></a></div>}
    <div className="main-header-row"><Logo /><button className="catalog-button" onClick={onCatalog} aria-expanded={catalogOpen} aria-haspopup="dialog" aria-controls={catalogOpen ? 'header-catalog-panel' : undefined}><Icon name={catalogOpen ? 'close' : 'grid'} size={20} /><span>Каталог</span></button><SearchBox compact={compact} suspended={searchSuspended} />{!compact && <Link className="service-link" to="/services">Услуги</Link>}{(compact || !headerQuickLinksConfig.enabled) && <PaintServiceLink className="paint-service-link--fallback" />}<div className="header-actions"><Profile /><Action to="/compare" label="Сравнение" icon="compare" count={counts.compare} /><Action to="/favorites" label="Избранное" icon="heart" count={counts.favorites} /><Action to="/cart" label="Корзина" icon="cart" count={counts.cart} /></div></div>
  </div>
}
type MobileProps = { region: string; onRegion(): void; menuOpen: boolean; onMenu(): void; onCatalog(): void; searchSuspended?: boolean }
export function MobileHeader({ region, onRegion, menuOpen, onMenu, onCatalog, searchSuspended }: MobileProps) {
  useEffect(() => { if (!menuOpen) return; const close = (e: KeyboardEvent) => { if (e.key === 'Escape') onMenu() }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [menuOpen, onMenu])
  return <div className="mobile-header"><div className="mobile-header__top"><button onClick={onMenu} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen}><Icon name={menuOpen ? 'close' : 'menu'} /></button><Logo /><button className="mobile-region" onClick={onRegion} aria-label="Выбрать город"><Icon name="pin" size={16} /><span>{region}</span></button></div><SearchBox suspended={searchSuspended} /><Link className="sc-mobile-paint" to="/services/paint-matching">Подбор автоэмали <Icon name="arrow" size={17} /></Link>{menuOpen && <nav className="mobile-menu" aria-label="Мобильное меню"><button onClick={onCatalog}>Каталог<Icon name="arrow" /></button>{[['Услуги', '/services'], ['Акции', '/actions'], ['Доставка и оплата', '/delivery'], ['О компании', '/about'], ['Контакты', '/contacts']].map(([label, href]) => <Link key={href} to={href}>{label}<Icon name="arrow" size={18} /></Link>)}<a href="tel:+70000000000">+7 (000) 000-00-00</a></nav>}</div>
}
export function MobileBottomNav({ favorites, cart, catalogOpen, onCatalog }: { favorites: number; cart: number; catalogOpen: boolean; onCatalog(): void }) {
  return <nav className="mobile-bottom-nav sc-bottom-nav" aria-label="Мобильная навигация"><NavLink to="/style-check/" aria-label="Главная"><Icon name="home" /><span>Главная</span></NavLink><button onClick={onCatalog} aria-label="Каталог" aria-expanded={catalogOpen} aria-haspopup="dialog"><Icon name="grid" /><span>Каталог</span></button><Action to="/favorites" label="Избранное" icon="heart" count={favorites} /><Action to="/cart" label="Корзина" icon="cart" count={cart} /><Profile /></nav>
}
