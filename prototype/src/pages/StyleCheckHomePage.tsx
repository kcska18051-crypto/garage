import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { prototypeData } from '../data/prototypeData'
import { ProductShowcase } from '../features/products/ProductShowcase'
import { UsefulSection } from '../features/home/UsefulSection'
import { ContactDialog } from '../features/forms/ContactDialog'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { PromoBanner } from '../data/types'
import { CampaignRaster } from '../features/home/CampaignRaster'

const assets = '/garage/style-check/review-assets/'
const paths: Record<string, string> = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  delivery: 'M3 6h11v11H3zM14 10h4l3 4v3h-7M5 19h.01M18 19h.01M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm13 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  pickup: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  support: 'M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6ZM8 12l3 3 5-6',
  clients: 'M3 7h18v14H3ZM8 7V3h8v4M3 12h18M10 12v3h4v-3',
  tools: 'm14.5 6.5-3.5 3.5 3 3 3.5-3.5a5 5 0 0 1-6 6L6 21a2.1 2.1 0 0 1-3-3l5.5-5.5a5 5 0 0 1 6-6Z',
  message: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 1 1 19 0ZM7 9h9M7 13h6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2',
  brands: 'M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5',
}
function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <svg className={`review-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.arrow} /></svg>
}
function Heading({ title, href, all }: { title: string; href: string; all: string }) {
  return <div className="section-heading"><div><h2>{title}</h2></div><Link className="review-all-link" to={href}>{all}<Icon name="arrow" /></Link></div>
}
function ReviewHero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const start = useRef<number | null>(null)
  const swiped = useRef(false)
  const reduced = useReducedMotion()
  const slides = prototypeData.slides
  useEffect(() => {
    if (paused || reduced || slides.length < 2) return
    const timer = setInterval(() => setActive(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [paused, reduced, slides.length])
  return <section className="hero review-hero" aria-label="Главные предложения" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false) }} onPointerDown={e => { start.current = e.clientX; swiped.current = false }} onPointerCancel={() => { start.current = null }} onPointerUp={e => { if (start.current === null) return; const distance = e.clientX - start.current; start.current = null; if (Math.abs(distance) > 45) { swiped.current = true; setActive(i => (i + (distance > 0 ? slides.length - 1 : 1)) % slides.length) } }}>
    <div className="hero__stage">{slides.map((slide, i) => <article className="hero__slide" key={slide.id} hidden={i !== active} aria-label={`Слайд ${i + 1} из ${slides.length}: ${slide.title}`}><Link to={slide.href} onClick={e => { if (swiped.current) { e.preventDefault(); swiped.current = false } }}><CampaignRaster file={`hero-${slide.id}`} alt={`${slide.title}. ${slide.text} ${slide.cta}`} eager /></Link></article>)}</div>
    <div className="hero__pagination">{slides.map((slide, i) => <button key={slide.id} type="button" onClick={() => setActive(i)} aria-label={`Перейти к слайду ${i + 1}`} aria-current={i === active ? 'true' : undefined} />)}</div>
  </section>
}
const categoryPictures = ['jack', 'cabinet', 'spraygun', 'compressor', 'toolset', 'welder']
function ReviewCategories() {
  const [variant, setVariant] = useState<'calm' | 'expressive'>('calm')
  return <section className="home-section popular-categories" data-category-style={variant}>
    <Heading title="Популярные категории" href="/catalog" all="Весь каталог" />
    <div className="category-style-switch" role="group" aria-label="Временное сравнение оформления категорий">
      <button type="button" aria-pressed={variant === 'calm'} onClick={() => setVariant('calm')}>1 · Спокойный</button>
      <button type="button" aria-pressed={variant === 'expressive'} onClick={() => setVariant('expressive')}>2 · Выразительный</button>
    </div>
    <div className="category-grid">{prototypeData.categories.map((item, i) => <Link className="category-card" key={item.id} to={item.href} aria-label={`Перейти в категорию ${item.name}`}><div className="category-card__art"><img src={`${assets}category-products-png-v27/${categoryPictures[i]}.png`} alt="" loading="lazy" /></div><strong>{item.name}</strong></Link>)}</div>
  </section>
}

function ReviewBanner({ item }: { item: PromoBanner }) {
  return <Link className="divider-banner review-image-banner" to={item.href}><CampaignRaster file={`banner-${item.id}`} alt={`${item.title}. ${item.text} ${item.cta}`} /></Link>
}
function ReviewMerchandising() {
  return <div className="home-merchandising-stream">{prototypeData.homeMerchandising.filter(block => block.visible).map(block => {
    const collection = prototypeData.productCollections.find(item => item.id === block.collectionId)
    if (!collection) return null
    const banners = block.bannerIds.map(id => prototypeData.promoBanners.find(item => item.id === id)).filter((item): item is PromoBanner => !!item)
    return <div className="review-merchandising-group" key={block.id}><ProductShowcase collection={collection} demoCopies={3} />{banners.length > 0 && <div className={`compact-banner-group compact-banner-group--${banners.length}`}>{banners.map(item => <ReviewBanner key={item.id} item={item} />)}</div>}</div>
  })}</div>
}
function ReviewBenefits() {
  const [variant, setVariant] = useState<'calm' | 'expressive'>('calm')
  const links: Record<string, string> = { delivery: '/delivery', pickup: '/contacts', support: '/warranty', clients: '/contacts' }
  return <section className="benefits-strip review-benefits" aria-label="Преимущества" data-benefit-style={variant}>
    <div className="benefit-style-switch" role="group" aria-label="Временное сравнение оформления преимуществ">
      <button type="button" aria-pressed={variant === 'calm'} onClick={() => setVariant('calm')}>1 · Спокойный</button>
      <button type="button" aria-pressed={variant === 'expressive'} onClick={() => setVariant('expressive')}>2 · Выразительный</button>
    </div>
    <div className="review-benefits-grid">{prototypeData.benefits.map(item => <article key={item.id}><span className="review-benefit-icon"><Icon name={item.id} /></span><div className="review-benefit-copy"><h2>{item.title}</h2><p>{item.text}</p></div><img className="review-benefit-decor" src={`${assets}benefits-v30/${item.id}.png`} alt="" loading="lazy" /><Link className="review-benefit-link" to={links[item.id]} aria-label={item.title}><Icon name="arrow" /></Link></article>)}</div>
  </section>
}

const brandPictures: Record<string, string> = { nordberg: 'logo-nordberg.svg', trommelberg: 'logo-trommelberg.png', jtc: 'logo-jtc.png', rupes: 'logo-rupes.png', wiederkraft: 'logo-wiederkraft.jpg', jonnesway: 'logo-jonnesway.svg', sivik: 'logo-sivik.svg', 'car-tool': 'logo-car-tool.png' }
function ReviewBrands() {
  const rail = useRef<HTMLDivElement>(null)
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth, behavior: 'smooth' })
  return <section className="home-section home-section--brands"><div className="section-heading"><div><h2>Популярные бренды</h2></div><div className="rail-actions"><Link to="/brands">Все бренды</Link></div></div><div className="review-brand-rail"><button className="review-brand-prev" type="button" aria-label="Предыдущие бренды" onClick={() => move(-1)}><Icon name="chevron" className="review-icon--back" /></button><div className="brand-grid" ref={rail}>{prototypeData.brands.map(brand => <Link key={brand.id} to={brand.href} aria-label={brand.name}><img className={`review-brand-logo review-brand-logo--${brand.id}`} src={assets + brandPictures[brand.id]} alt={brand.name} loading="lazy" /></Link>)}</div><button className="review-brand-next" type="button" aria-label="Следующие бренды" onClick={() => move(1)}><Icon name="chevron" /></button></div></section>
}
const serviceRasterFiles: Record<string,string> = { 'service-center':'service-center', rental:'service-rental', 'paint-matching':'service-paint' }
const promotionRasterFiles: Record<string,string> = { 'service-tools':'promotion-service', 'paint-week':'promotion-paint', 'compressor-season':'promotion-compressor' }
function ReviewFeatures({ services = false }: { services?: boolean }) {
  if (services) return <section className="home-section services"><Heading title="Услуги" href="/services" all="Все услуги" /><div className="review-feature-grid">{prototypeData.services.map(item => <Link className="service-banner" key={item.id} to={item.href}><CampaignRaster file={serviceRasterFiles[item.id]} alt={`${item.name}. ${item.text} ${item.cta}`} /></Link>)}</div></section>
  return <section className="home-section promotions"><Heading title="Акции" href="/actions" all="Все акции" /><div className="promotions__grid review-feature-grid">{prototypeData.promotions.filter(item=>item.showOnHome).map(item=><Link className="review-feature-card promotion-card" key={item.id} to={item.href}><div className="review-feature-photo"><img src={`/garage/style-check/review-assets/raster-responsive-v24/${promotionRasterFiles[item.id]}-cover.webp`} alt="" loading="lazy" decoding="async" /></div><div className="review-feature-copy"><p className="promotion-card__deadline">{item.deadline}</p><h3>{item.title}</h3><p>{item.text}</p><span className="review-feature-action">Подробнее<Icon name="arrow" /></span></div></Link>)}</div></section>
}
function ReviewAbout() {
  const facts = [
    { id: 'years', title: 'Годы работы', icon: 'clock' },
    { id: 'stores', title: 'Магазины', icon: 'pickup' },
    { id: 'directions', title: 'Направления', icon: 'tools' },
    { id: 'brands', title: 'Бренды', icon: 'brands' },
  ]
  return <section className="home-section about-section review-about"><div className="about-section__art" aria-hidden="true" /><div className="about-section__copy"><h2>Знаем оборудование изнутри</h2><p>«Гараж» работает с профессиональным оборудованием, инструментом и материалами для автосервисов, кузовного ремонта и производственных задач.</p><Link className="button" to="/about">Подробнее о компании<Icon name="arrow" /></Link></div><div className="about-facts">{facts.map(fact => <div key={fact.id} className="review-about-fact"><span className="review-about-fact__icon"><Icon name={fact.icon} /></span><strong>{fact.title}</strong><span className="review-fact-detail">данные клиента</span><img className="review-about-fact__decor" src={`${assets}about-v29/${fact.id}.png`} alt="" loading="lazy" /></div>)}</div></section>
}

function ReviewConsultation({ onConsult, onCallback }: { onConsult(): void; onCallback(): void }) {
  return <section className="final-cta review-consultation"><div><h2>Не уверены, какое оборудование или материал выбрать?</h2><p>Опишите задачу — специалист поможет определить подходящее направление.</p><div><button className="button button--light" type="button" onClick={onConsult}>Получить консультацию</button><button className="button" type="button" onClick={onCallback}>Заказать обратный звонок</button></div></div></section>
}
export function StyleCheckHomePage() {
  const [dialog, setDialog] = useState<'consultation' | 'callback' | null>(null)
  return <main className="review-home-v2"><h1 className="sr-only">Оборудование для автосервиса — Гараж</h1><ReviewHero /><ReviewCategories /><ReviewMerchandising /><ReviewBenefits /><ReviewBrands /><ReviewFeatures /><ReviewFeatures services /><ReviewAbout /><UsefulSection showAllLink={false} items={prototypeData.useful.filter(item => item.kind !== 'review' || prototypeData.config.showReviews)} /><ReviewConsultation onConsult={() => setDialog('consultation')} onCallback={() => setDialog('callback')} />{dialog && <ContactDialog mode={dialog} onClose={() => setDialog(null)} />}</main>
}
