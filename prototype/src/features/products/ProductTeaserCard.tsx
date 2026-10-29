import { RoundedIcon } from '../header/RoundedIcon'
import { useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCommerce } from '../../state/CommerceState'
import './ProductTeaserCard.css'
import { promotionPrice } from '../../data/promotionPricing'
import { styleCheckProductPhotos } from '../../data/styleCheckAssets'

export type ProductTeaser = {
  id: string
  name: string
  href: string
  sku: string
  price: string
  oldPrice?: string
  purchaseMode?: 'cart' | 'quote'
  availability?: string
}

export function ProductTeaserCard({ product, index, className = '' }: { product: ProductTeaser; index: number; className?: string }) {
  const commerce = useCommerce()
  const isStyleCheck = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  const styleCheckPhoto = isStyleCheck ? styleCheckProductPhotos[product.name] : undefined
  const cartQuantity = commerce.cartItems.find(item => item.id === product.id)?.quantity ?? 0
  const promo = promotionPrice(product.id, Number(product.price.replace(/\D/g, '')), product.purchaseMode === 'quote')
  const [frame, setFrame] = useState(0)
  const frames = [0, 1, 2]
  const mediaClass = `product-teaser__visual product-teaser__visual--${(index + frame) % 4}`
  const selectFrameFromPointer = (event: MouseEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width) return
    setFrame(Math.min(frames.length - 1, Math.floor(((event.clientX - bounds.left) / bounds.width) * frames.length)))
  }

  return <article className={`product-teaser ${className}`.trim()}>
    <Link className="product-teaser__media product-card__media" to={product.href} aria-label={`Открыть товар: ${product.name}`} onMouseMove={isStyleCheck ? undefined : selectFrameFromPointer} onMouseLeave={() => setFrame(0)}>
      <span className={mediaClass} role="img" aria-label={`Изображение товара: ${product.name}`} data-testid="product-gallery" data-frame={frame}>{styleCheckPhoto ? <img className="style-check-product-photo" src={styleCheckPhoto} alt="" aria-hidden="true" loading="lazy" decoding="async" /> : <><i /><b /></>}</span>
    </Link>
    {promo.promotionHref && <Link className="promotion-badge" to={promo.promotionHref}>Акция</Link>}
    <div className="product-teaser__actions">
      <button type="button" aria-label={`${commerce.favoriteIds.has(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}: ${product.name}`} aria-pressed={commerce.favoriteIds.has(product.id)} onClick={() => commerce.toggleFavorite(product.id)}>{isStyleCheck ? <RoundedIcon name="favorite" /> : '♡'}</button>
      <button type="button" aria-label={`${commerce.compareIds.has(product.id) ? 'Убрать из сравнения' : 'Добавить в сравнение'}: ${product.name}`} aria-pressed={commerce.compareIds.has(product.id)} onClick={() => commerce.toggleCompare(product.id)}>{isStyleCheck ? <RoundedIcon name="compare" /> : '≡'}</button>
    </div>
    {!isStyleCheck && <div className="product-teaser__dots" aria-label="Кадры товара">{frames.map((item) => <button key={item} type="button" data-testid="product-gallery-dot" aria-label={`Показать кадр ${item + 1}: ${product.name}`} aria-pressed={frame === item} onClick={() => setFrame(item)} />)}</div>}
    <Link className="product-teaser__name" to={product.href}>{product.name}</Link>
    {isStyleCheck && index < 3 && <div className="product-teaser__rating" title="Демонстрационные оценки и количество отзывов" aria-label={`Демонстрационный рейтинг ${['4,9', '4,8', '5'][index]}, отзывов: ${[30, 18, 12][index]}`}><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg><span className="product-teaser__rating-score">{['4,9', '4,8', '5'][index]}</span><span>({[30, 18, 12][index]})</span></div>}
    <p className="product-teaser__sku">Артикул: {product.sku}</p>
    {product.availability ? <p className="product-teaser__availability" data-in-stock={product.availability.startsWith("В наличии в ")}><i aria-hidden="true" />{product.availability}</p> : null}
    <div className="product-teaser__bottom catalog-product-card__bottom"><div>{promo.oldPrice ? <del>{promo.oldPrice.toLocaleString('ru-RU')} ₽</del> : null}<strong>{product.purchaseMode === 'quote' ? 'Цена по запросу' : product.price}</strong></div>{product.purchaseMode === 'quote' ? <button className="product-teaser__quote" type="button">Запросить цену</button> : <button className="product-teaser__cart" type="button" aria-pressed={commerce.cartIds.has(product.id)} aria-label={`${commerce.cartIds.has(product.id) ? 'Товар в корзине' : 'Добавить в корзину'}: ${product.name}`} onClick={() => commerce.addToCart(product.id)}>{isStyleCheck ? <><RoundedIcon name="cart" /><span className="review-cart-label">{cartQuantity ? 'В корзине' : 'В корзину'}</span>{cartQuantity > 0 && <b className="review-cart-quantity">{cartQuantity}</b>}</> : commerce.cartIds.has(product.id) ? '✓' : '＋'}</button>}</div>
  </article>
}
