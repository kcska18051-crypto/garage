import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { prototypeData as data } from '../../../src/data/prototypeData'
import type { ProductCollection, PromoBanner } from '../../../src/data/types'
import { UsefulSection } from './UsefulSection'
import { AboutSection } from './AboutSection'
import { ContactDialog } from '../../../src/features/forms/ContactDialog'
import { Hero } from './Hero'
import { Icon, type IconName } from './Icon'
import { ProductCard } from './ProductCard'
import { images } from './images'
import { PromoBanner as Banner } from './PromoBanner'
import { promoDesigns } from './promoDesign'

const categoryPhotos: Record<string, string> = { lifting: 'product-jack', body: 'product-diagnostic', paint: 'product-spray', 'compressor-equipment': 'product-compressor', tools: 'product-toolset', welding: 'product-welder' }
const servicePhotos: Record<string, string> = { 'service-center': 'photo-service-repair', rental: 'photo-service-rental', 'paint-matching': 'photo-service-paint' }
function SectionTitle({ title, href, link = 'Смотреть все', children }: { title: string; href: string; link?: string; children?: React.ReactNode }) {
  return <div className="sc-section-title"><h2>{title}</h2><div><Link to={href}>{link}</Link>{children}</div></div>
}
function Collection({ collection, onQuote }: { collection: ProductCollection; onQuote(): void }) {
  const rail = useRef<HTMLDivElement>(null)
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  return <section className={`sc-section sc-collection${collection.id === 'bestsellers' ? ' sc-collection--featured' : ''}`} data-collection={collection.id}><SectionTitle title={collection.label} href={collection.href}><div className="sc-rail-controls"><button aria-label={`Предыдущие товары: ${collection.label}`} onClick={() => move(-1)}><Icon name="left" size={18} /></button><button aria-label={`Следующие товары: ${collection.label}`} onClick={() => move(1)}><Icon name="right" size={18} /></button></div></SectionTitle><div className="sc-products" ref={rail}>{collection.products.map(product => <ProductCard key={product.id} product={product} label={collection.id === 'new' ? 'Новинка' : collection.id === 'bestsellers' ? 'Хит' : undefined} onQuote={onQuote} />)}</div></section>
}
function Brands() {
  const rail = useRef<HTMLDivElement>(null)
  return <section className="sc-section"><SectionTitle title="Популярные бренды" href="/brands" link="Все бренды"><div className="sc-rail-controls"><button aria-label="Предыдущие бренды" onClick={() => rail.current?.scrollBy({ left: -400 })}><Icon name="left" size={18} /></button><button aria-label="Следующие бренды" onClick={() => rail.current?.scrollBy({ left: 400 })}><Icon name="right" size={18} /></button></div></SectionTitle><div className="sc-brands" ref={rail}>{data.brands.map(brand => <Link key={brand.id} to={brand.href}>{brand.name}</Link>)}</div></section>
}
export function Home() {
  const [dialog, setDialog] = useState<'consultation' | 'callback' | null>(null)
  const benefits: IconName[] = ['truck', 'pickup', 'shield', 'case']
  return <main><h1 className="sr-only">Оборудование для автосервиса — Гараж</h1><Hero />
    <section className="sc-section sc-categories"><SectionTitle title="Популярные категории" href="/catalog" link="Весь каталог" /><div className="sc-category-grid">{data.categories.map(item => <Link key={item.id} to={item.href} className="sc-category"><strong>{item.name}</strong><div><img src={images[categoryPhotos[item.id]]} alt="" loading="lazy" /></div></Link>)}</div></section>
    {data.homeMerchandising.filter(block => block.visible).map(block => { const collection = data.productCollections.find(item => item.id === block.collectionId); const banners = block.bannerIds.map(id => data.promoBanners.find(item => item.id === id)).filter((item): item is PromoBanner => Boolean(item)); return <Fragment key={block.id}>{collection && <Collection collection={collection} onQuote={() => setDialog('consultation')} />}{banners.length > 0 && <div className={`sc-banner-group sc-banner-group--${banners.length}`}>{banners.map(banner => <Banner key={banner.id} banner={banner} design={promoDesigns[banner.id]} />)}</div>}</Fragment> })}
    <section className="sc-benefits" aria-label="Преимущества">{data.benefits.map((item, index) => <article key={item.id}><span className="sc-benefit-icon"><Icon name={benefits[index]} size={30} /></span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</section>
    <Brands />
    <section className="sc-section"><SectionTitle title="Акции" href="/actions" link="Все акции" /><div className="sc-promotions">{data.promotions.filter(item => item.showOnHome).map((item, index) => <Link className="sc-offer" key={item.id} to={item.href}><div className="sc-offer-image"><img src={images[['photo-hero-workshop', 'photo-paint', 'photo-compressor'][index]]} alt="" loading="lazy" /><span className="sc-badge sc-badge--sale">Акция</span></div><div className="sc-offer-copy"><small>{item.deadline}</small><h3>{item.title}</h3><p>{item.text}</p><span>Подробнее</span></div></Link>)}</div></section>
    <section className="sc-section"><SectionTitle title="Услуги" href="/services" link="Все услуги" /><div className="sc-services">{data.services.map(item => <article className={`sc-service sc-service--${item.id}`} key={item.id}><img src={images[servicePhotos[item.id]]} alt="" loading="lazy" /><div><h3>{item.name}</h3><p>{item.text}</p><Link to={item.href}>{item.cta}</Link></div></article>)}</div></section>
    <AboutSection /><UsefulSection items={data.useful.filter(item => item.kind !== 'review' || data.config.showReviews)} />
    <section className="sc-consult"><div className="sc-consult-icon"><Icon name="user" size={42} /></div><div><p className="sc-kicker">Поможем с выбором</p><h2>Не уверены, какое оборудование<br />или материал выбрать?</h2><p>Опишите задачу — специалист поможет определить подходящее направление.</p><div className="sc-consult-actions"><button className="sc-buy" onClick={() => setDialog('consultation')}>Получить консультацию</button><button className="sc-outline" onClick={() => setDialog('callback')}>Заказать обратный звонок</button></div></div></section>
    {dialog && <ContactDialog mode={dialog} onClose={() => setDialog(null)} />}
  </main>
}
