import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogProduct } from '../../data/catalogTypes'
import { productDetail } from '../../data/productDetailData'
import { styleCheckProductPhotos } from '../../data/styleCheckAssets'
import { promotionPrice } from '../../data/promotionPricing'
import { useCommerce } from '../../state/CommerceState'
import { RoundedIcon } from '../header/RoundedIcon'
import { formatAvailability } from '../../utils/availability'
import { compressorCategoryImages } from './compressorCategoryImages'
import './CatalogRichCard.css'

const money = (value: number) => value.toLocaleString('ru-RU') + ' ₽'
export function CatalogProductCard({ product }: { product: CatalogProduct; index: number }) {
  const commerce = useCommerce()
  const [frame, setFrame] = useState(0)
  const touchStart = useRef(0)
  const primary = styleCheckProductPhotos[product.name] || compressorCategoryImages[product.subcategoryId]
  const images = product.subcategoryId === 'screw-compressors' ? [1,2,3].map(index => '/garage/style-check/review-assets/catalog-gallery/screw-' + index + '.webp') : primary ? [primary] : []
  const activeFrame = Math.min(frame, Math.max(0, images.length - 1))
  const knownProduct = product.id === productDetail.id
  const name = knownProduct ? productDetail.name : product.name
  const quantity = commerce.cartItems.find(item => item.id === product.id)?.quantity ?? 0
  const promo = promotionPrice(product.id, product.price, product.purchaseMode === 'quote')
  const availability = formatAvailability(product.availabilityLabel, Math.min(3, Math.max(0, product.storeCount)))
  return <article className="catalog-product-card catalog-rich-card">
    <Link className="catalog-rich-card__media" to={'/product/' + product.slug} aria-label={'Открыть товар: ' + name}
      onMouseMove={event => { if (images.length < 2) return; const bounds = event.currentTarget.getBoundingClientRect(); setFrame(Math.min(images.length - 1, Math.max(0, Math.floor((event.clientX - bounds.left) / bounds.width * images.length)))) }}
      onMouseLeave={() => setFrame(0)} onTouchStart={event => { touchStart.current = event.touches[0].clientX }}
      onTouchEnd={event => { const distance = touchStart.current - event.changedTouches[0].clientX; if (images.length > 1 && Math.abs(distance) > 30) { event.preventDefault(); setFrame((activeFrame + (distance > 0 ? 1 : images.length - 1)) % images.length) } }}
      onKeyDown={event => { if (images.length > 1 && ['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); setFrame((activeFrame + (event.key === 'ArrowRight' ? 1 : images.length - 1)) % images.length) } }}>
      {images.length ? <img src={images[activeFrame]} alt={name + ', фото ' + (activeFrame + 1)} loading="lazy" /> : <span>Фото товара</span>}
    </Link>
    {promo.promotionHref && <Link className="catalog-rich-card__badge" to={promo.promotionHref}>Акция</Link>}
    <div className="catalog-rich-card__actions">
      <button type="button" aria-label={(commerce.favoriteIds.has(product.id) ? 'Убрать из избранного: ' : 'Добавить в избранное: ') + name} aria-pressed={commerce.favoriteIds.has(product.id)} onClick={() => commerce.toggleFavorite(product.id)}><RoundedIcon name="favorite" /></button>
      <button type="button" aria-label={(commerce.compareIds.has(product.id) ? 'Убрать из сравнения: ' : 'Добавить в сравнение: ') + name} aria-pressed={commerce.compareIds.has(product.id)} onClick={() => commerce.toggleCompare(product.id)}><RoundedIcon name="compare" /></button>
    </div>
    <div className="catalog-rich-card__gallery" aria-label={'Фотографии: ' + name}>{images.length > 1 && images.map((_, index) => <button type="button" key={index} aria-label={'Фото ' + (index + 1) + ': ' + name} aria-pressed={activeFrame === index} onClick={() => setFrame(index)} />)}</div>
    <div className="catalog-rich-card__price"><strong>{product.purchaseMode === 'quote' ? 'Цена по запросу' : money(product.price)}</strong>{promo.oldPrice && <del>{money(promo.oldPrice)}</del>}</div>
    <Link className="catalog-rich-card__name" to={'/product/' + product.slug}>{name}</Link>
    <div className="catalog-rich-card__meta">{knownProduct && <span className="catalog-rich-card__rating" aria-label={'Рейтинг ' + productDetail.rating + ', ' + productDetail.reviewCount}><span aria-hidden="true">★</span> {productDetail.rating} <small>({productDetail.reviewCount})</small></span>}<span className="catalog-rich-card__sku">Артикул: {product.sku}</span></div>
    <p className="catalog-rich-card__availability" data-in-stock={product.availabilityLabel === 'available' && product.storeCount > 0}>{availability}</p>
    {product.purchaseMode === 'quote' ? <button className="catalog-rich-card__cart" type="button">Запросить цену</button> : <button className="catalog-rich-card__cart" type="button" aria-label={(quantity ? 'Товар в корзине: ' : 'Добавить в корзину: ') + product.name} aria-pressed={quantity > 0} onClick={() => commerce.addToCart(product.id)}>{quantity ? 'В корзине · ' + quantity : 'В корзину'}</button>}
  </article>
}
