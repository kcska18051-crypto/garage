import { useRef, useState } from 'react'
import { money } from '../../data/checkoutData'
import { useCommerce } from '../../state/CommerceState'
import type { priceCart } from './cartPricing'

export function CartPricingView({ pricing, count }: { pricing: ReturnType<typeof priceCart>; count: number }) {
  const quoteOnly = pricing.rows.length > 0 && pricing.rows.every(row => row.quote)
  return <>
    <div className="order-summary__row"><span>{count} товара{pricing.referenceCents > pricing.totalCents ? ' до скидок' : ''}</span><b>{quoteOnly ? 'Уточняется' : money(pricing.referenceCents / 100)}</b></div>
    {(pricing.productDiscountCents > 0 || pricing.promoDiscountCents > 0) && <div className="cart-pricing-discounts" role="group" aria-label="Расшифровка скидок">
      {pricing.productDiscountCents > 0 && <div className="order-summary__row" data-testid="product-discount"><span>Акции на товары</span><b>−{money(pricing.productDiscountCents / 100)}</b></div>}
      {pricing.promoDiscountCents > 0 && <div className="order-summary__row" data-testid="promo-discount"><span>Промокод 123 · 10%</span><b>−{money(pricing.promoDiscountCents / 100)}</b></div>}
    </div>}
    <div className="order-summary__total"><span>Итого</span><strong data-testid="order-total">{quoteOnly ? 'Уточняется' : money(pricing.totalCents / 100)}</strong></div>
    {pricing.rows.some(row => row.quote) && <p className="cart-pricing-notice">Позиции с запросом цены не включены в сумму. Их стоимость уточняется.</p>}
  </>
}

export function CartPromoForm({ eligible }: { eligible: boolean }) {
  const { checkout, updateCheckout } = useCommerce()
  const [draft, setDraft] = useState(checkout.promoCode === '123' ? '123' : '')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const active = checkout.promoCode === '123'
  return <form className="cart-promo" onSubmit={event => {
    event.preventDefault()
    const code = draft.trim()
    if (!code) { setError('Введите промокод'); return }
    if (code !== '123') { setError('Промокод не найден. Для демонстрации используйте 123.'); return }
    updateCheckout({ promoCode: '123' }); setDraft('123'); setError(''); setNotice('')
  }}>
    <label htmlFor="cart-promo">Промокод</label><div><input ref={input} id="cart-promo" value={draft} aria-invalid={Boolean(error)} aria-describedby={error ? 'cart-promo-error' : undefined} onChange={event => { setDraft(event.target.value); setError('') }} placeholder="Демонстрационный код 123"/><button type="submit" aria-label="Применить промокод">Применить</button></div>
    {error && <p id="cart-promo-error" role="alert">{error}</p>}
    {(active || notice) && <p role="status">{active ? eligible ? 'Промокод 123 применён' : 'Промокод 123 сохранён. Выберите товары с указанной ценой для скидки.' : notice}</p>}
    {active && <div className="cart-promo__actions"><button type="button" onClick={() => { input.current?.focus(); input.current?.select() }}>Изменить промокод</button><button type="button" onClick={() => { updateCheckout({ promoCode: undefined }); setDraft(''); setError(''); setNotice('Промокод удалён. Итог пересчитан, акции на товары сохранены.') }}>Удалить промокод</button></div>}
    <small>Демонстрационный код: применяется к выбранным товарам после акций, без доставки. Не является предложением реальной скидки.</small>
  </form>
}
