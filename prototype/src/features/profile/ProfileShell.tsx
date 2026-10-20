import { NavLink, Outlet, useLocation } from 'react-router-dom'
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
  const { isAuthenticated, openAuth, logout } = useAuth()
  const location = useLocation()
  const publicSection = ['/profile/favorites','/profile/recently-viewed','/profile/help'].includes(location.pathname.replace(/\/$/,''))
  const login = () => openAuth('login', { returnTo: location.pathname + location.search + location.hash })
  const visibleLinks = profileConfig.showBonusCard ? [...links, ['Бонусная карта', '/profile/bonus', '◉'] as const] : links
  return <main className="profile-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }]} />
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-user-card"><span className="profile-avatar" aria-hidden="true">{isAuthenticated ? `${user.firstName[0]}${user.lastName[0]}` : '○'}</span><div>{isAuthenticated ? <><strong>{user.firstName} {user.lastName}</strong><span>{user.phone}</span><small>Демо-профиль · телефон подтверждён</small></> : <><strong>Гость</strong><small>Личные данные доступны после входа</small></>}</div>{isAuthenticated && <NavLink to="/profile/data" aria-label="Перейти в профиль">→</NavLink>}</div>
        <nav className="profile-nav" aria-label="Разделы личного кабинета">{visibleLinks.map(([label, href, icon]) => <NavLink key={href} to={href} end={href === '/profile'}><span aria-hidden="true">{icon}</span>{label}</NavLink>)}<button className="profile-nav__logout" type="button" onClick={isAuthenticated ? logout : login}><span aria-hidden="true">{isAuthenticated ? '↗' : '○'}</span>{isAuthenticated ? 'Выйти' : 'Войти / зарегистрироваться'}</button></nav>
      </aside>
      <section className="profile-content">{isAuthenticated || publicSection ? <Outlet /> : <section className="profile-panel profile-guest" aria-label="Вход в личный кабинет"><h1>Личный кабинет</h1><h2>Войдите, чтобы открыть профиль</h2><p>Ваши данные, заказы, адреса и документы доступны после входа.</p><button className="profile-button profile-button--primary" type="button" onClick={login}>Войти / зарегистрироваться</button><p>В прототипе доступен явно обозначенный демонстрационный вход. Безопасная авторизация будет подключена на этапе интеграции.</p></section>}</section>
    </div>
  </main>
}

export function ProfileShell() { return <ShellContent /> }
