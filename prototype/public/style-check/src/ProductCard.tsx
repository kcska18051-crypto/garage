import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../../src/data/types'
import { promotionPrice } from '../../../src/data/promotionPricing'
import { formatAvailability } from '../../../src/utils/availability'
import { useCommerce } from '../../../src/state/CommerceState'
import { Icon } from './Icon'
import { images } from './images'
import { getDemoProduct } from '../../../src/data/productRegistry'

const productImages: Record<string, string> = {
  'product-1': 'product-jack', 'product-2': 'product-toolset', 'product-3': 'product-spray',
  'product-4': 'product-compressor', 'product-5': 'product-diagnostic', 'product-6': 'product-sander',
  'product-7': 'product-trolley', 'product-8': 'product-welder', 'product-9': 'product-dryer',
  'remeza-vk-10-gr-0001': 'product-remeza-10', 'compressor-7': 'product-remeza-piston',
  'compressor-13': 'product-remeza-20', 'compressor-19': 'product-remeza-25', 'compressor-25': 'product-remeza-60',
}
export function ProductCard({ product, label, onQuote }: { product: Product; label?: string; onQuote(): void }) {
  const commerce = useCommerce()
  const [frame, setFrame] = useState(0)
  const price = promotionPrice(product.id, Number(product.price.replace(/\D/g, '')), product.purchaseMode === 'quote')
  const inCart = commerce.cartIds.has(product.id)
  const photo = images[productImages[product.id]]
  // Existing assets contain one confirmed illustration per product. Do not
  // manufacture gallery frames by moving or cropping the same photograph.
  const frames = photo ? [photo] : []
  const available = formatAvailability(product.availabilityStatus, product.storeCount)
  const specs = getDemoProduct(product.id)?.specs ?? {}
  const shortSpecs = ['Напряжение', 'Мощность'].filter(key => specs[key]).map(key => [key, specs[key]])
  return <article className="sc-product" data-product-id={product.id}>
    <div className="sc-product-top"><div className="sc-badges">{price.promotionHref && <Link to={price.promotionHref} className="sc-badge sc-badge--sale">Акция</Link>}{label && <span className={`sc-badge sc-badge--${label === 'Новинка' ? 'new' : 'hit'}`}>{label}</span>}</div><div className="sc-product-actions"><button aria-label={`${commerce.favoriteIds.has(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}: ${product.name}`} aria-pressed={commerce.favoriteIds.has(product.id)} onClick={() => commerce.toggleFavorite(product.id)}><Icon name="heart" size={20} /></button><button aria-label={`${commerce.compareIds.has(product.id) ? 'Убрать из сравнения' : 'Добавить в сравнение'}: ${product.name}`} aria-pressed={commerce.compareIds.has(product.id)} onClick={() => commerce.toggleCompare(product.id)}><Icon name="compare" size={20} /></button></div></div>
    <Link to={product.href} className="sc-product-media" aria-label={`Открыть товар: ${product.name}`} onMouseMove={event => { if (frames.length < 2) return; const bounds = event.currentTarget.getBoundingClientRect(); setFrame(Math.min(frames.length - 1, Math.max(0, Math.floor((event.clientX - bounds.left) / bounds.width * frames.length)))) }} onMouseLeave={() => setFrame(0)}>{photo ? <img src={frames[frame]} alt={product.name} loading="lazy" /> : <span>{product.name}</span>}</Link>
    {frames.length > 1 && <div className="sc-product-frames" aria-label="Просмотр изображения">{frames.map((_, item) => <button key={item} aria-label={`Показать кадр ${item + 1}: ${product.name}`} aria-pressed={item === frame} onClick={() => setFrame(item)} />)}</div>}
    <Link className="sc-product-name" to={product.href} title={product.name}>{product.name}</Link>
    {shortSpecs.length > 0 && <dl className="sc-product-specs">{shortSpecs.map(([key, value]) => <div key={key}><dt className="sr-only">{key}</dt><dd>{value}</dd></div>)}</dl>}
    <p className="sc-product-sku">Артикул: {product.sku}</p>
    <p className={`sc-product-stock${product.availabilityStatus === 'available' || String(product.availabilityStatus).includes('магазин') ? ' sc-product-stock--available' : ''}`}>{available}</p>
    <div className="sc-product-purchase"><div className="sc-product-price">{price.oldPrice && <del>{price.oldPrice.toLocaleString('ru-RU')} ₽</del>}<strong>{product.purchaseMode === 'quote' ? 'Цена по запросу' : product.price}</strong></div>
    {product.purchaseMode === 'quote' ? <button className="sc-buy" onClick={onQuote}>Запросить цену</button> : inCart ? <Link className="sc-buy sc-buy--added" to="/cart"><Icon name="check" size={18} />В корзине</Link> : <button className="sc-buy" aria-label={`Добавить в корзину: ${product.name}`} onClick={() => commerce.addToCart(product.id)}><Icon name="cart" size={18} />В корзину</button>}</div>
  </article>
}
