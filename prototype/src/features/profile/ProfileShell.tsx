import {useState} from 'react'
import {ProfileIcon} from './ProfileIcon'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Breadcrumbs } from '../catalog/Breadcrumbs'
import { profileConfig } from '../../data/profileData'
import { useProfile } from '../../state/ProfileState'
import { useAuth } from '../../state/AuthState'
import './Profile.css'
import './ProfileDashboard.css'
import './ProfileInner.css'

const links = [
  ['Обзор', '/profile', 'home'], ['Мои заказы', '/profile/orders', 'orders'], ['Мои организации', '/profile/organizations', 'organization'],
  ['Избранное', '/profile/favorites', 'favorite'], ['Вы смотрели', '/profile/recently-viewed', 'history'], ['Заявки на услуги', '/profile/services', 'service'],
  ['Документы', '/profile/documents', 'document'], ['Отзывы', '/profile/reviews', 'star'], ['Адреса', '/profile/addresses', 'pin'], ['Профиль', '/profile/data', 'profile'], ['Помощь', '/profile/help', 'help'],
] as const

function ShellContent() {
  const [navOpen,setNavOpen]=useState(false)
  const { user } = useProfile()
  const { isAuthenticated, identity, openAuth, logout } = useAuth()
  const location = useLocation()
  const accountPhone=identity?.phone==='79000000000'?user.phone:identity?`+${identity.phone}`:user.phone
  const publicSection = ['/profile/favorites','/profile/recently-viewed','/profile/help'].includes(location.pathname.replace(/\/$/,''))
  const login = () => openAuth('login', { returnTo: location.pathname + location.search + location.hash,requirePhoneConfirmation:location.pathname.replace(/\/$/,'')==='/profile/services/request' })
  const visibleLinks = profileConfig.showBonusCard ? [...links, ['Бонусная карта', '/profile/bonus', 'bonus'] as const] : links
  return <main className="profile-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Личный кабинет' }]} />
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-user-card"><span className="profile-avatar" aria-hidden="true">{isAuthenticated ? `${user.firstName[0]}${user.lastName[0]}` : <ProfileIcon name="profile"/>}</span><div>{isAuthenticated ? <><strong>{user.firstName} {user.lastName}</strong><span>{accountPhone}</span><small>Демо-профиль · {identity?.phoneConfirmed?'демоподтверждение телефона':'демонстрационный вход'}</small></> : <><strong>Гость</strong><small>Личные данные доступны после входа</small></>}</div>{isAuthenticated && <NavLink className="profile-button profile-user-card__action" to="/profile/data" aria-label="Перейти в профиль">Профиль</NavLink>}</div>
        <button className="profile-nav-toggle" type="button" aria-expanded={navOpen} aria-controls="profile-navigation" onClick={()=>setNavOpen(!navOpen)}><ProfileIcon name="menu"/><span>Разделы кабинета</span><ProfileIcon name="chevron"/></button>
        <nav id="profile-navigation" className={`profile-nav${navOpen?' is-mobile-open':''}`} aria-label="Разделы личного кабинета">{visibleLinks.map(([label, href, icon]) => <NavLink key={href} to={href === '/profile' && location.pathname === '/profile/' ? '/profile/' : href} end={href === '/profile'} onClick={()=>setNavOpen(false)}><ProfileIcon name={icon}/>{label}</NavLink>)}<button className="profile-nav__logout" type="button" onClick={isAuthenticated ? logout : login}><ProfileIcon name={isAuthenticated?'logout':'profile'}/>{isAuthenticated ? 'Выйти' : 'Войти / зарегистрироваться'}</button></nav>
      </aside>
      <section className="profile-content">{isAuthenticated || publicSection ? <Outlet /> : <section className="profile-panel profile-guest" aria-label="Вход в личный кабинет"><h1>Личный кабинет</h1><h2>Войдите, чтобы открыть профиль</h2><p>Ваши данные, заказы, адреса и документы доступны после входа.</p><button className="profile-button profile-button--primary" type="button" onClick={login}>Войти / зарегистрироваться</button><p>В прототипе доступен явно обозначенный демонстрационный вход. Безопасная авторизация будет подключена на этапе интеграции.</p></section>}</section>
    </div>
  </main>
}

export function ProfileShell() { return <ShellContent /> }
