import { useState } from 'react'
import { productDetail, money } from '../../data/productDetailData'
import { useCommerce } from '../../state/CommerceState'
import { useRegion } from '../../state/RegionState'

const requestCopy = {
  quote: 'Запрос коммерческого предложения подготовлен. Форма работает в демонстрационном режиме.',
  lease: 'Запрос на лизинг подготовлен. Условия будут уточняться отдельно.',
  alternative: 'Запрос альтернативной комплектации подготовлен для консультации.',
}

export function ProductPurchase() {
  const commerce = useCommerce()
  const { region } = useRegion()
  const [request, setRequest] = useState<keyof typeof requestCopy | null>(null)
  const inCart = commerce.cartIds.has(productDetail.id)
  const saving = productDetail.oldPrice - productDetail.price
  return <aside className="product-purchase" aria-label="Покупка товара"><p className="product-purchase__notice">Демонстрационные данные прототипа</p><div className="product-purchase__price"><del>{money(productDetail.oldPrice)}</del><strong>{money(productDetail.price)}</strong><span>Экономия {money(saving)}</span></div><p className="product-purchase__status"><span />{productDetail.status}<small>Получение в городе {region}: ориентировочный срок уточняется</small></p><button className="button button--dark" type="button" onClick={() => commerce.addToCart(productDetail.id)}>{inCart ? 'В корзине' : 'В корзину'}</button><button className="button" type="button" onClick={() => setRequest('quote')}>Получить коммерческое предложение</button><button className="button" type="button" onClick={() => setRequest('lease')}>Купить в лизинг</button><button className="product-purchase__link" type="button" onClick={() => setRequest('alternative')}>Запросить альтернативную комплектацию</button>{request && <p className="product-purchase__feedback" role="status">{requestCopy[request]}</p>}</aside>
}

export function ProductMobilePurchase() {
  const commerce = useCommerce()
  return <div className="product-mobile-purchase"><div><small>Демонстрационные данные прототипа</small><strong>{money(productDetail.price)}</strong></div><button className="button button--dark" type="button" onClick={() => commerce.addToCart(productDetail.id)}>{commerce.cartIds.has(productDetail.id) ? 'В корзине' : 'В корзину'}</button></div>
}
