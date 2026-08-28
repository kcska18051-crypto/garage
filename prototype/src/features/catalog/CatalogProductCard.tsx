import { Link } from 'react-router-dom'
import { catalogBrands, fullFilterGroups } from '../../data/catalogData'
import type { CatalogProduct } from '../../data/catalogTypes'
import { useCommerce } from '../../state/CommerceState'

const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
const specLabel = (group: string, value: string) => fullFilterGroups.find((item) => item.id === group)?.options?.find((item) => item.value === value)?.label ?? value

export function CatalogProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const commerce = useCommerce()
  const brand = catalogBrands.find((item) => item.id === product.brandId)?.name ?? product.brandId
  return <article className="catalog-product-card"><div className={`catalog-product-card__media catalog-product-card__media--${index % 4}`} aria-hidden="true"><span /><b /></div><div className="catalog-product-card__actions"><button type="button" aria-label={`${commerce.favoriteIds.has(product.id) ? 'Убрать из избранного' : 'Добавить в избранное'}: ${product.name}`} aria-pressed={commerce.favoriteIds.has(product.id)} onClick={() => commerce.toggleFavorite(product.id)}>♡</button><button type="button" aria-label={`${commerce.compareIds.has(product.id) ? 'Убрать из сравнения' : 'Добавить в сравнение'}: ${product.name}`} aria-pressed={commerce.compareIds.has(product.id)} onClick={() => commerce.toggleCompare(product.id)}>≡</button></div><p className="catalog-product-card__meta">{brand} · {product.sku}</p><Link className="catalog-product-card__name" to={`/product/${product.slug}`}>{product.name}</Link><dl>{['performance', 'voltage', 'pressure', 'power'].map((group) => <div key={group}><dt>{fullFilterGroups.find((item) => item.id === group)?.label}</dt><dd>{specLabel(group, product.specs[group])}</dd></div>)}</dl><p className="catalog-product-card__availability"><span />{product.availability.includes('in-stock') ? 'В наличии' : 'Доступно для заказа'}<small>{product.delivery}</small></p><div className="catalog-product-card__bottom"><div>{product.oldPrice ? <del>{money(product.oldPrice)}</del> : null}<strong>{money(product.price)}</strong></div>{product.purchaseMode === 'quote' ? <button className="catalog-product-card__quote" type="button">Запросить цену</button> : <button className="catalog-product-card__cart" type="button" aria-label={`${commerce.cartIds.has(product.id) ? 'Товар в корзине' : 'Добавить в корзину'}: ${product.name}`} onClick={() => commerce.addToCart(product.id)}>{commerce.cartIds.has(product.id) ? 'В корзине' : 'В корзину'}</button>}</div></article>
}
