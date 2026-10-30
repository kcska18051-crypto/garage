import { StyleCheckHeaderSymbol } from './StyleCheckHeaderSymbol'
import { Link, useLocation } from 'react-router-dom'
import { SearchBox } from './SearchBox'
import { useAuth } from '../../state/AuthState'
import { headerQuickLinksConfig } from '../../data/headerNavigationData'
import { PaintServiceLink } from './PaintServiceLink'
import { useState } from 'react'
import { ContactDialog } from '../forms/ContactDialog'
import { RoundedIcon } from './RoundedIcon'

export type HeaderCounts = { favorites: number; compare: number; cart: number }

function ActionLink({ to, label, symbol, count }: { to: string; label: string; symbol: string; count?: number }) {
  return <Link className="header-action" to={to} aria-label={`${label}${count ? `: ${count}` : ''}`}><span aria-hidden="true">{symbol}</span><small>{label}</small>{count ? <b>{count}</b> : null}</Link>
}

export function DesktopHeader({ region, onRegion, counts, compact, catalogOpen, onCatalog, searchSuspended = false }: { region: string; onRegion(): void; counts: HeaderCounts; compact: boolean; catalogOpen: boolean; onCatalog(): void; searchSuspended?: boolean }) {
  const { isAuthenticated, openAuth } = useAuth()
  const [callbackOpen, setCallbackOpen] = useState(false)
  const isStyleCheck = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  return (
    <div className={`desktop-header${compact ? ' desktop-header--compact' : ''}`}>
      {!compact && <div className="service-row"><button onClick={onRegion} aria-label="Выбрать город">{isStyleCheck ? <svg className="reference-geo" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg> : <StyleCheckHeaderSymbol name="location" symbol="⌖" />} {region}{isStyleCheck && <svg className="reference-city-chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 6.5 3 3 3-3"/></svg>}</button><nav aria-label="Сервисная навигация"><Link to="/delivery">Доставка и оплата</Link><Link to="/about">О компании</Link>{isStyleCheck && <Link to="/services">Сервис и ремонт</Link>}<Link to="/contacts">Контакты</Link></nav><a href="tel:+70000000000">+7 (000) 000-00-00 <small>Пн–Пт, 9:00–18:00</small></a>{isStyleCheck && <button className="reference-callback" type="button" onClick={() => setCallbackOpen(true)}>Заказать звонок</button>}</div>}
      <div className="main-header-row">
        <Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link>
        <button className="catalog-button" onClick={onCatalog} aria-expanded={catalogOpen} aria-controls={catalogOpen ? 'header-catalog-panel' : undefined} aria-haspopup="dialog"><StyleCheckHeaderSymbol name="menu" symbol="▦" /> <span>Каталог</span></button>
        <SearchBox compact={compact} suspended={searchSuspended} />
        {isStyleCheck && <nav className="reference-desktop-services" aria-label="Услуги и подбор автоэмали"><Link to="/services"><RoundedIcon name="service" /><span>Услуги</span></Link><Link to="/services/paint-matching"><RoundedIcon name="paint" /><span>Подбор</span></Link></nav>}
        {!isStyleCheck && !compact && <Link className="service-link" to="/services">Услуги</Link>}
        {!isStyleCheck && (compact || !headerQuickLinksConfig.enabled) && <PaintServiceLink className="paint-service-link--fallback" />}
        <div className="header-actions">{isAuthenticated ? <ActionLink to="/profile" label="Профиль" symbol="○" /> : <button className="header-action" type="button" aria-label="Профиль" onClick={() => openAuth('login', { returnTo: '/profile' })}><span aria-hidden="true">○</span><small>Профиль</small></button>}<ActionLink to="/compare" label="Сравнение" symbol="≡" count={counts.compare} /><ActionLink to="/favorites" label="Избранное" symbol="♡" count={counts.favorites} /><ActionLink to="/cart" label="Корзина" symbol="▱" count={counts.cart} /></div>
      </div>
      {isStyleCheck && callbackOpen && <ContactDialog mode="callback" onClose={() => setCallbackOpen(false)} />}
    </div>
  )
}
