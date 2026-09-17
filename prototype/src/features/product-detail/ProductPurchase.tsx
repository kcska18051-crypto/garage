import { useState } from 'react'
import { money, productDetail, type ProductOffer } from '../../data/productDetailData'
import { useCommerce } from '../../state/CommerceState'
import { CommercialProposal } from './CommercialProposal'

export type CommercialState = 'available' | 'order' | 'unavailable' | 'discontinued'

const stateMap: Record<CommercialState, { label: string; action: string; tone: string; stocks: Array<[string, string]> }> = {
  available: { label: 'В наличии', action: 'В корзину', tone: 'positive', stocks: [['Ярославль', '3 шт. · самовывоз сегодня'], ['Вологда', 'Получение ориентировочно завтра']] },
  order: { label: 'Под заказ', action: 'Запросить срок', tone: 'warning', stocks: [['Ярославль', 'Поставка ориентировочно 5–7 дней'], ['Вологда', 'Поставка ориентировочно 6–8 дней']] },
  unavailable: { label: 'Нет в наличии', action: 'Уведомить о поступлении', tone: 'negative', stocks: [['Ярославль', 'Нет в наличии'], ['Вологда', 'Нет в наличии']] },
  discontinued: { label: 'Снят с производства', action: 'Показать аналоги', tone: 'neutral', stocks: [['Ярославль', 'Поставка прекращена'], ['Вологда', 'Поставка прекращена']] },
}

type Props = { offer: ProductOffer; state: CommercialState; onStateChange(state: CommercialState): void }

export function GalleryPurchasePanel({ offer, state }: { offer: ProductOffer; state: CommercialState }) {
  const commerce = useCommerce()
  const current = stateMap[state]
  return <aside className="gallery-purchase" aria-label="Покупка в увеличенном просмотре">
    <small>Артикул {offer.sku}</small><h3>{productDetail.name}</h3><strong>{money(offer.price)}</strong>
    <p className={`product-status product-status--${current.tone}`}><i aria-hidden="true" />{current.label}</p>
    <button className="button button--dark" type="button" disabled={state !== 'available'} onClick={() => commerce.addToCart(offer.id)}>{state === 'available' ? 'В корзину' : current.action}</button>
  </aside>
}

export function ProductPurchase({ offer, state, onStateChange }: Props) {
  const commerce = useCommerce()
  const [feedback, setFeedback] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [proposalOpen, setProposalOpen] = useState(false)
  const current = stateMap[state]
  const saving = offer.oldPrice - offer.price
  const inCart = commerce.cartIds.has(offer.id)
  const primaryAction = () => {
    if (state === 'available') commerce.addToCart(offer.id)
    else if (state === 'order') setFeedback('Запрос срока подготовлен. Менеджер уточнит поставку.')
    else if (state === 'unavailable') setFeedback('Уведомление о поступлении включено в демонстрационном режиме.')
    else document.querySelector('#analogs')?.scrollIntoView()
  }
  return <aside className="product-purchase" aria-label="Покупка товара">
    <div className="product-state-switch" role="group" aria-label="Демонстрация статуса товара">
      <span>Показать состояние</span><div>{(Object.keys(stateMap) as CommercialState[]).map((key) => <button type="button" key={key} aria-label={stateMap[key].label} aria-pressed={state === key} onClick={() => { onStateChange(key); setFeedback('') }}>{stateMap[key].label}</button>)}</div>
    </div>
    <div className="product-purchase__price"><del>{money(offer.oldPrice)}</del><strong>{money(offer.price)}</strong><span>Выгода {money(saving)}</span></div>
    <p className={`product-status product-status--${current.tone}`}><i aria-hidden="true" /><strong>{current.label}</strong></p>
    <div className="product-stock" aria-label="Наличие по городам">{current.stocks.map(([city, note]) => <div key={city}><strong className="product-stock__city">{city}</strong><span>{note}</span></div>)}</div>
    {state === 'available' && <div className="product-purchase__buy-row"><div className="product-quantity" aria-label="Количество товара"><button type="button" aria-label="Уменьшить количество" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><output>{quantity}</output><button type="button" aria-label="Увеличить количество" onClick={() => setQuantity((value) => value + 1)}>+</button></div><button className="button button--dark" type="button" onClick={primaryAction}>{inCart ? 'В корзине' : current.action}</button></div>}
    {state !== 'available' && <button className="button button--dark" type="button" onClick={primaryAction}>{current.action}</button>}
    {(state === 'available' || state === 'order') && <button className="button" type="button" onClick={() => setFeedback('Быстрый заказ подготовлен. Менеджер свяжется для подтверждения.')}>Купить в один клик</button>}
    <button className="product-purchase__proposal" type="button" onClick={() => setProposalOpen(true)}>Коммерческое предложение</button>
    <div className="product-finance" aria-label="Способы финансирования">{['Купить в кредит', 'В рассрочку', 'В лизинг'].map((label) => <button type="button" key={label} aria-label={label} onClick={() => setFeedback(`${label}: условия будут рассчитаны после подтверждения данных.`)}><span aria-hidden="true">○</span>{label}<small>Условия уточняются</small></button>)}</div>
    <div className="product-help"><strong>Нужна помощь?</strong><p>Специалист поможет подобрать комплектацию.</p><div><button type="button" aria-label="Написать в Telegram" onClick={() => setFeedback('Telegram показан в демонстрационном режиме.')}>TG</button><button type="button" aria-label="Написать в WhatsApp" onClick={() => setFeedback('WhatsApp показан в демонстрационном режиме.')}>WA</button><button type="button" aria-label="Заказать звонок" onClick={() => setFeedback('Обратный звонок подготовлен.')}>☎</button></div></div>
    {feedback && <p className="product-feedback" role="status">{feedback}</p>}
    {proposalOpen && <CommercialProposal offer={offer} quantity={quantity} onClose={() => setProposalOpen(false)} />}
  </aside>
}

export function ProductMobilePurchase({ offer, state }: { offer: ProductOffer; state: CommercialState }) {
  const commerce = useCommerce()
  const current = stateMap[state]
  return <div className="product-mobile-purchase"><div><small>{current.label}</small><strong>{money(offer.price)}</strong></div><button className="button button--dark" type="button" onClick={() => state === 'available' ? commerce.addToCart(offer.id) : document.querySelector('.product-purchase')?.scrollIntoView()}>{state === 'available' && commerce.cartIds.has(offer.id) ? 'В корзине' : current.action}</button></div>
}
