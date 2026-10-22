import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { checkoutProducts, money, optionParentLabel } from '../data/checkoutData'
import { useCommerce } from '../state/CommerceState'
import { formatAvailability } from '../utils/availability'
import './CartCheckout.css'
import './CartLayout.css'
import { CartTools, SharedCart } from '../features/cart/CartTools'
import { CartAccessories } from '../features/cart/CartAccessories'
import { CartStock } from '../features/cart/CartStock'
import { CartViewed } from '../features/cart/CartViewed'
import { getCartPricing, selectedCartLines } from '../features/cart/cartPricing'
import { CartPricingView, CartPromoForm } from '../features/cart/CartPricingView'
import { CartRecipient } from '../features/cart/CartRecipient'

type SummaryProps = { action?: React.ReactNode; selectedIds?: Set<string>; promo?: React.ReactNode }

export function OrderSummary({ action, selectedIds, promo }: SummaryProps) {
  const { cartItems, checkout } = useCommerce()
  const included = selectedIds ? cartItems.filter((line) => selectedIds.has(line.id)) : selectedCartLines(cartItems, checkout.selectedCartIds)
  const count = included.reduce((sum, item) => sum + item.quantity, 0)
  const pricing = getCartPricing(included, checkout.promoCode)
  return <aside className="order-summary" aria-label="Итоги заказа">
    <h2>Итого к оформлению</h2>
    <CartPricingView pricing={pricing} count={count}/>
    {promo}{action}
    <small>Наличие и срок получения уточняются для выбранного города.</small>
  </aside>
}


export function CartPage() {
  const { cartItems, checkout, updateCheckout, updateQuantity, removeFromCart, moveToFavorites, ensureDemoCart } = useCommerce()
  const [params] = useSearchParams()
  const shared = params.get('shared')
  const selected = useMemo(() => new Set(selectedCartLines(cartItems, checkout.selectedCartIds).map(line => line.id)), [cartItems, checkout.selectedCartIds])
  const pricing = getCartPricing(cartItems.filter(line => selected.has(line.id)), checkout.promoCode)
  const basePricing = getCartPricing(cartItems)
  useEffect(() => { if (!shared) ensureDemoCart() }, [shared])
  const allSelected = cartItems.length > 0 && selected.size === cartItems.length
  const selectedCount = useMemo(() => cartItems.filter((line) => selected.has(line.id)).reduce((sum, line) => sum + line.quantity, 0), [cartItems, selected])
  const toggleAll = () => updateCheckout({ selectedCartIds: allSelected ? [] : cartItems.map(line => line.id) })
  const toggleLine = (id: string) => { const next = new Set(selected); next.has(id) ? next.delete(id) : next.add(id); updateCheckout({ selectedCartIds: [...next] }) }
  if (shared) return <main className="cart-page container"><SharedCart encoded={shared}/></main>
  if (!cartItems.length) return <main className="cart-page container"><h1>Корзина пуста</h1><p>Добавьте товары из каталога, чтобы оформить заказ.</p><Link className="button" to="/catalog">Перейти в каталог</Link></main>
  const promo = <CartPromoForm eligible={pricing.currentCents > 0}/>
  return <main className="cart-page container">
    <header className="cart-heading"><div><p><Link to="/">Главная</Link> / Корзина</p><h1>Корзина</h1></div><span>{cartItems.length} {cartItems.length % 10 === 1 && cartItems.length % 100 !== 11 ? 'позиция' : [2,3,4].includes(cartItems.length % 10) && ![12,13,14].includes(cartItems.length % 100) ? 'позиции' : 'позиций'}</span></header>
    <CartRecipient />
    <div className="cart-layout">
      <section className="cart-order" aria-label="Состав заказа">
        <div className="cart-toolbar"><label><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Выбрать все товары" /> Выбрать всё</label><span>Выбрано: {selectedCount}</span></div>
        <div className="cart-lines">{cartItems.map((line, lineIndex) => {
          const product = checkoutProducts.find((item) => item.id === line.id) ?? { id: line.id, name: line.id, sku: 'Уточняется', modification: 'Данные товара уточняются', price: 0, availabilityStatus: 'Под заказ' as const, storeCount: 0, href: '/catalog' }
          const linePricing = pricing.rows.find(row => row.id === line.id) ?? basePricing.rows.find(row => row.id === line.id)!
          const discountPercent = !linePricing.quote && linePricing.referenceCents > linePricing.totalCents
            ? ((linePricing.referenceCents - linePricing.totalCents) / linePricing.referenceCents * 100).toLocaleString('ru-RU', { maximumFractionDigits: 1 })
            : null
          return <article className="cart-line" data-testid="cart-line" key={line.id}>
            <label className="cart-line__select"><input type="checkbox" checked={selected.has(line.id)} onChange={() => toggleLine(line.id)} aria-label={`Выбрать ${product.name}`} /></label>
            <Link className="cart-line__image" to={product.href} aria-label={`Открыть ${product.name}`}><i /><b />{linePricing.referenceCents > linePricing.currentCents && <span className="cart-promotion">Акция</span>}</Link>
            <div className="cart-line__details"><Link to={product.href}><h2>{product.name}</h2></Link><p>Артикул: {product.sku}</p>{line.optionFor && <div className="cart-option-link">{Object.entries(line.optionParents ?? { [line.optionFor]: line.quantity }).map(([parent, count]) => <p key={parent}>Опция для варианта: {optionParentLabel(parent)} · {count} шт.</p>)}</div>}<p>{product.modification}</p><p className="cart-line__availability">{formatAvailability(product.availabilityStatus, product.storeCount)}</p><CartStock product={product}/><div className="cart-line__secondary"><button onClick={() => moveToFavorites(line.id)} aria-label="Перенести в избранное">♡ В избранное</button><button onClick={() => removeFromCart(line.id)} aria-label="Удалить товар">Удалить</button></div></div>
            <div className="cart-line__controls"><div className="cart-line__price">{linePricing.quote ? <strong>Цена по запросу</strong> : <>{linePricing.referenceCents > linePricing.totalCents && <del data-testid="line-old-price">{money(linePricing.referenceCents / 100)}</del>}<strong data-testid="line-new-price">{money(linePricing.totalCents / 100)}</strong>{discountPercent && <span className="cart-line__discount-percent" data-testid="line-discount-percent" aria-label={`Общая скидка ${discountPercent}%`} title="Общая скидка от исходной цены">−{discountPercent}%</span>}</>}</div><div className="quantity"><button aria-label="Уменьшить количество" onClick={() => updateQuantity(line.id, line.quantity - 1)}>−</button><span aria-label="Количество">{line.quantity}</span><button aria-label="Увеличить количество" onClick={() => updateQuantity(line.id, line.quantity + 1)}>+</button></div></div>
            <CartAccessories id={line.id} featured={lineIndex === 0} expanded={cartItems.length <= 2 || lineIndex === 0}/>
          </article>
        })}</div>
      </section>
      <OrderSummary selectedIds={selected} promo={promo} action={<><Link className={`button checkout-sticky${selected.size ? '' : ' button--disabled'}`} aria-disabled={!selected.size} to={selected.size ? '/checkout/review' : '#'}>Перейти к оформлению</Link><CartTools lines={cartItems.filter(line => selected.has(line.id))}/></>} />
    </div>
    <CartViewed/>
  </main>
}
