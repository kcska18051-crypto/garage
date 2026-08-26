import { NavLink } from 'react-router-dom'

const links = [['⌂', 'Главная', '/'], ['▦', 'Каталог', '/catalog'], ['♡', 'Избранное', '/favorites'], ['▱', 'Корзина', '/cart'], ['○', 'Профиль', '/profile']]

export function MobileBottomNav({ favorites, cart }: { favorites: number; cart: number }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      {links.map(([icon, label, href]) => {
        const count = label === 'Избранное' ? favorites : label === 'Корзина' ? cart : 0
        return <NavLink key={label} to={href} aria-label={count > 0 ? `${label}: ${count}` : label}><span className="mobile-bottom-nav__icon" aria-hidden="true">{icon}{count > 0 && <b>{count}</b>}</span><span>{label}</span></NavLink>
      })}
    </nav>
  )
}
