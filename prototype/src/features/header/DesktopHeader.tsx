import { Link } from 'react-router-dom'
import { SearchBox } from './SearchBox'

export type HeaderCounts = { favorites: number; compare: number; cart: number }

function ActionLink({ to, label, symbol, count }: { to: string; label: string; symbol: string; count?: number }) {
  return <Link className="header-action" to={to} aria-label={`${label}${count ? `: ${count}` : ''}`}><span aria-hidden="true">{symbol}</span><small>{label}</small>{count ? <b>{count}</b> : null}</Link>
}

export function DesktopHeader({ region, onRegion, counts, compact, catalogOpen, onCatalog }: { region: string; onRegion(): void; counts: HeaderCounts; compact: boolean; catalogOpen: boolean; onCatalog(): void }) {
  return (
    <div className={`desktop-header${compact ? ' desktop-header--compact' : ''}`}>
      {!compact && <div className="service-row"><button onClick={onRegion} aria-label="Выбрать город">⌖ {region}</button><nav aria-label="Сервисная навигация"><Link to="/shops">Магазины</Link><Link to="/delivery">Доставка и оплата</Link><Link to="/about">О компании</Link><Link to="/contacts">Контакты</Link><Link to="/business">Юридическим лицам</Link></nav><a href="tel:+70000000000">+7 (000) 000-00-00 <small>Пн–Пт, 9:00–18:00</small></a></div>}
      <div className="main-header-row">
        <Link className="logo" to="/" aria-label="Гараж, главная"><span aria-hidden="true" />ГАРАЖ</Link>
        <button className="catalog-button" onClick={onCatalog} aria-expanded={catalogOpen}>▦ <span>Каталог</span></button>
        <SearchBox compact={compact} />
        {!compact && <><Link className="service-link" to="/services">Услуги</Link><Link className="header-text-link" to="/actions">Акции</Link></>}
        <div className="header-actions"><ActionLink to="/profile" label="Профиль" symbol="○" /><ActionLink to="/compare" label="Сравнение" symbol="≡" count={counts.compare} /><ActionLink to="/favorites" label="Избранное" symbol="♡" count={counts.favorites} /><ActionLink to="/cart" label="Корзина" symbol="▱" count={counts.cart} /></div>
      </div>
      {catalogOpen && <nav className="catalog-panel" aria-label="Меню каталога"><p className="eyebrow">Основные направления</p>{['Подъёмное оборудование', 'Кузовной ремонт', 'Покраска и подготовка', 'Диагностика', 'Инструмент', 'Все категории'].map((name, index) => <Link key={name} to={index === 5 ? '/catalog' : `/catalog/section-${index + 1}`}>{name}<span>→</span></Link>)}</nav>}
    </div>
  )
}
