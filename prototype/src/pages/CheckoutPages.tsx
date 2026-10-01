import { Link, Navigate, useNavigate } from 'react-router-dom'
import { checkoutProducts, money } from '../data/checkoutData'
import { useCommerce } from '../state/CommerceState'
import './CartCheckout.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatProfileAddress, useProfile } from '../state/ProfileState'

const useDemoCart = () => { const { ensureDemoCart } = useCommerce(); useEffect(() => ensureDemoCart(), []) }

const deliveryLabels = { pickup: 'Самовывоз', courier: 'Курьером', transport: 'Транспортная компания' } as const
const paymentLabels = { card: 'Картой онлайн', sbp: 'СБП', cash: 'При получении', installment: 'Рассрочка / Сплит', invoice: 'Оплата по счёту' } as const

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
}

export function CheckoutReviewPage() {
  useDemoCart()
  const navigate = useNavigate()
  const { cartItems, checkout, updateCheckout } = useCommerce()
  const { addresses } = useProfile()
  const [courierEditor, setCourierEditor] = useState(Boolean(checkout.address))
  const [transportEditor, setTransportEditor] = useState(Boolean(checkout.transportAddress))
  const [validationMessage, setValidationMessage] = useState('')
  const [ctaVisible, setCtaVisible] = useState(false)
  const submitRef = useRef<HTMLButtonElement>(null)
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = useMemo(() => cartItems.reduce((sum, line) => sum + (checkoutProducts.find((item) => item.id === line.id)?.price ?? 0) * line.quantity, 0), [cartItems])
  const recipientValid = !checkout.otherRecipient || Boolean(checkout.recipientName.trim() && checkout.recipientLastName.trim() && checkout.recipientPhone.trim())
  const deliveryValid = checkout.delivery === 'pickup' ? Boolean(checkout.store) : checkout.delivery === 'courier' ? Boolean(checkout.address.trim()) : Boolean(checkout.transportAddress.trim())
  const paymentValid = checkout.customerType === 'organization' ? checkout.payment === 'invoice' : checkout.payment !== 'invoice' && checkout.payment !== 'installment' && !(checkout.payment === 'cash' && checkout.delivery === 'transport')
  const orderValid = recipientValid && deliveryValid && paymentValid

  useEffect(() => {
    if (!submitRef.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), { threshold: .6 })
    observer.observe(submitRef.current)
    return () => observer.disconnect()
  }, [])

  const setCustomerType = (customerType: 'personal' | 'organization') => updateCheckout({ customerType, payment: customerType === 'organization' ? 'invoice' : 'card' })
  const setDelivery = (delivery: 'pickup' | 'courier' | 'transport') => updateCheckout({ delivery, payment: checkout.customerType === 'organization' ? 'invoice' : checkout.payment === 'cash' && delivery === 'transport' ? 'card' : checkout.payment })
  const submit = () => {
    if (!recipientValid) { setValidationMessage('Заполните данные другого получателя'); scrollToSection('checkout-recipient'); return }
    if (!deliveryValid) { setValidationMessage('Выберите способ получения и укажите место получения'); scrollToSection('checkout-delivery'); return }
    if (!paymentValid) { setValidationMessage('Выберите доступный способ оплаты'); scrollToSection('checkout-payment'); return }
    setValidationMessage('')
    navigate('/checkout/success')
  }

  return <main className="checkout-page checkout-review-page">
    <nav className="checkout-breadcrumbs" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span>/</span><Link to="/cart">Корзина</Link><span>/</span><span>Оформление заказа</span></nav>
    <header className="checkout-heading"><Link className="checkout-back" aria-label="Вернуться в корзину" to="/cart">← Вернуться в корзину</Link><h1>Оформление заказа</h1></header>
    <div className="checkout-layout">
      <section className="checkout-form">
        <section className="checkout-card" id="checkout-recipient" aria-labelledby="recipient-title">
          <div className="checkout-card__heading"><h2 id="recipient-title">Данные получателя</h2><div className="checkout-customer-tabs" role="tablist" aria-label="Тип покупателя"><button role="tab" aria-selected={checkout.customerType === 'personal'} onClick={() => setCustomerType('personal')}>Покупка для себя</button><button role="tab" aria-selected={checkout.customerType === 'organization'} onClick={() => setCustomerType('organization')}>Купить как юридическое лицо</button></div></div>
          <div className="checkout-profile-data">
            <label>Имя<input aria-label="Имя пользователя" value="Пользователь профиля" readOnly/></label>
            <label>Телефон<input aria-label="Подтверждённый телефон" value="+7 (900) 000-00-00" readOnly/></label>
          </div>
          {checkout.customerType === 'organization' && <div className="checkout-organization"><label>Организация<select aria-label="Организация" value={checkout.organization} onChange={(event) => updateCheckout({ organization: event.target.value })}><option>ООО «Гараж»</option></select></label><label>Найти другую организацию<input aria-label="Поиск организации по ИНН" inputMode="numeric" placeholder="Введите ИНН" value={checkout.organizationInn} onChange={(event) => updateCheckout({ organizationInn: event.target.value })}/></label><p>Реквизиты выбранной организации загружаются из профиля.</p></div>}
          <label className="checkout-switch"><input type="checkbox" aria-label="Заберёт другой человек" checked={checkout.otherRecipient} onChange={(event) => updateCheckout({ otherRecipient: event.target.checked })}/><span><strong>Заберёт другой человек</strong><small>Укажите его контактные данные</small></span></label>
          {checkout.otherRecipient && <div className="checkout-fields checkout-fields--recipient">
            <label>Имя получателя<input aria-label="Имя получателя" required value={checkout.recipientName} onChange={(event) => updateCheckout({ recipientName: event.target.value })}/></label>
            <label>Фамилия получателя<input aria-label="Фамилия получателя" required value={checkout.recipientLastName} onChange={(event) => updateCheckout({ recipientLastName: event.target.value })}/></label>
            <label>Телефон получателя<input aria-label="Телефон получателя" type="tel" required value={checkout.recipientPhone} onChange={(event) => updateCheckout({ recipientPhone: event.target.value })}/></label>
            <p>Код подтверждения для другого получателя предусмотрен; окончательная механика уточняется.</p>
          </div>}
        </section>

        <section className="checkout-card" id="checkout-delivery" aria-labelledby="delivery-title">
          <h2 id="delivery-title">Способ получения</h2>
          <div className="checkout-delivery-tabs" role="tablist" aria-label="Способ получения">
            <button role="tab" aria-selected={checkout.delivery === 'pickup'} onClick={() => setDelivery('pickup')}><strong>Самовывоз</strong><small>Из пункта выдачи</small></button>
            <button role="tab" aria-selected={checkout.delivery === 'courier'} onClick={() => setDelivery('courier')}><strong>Курьером</strong><small>Стоимость после адреса</small></button>
            <button role="tab" aria-selected={checkout.delivery === 'transport'} onClick={() => setDelivery('transport')}><strong>Транспортная компания</strong><small>По тарифу перевозчика</small></button>
          </div>
          <div className="checkout-delivery-panel">
            {checkout.delivery === 'pickup' && <><div><b>Ярославль</b><p>Выберите удобный пункт выдачи заказа.</p></div>{checkout.store ? <div className="checkout-location"><div><strong>{checkout.store}</strong><span>Адрес демонстрационный · ориентировочно завтра · бесплатно</span></div><div className="checkout-map" aria-label="Место для карты">Карта пункта выдачи</div><div className="checkout-location__actions"><button type="button">Показать на карте</button><button type="button" onClick={() => updateCheckout({ store: '' })}>Изменить магазин</button></div></div> : <button className="checkout-secondary-button" type="button" onClick={() => updateCheckout({ store: 'Пункт выдачи в выбранном городе' })}>Выбрать пункт выдачи</button>}</>}
            {checkout.delivery === 'courier' && <><p>Выберите сохранённый адрес или укажите новый.</p><div className="checkout-saved-addresses">{addresses.map((address) => <button className={checkout.address === formatProfileAddress(address) ? 'is-selected' : ''} type="button" key={address.id} onClick={() => { updateCheckout({ address: formatProfileAddress(address) }); setCourierEditor(false) }}>{address.label} — {formatProfileAddress(address)}</button>)}</div>{!courierEditor && <button className="checkout-secondary-button" type="button" onClick={() => setCourierEditor(true)}>Указать адрес доставки</button>}{(courierEditor || (checkout.address && !addresses.some((address) => formatProfileAddress(address) === checkout.address))) && <div className="checkout-address"><label>Адрес доставки<input aria-label="Адрес доставки" value={checkout.address} placeholder="Город, улица, дом" onChange={(event) => updateCheckout({ address: event.target.value })}/></label><span>Ориентировочная дата и стоимость будут рассчитаны после выбора адреса.</span></div>}</>}
            {checkout.delivery === 'transport' && <><p>Отправка из выбранного региона. Можно указать адрес или терминал транспортной компании.</p>{!transportEditor && !checkout.transportAddress ? <button className="checkout-secondary-button" type="button" onClick={() => setTransportEditor(true)}>Указать адрес или терминал</button> : <div className="checkout-address"><label>Адрес или терминал<input aria-label="Адрес или терминал транспортной компании" value={checkout.transportAddress} placeholder="Терминал или адрес" onChange={(event) => updateCheckout({ transportAddress: event.target.value })}/></label><span>Срок и стоимость рассчитываются по тарифу перевозчика.</span></div>}</>}
          </div>
        </section>

        <section className="checkout-card" id="checkout-payment" aria-labelledby="payment-title">
          <h2 id="payment-title">Способ оплаты</h2>
          <div className="checkout-payment-grid">
            {checkout.customerType === 'organization' ? <label className="checkout-payment is-selected"><input type="radio" aria-label="Оплата по счёту" checked={checkout.payment === 'invoice'} onChange={() => updateCheckout({ payment: 'invoice' })}/><span><strong>Оплата по счёту</strong><small>Для выбранной организации</small></span></label> : <>
              <label className={`checkout-payment${checkout.payment === 'card' ? ' is-selected' : ''}`}><input type="radio" name="payment" aria-label="Картой онлайн" checked={checkout.payment === 'card'} onChange={() => updateCheckout({ payment: 'card' })}/><span><strong>Картой онлайн</strong><small>После проверки заказа</small></span></label>
              <label className={`checkout-payment${checkout.payment === 'sbp' ? ' is-selected' : ''}`}><input type="radio" name="payment" aria-label="СБП" checked={checkout.payment === 'sbp'} onChange={() => updateCheckout({ payment: 'sbp' })}/><span><strong>СБП</strong><small>Онлайн-оплата</small></span></label>
              <label className={`checkout-payment${checkout.payment === 'cash' ? ' is-selected' : ''}`}><input type="radio" name="payment" aria-label="При получении" disabled={checkout.delivery === 'transport'} checked={checkout.payment === 'cash'} onChange={() => updateCheckout({ payment: 'cash' })}/><span><strong>При получении</strong><small>{checkout.delivery === 'transport' ? 'Недоступно для транспортной компании' : 'Если допустимо способом получения'}</small></span></label>
              <label className="checkout-payment is-disabled"><input type="radio" name="payment" aria-label="Рассрочка или Сплит" disabled/><span><strong>Рассрочка / Сплит</strong><small>Условия уточняются</small></span></label>
            </>}
          </div>
        </section>

        <section className="checkout-card checkout-extra" aria-labelledby="extra-title"><h2 id="extra-title">Дополнительно</h2><label>Комментарий к заказу<textarea aria-label="Комментарий к заказу" value={checkout.comment} onChange={(event) => updateCheckout({ comment: event.target.value })}/></label><label className="checkout-marketing"><input type="checkbox" checked={checkout.marketingConsent} onChange={(event) => updateCheckout({ marketingConsent: event.target.checked })}/>Получать рекламные материалы</label><p>Нажимая «Оформить заказ», вы подтверждаете согласие с условиями оформления и обработки данных.</p></section>
      </section>
      <aside className="order-summary checkout-summary" aria-label="Итоги заказа">
        <h2>Ваш заказ</h2><div className="order-summary__row"><span>{count} товара на сумму</span><b>{money(total)}</b></div><div className="order-summary__row"><span>Скидка</span><b>0 ₽</b></div><div className="order-summary__row"><span>Доставка</span><b>{checkout.delivery === 'pickup' ? 'Бесплатно' : checkout.delivery === 'courier' ? 'Рассчитает менеджер' : 'По тарифу ТК'}</b></div><div className="order-summary__total"><span>Итого</span><strong>{money(total)}</strong></div>
        <div className="checkout-summary__details"><p><span>Получатель</span><b>{checkout.otherRecipient ? `${checkout.recipientName || 'Другой'} ${checkout.recipientLastName}`.trim() : 'Пользователь профиля'}</b><button onClick={() => scrollToSection('checkout-recipient')}>Изменить</button></p><p><span>Получение</span><b>{deliveryLabels[checkout.delivery]}</b><button onClick={() => scrollToSection('checkout-delivery')}>Изменить</button></p><p><span>Оплата</span><b>{paymentLabels[checkout.payment]}</b><button onClick={() => scrollToSection('checkout-payment')}>Изменить</button></p></div>
        {validationMessage && <p className="checkout-validation" role="alert">{validationMessage}</p>}
        <button ref={submitRef} data-testid="checkout-submit" className={`button checkout-submit${orderValid ? '' : ' is-inactive'}`} aria-disabled={!orderValid} type="button" onClick={submit}>Оформить заказ</button>
      </aside>
    </div>
    <div className={`mobile-checkout-hint${ctaVisible ? ' is-hidden' : ''}`} data-testid="mobile-checkout-hint"><span><b>{money(total)}</b><small>{count} товара</small></span><button type="button" aria-label="Перейти к оформлению заказа" onClick={() => submitRef.current?.scrollIntoView?.({ behavior: 'auto', block: 'center' })}>Оформить заказ</button></div>
  </main>
}

export function CheckoutDeliveryPage() {
  return <Navigate replace to="/checkout/review#checkout-delivery"/>
}

export function CheckoutSuccessPage() {
  useDemoCart()
  const { cartItems, checkout } = useCommerce()
  return <main className="checkout-page checkout-success-page"><h1>Заказ принят</h1><p className="order-number">Номер заказа: GR-2026-091</p><div className="checkout-layout"><section className="checkout-form checkout-card"><h2>Состав заказа</h2><ul>{cartItems.map((line) => <li key={line.id}>{checkoutProducts.find((item) => item.id === line.id)?.name ?? line.id} — {line.quantity} шт.</li>)}</ul><h2>Получение и оплата</h2><p>{deliveryLabels[checkout.delivery]}: {checkout.delivery === 'pickup' ? checkout.store : checkout.delivery === 'courier' ? checkout.address : checkout.transportAddress}</p><p>{paymentLabels[checkout.payment]}</p><div className="success-actions"><Link className="button" to="/profile/orders">Активные заказы</Link><Link to="/catalog">Вернуться в каталог</Link></div></section></div></main>
}
