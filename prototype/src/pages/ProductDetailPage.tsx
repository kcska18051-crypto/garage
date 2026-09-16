import { useState } from 'react'
import { Link } from 'react-router-dom'
import { productDetail } from '../data/productDetailData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ProductGallery } from '../features/product-detail/ProductGallery'
import { ProductMobilePurchase, ProductPurchase } from '../features/product-detail/ProductPurchase'
import { ProductSections } from '../features/product-detail/ProductSections'
import { useCommerce } from '../state/CommerceState'
import '../features/product-detail/ProductDetail.css'

export function ProductDetailPage() {
  const [commercialState, setCommercialState] = useState<'available' | 'request'>('available')
  const commerce = useCommerce()
  const favorite = commerce.favoriteIds.has(productDetail.id)
  const compared = commerce.compareIds.has(productDetail.id)
  return <main className="product-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Компрессорное оборудование', to: '/catalog/compressor-equipment' }, { label: 'Винтовые компрессоры', to: '/catalog/compressor-equipment/screw-compressors' }, { label: productDetail.name }]} />
    <section className="product-hero">
      <ProductGallery images={productDetail.gallery} name={productDetail.name} />
      <div className="product-identity">
        <div className="product-labels">{productDetail.labels.map((label) => <span key={label}>{label}</span>)}</div>
        <h1>{productDetail.name}</h1>
        <div className="product-identity__reference"><Link className="product-identity__brand" to="/brand/remeza/">{productDetail.brand}</Link><p className="product-identity__meta">Артикул {productDetail.sku}</p></div>
        <div className="product-identity__trust"><span>★ {productDetail.rating}</span><button type="button" onClick={() => document.querySelector('#reviews')?.scrollIntoView()}>{productDetail.reviewCount} · демо</button><button type="button" onClick={() => document.querySelector('#questions')?.scrollIntoView()}>{productDetail.questionCount} · демо</button></div>
        <p className="product-identity__warranty">Гарантия: {productDetail.warranty}</p>
        <div className="product-identity__actions"><button type="button" aria-pressed={compared} onClick={() => commerce.toggleCompare(productDetail.id)}>{compared ? 'Убрать из сравнения' : 'Добавить в сравнение'}</button><button type="button" aria-pressed={favorite} onClick={() => commerce.toggleFavorite(productDetail.id)}>{favorite ? 'Убрать из избранного' : 'Добавить в избранное'}</button></div>
        <dl className="product-key-specs">{productDetail.keySpecs.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
        <a className="product-all-specs" href="#characteristics">Все характеристики ↓</a>
      </div>
      <ProductPurchase state={commercialState} onStateChange={setCommercialState} />
    </section>
    <nav className="product-anchor-nav" aria-label="Разделы товара">{productDetail.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</nav>
    <ProductSections />
    <ProductMobilePurchase state={commercialState} />
  </main>
}
