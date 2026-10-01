import { Link } from 'react-router-dom'
import { checkoutProducts } from '../data/checkoutData'
import { useCommerce } from '../state/CommerceState'
import { OrderSummary } from './CartPage'
import './CartCheckout.css'
import { useEffect } from 'react'

const Stepper = ({ current }: { current: number }) => <ol className="checkout-steps" aria-label="Этапы оформления">{['Проверка заказа', 'Доставка и оплата', 'Заказ принят'].map((label, index) => <li className={index + 1 <= current ? 'active' : ''} key={label}>{index + 1}. {label}</li>)}</ol>
const useDemoCart = () => { const { ensureDemoCart } = useCommerce(); useEffect(() => ensureDemoCart(), []) }

export function CheckoutReviewPage() {
  useDemoCart()
  const { checkout, updateCheckout } = useCommerce()
  return <main className="checkout-page checkout-review-page">
    <nav className="checkout-breadcrumbs" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span>/</span><Link to="/cart">Корзина</Link><span>/</span><span>Проверка заказа</span></nav>
    <Stepper current={1}/>
    <header className="checkout-heading"><h1>Проверка заказа</h1><span>Уточните данные покупателя и получателя перед выбором доставки.</span></header>
    <div className="checkout-layout">
      <section className="checkout-form">
        <fieldset className="checkout-card">
          <legend>Кто оформляет заказ</legend>
          <div className="checkout-choice-grid">
            <label className={`checkout-choice${checkout.customerType === 'personal' ? ' is-selected' : ''}`}><input type="radio" name="customer-type" checked={checkout.customerType === 'personal'} onChange={() => updateCheckout({ customerType: 'personal', payment: 'card' })}/><span><strong>Физическое лицо</strong><small>Покупка для себя</small></span></label>
            <label className={`checkout-choice${checkout.customerType === 'organization' ? ' is-selected' : ''}`}><input type="radio" name="customer-type" aria-label="Оформляет организация" checked={checkout.customerType === 'organization'} onChange={() => updateCheckout({ customerType: 'organization', payment: 'invoice' })}/><span><strong>Организация</strong><small>Заказ по реквизитам компании</small></span></label>
          </div>
          {checkout.customerType === 'organization' && <div className="checkout-organization"><label>Организация<select aria-label="Организация" value={checkout.organization} onChange={(event) => updateCheckout({ organization: event.target.value })}><option>ООО «Гараж»</option></select></label><p>Реквизиты и ИНН загружены из профиля</p></div>}
        </fieldset>

        <fieldset className="checkout-card">
          <legend>Контактные данные</legend>
          <div className="checkout-toggle-row">
            <label><input type="checkbox" aria-label="Оформить как гость" checked={checkout.guest} onChange={(event) => updateCheckout({ guest: event.target.checked, phoneVerified: false })}/><span><strong>Оформить как гость</strong><small>Заполнить контакты без данных профиля</small></span></label>
            <label><input type="checkbox" aria-label="Другой получатель" checked={checkout.otherRecipient} onChange={(event) => updateCheckout({ otherRecipient: event.target.checked })}/><span><strong>Другой получатель</strong><small>Заказ заберёт другой человек</small></span></label>
          </div>

          {!checkout.guest && <div className="checkout-account-contact"><label>Телефон аккаунта<input aria-label="Телефон аккаунта" value="+7 (900) 000-00-00" readOnly/></label><span>Подтверждён в профиле</span></div>}

          {checkout.guest && <div className="checkout-fields checkout-fields--guest">
            <label>Имя покупателя<input aria-label="Имя покупателя" required value={checkout.guestName} onChange={(event) => updateCheckout({ guestName: event.target.value })}/></label>
            <label>Электронная почта<input aria-label="Электронная почта" type="email" required value={checkout.guestEmail} onChange={(event) => updateCheckout({ guestEmail: event.target.value })}/></label>
            <label>Телефон покупателя<input aria-label="Телефон покупателя" type="tel" required value={checkout.guestPhone} onChange={(event) => updateCheckout({ guestPhone: event.target.value, phoneVerified: false })}/></label>
            <div className="checkout-verification"><button type="button" onClick={() => updateCheckout({ phoneVerified: true })}>Получить код</button>{checkout.phoneVerified && <span role="status">Код подтверждён</span>}</div>
          </div>}

          {checkout.otherRecipient && <div className="checkout-fields checkout-fields--recipient">
            <label>Имя получателя<input aria-label="Имя получателя" required value={checkout.recipientName} onChange={(event) => updateCheckout({ recipientName: event.target.value })}/></label>
            <label>Фамилия получателя<input aria-label="Фамилия получателя" required value={checkout.recipientLastName} onChange={(event) => updateCheckout({ recipientLastName: event.target.value })}/></label>
            <label>Телефон получателя<input aria-label="Телефон получателя" type="tel" required value={checkout.recipientPhone} onChange={(event) => updateCheckout({ recipientPhone: event.target.value })}/></label>
          </div>}
          {(checkout.guest || checkout.otherRecipient) && <p className="checkout-required-note">Поля, отмеченные как обязательные, нужны для связи по заказу.</p>}
        </fieldset>
      </section>
      <OrderSummary action={<Link className="button checkout-sticky" to="/checkout/delivery">Продолжить оформление</Link>}/>
    </div>
  </main>
}

export function CheckoutDeliveryPage() {
  useDemoCart()
  const { checkout, updateCheckout } = useCommerce()
  return <main className="checkout-page container"><Stepper current={2}/><h1>Доставка и оплата</h1><div className="checkout-layout"><section className="checkout-form"><fieldset><legend>Способ получения</legend><label><input type="radio" checked={checkout.delivery === 'delivery'} onChange={() => updateCheckout({ delivery: 'delivery' })}/>Доставка</label><label><input type="radio" checked={checkout.delivery === 'pickup'} onChange={() => updateCheckout({ delivery: 'pickup' })}/>Самовывоз</label>{checkout.delivery === 'delivery' ? <label>Адрес доставки<input value={checkout.address} onChange={(event) => updateCheckout({ address: event.target.value })}/></label> : <label>Магазин<select value={checkout.store} onChange={(event) => updateCheckout({ store: event.target.value })}><option>Магазин в выбранном городе</option></select></label>}</fieldset><fieldset><legend>Оплата</legend>{checkout.customerType === 'organization' && <label><input aria-label="Оплата по счёту" type="radio" checked={checkout.payment === 'invoice'} onChange={() => updateCheckout({ payment: 'invoice' })}/>Оплата по счёту</label>}<label><input type="radio" checked={checkout.payment === 'card'} onChange={() => updateCheckout({ payment: 'card' })}/>Банковской картой</label>{checkout.customerType === 'personal' && <label><input type="radio" checked={checkout.payment === 'cash'} onChange={() => updateCheckout({ payment: 'cash' })}/>При получении</label>}</fieldset><section><h2>Получатель</h2><p>{checkout.otherRecipient ? checkout.recipientName || 'Данные другого получателя' : 'Получатель из профиля'}</p></section></section><OrderSummary action={<Link className="button checkout-sticky" to="/checkout/success">Подтвердить заказ</Link>}/></div></main>
}

export function CheckoutSuccessPage() {
  useDemoCart()
  const { cartItems, checkout } = useCommerce()
  return <main className="checkout-page container"><Stepper current={3}/><h1>Заказ принят</h1><p className="order-number">Номер заказа: GR-2026-091</p><div className="checkout-layout"><section className="checkout-form"><h2>Состав заказа</h2><ul>{cartItems.map((line) => <li key={line.id}>{checkoutProducts.find((item) => item.id === line.id)?.name ?? line.id} — {line.quantity} шт.</li>)}</ul><h2>Получение и оплата</h2><p>{checkout.delivery === 'delivery' ? `Доставка: ${checkout.address}` : `Самовывоз: ${checkout.store}`}</p><p>{checkout.payment === 'invoice' ? 'Оплата по счёту' : checkout.payment === 'card' ? 'Банковской картой' : 'Оплата при получении'}</p><div className="success-actions"><Link className="button" to="/profile/orders">Активные заказы</Link><Link to="/catalog">Вернуться в каталог</Link></div></section><OrderSummary/></div></main>
}
