import { Link } from 'react-router-dom'
import { checkoutProducts, money } from '../data/checkoutData'
import { useCommerce } from '../state/CommerceState'
import { formatAvailability } from '../utils/availability'
import { useEffect } from 'react'
import './CartCheckout.css'

export function OrderSummary({ action }: { action?: React.ReactNode }) {
  const { cartItems } = useCommerce()
  const total = cartItems.reduce((sum, line) => sum + (checkoutProducts.find((item) => item.id === line.id)?.price ?? 0) * line.quantity, 0)
  return <aside className="order-summary" aria-label="Итоги заказа"><h2>Итого к оформлению</h2><p>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} товара</p><strong>{money(total)}</strong>{action}</aside>
}

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, moveToFavorites, ensureDemoCart } = useCommerce()
  useEffect(() => ensureDemoCart(), [])
  if (!cartItems.length) return <main className="cart-page container"><h1>Корзина пуста</h1><p>Добавьте товары из каталога, чтобы оформить заказ.</p><Link className="button" to="/catalog">Перейти в каталог</Link></main>
  return <main className="cart-page container"><h1>Корзина</h1><div className="cart-layout"><div className="cart-lines">{cartItems.map((line) => {
    const product = checkoutProducts.find((item) => item.id === line.id) ?? checkoutProducts[0]
    return <article className="cart-line" data-testid="cart-line" key={line.id}><div className="cart-line__image" aria-hidden="true" /><div><Link to={product.href}><h2>{product.name}</h2></Link><p>Артикул: {product.sku}</p><p>{product.modification}</p><p>{formatAvailability('available', product.storeCount)}</p></div><div className="cart-line__controls"><strong>{money(product.price * line.quantity)}</strong><div className="quantity"><button aria-label="Уменьшить количество" onClick={() => updateQuantity(line.id, line.quantity - 1)}>−</button><span>{line.quantity}</span><button aria-label="Увеличить количество" onClick={() => updateQuantity(line.id, line.quantity + 1)}>+</button></div><button onClick={() => moveToFavorites(line.id)} aria-label="Перенести в избранное">В избранное</button><button onClick={() => removeFromCart(line.id)} aria-label="Удалить товар">Удалить</button></div></article>
  })}</div><OrderSummary action={<Link className="button checkout-sticky" to="/checkout/review">Перейти к оформлению</Link>} /></div></main>
}
