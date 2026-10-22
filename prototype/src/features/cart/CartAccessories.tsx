import { useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { relatedForCart } from '../../data/productRelations'
import { money } from '../../data/checkoutData'
import { useCommerce } from '../../state/CommerceState'

export function CartAccessories({ id, expanded }: { id: string; expanded: boolean }) {
  const { addToCart } = useCommerce()
  const rail = useRef<HTMLDivElement>(null)
  const railId = useId()
  const products = relatedForCart(id)
  return <details className="line-accessories" open={expanded}><summary>Может пригодиться</summary>
    {products.length > 1 && <div className="cart-rail-controls"><button type="button" aria-controls={railId} aria-label="Предыдущие сопутствующие товары" onClick={() => rail.current?.scrollBy({ left: -(rail.current?.clientWidth ?? 300), behavior: 'smooth' })}>←</button><button type="button" aria-controls={railId} aria-label="Следующие сопутствующие товары" onClick={() => rail.current?.scrollBy({ left: rail.current?.clientWidth ?? 300, behavior: 'smooth' })}>→</button></div>}
    <div ref={rail} id={railId} className="line-accessories__rail" tabIndex={0} role="region" aria-label="Сопутствующие товары" onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); rail.current?.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * 280, behavior: 'smooth' }) } }}>
      {products.map(product => <article key={product.id} data-related-id={product.id}><Link className="accessory-mini" to={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}/><div><Link to={`/product/${product.id}`}><strong title={product.name}>{product.name}</strong></Link><small>{money(product.price)}</small></div><button type="button" aria-label={`Добавить ${product.name} в корзину`} onClick={() => addToCart(product.id)}><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 3h2l2.4 12h11l2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg></button></article>)}
    </div>
  </details>
}
