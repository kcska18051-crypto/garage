import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkoutProducts, money } from '../data/checkoutData'
import { useCommerce } from '../state/CommerceState'
import { formatAvailability } from '../utils/availability'
import './CartCheckout.css'
import './CartLayout.css'

type SummaryProps = { action?: React.ReactNode; selectedIds?: Set<string>; promo?: React.ReactNode }

export function OrderSummary({ action, selectedIds, promo }: SummaryProps) {
  const { cartItems } = useCommerce()
  const included = selectedIds ? cartItems.filter((line) => selectedIds.has(line.id)) : cartItems
  const count = included.reduce((sum, item) => sum + item.quantity, 0)
  const total = included.reduce((sum, line) => sum + (checkoutProducts.find((item) => item.id === line.id)?.price ?? 0) * line.quantity, 0)
  return <aside className="order-summary" aria-label="Итоги заказа">
    <h2>Итого к оформлению</h2>
    <div className="order-summary__row"><span>{count} товара на сумму</span><b>{money(total)}</b></div>
    <div className="order-summary__row"><span>Скидка</span><b>0 ₽</b></div>
    <div className="order-summary__row"><span>Доставка</span><b>Рассчитаем при оформлении</b></div>
    <div className="order-summary__total"><span>Итого</span><strong>{money(total)}</strong></div>
    {promo}{action}
    <small>Наличие и срок получения уточняются для выбранного города.</small>
  </aside>
}

const recommendations = [
  { id: 'product-1', title: 'Расходные материалы для компрессора', price: '3 900 ₽', href: '/catalog/compressor-equipment' },
  { id: 'product-2', title: 'Органайзер для инструмента', price: '4 600 ₽', href: '/catalog/tools' },
  { id: 'product-1', title: 'Комплект для обслуживания', price: '7 200 ₽', href: '/services' },
]

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, moveToFavorites, ensureDemoCart, addToCart } = useCommerce()
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  useEffect(() => ensureDemoCart(), [])
  useEffect(() => {
    const ids = new Set(cartItems.map((item) => item.id))
    setSelected((current) => current.size ? new Set([...current].filter((id) => ids.has(id))) : ids)
  }, [cartItems])
  const allSelected = cartItems.length > 0 && selected.size === cartItems.length
  const selectedCount = useMemo(() => cartItems.filter((line) => selected.has(line.id)).reduce((sum, line) => sum + line.quantity, 0), [cartItems, selected])
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(cartItems.map((item) => item.id)))
  const toggleLine = (id: string) => setSelected((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next })
  if (!cartItems.length) return <main className="cart-page container"><h1>Корзина пуста</h1><p>Добавьте товары из каталога, чтобы оформить заказ.</p><Link className="button" to="/catalog">Перейти в каталог</Link></main>
  const promo = <form className="cart-promo" onSubmit={(event) => { event.preventDefault(); if (promoCode.trim()) setPromoApplied(true) }}><label htmlFor="cart-promo">Промокод</label><div><input id="cart-promo" value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setPromoApplied(false) }} placeholder="Введите промокод" /><button type="submit" aria-label="Применить промокод">Применить</button></div>{promoApplied && <p role="status">Промокод применён для демонстрации</p>}</form>
  return <main className="cart-page container">
    <header className="cart-heading"><div><p><Link to="/">Главная</Link> / Корзина</p><h1>Корзина</h1></div><span>{cartItems.length} позиции</span></header>
    <div className="cart-layout">
      <section className="cart-order" aria-label="Состав заказа">
        <div className="cart-toolbar"><label><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Выбрать все товары" /> Выбрать всё</label><span>Выбрано: {selectedCount}</span></div>
        <div className="cart-lines">{cartItems.map((line) => {
          const product = checkoutProducts.find((item) => item.id === line.id) ?? checkoutProducts[0]
          return <article className="cart-line" data-testid="cart-line" key={line.id}>
            <label className="cart-line__select"><input type="checkbox" checked={selected.has(line.id)} onChange={() => toggleLine(line.id)} aria-label={`Выбрать ${product.name}`} /></label>
            <Link className="cart-line__image" to={product.href} aria-label={`Открыть ${product.name}`}><i /><b /></Link>
            <div className="cart-line__details"><Link to={product.href}><h2>{product.name}</h2></Link><p>Артикул: {product.sku}</p><p>{product.modification}</p><p className="cart-line__availability">{formatAvailability(product.availabilityStatus, product.storeCount)}</p><div className="cart-line__secondary"><button onClick={() => moveToFavorites(line.id)} aria-label="Перенести в избранное">♡ В избранное</button><button onClick={() => removeFromCart(line.id)} aria-label="Удалить товар">Удалить</button></div></div>
            <div className="cart-line__controls"><strong>{money(product.price * line.quantity)}</strong><div className="quantity"><button aria-label="Уменьшить количество" onClick={() => updateQuantity(line.id, line.quantity - 1)}>−</button><span aria-label="Количество">{line.quantity}</span><button aria-label="Увеличить количество" onClick={() => updateQuantity(line.id, line.quantity + 1)}>+</button></div></div>
          </article>
        })}</div>
      </section>
      <OrderSummary selectedIds={selected} promo={promo} action={<Link className={`button checkout-sticky${selected.size ? '' : ' button--disabled'}`} aria-disabled={!selected.size} to={selected.size ? '/checkout/review' : '#'}>Перейти к оформлению</Link>} />
    </div>
    <section className="cart-recommendations" aria-label="Рекомендуем к заказу"><div className="cart-recommendations__heading"><h2>С этим покупают</h2><Link to="/catalog">Смотреть всё →</Link></div><div className="cart-recommendations__rail">{recommendations.map((item, index) => <article data-testid="cart-recommendation" key={`${item.title}-${index}`}><Link className="cart-recommendation__art" to={item.href} aria-label={`Открыть ${item.title}`}><i /></Link><Link to={item.href}><h3>{item.title}</h3></Link><strong>{item.price}</strong><button type="button" onClick={() => addToCart(item.id)} aria-label={`Добавить ${item.title} в корзину`}>＋</button></article>)}</div></section>
  </main>
}
