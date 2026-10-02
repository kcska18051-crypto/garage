import { NavLink, Outlet } from 'react-router-dom'
import { Breadcrumbs } from '../catalog/Breadcrumbs'
import { profileConfig } from '../../data/profileData'
import { useProfile } from '../../state/ProfileState'
import { useAuth } from '../../state/AuthState'
import './Profile.css'

const links = [
  ['Обзор', '/profile', '⌂'], ['Мои заказы', '/profile/orders', '▤'], ['Мои организации', '/profile/organizations', '▣'],
  ['Избранное', '/profile/favorites', '♡'], ['Вы смотрели', '/profile/recently-viewed', '◷'], ['Заявки на услуги', '/profile/services', '◇'],
  ['Документы', '/profile/documents', '▧'], ['Отзывы', '/profile/reviews', '☆'], ['Адреса', '/profile/addresses', '⌖'], ['Профиль', '/profile/data', '○'], ['Помощь', '/profile/help', '?'],
] as const

function ShellContent() {
  const { user } = useProfile()
  const { openAuth } = useAuth()
  const visibleLinks = profileConfig.showBonusCard ? [...links, ['Бонусная карта', '/profile/bonus', '◉'] as const] : links
  return <main className="profile-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }]} />
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-user-card"><span className="profile-avatar" aria-hidden="true">АС</span><div><strong>{user.firstName} {user.lastName}</strong><span>{user.phone}</span><small>Телефон подтверждён</small></div><NavLink to="/profile/data" aria-label="Перейти в профиль">→</NavLink></div>
        <nav className="profile-nav" aria-label="Разделы личного кабинета">{visibleLinks.map(([label, href, icon]) => <NavLink key={href} to={href} end={href === '/profile'}><span aria-hidden="true">{icon}</span>{label}</NavLink>)}<button className="profile-nav__logout" type="button" onClick={() => openAuth('login')}><span aria-hidden="true">↗</span>Войти / регистрация</button></nav>
      </aside>
      <section className="profile-content"><Outlet /></section>
    </div>
  </main>
}

export function ProfileShell() { return <ShellContent /> }
