import { useState } from 'react'
import { productDetail, money } from '../../data/productDetailData'
import { useCommerce } from '../../state/CommerceState'
import { useRegion } from '../../state/RegionState'

export type CommercialState = 'available' | 'request'

const requestCopy = {
  price: 'Запрос цены подготовлен. Менеджер подтвердит цену и срок поставки.',
  oneClick: 'Заказ в один клик подготовлен. Менеджер свяжется для подтверждения.',
  finance: 'Запрос условий финансирования подготовлен. Доступность уточняется отдельно.',
}

type ProductPurchaseProps = {
  state: CommercialState
  onStateChange: (state: CommercialState) => void
}

export function ProductPurchase({ state, onStateChange }: ProductPurchaseProps) {
  const commerce = useCommerce()
  const { region } = useRegion()
  const [request, setRequest] = useState<keyof typeof requestCopy | null>(null)
  const [quantity, setQuantity] = useState(1)
  const inCart = commerce.cartIds.has(productDetail.id)
  const saving = productDetail.oldPrice - productDetail.price
  const isAvailable = state === 'available'

  return <aside className="product-purchase" aria-label="Покупка товара">
    <p className="product-purchase__notice">Демонстрационные данные прототипа</p>
    <div className="product-state-switch" role="group" aria-label="Демонстрация коммерческого состояния">
      <span>Состояние товара</span>
      <div>
        <button type="button" aria-pressed={isAvailable} onClick={() => { onStateChange('available'); setRequest(null) }}>Доступен</button>
        <button type="button" aria-pressed={!isAvailable} onClick={() => { onStateChange('request'); setRequest(null) }}>Цена по запросу</button>
      </div>
    </div>

    {isAvailable ? <>
      <div className="product-purchase__price"><del>{money(productDetail.oldPrice)}</del><strong>{money(productDetail.price)}</strong><span>Скидка {money(saving)}</span></div>
      <p className="product-purchase__status"><span />{productDetail.status}<small>Данные о наличии зависят от выбранного города</small></p>
      <div className="product-purchase__buy-row">
        <div className="product-quantity" aria-label="Количество товара"><button type="button" aria-label="Уменьшить количество" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><output>{quantity}</output><button type="button" aria-label="Увеличить количество" onClick={() => setQuantity((value) => value + 1)}>+</button></div>
        <button className="button button--dark" type="button" onClick={() => commerce.addToCart(productDetail.id)}>{inCart ? 'В корзине' : 'В корзину'}</button>
      </div>
      <button className="button" type="button" onClick={() => setRequest('oneClick')}>Купить в один клик</button>
      <button className="product-purchase__finance" type="button" onClick={() => setRequest('finance')}>Рассрочка · сплит · лизинг <span>условия уточняются</span></button>
    </> : <>
      <div className="product-purchase__request-price"><strong>Цена по запросу</strong><p>Менеджер подтвердит цену и срок поставки после обращения.</p></div>
      <button className="button button--dark" type="button" onClick={() => setRequest('price')}>Запросить цену</button>
    </>}

    <div className="product-fulfillment">
      <div><strong>Доставка в городе {region}</strong><span>{isAvailable ? 'Ориентировочный срок уточняется' : 'Доступность и срок подтвердит менеджер'}</span></div>
      <div><strong>Самовывоз</strong><span>{isAvailable ? 'Из доступного пункта после подтверждения' : 'Возможные пункты сообщит менеджер'}</span></div>
    </div>
    <div className="product-purchase__assurances"><span>Гарантия</span><span>Возврат</span><span>Оплата</span></div>
    <p className="product-purchase__audience">Физическим лицам и организациям</p>
    {request && <p className="product-purchase__feedback" role="status">{requestCopy[request]}</p>}
  </aside>
}

export function ProductMobilePurchase({ state }: { state: CommercialState }) {
  const commerce = useCommerce()
  const isAvailable = state === 'available'
  return <div className="product-mobile-purchase"><div><small>Демонстрационные данные прототипа</small><strong>{isAvailable ? `${money(productDetail.price)} · цена` : 'Цена по запросу'}</strong></div><button className="button button--dark" type="button" onClick={() => isAvailable && commerce.addToCart(productDetail.id)}>{isAvailable ? (commerce.cartIds.has(productDetail.id) ? 'В корзине' : 'В корзину') : 'Запросить'}</button></div>
}
