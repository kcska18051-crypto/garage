import { NavLink } from 'react-router-dom'
import { useAuth } from '../../state/AuthState'

const links = [['⌂', 'Главная', '/'], ['▦', 'Каталог', '/catalog'], ['♡', 'Избранное', '/favorites'], ['▱', 'Корзина', '/cart'], ['○', 'Профиль', '/profile']]

export function MobileBottomNav({ favorites, cart }: { favorites: number; cart: number }) {
  const { isAuthenticated, openAuth } = useAuth()
  return (
    <nav className="mobile-bottom-nav" aria-label="Мобильная навигация">
      {links.map(([icon, label, href]) => {
        const count = label === 'Избранное' ? favorites : label === 'Корзина' ? cart : 0
        if (label === 'Профиль' && !isAuthenticated) return <button key={label} type="button" aria-label="Профиль" onClick={() => openAuth('login', { returnTo: '/profile' })}><span className="mobile-bottom-nav__icon" aria-hidden="true">{icon}</span><span>{label}</span></button>
        return <NavLink key={label} to={href} aria-label={count > 0 ? `${label}: ${count}` : label}><span className="mobile-bottom-nav__icon" aria-hidden="true">{icon}{count > 0 && <b>{count}</b>}</span><span>{label}</span></NavLink>
      })}
    </nav>
  )
}
