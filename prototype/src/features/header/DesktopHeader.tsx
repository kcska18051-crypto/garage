import {regionalPhoneLabel} from '../../data/regionalPhones'
import { HeaderPhoneButton } from './HeaderPhoneButton'
import { isApprovedChrome } from '../../app/approvedHomepage'
import { StyleCheckHeaderSymbol } from './StyleCheckHeaderSymbol'
import { useLocation } from 'react-router-dom'
import { DemoLink as Link } from '../../app/DemoLink'
import { SearchBox } from './SearchBox'
import { useAuth } from '../../state/AuthState'
import { headerQuickLinksConfig } from '../../data/headerNavigationData'
import { PaintServiceLink } from './PaintServiceLink'
import { useState } from 'react'
import { ContactDialog } from '../forms/ContactDialog'
import { ComparePreview } from './ComparePreview'
import { RoundedIcon } from './RoundedIcon'

export type HeaderCounts = { favorites: number; compare: number; cart: number }

function ActionLink({ to, label, symbol, count }: { to: string; label: string; symbol: string; count?: number }) {
  return <Link className="header-action" to={to} aria-label={`${label}${count ? `: ${count}` : ''}`}><span aria-hidden="true">{symbol}</span><small>{label}</small>{count ? <b key={count}>{count}</b> : null}</Link>
}

export function DesktopHeader({ region, onRegion, counts, compact, catalogOpen, onCatalog, onCatalogHover, onCatalogLeave, searchSuspended = false, customerName }: { customerName?: string; region: string; onRegion(): void; counts: HeaderCounts; compact: boolean; catalogOpen: boolean; onCatalog(): void; onCatalogHover?(opener: HTMLButtonElement): void; onCatalogLeave?(): void; searchSuspended?: boolean }) {
  const { isAuthenticated, openAuth } = useAuth()
  const [callbackOpen, setCallbackOpen] = useState(false)
  const isStyleCheck = isApprovedChrome(useLocation().pathname)
  return (
    <div className={`desktop-header${compact ? ' desktop-header--compact' : ''}`}>
      {!compact && <div className="service-row"><button onClick={onRegion} aria-label="Выбрать город">{isStyleCheck ? <svg className="reference-geo" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg> : <StyleCheckHeaderSymbol name="location" symbol="⌖" />} {region}{isStyleCheck && <svg className="reference-city-chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 6.5 3 3 3-3"/></svg>}</button><nav aria-label="Сервисная навигация"><Link to="/delivery">Доставка и оплата</Link><Link to="/about">О компании</Link>{isStyleCheck && <Link to="/services/service-center">Сервис и ремонт</Link>}<Link to="/contacts">Контакты</Link></nav><HeaderPhoneButton className="header-phone-trigger" ariaLabel="Выбрать телефон магазина">{regionalPhoneLabel(region)} <small>Пн–Пт, 9:00–18:00</small></HeaderPhoneButton>{isStyleCheck && <button className="reference-callback" type="button" onClick={() => setCallbackOpen(true)}>Заказать звонок</button>}</div>}
      <div className="main-header-row">
        <Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link>
        <button className="catalog-button" onClick={onCatalog} onMouseEnter={event => onCatalogHover?.(event.currentTarget)} onMouseLeave={onCatalogLeave} aria-expanded={catalogOpen} aria-controls={catalogOpen ? 'header-catalog-panel' : undefined} aria-haspopup="dialog"><span className="catalog-button__icon" aria-hidden="true"><i /><i /><i /></span> <span>Каталог</span></button>
        <SearchBox compact={compact} suspended={searchSuspended} />
        {isStyleCheck && <nav className="reference-desktop-services" aria-label="Услуги и подбор автоэмали">{compact && <Link to="/services"><RoundedIcon name="service" /><span>Услуги</span></Link>}<Link to="/services/paint-matching"><RoundedIcon name="paint" /><span>{compact ? 'Подбор' : 'Подбор автоэмалей'}</span></Link></nav>}
        {!isStyleCheck && !compact && <Link className="service-link" to="/services">Услуги</Link>}
        {!isStyleCheck && (compact || !headerQuickLinksConfig.enabled) && <PaintServiceLink className="paint-service-link--fallback" />}
        <div className="header-actions">{isAuthenticated ? <ActionLink to="/profile" label={customerName?.trim() || "Профиль"} symbol="○" /> : <button className="header-action" type="button" aria-label="Профиль" onClick={() => openAuth('login', { returnTo: '/profile' })}><span aria-hidden="true">○</span><small>Профиль</small></button>}<ComparePreview count={counts.compare} /><ActionLink to="/favorites" label="Избранное" symbol="♡" count={counts.favorites} /><ActionLink to="/cart" label="Корзина" symbol="▱" count={counts.cart} /></div>
        {isStyleCheck && compact && <div className="reference-compact-contact reference-contact-tile"><RoundedIcon name="phone" /><span><button type="button" className="compact-callback" onClick={() => setCallbackOpen(true)}>Связаться с нами</button><HeaderPhoneButton className="header-phone-trigger" ariaLabel="Выбрать телефон магазина">{regionalPhoneLabel(region)}</HeaderPhoneButton></span></div>}
      </div>
      {isStyleCheck && callbackOpen && <ContactDialog mode="callback" onClose={() => setCallbackOpen(false)} />}
    </div>
  )
}
