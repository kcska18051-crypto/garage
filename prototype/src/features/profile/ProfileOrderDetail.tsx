import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCommerce } from '../../state/CommerceState'
import { useProfile } from '../../state/ProfileState'
import { ProfileDialog } from './ProfileDialog'

export function ProfileOrderDetail() {
  const { id } = useParams()
  const { orders, requestCancellation, updateRecipient, updateAddress, notify, notification } = useProfile()
  const commerce = useCommerce()
  const order = orders.find((item) => item.id === id)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [recipientEdit, setRecipientEdit] = useState(false)
  const [addressEdit, setAddressEdit] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [recipient, setRecipient] = useState(order?.recipient)
  const [address, setAddress] = useState(order?.address ?? '')

  if (!order || !recipient) return <div className="profile-section"><h1>Заказ не найден</h1><Link to="/profile/orders">Вернуться к заказам</Link></div>
  const repeat = () => { const ids = order.items.filter((item) => item.available).map((item) => item.productId); commerce.addManyToCart(ids); notify(`${ids.length} товара добавлены в корзину. Цена и наличие будут пересчитаны.`) }
  const saveRecipient = () => { updateRecipient(order.id, recipient); setRecipientEdit(false) }
  const saveAddress = () => { if (!address.trim()) return; updateAddress(order.id, address); setAddressEdit(false) }

  return <div className="profile-section profile-order-detail">
    <Link className="profile-back" to="/profile/orders">← Все заказы</Link>
    <header className="profile-section__heading"><div><h1>Заказ № {order.number}</h1><span className="profile-heading-meta">{order.date}</span></div><div className="profile-order-total"><span className="profile-status"><i aria-hidden="true" />{order.status}</span><strong>{order.total}</strong></div></header>
    {notification && <p className="profile-message profile-message--success" role="status">{notification}</p>}
    <section className="profile-panel"><h2>Статус заказа</h2><ol className="profile-timeline">{order.timeline.map((step) => <li className={step.complete ? 'complete' : ''} aria-current={step.current ? 'step' : undefined} key={step.label}><i aria-hidden="true" /><span>{step.label}</span></li>)}</ol></section>
    <div className="profile-detail-grid">
      <section className="profile-panel"><div className="profile-panel-heading"><h2>Товары</h2><span>{order.items.length} позиции</span></div><div className="profile-order-products">{order.items.map((item) => <div key={item.productId}><span aria-hidden="true" /><div><strong>{item.name}</strong><small>{item.quantity} шт. · {item.available ? 'Доступно' : 'Недоступно для повтора'}</small></div></div>)}</div></section>
      <section className="profile-panel profile-order-summary"><h2>Получение и оплата</h2><dl><div><dt>Способ получения</dt><dd>{order.delivery}</dd></div><div><dt>Оплата</dt><dd>{order.payment}</dd></div></dl></section>
    </div>
    <div className="profile-detail-grid">
      <section className="profile-panel"><div className="profile-panel-heading"><h2>Получатель</h2>{order.canEdit && !recipientEdit && <button className="profile-link-button" type="button" onClick={() => setRecipientEdit(true)}>Изменить получателя</button>}</div>{recipientEdit ? <div className="profile-form profile-form--grid"><label>Имя получателя<input value={recipient.firstName} onChange={(event) => setRecipient({ ...recipient, firstName: event.target.value })} /></label><label>Фамилия получателя<input value={recipient.lastName} onChange={(event) => setRecipient({ ...recipient, lastName: event.target.value })} /></label><label>Телефон получателя<input value={recipient.phone} onChange={(event) => setRecipient({ ...recipient, phone: event.target.value })} /></label><div className="profile-radio-group"><label><input type="radio" name="recipient" checked={recipient.relation === 'owner'} onChange={() => setRecipient({ ...recipient, relation: 'owner' })} />Владелец аккаунта</label><label><input type="radio" name="recipient" checked={recipient.relation === 'other'} onChange={() => setRecipient({ ...recipient, relation: 'other' })} />Другой получатель</label></div><button className="profile-button profile-button--primary" type="button" onClick={saveRecipient}>Сохранить получателя</button></div> : <div className="profile-data-lines"><strong>Получатель: {order.recipient.firstName} {order.recipient.lastName}</strong><span>{order.recipient.phone}</span><small>{order.recipient.relation === 'owner' ? 'Заказ заберёт владелец аккаунта' : 'Заказ заберёт другой человек'}</small></div>}<p className="profile-info">Способ подтверждения получения будет уточнён.</p></section>
      <section className="profile-panel"><div className="profile-panel-heading"><h2>Адрес доставки</h2>{order.canEdit && !addressEdit && <button className="profile-link-button" type="button" onClick={() => setAddressEdit(true)}>Изменить адрес</button>}</div>{addressEdit ? <div className="profile-form"><label>Адрес доставки<input value={address} onChange={(event) => setAddress(event.target.value)} /></label>{address.toLocaleLowerCase('ru').includes('свобод') && <button className="profile-suggestion" type="button" onClick={() => setAddress('Ярославль, ул. Свободы, 18')}>Ярославль, ул. Свободы, 18</button>}<div className="profile-actions"><button className="profile-button profile-button--primary" type="button" onClick={saveAddress}>Сохранить адрес</button><button className="profile-button" type="button" onClick={() => setAddressEdit(false)}>Отмена</button></div></div> : <div className="profile-data-lines"><strong>{order.address}</strong><span>Демонстрационный адрес</span></div>}<button className="profile-link-button profile-map-link" type="button" onClick={() => setMapOpen(true)}>Показать на карте</button></section>
    </div>
    <div className="profile-actions"><button className="profile-button profile-button--primary" type="button" onClick={repeat}>Повторить заказ</button>{order.canCancel && <button className="profile-button profile-button--danger" type="button" onClick={() => setCancelOpen(true)}>Отменить заказ</button>}</div>
    {cancelOpen && <ProfileDialog title="Отменить заказ" onClose={() => setCancelOpen(false)}><p>Отмена не произойдёт мгновенно. Мы создадим заявку на отмену заказа.</p><div className="profile-actions"><button className="profile-button profile-button--danger" type="button" onClick={() => { requestCancellation(order.id); setCancelOpen(false) }}>Отправить заявку</button><button className="profile-button" type="button" onClick={() => setCancelOpen(false)}>Не отменять</button></div></ProfileDialog>}
    {mapOpen && <ProfileDialog title="Адрес на карте" onClose={() => setMapOpen(false)}><div className="profile-map" aria-label="Демонстрационная карта"><span aria-hidden="true">●</span><p>{order.address}</p></div><button className="profile-button" type="button" onClick={() => setMapOpen(false)}>Закрыть</button></ProfileDialog>}
  </div>
}
