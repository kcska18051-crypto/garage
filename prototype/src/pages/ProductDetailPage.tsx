import { useState } from 'react'
import { Link } from 'react-router-dom'
import { defaultOffer, findOffer, offerSelections, productDetail, type ProductOffer } from '../data/productDetailData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { ProductGallery } from '../features/product-detail/ProductGallery'
import { ProductMobilePurchase, ProductPurchase, type CommercialState } from '../features/product-detail/ProductPurchase'
import { ProductSections } from '../features/product-detail/ProductSections'
import { ProductVariants } from '../features/product-detail/ProductVariants'
import { useCommerce } from '../state/CommerceState'
import '../features/product-detail/ProductDetail.css'

export function ProductDetailPage() {
  const [commercialState, setCommercialState] = useState<CommercialState>('available')
  const [offer, setOffer] = useState<ProductOffer>(defaultOffer)
  const [selections, setSelections] = useState(offerSelections(defaultOffer))
  const [shareFeedback, setShareFeedback] = useState('')
  const commerce = useCommerce()
  const favorite = commerce.favoriteIds.has(productDetail.id)
  const compared = commerce.compareIds.has(productDetail.id)
  const selectVariant = (groupId: string, value: string) => {
    const exact = findOffer({ ...selections, [groupId]: value })
    const next = exact ?? productDetail.offers.find((candidate) => candidate.options[groupId] === value)
    if (!next) return
    setOffer(next)
    setSelections(offerSelections(next))
  }
  return <main className="product-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Компрессорное оборудование', to: '/catalog/compressor-equipment' }, { label: 'Винтовые компрессоры', to: '/catalog/compressor-equipment/screw-compressors' }, { label: productDetail.brand }]} />
    <header className="product-heading">
      <div className="product-labels">{productDetail.labels.map((label) => <span key={label}>{label}</span>)}</div>
      <h1>{productDetail.name}</h1>
      <div className="product-heading__bar"><div className="product-heading__meta"><span>Артикул {offer.sku}</span><strong>★ {productDetail.rating}</strong><button type="button" onClick={() => document.querySelector('#reviews')?.scrollIntoView()}>{productDetail.reviewCount}</button><button type="button" onClick={() => document.querySelector('#questions')?.scrollIntoView()}>{productDetail.questionCount}</button><span>{productDetail.warranty}</span></div><div className="product-heading__actions"><button type="button" title="В избранное" aria-label="В избранное" aria-pressed={favorite} onClick={() => commerce.toggleFavorite(productDetail.id)}><span aria-hidden="true">♡</span></button><button type="button" title="Сравнить" aria-label="Сравнить" aria-pressed={compared} onClick={() => commerce.toggleCompare(productDetail.id)}><span aria-hidden="true">≡</span></button><button type="button" title="Поделиться" aria-label="Поделиться" onClick={() => setShareFeedback('Ссылка на товар скопирована')}><span aria-hidden="true">↗</span></button></div></div>
      {shareFeedback && <p className="product-heading__feedback" role="status">{shareFeedback}</p>}
    </header>
    <section className="product-hero">
      <ProductGallery images={productDetail.gallery} name={productDetail.name} offer={offer} state={commercialState} />
      <div className="product-identity"><Link className="product-identity__brand" to="/brand/remeza/">{productDetail.brand}</Link><ProductVariants groups={productDetail.variantGroups} selections={selections} offers={productDetail.offers} onChange={selectVariant} /><h2>Ключевые характеристики</h2><dl className="product-key-specs">{productDetail.keySpecs.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl><a className="product-all-specs" href="#characteristics">Все характеристики ↓</a></div>
      <ProductPurchase offer={offer} state={commercialState} onStateChange={setCommercialState} />
    </section>
    <nav className="product-anchor-nav" aria-label="Разделы товара">{productDetail.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</nav>
    <ProductSections />
    <ProductMobilePurchase offer={offer} state={commercialState} />
  </main>
}
