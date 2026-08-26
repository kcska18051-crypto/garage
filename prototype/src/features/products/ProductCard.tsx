import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { useCommerce } from '../../state/CommerceState'

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { favoriteIds, compareIds, cartIds, toggleFavorite, toggleCompare, addToCart } = useCommerce()
  return <article className="product-card"><div className={`product-card__media product-card__media--${index % 4}`} aria-hidden="true"><span /><b /></div><div className="product-card__floating"><button aria-label={`${favoriteIds.has(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}: ${product.name}`} aria-pressed={favoriteIds.has(product.id)} onClick={() => toggleFavorite(product.id)}>♡</button><button aria-label={`${compareIds.has(product.id) ? 'Убрать из сравнения' : 'Добавить в сравнение'}: ${product.name}`} aria-pressed={compareIds.has(product.id)} onClick={() => toggleCompare(product.id)}>≡</button></div><Link className="product-card__name" to={product.href}>{product.name}</Link><p className="product-card__availability"><span />{product.availability}</p><div className="product-card__bottom"><strong>{product.price}</strong><button className="product-card__cart" aria-label={`${cartIds.has(product.id) ? 'Товар в корзине' : 'Добавить в корзину'}: ${product.name}`} onClick={() => addToCart(product.id)}>{cartIds.has(product.id) ? '✓' : '＋'}</button></div></article>
}
