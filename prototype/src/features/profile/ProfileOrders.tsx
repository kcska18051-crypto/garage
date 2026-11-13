import { formatProductCount } from '../../data/catalogData'
import { ProfileStatus } from './ProfileStatus'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { ProfileOrder, ProfileOrderKind } from '../../data/profileData'
import { useCommerce } from '../../state/CommerceState'
import { useProfile } from '../../state/ProfileState'
import { ProfileDialog } from './ProfileDialog'



export function ProfileOrders() {
  const { orders, notification, notify } = useProfile()
  const commerce = useCommerce()
  const [params, setParams] = useSearchParams()
  const kind: ProfileOrderKind = params.get('kind') === 'organization' ? 'organization' : 'personal'
  const setKind = (value: ProfileOrderKind) => {
    const next = new URLSearchParams(params)
    if (value === 'organization') next.set('kind', value)
    else next.delete('kind')
    setParams(next, { preventScrollReset: true })
  }
  const [repeatOrder, setRepeatOrder] = useState<ProfileOrder | null>(null)
  const visible = orders.filter((order) => order.kind === kind)

  const confirmRepeat = () => {
    if (!repeatOrder) return
    const available = repeatOrder.items.filter((item) => item.available)
    available.forEach(item => commerce.addToCart(item.productId, item.quantity))
    const count = available.reduce((sum, item) => sum + item.quantity, 0)
    notify(count ? `${formatProductCount(count)} ${count === 1 ? 'добавлен' : 'добавлены'} в корзину. Состав и условия пересчитаны.` : 'В этом заказе нет доступных товаров для повтора.')
    setRepeatOrder(null)
  }

  return <div className="profile-section">
    <header className="profile-section__heading"><h1>Мои заказы</h1></header>
    <div className="profile-tabs" role="group" aria-label="Тип заказов"><button type="button" aria-pressed={kind === 'personal'} onClick={() => setKind('personal')}>Личные</button><button type="button" aria-pressed={kind === 'organization'} onClick={() => setKind('organization')}>От организаций</button></div>
    {notification && <p className="profile-message profile-message--success" role="status">{notification}</p>}
    <div className="profile-order-list">{visible.map((order) => <article className="profile-order-card" data-testid={`order-${order.id}`} key={order.id}>
      <div className="profile-order-card__top"><div><span>Заказ № {order.number}</span><small>{order.date}</small></div><ProfileStatus>{order.status}</ProfileStatus><strong>{order.total}</strong></div>
      {order.kind === 'organization' && <div className="profile-order-card__organization"><strong>{order.organization}</strong><span>ИНН {order.inn}</span></div>}
      <dl><div><dt>Получение</dt><dd>{order.delivery}</dd></div><div><dt>Состав</dt><dd>{formatProductCount(order.items.length)}</dd></div><div><dt>Тип</dt><dd>{order.kind === 'personal' ? 'Личный' : 'Организация'}</dd></div></dl>
      <div className="profile-actions"><Link className="profile-button profile-button--primary" to={`/profile/orders/${order.id}`}>Подробнее</Link><button className="profile-button" type="button" onClick={() => setRepeatOrder(order)}>Повторить заказ</button></div>
    </article>)}</div>
    {repeatOrder && <ProfileDialog title="Повторить заказ" onClose={() => setRepeatOrder(null)}><p>Перед добавлением цена, наличие и состав будут пересчитаны по актуальным данным.</p>{repeatOrder.items.some((item) => !item.available) && <div className="profile-warning"><strong>Сейчас недоступны и не будут добавлены:</strong><ul>{repeatOrder.items.filter((item) => !item.available).map((item) => <li key={item.productId}>{item.name}</li>)}</ul></div>}<div className="profile-actions"><button className="profile-button profile-button--primary" type="button" onClick={confirmRepeat}>Добавить доступные товары</button><button className="profile-button" type="button" onClick={() => setRepeatOrder(null)}>Отмена</button></div></ProfileDialog>}
  </div>
}
