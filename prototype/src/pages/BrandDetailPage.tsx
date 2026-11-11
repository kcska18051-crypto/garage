import { getMaterial } from '../data/materialsData'
import { materialPicture } from '../features/materials/materialPictures'
import { compressorCategoryImages } from '../features/catalog/compressorCategoryImages'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { remezaCategories, remezaFilterGroups, remezaProducts } from '../data/brandDetailData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogProductCard } from '../features/catalog/CatalogProductCard'
import { ProductListing } from '../features/catalog/ProductListing'
import '../features/brands/BrandDetail.css'

const canonicalUrl = 'https://kcska18051-crypto.github.io/garage/brand/remeza/'
const metaDescription = 'Оборудование Remeza: компрессоры, ресиверы и подготовка воздуха. Категории, товары и полезные материалы в магазине «Гараж».'

function useBrandMetadata() {
  useEffect(() => {
    const previousTitle = document.title
    const existingMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const existingCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const meta = existingMeta ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'description' }))
    const canonical = existingCanonical ?? document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'canonical' }))
    const previousDescription = meta.content
    const previousCanonical = canonical.href
    document.title = 'Оборудование Remeza — каталог бренда | Гараж'
    meta.content = metaDescription
    canonical.href = canonicalUrl
    return () => {
      document.title = previousTitle
      if (existingMeta) meta.content = previousDescription; else meta.remove()
      if (existingCanonical) canonical.href = previousCanonical; else canonical.remove()
    }
  }, [])
}

const categoryPictures:Record<string,string>={piston:compressorCategoryImages['piston-compressors'],screw:compressorCategoryImages['screw-compressors'],receivers:compressorCategoryImages.receivers,dryers:compressorCategoryImages.dryers}
const usefulMaterials=[getMaterial('article','compressor-checklist')!,getMaterial('review','compressor-types')!,getMaterial('article','air-line')!,getMaterial('article','work-area')!]
const benefits=[
 {title:'Помощь с подбором',text:'Сопоставим параметры оборудования с задачами мастерской.',icon:'M4 7h16M4 17h16M8 4v6M16 14v6'},
 {title:'Получение заказа',text:'Способ и сроки уточняются для выбранного города.',icon:'M3 6h11v11H3zM14 10h4l3 4v3h-7M5 19h.01M18 19h.01'},
 {title:'Сервис и обслуживание',text:'Обсудим диагностику и дальнейшее обслуживание оборудования.',icon:'m14 5-3 3 3 3 3-3a5 5 0 0 1-6 6l-6 6-3-3 6-6a5 5 0 0 1 6-6Z'},
 {title:'Для бизнеса',text:'Уточним состав заказа и необходимые документы.',icon:'M3 7h18v14H3zM8 7V3h8v4M3 12h18M10 12v3h4v-3'},
]
export function BrandDetailPage() {
  useBrandMetadata()
  return <main className="brand-detail-page">
    <Breadcrumbs items={[{label:'Главная',to:'/'},{label:'Бренды',to:'/brands'},{label:'Remeza'}]}/>
    <header className="brand-detail-hero"><div className="brand-detail-hero__copy">
      <img className="brand-detail-logo" src="/garage/style-check/review-assets/logo-remeza.svg" alt="Remeza" width="201" height="54"/>
      <h1>Оборудование Remeza</h1><p>Компрессоры, ресиверы и решения для подготовки сжатого воздуха. Выберите направление или перейдите к товарам бренда.</p>
      <a className="button brand-detail-cta" href="#brand-products">Перейти к товарам</a>
    </div><div className="brand-detail-hero__art"><img src={compressorCategoryImages['screw-compressors']} alt="Винтовой компрессор Remeza" width="600" height="600"/></div></header>

    <section className="brand-detail-section" aria-label="Категории товаров Remeza"><div className="brand-detail-heading"><h2>Категории товаров Remeza</h2></div>
      <div className="brand-category-grid">{remezaCategories.filter(category=>category.href).map(category=><Link key={category.id} to={category.href!}><img src={categoryPictures[category.id]} alt="" width="160" height="110"/><div><h3>{category.name}</h3><p>{category.description}</p></div><span aria-hidden="true">↗</span></Link>)}</div>
    </section>

    <section className="brand-detail-section brand-popular-products" aria-label="Популярные товары Remeza"><div className="brand-detail-heading brand-detail-heading--row"><h2>Популярные товары Remeza</h2><a href="#brand-products">Смотреть все товары Remeza</a></div><div className="brand-popular-products__grid">{remezaProducts.slice(0,4).map((product,index)=><CatalogProductCard key={product.id} product={product} index={index}/>)}</div></section>

    <section id="brand-products" className="brand-products" aria-label="Все товары Remeza"><div className="brand-detail-heading"><h2>Все товары бренда</h2><p>Сравните параметры и выберите оборудование под вашу задачу.</p></div><ProductListing products={remezaProducts} filterGroups={remezaFilterGroups} mode="full" title={null}/></section>

    <section className="brand-about" aria-label="О бренде Remeza"><div><h2>О бренде Remeza</h2><p>Remeza — компрессорное оборудование и системы подготовки сжатого воздуха. В каталоге представлены винтовые и поршневые компрессоры, ресиверы и осушители.</p><p>Для выбора оборудования учитывайте рабочие задачи, требования инструмента и условия размещения. Характеристики конкретной модели можно посмотреть в карточке товара.</p></div><dl><div><dt>Оборудование</dt><dd>Винтовые и поршневые компрессоры</dd></div><div><dt>Подготовка воздуха</dt><dd>Ресиверы и осушители</dd></div><div><dt>Подбор</dt><dd>По параметрам и задачам мастерской</dd></div></dl></section>

    <section className="brand-detail-section brand-benefits" aria-label="Преимущества покупки Remeza в Гараже"><div className="brand-detail-heading"><h2>Покупка Remeza в «Гараже»</h2></div><div>{benefits.map(item=><article key={item.title}><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>

    <section className="brand-detail-section brand-materials" aria-label="Документы и материалы"><div className="brand-detail-heading"><h2>Документы и материалы</h2><p>Каталог и документы на сайте производителя.</p></div><div><a href="https://www.remeza.org/catalog/" target="_blank" rel="noreferrer"><span>Каталог Remeza</span><small>Оборудование и характеристики</small><b aria-hidden="true">↗</b></a><a href="https://www.remeza.org/company/certificates/" target="_blank" rel="noreferrer"><span>Сертификаты</span><small>Документы производителя</small><b aria-hidden="true">↗</b></a></div></section>

    <section className="brand-detail-section brand-useful" aria-label="Полезные материалы о Remeza"><div className="brand-detail-heading"><h2>Полезные материалы</h2></div><div>{usefulMaterials.map(item=><Link key={item.kind+item.slug} to={`${item.kind==='review'?'/reviews':'/articles'}/${item.slug}`}><img src={materialPicture(item)} alt="" width="600" height="400" loading="lazy"/><div><small>{item.categoryLabel}</small><h3>{item.title}</h3><span>{item.dateLabel}</span></div></Link>)}</div></section>
    <Link className="brand-back" to="/brands">← Все бренды</Link>
  </main>
}
