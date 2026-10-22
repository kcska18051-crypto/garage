import { Link } from 'react-router-dom'
import { useAuth } from '../../state/AuthState'
import { useProfile } from '../../state/ProfileState'

export function CartRecipient() {
  const { isAuthenticated, identity, openAuth } = useAuth()
  const { user } = useProfile()
  return <section className="cart-recipient" aria-labelledby="cart-recipient-title">
    <div><h2 id="cart-recipient-title">{isAuthenticated ? 'Получатель заказа' : 'Войдите или зарегистрируйтесь'}</h2>{isAuthenticated ? <><p>{identity?.phone === '79000000000' ? `${user.firstName} ${user.lastName}` : 'Авторизованный покупатель'}</p><p>{identity?.phone ? `+${identity.phone}` : user.phone}</p><small>Демонстрационный профиль</small></> : <p>Для завершения заказа необходимо войти или зарегистрироваться. Корзина и выбранные условия сохранятся.</p>}</div>
    {isAuthenticated ? <Link to="/profile/data">Изменить данные профиля</Link> : <button className="button" type="button" onClick={() => openAuth('login', { returnTo: '/cart' })}>Войти или зарегистрироваться</button>}
  </section>
}
