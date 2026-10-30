import { RoundedIcon } from './RoundedIcon'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../state/AuthState'

const links = [['⌂', 'Главная', '/'], ['▦', 'Каталог', '/catalog'], ['♡', 'Избранное', '/favorites'], ['▱', 'Корзина', '/cart'], ['○', 'Профиль', '/profile']]

export function MobileBottomNav({ favorites, cart, catalogOpen, onCatalog }: { favorites: number; cart: number; catalogOpen: boolean; onCatalog(): void }) {
  const { isAuthenticated, openAuth } = useAuth()
  const isStyleCheck = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  if (isStyleCheck) return <nav className="mobile-bottom-nav reference-bottom-nav" aria-label="Мобильная навигация">{[['home','Главная','/'],['catalog','Каталог','/catalog'],['service','Услуги','/services'],['paint','Подбор','/services/paint-matching'],['favorite','Избранное','/favorites'],['cart','Корзина','/cart']].map(([icon,label,href]) => {
    const count = icon === 'favorite' ? favorites : icon === 'cart' ? cart : 0
    const content = <><span className="mobile-bottom-nav__icon" aria-hidden="true"><RoundedIcon name={icon} />{count > 0 && <b>{count}</b>}</span><span>{label}</span></>
    return icon === 'catalog' ? <button key={icon} type="button" aria-label="Каталог" aria-haspopup="dialog" aria-expanded={catalogOpen} onClick={onCatalog}>{content}</button> : <NavLink key={icon} to={href} aria-label={count ? `${label}: ${count}` : label} className={icon === 'service' || icon === 'paint' ? 'reference-bottom-service' : icon === 'home' ? 'active' : undefined}>{content}</NavLink>
  })}</nav>
  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      {links.map(([icon, label, href]) => {
        const count = label === 'Избранное' ? favorites : label === 'Корзина' ? cart : 0
        if (label === 'Каталог') return <button key={label} type="button" aria-label="Каталог" aria-haspopup="dialog" aria-expanded={catalogOpen} aria-controls={catalogOpen ? 'header-catalog-panel' : undefined} onClick={onCatalog}><span className="mobile-bottom-nav__icon" aria-hidden="true">{isStyleCheck ? <RoundedIcon name={label === 'Каталог' ? 'catalog' : 'profile'} /> : icon}</span><span>{label}</span></button>
        if (label === 'Профиль' && !isAuthenticated) return <button key={label} type="button" aria-label="Профиль" onClick={() => openAuth('login', { returnTo: '/profile' })}><span className="mobile-bottom-nav__icon" aria-hidden="true">{isStyleCheck ? <RoundedIcon name="profile" /> : icon}</span><span>{label}</span></button>
        return <NavLink key={label} to={href} className={({ isActive }) => isActive || (isStyleCheck && href === '/') ? 'active' : undefined} aria-current={isStyleCheck && href === '/' ? 'page' : undefined} aria-label={count > 0 ? `${label}: ${count}` : label}><span className="mobile-bottom-nav__icon" aria-hidden="true">{isStyleCheck ? <RoundedIcon name={href === '/' ? 'home' : href === '/favorites' ? 'favorite' : href === '/cart' ? 'cart' : 'profile'} /> : icon}{count > 0 && <b>{count}</b>}</span><span>{label}</span></NavLink>
      })}
    </nav>
  )
}
