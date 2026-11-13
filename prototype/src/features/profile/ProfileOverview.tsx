import { ProfileStatus, profileStatusTone } from './ProfileStatus'
import {ProfileIcon} from './ProfileIcon'
import {CartProductImage} from '../cart/CartProductImage'
import { Link } from 'react-router-dom'
import { prototypeData } from '../../data/prototypeData'
import { useCommerce } from '../../state/CommerceState'
import { useProfile } from '../../state/ProfileState'
import {useAuth} from '../../state/AuthState'
import {canViewServiceRequest} from '../../state/serviceRequests'
import { getDemoProduct, asProductCard } from '../../data/productRegistry'

export function ProfileOverview() {
  const { user, orders, recentProductIds,serviceRequests } = useProfile()
  const {identity}=useAuth()
  const openRequests=serviceRequests.filter(record=>canViewServiceRequest(record,identity)&&!['Выполнено','Отменено'].includes(record.status)).length
  const commerce = useCommerce()
  const activeOrders = orders.filter((order) => order.status === 'В обработке' || order.status === 'Заявка на отмену отправлена')
  const recent = recentProductIds.slice(0, 3).flatMap(id => { const product = getDemoProduct(id); return product ? [asProductCard(product)] : [] })
  return <div className="profile-section profile-overview">
    <header className="profile-section__heading"><h1>Личный кабинет</h1><Link className="profile-button" to="/profile/data">Настроить профиль</Link></header>
    <section className="profile-welcome"><div><span>Здравствуйте, {user.firstName}</span><h2>Всё важное — в одном рабочем пространстве</h2><p>Заказы, организации, услуги и сохранённые товары доступны по разделам кабинета.</p></div></section>
    <section className="profile-stats" aria-label="Сводка"><Link to="/profile/orders"><strong>{activeOrders.length}</strong><span>Активные заказы</span></Link><Link to="/profile/services"><strong>{openRequests}</strong><span>Открытые заявки</span></Link><Link to="/profile/favorites"><strong>{commerce.favoriteIds.size}</strong><span>В избранном</span></Link></section>
    <div className="profile-dashboard-grid">
      <section className="profile-panel profile-dashboard-card"><div className="profile-panel-heading"><h2>Активные заказы</h2><Link to="/profile/orders">Все заказы →</Link></div>{!activeOrders.length&&<p className="profile-overview-empty">Активных заказов пока нет.</p>}{activeOrders.map((order) => <Link className="profile-order-row" data-status-tone={profileStatusTone(order.status)} key={order.id} to={`/profile/orders/${order.id}`}><div><strong>№ {order.number}</strong><span>{order.date} · {order.items.length} товара</span></div><ProfileStatus>{order.status}</ProfileStatus><b>{order.total}</b></Link>)}</section>
      <section className="profile-panel profile-quick-links"><h2>Быстрые действия</h2><Link to="/profile/organizations"><span><ProfileIcon name="organization"/></span><div><strong>Мои организации</strong><small>Реквизиты и активная организация</small></div><b><ProfileIcon name="arrow"/></b></Link><Link to="/profile/data"><span><ProfileIcon name="profile"/></span><div><strong>Данные профиля</strong><small>Контакты и адреса доставки</small></div><b><ProfileIcon name="arrow"/></b></Link></section>
    </div>
    <section className="profile-panel"><div className="profile-panel-heading"><h2>Последние просмотренные</h2><Link to="/profile/recently-viewed">Вся история →</Link></div>{!recent.length&&<p className="profile-overview-empty">Здесь появятся товары, которые вы просматривали.</p>}<div className="profile-recent-compact">{recent.map((product) => <Link key={product.id} to={product.href}><span className="profile-recent-photo"><CartProductImage product={product}/></span><div><strong>{product.name}</strong><small>{product.price}</small></div><b><ProfileIcon name="arrow"/></b></Link>)}</div></section>
  </div>
}
