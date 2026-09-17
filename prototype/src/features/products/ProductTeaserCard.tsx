import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCommerce } from '../../state/CommerceState'
import './ProductTeaserCard.css'

export type ProductTeaser = {
  id: string
  name: string
  href: string
  sku: string
  price: string
  oldPrice?: string
  purchaseMode?: 'cart' | 'quote'
}

export function ProductTeaserCard({ product, index, className = '' }: { product: ProductTeaser; index: number; className?: string }) {
  const commerce = useCommerce()
  const [frame, setFrame] = useState(0)
  const frames = [0, 1, 2]
  const mediaClass = `product-teaser__visual product-teaser__visual--${(index + frame) % 4}`
  const selectFrameFromPointer = (event: MouseEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width) return
    setFrame(Math.min(frames.length - 1, Math.floor(((event.clientX - bounds.left) / bounds.width) * frames.length)))
  }

  return <article className={`product-teaser ${className}`.trim()}>
    <Link className="product-teaser__media product-card__media" to={product.href} aria-label={`Открыть товар: ${product.name}`} onMouseMove={selectFrameFromPointer} onMouseLeave={() => setFrame(0)}>
      <span className={mediaClass} role="img" aria-label={`Изображение товара: ${product.name}`} data-testid="product-gallery" data-frame={frame}><i /><b /></span>
    </Link>
    <div className="product-teaser__actions">
      <button type="button" aria-label={`${commerce.favoriteIds.has(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}: ${product.name}`} aria-pressed={commerce.favoriteIds.has(product.id)} onClick={() => commerce.toggleFavorite(product.id)}>♡</button>
      <button type="button" aria-label={`${commerce.compareIds.has(product.id) ? 'Убрать из сравнения' : 'Добавить в сравнение'}: ${product.name}`} aria-pressed={commerce.compareIds.has(product.id)} onClick={() => commerce.toggleCompare(product.id)}>≡</button>
    </div>
    <div className="product-teaser__dots" aria-label="Кадры товара">{frames.map((item) => <button key={item} type="button" data-testid="product-gallery-dot" aria-label={`Показать кадр ${item + 1}: ${product.name}`} aria-pressed={frame === item} onClick={() => setFrame(item)} />)}</div>
    <Link className="product-teaser__name" to={product.href}>{product.name}</Link>
    <p className="product-teaser__sku">Артикул: {product.sku}</p>
    <div className="product-teaser__bottom catalog-product-card__bottom"><div>{product.oldPrice ? <del>{product.oldPrice}</del> : null}<strong>{product.price}</strong></div>{product.purchaseMode === 'quote' ? <button className="product-teaser__quote" type="button">Запросить цену</button> : <button className="product-teaser__cart" type="button" aria-label={`${commerce.cartIds.has(product.id) ? 'Товар в корзине' : 'Добавить в корзину'}: ${product.name}`} onClick={() => commerce.addToCart(product.id)}>{commerce.cartIds.has(product.id) ? '✓' : '＋'}</button>}</div>
  </article>
}
