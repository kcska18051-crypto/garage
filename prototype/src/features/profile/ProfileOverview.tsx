import { Link } from 'react-router-dom'
import { prototypeData } from '../../data/prototypeData'
import { useCommerce } from '../../state/CommerceState'
import { useProfile } from '../../state/ProfileState'

export function ProfileOverview() {
  const { user, orders, recentProductIds } = useProfile()
  const commerce = useCommerce()
  const activeOrders = orders.filter((order) => order.status === 'В обработке' || order.status === 'Заявка на отмену отправлена')
  const recent = recentProductIds.slice(0, 3).map((id) => prototypeData.products.find((product) => product.id === id)!).filter(Boolean)
  return <div className="profile-section profile-overview">
    <header className="profile-section__heading"><h1>Личный кабинет</h1><Link className="profile-button" to="/profile/data">Настроить профиль</Link></header>
    <section className="profile-welcome"><div><span>Здравствуйте, {user.firstName}</span><h2>Всё важное — в одном рабочем пространстве</h2><p>Заказы, организации, услуги и сохранённые товары доступны по разделам кабинета.</p></div><span className="profile-welcome__shape" aria-hidden="true" /></section>
    <section className="profile-stats" aria-label="Сводка"><Link to="/profile/orders"><strong>{activeOrders.length}</strong><span>Активные заказы</span></Link><Link to="/profile/services"><strong>3</strong><span>Открытые заявки</span></Link><Link to="/profile/favorites"><strong>{commerce.favoriteIds.size}</strong><span>В избранном</span></Link></section>
    <div className="profile-dashboard-grid">
      <section className="profile-panel profile-dashboard-card"><div className="profile-panel-heading"><h2>Активные заказы</h2><Link to="/profile/orders">Все заказы →</Link></div>{activeOrders.map((order) => <Link className="profile-order-row" key={order.id} to={`/profile/orders/${order.id}`}><div><strong>№ {order.number}</strong><span>{order.date} · {order.items.length} товара</span></div><span className="profile-status"><i aria-hidden="true" />{order.status}</span><b>{order.total}</b></Link>)}</section>
      <section className="profile-panel profile-quick-links"><h2>Быстрые действия</h2><Link to="/profile/organizations"><span>▣</span><div><strong>Мои организации</strong><small>Реквизиты и активная организация</small></div><b>→</b></Link><Link to="/profile/data"><span>○</span><div><strong>Данные профиля</strong><small>Контакты и адреса доставки</small></div><b>→</b></Link></section>
    </div>
    <section className="profile-panel"><div className="profile-panel-heading"><h2>Последние просмотренные</h2><Link to="/profile/recently-viewed">Вся история →</Link></div><div className="profile-recent-compact">{recent.map((product) => <Link key={product.id} to={product.href}><span aria-hidden="true" /><div><strong>{product.name}</strong><small>{product.price}</small></div><b>→</b></Link>)}</div></section>
  </div>
}
