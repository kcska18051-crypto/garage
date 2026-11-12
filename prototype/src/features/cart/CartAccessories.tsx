import {CartProductImage} from './CartProductImage'
import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { companionProducts, relatedForCart } from '../../data/productRelations'
import { money } from '../../data/checkoutData'
import { useCommerce } from '../../state/CommerceState'

export function CartAccessories({ id, expanded, featured = false }: { id: string; expanded: boolean; featured?: boolean }) {
  const { addToCart } = useCommerce()
  const rail = useRef<HTMLDivElement>(null)
  const railId = useId()
  const products = useMemo(() => featured
    ? [...new Map([...relatedForCart(id), ...companionProducts].filter(product => product.id !== id).map(product => [product.id, product])).values()].slice(0, 7)
    : relatedForCart(id), [id, featured])
  const [overflow, setOverflow] = useState(false)
  useLayoutEffect(() => {
    const element = rail.current
    if (!element) return
    const update = () => setOverflow(element.scrollWidth > element.clientWidth + 1)
    update()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(element)
    window.addEventListener('resize', update)
    return () => { observer?.disconnect(); window.removeEventListener('resize', update) }
  }, [products, expanded])
  const moveOne = (direction: number) => {
    const element = rail.current
    const first = element?.querySelector<HTMLElement>('article')
    if (!element || !first) return
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0
    element.scrollBy({ left: direction * (first.getBoundingClientRect().width + gap), behavior: 'smooth' })
  }
  return <details className="line-accessories" open={expanded}><summary>Может пригодиться{featured && <small className="cart-rail-count"> · {products.length} товаров</small>}</summary>
    <div className="line-accessories__carousel">
    {overflow && <div className="cart-rail-controls"><button type="button" aria-controls={railId} aria-label="Предыдущие сопутствующие товары" onClick={() => moveOne(-1)}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6"/></svg></button><button type="button" aria-controls={railId} aria-label="Следующие сопутствующие товары" onClick={() => moveOne(1)}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m10 6 6 6-6 6"/></svg></button></div>}
    <div ref={rail} id={railId} className="line-accessories__rail" tabIndex={0} role="region" aria-label="Сопутствующие товары" onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); moveOne(event.key === 'ArrowRight' ? 1 : -1) } }}>
      {products.map(product => <article key={product.id} data-related-id={product.id}><Link className="accessory-mini" to={`/product/${product.id}`} aria-label={`Открыть ${product.name}`}><CartProductImage product={product}/></Link><div><Link to={`/product/${product.id}`}><strong title={product.name}>{product.name}</strong></Link><small>{money(product.price)}</small></div><button type="button" aria-label={`Добавить ${product.name} в корзину`} onClick={() => addToCart(product.id)}><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 3h2l2.4 12h11l2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg></button></article>)}
    </div>
    </div>
  </details>
}
