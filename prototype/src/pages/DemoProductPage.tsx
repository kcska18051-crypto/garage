import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { getDemoProduct, money, type DemoProduct } from '../data/productRegistry'
import { productDetail } from '../data/productDetailData'
import { promotionPrice } from '../data/promotionPricing'
import { formatAvailability } from '../utils/availability'
import { useCommerce } from '../state/CommerceState'
import { useRegion } from '../state/RegionState'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ContactDialog } from '../features/forms/ContactDialog'
import { RentalAvailability } from '../features/services/RentalAvailability'
import { ProductDetailPage } from './ProductDetailPage'
import { NotFoundPage } from './NotFoundPage'
import { useProfile } from '../state/ProfileState'
import '../features/products/ProductTeaserCard.css'
import './DemoProductPage.css'

function DemoProduct({ product }: { product:DemoProduct }) {
  const commerce=useCommerce(), {region}=useRegion()
  const [quantity,setQuantity]=useState(1), [added,setAdded]=useState(false), [consultation,setConsultation]=useState(false)
  const promo=promotionPrice(product.id,product.price,product.purchaseMode==='quote')
  return <main className="demo-pdp">
    <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Каталог',to:'/catalog'},{label:product.name}]}/>
    <header><h1>{product.name}</h1><p>Артикул: {product.sku}</p><p className="demo-pdp__note">Демонстрационные данные. Цена, наличие и параметры требуют подтверждения клиентом.</p></header>
    <div className="demo-pdp__hero">
      <figure><span className={`product-teaser__visual product-teaser__visual--${product.imageVariant%4}`} role="img" aria-label={`Демозаглушка изображения: ${product.name}`}><i/><b/></span><figcaption>Место для изображения товара · {product.name}</figcaption></figure>
      <aside className="demo-pdp__purchase" aria-label="Покупка товара">
        {product.brand && <p>Бренд: {product.brand}</p>}
        <RentalAvailability productId={product.id}/>
        <div className="demo-pdp__price">{promo.oldPrice && <del>{money(promo.oldPrice)}</del>}<strong>{product.purchaseMode==='quote'?'Цена по запросу':money(product.price)}</strong></div>
        <p>{formatAvailability(product.availabilityStatus,product.storeCount)}</p>
        <p>Получение в городе {region}: условия и срок уточняются при оформлении.</p>
        {product.purchaseMode==='quote' ? <button className="button" type="button" onClick={()=>setConsultation(true)}>Запросить цену</button> : <><label>Количество товара<input type="number" min={1} max={999} value={quantity} onChange={event=>setQuantity(Math.max(1,Math.min(999,Math.floor(Number(event.target.value))||1)))}/></label><button className="button" type="button" aria-label="Добавить в корзину" onClick={()=>{commerce.addToCart(product.id,quantity);setAdded(true)}}>{commerce.cartIds.has(product.id)?'Добавить ещё':'В корзину'}</button></>}
        <button className="demo-pdp__favorite" type="button" aria-pressed={commerce.favoriteIds.has(product.id)} onClick={()=>commerce.toggleFavorite(product.id)}>{commerce.favoriteIds.has(product.id)?'Убрать из избранного':'В избранное'}</button>
        {added && <p role="status">Товар добавлен. <Link to="/cart">Перейти в корзину →</Link></p>}
      </aside>
    </div>
    <section><h2>Информация о товаре</h2><p>{product.modification}</p><p>Карточка показывает существующий пример прототипа, а не подтверждённую спецификацию поставщика.</p></section>
    <section><h2>Характеристики</h2>{Object.keys(product.specs).length ? <><p className="demo-pdp__note">Имеющиеся демопараметры. Не использовать как паспорт изделия.</p><dl>{Object.entries(product.specs).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></> : <p>Подробные характеристики пока не предоставлены. Они будут добавлены после получения данных клиента; вымышленные значения не используются.</p>}</section>
    <section><h2>Получение и гарантия</h2><p>Условия доставки, доступность и гарантийные обязательства уточняются для выбранного товара.</p><Link to="/delivery">Доставка и оплата →</Link><Link to="/warranty">Гарантия и возврат →</Link></section>
    {consultation && <ContactDialog mode="consultation" onClose={()=>setConsultation(false)}/>}
  </main>
}

export function DemoProductPage() {
  const {slug}=useParams()
  const { recordRecentlyViewed } = useProfile()
  useEffect(() => { if (slug && getDemoProduct(slug)) recordRecentlyViewed(slug) }, [slug, recordRecentlyViewed])
  const {hash}=useLocation()
  useEffect(()=>{
    const target=hash ? document.getElementById(hash.slice(1)) : null
    if(target) target.scrollIntoView?.()
    else { document.documentElement.scrollTop=0; document.body.scrollTop=0 }
  },[slug,hash])
  if (productDetail.offers.some(offer=>offer.id===slug)) return <ProductDetailPage key={slug} initialOfferId={slug}/>
  const product=getDemoProduct(slug)
  return product ? <DemoProduct key={product.id} product={product}/> : <NotFoundPage/>
}
