import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { prototypeData } from '../data/prototypeData'
import { ProductShowcase } from '../features/products/ProductShowcase'
import { UsefulSection } from '../features/home/UsefulSection'
import { ContactDialog } from '../features/forms/ContactDialog'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { PromoBanner } from '../data/types'

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
function BannerPicture({ name, alt, hero = false }: { name: string; alt: string; hero?: boolean }) {
  return <picture><source media="(max-width: 767px)" srcSet={`${assets}${name}-mobile-v4.svg`} /><img src={`${assets}${name}-v4.svg`} alt={alt} loading={hero ? 'eager' : 'lazy'} decoding="async" /></picture>
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
    <div className="hero__stage">{slides.map((slide, i) => <article className="hero__slide" key={slide.id} hidden={i !== active} aria-label={`Слайд ${i + 1} из ${slides.length}: ${slide.title}`}><Link to={slide.href} aria-label={`${slide.title}. ${slide.cta}`} onClick={e => { if (swiped.current) { e.preventDefault(); swiped.current = false } }}><BannerPicture name={`hero-${slide.id}`} alt={`${slide.title}. ${slide.text}. ${slide.cta}`} hero /></Link></article>)}</div>
    <div className="hero__pagination">{slides.map((slide, i) => <button key={slide.id} type="button" onClick={() => setActive(i)} aria-label={`Перейти к слайду ${i + 1}`} aria-current={i === active ? 'true' : undefined} />)}</div>
  </section>
}
const categoryPictures = ['product-jack.jpg', 'product-cabinet.jpg', 'product-spraygun.jpg', 'product-compressor.jpg', 'product-toolset.jpg', 'product-welder.jpg']
function ReviewCategories() {
  return <section className="home-section popular-categories"><Heading title="Популярные категории" href="/catalog" all="Весь каталог" /><div className="category-grid">{prototypeData.categories.map((item, i) => <Link className="category-card" key={item.id} to={item.href} aria-label={`Перейти в категорию ${item.name}`}><div className="category-card__art"><img src={assets + categoryPictures[i]} alt="" loading="lazy" /></div><strong>{item.name}</strong></Link>)}</div></section>
}
const bannerNames: Record<string, string> = { season: 'banner-season', paint: 'banner-paint', compressors: 'banner-compressors', workshop: 'banner-workshop' }
function ReviewBanner({ item }: { item: PromoBanner }) {
  return <Link className="divider-banner review-image-banner" to={item.href} aria-label={`${item.title}. Подробнее`}><BannerPicture name={bannerNames[item.id]} alt={`${item.title}. ${item.text}. Подробнее`} /></Link>
}
function ReviewMerchandising() {
  return <div className="home-merchandising-stream">{prototypeData.homeMerchandising.filter(block => block.visible).map(block => {
    const collection = prototypeData.productCollections.find(item => item.id === block.collectionId)
    if (!collection) return null
    const banners = block.bannerIds.map(id => prototypeData.promoBanners.find(item => item.id === id)).filter((item): item is PromoBanner => !!item)
    return <div className="review-merchandising-group" key={block.id}><ProductShowcase collection={collection} />{banners.length > 0 && <div className={`compact-banner-group compact-banner-group--${banners.length}`}>{banners.map(item => <ReviewBanner key={item.id} item={item} />)}</div>}</div>
  })}</div>
}
function ReviewBenefits() {
  return <section className="benefits-strip review-benefits" aria-label="Преимущества">{prototypeData.benefits.map(item => <article key={item.id}><span className="review-benefit-icon"><Icon name={item.id} /></span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</section>
}
const brandPictures: Record<string, string> = { nordberg: 'logo-nordberg.svg', trommelberg: 'logo-trommelberg.png', jtc: 'logo-jtc.png', rupes: 'logo-rupes.png', wiederkraft: 'logo-wiederkraft.jpg', jonnesway: 'logo-jonnesway.svg', sivik: 'logo-sivik.svg', 'car-tool': 'logo-car-tool.png' }
function ReviewBrands() {
  const rail = useRef<HTMLDivElement>(null)
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * .7, behavior: 'smooth' })
  return <section className="home-section home-section--brands"><div className="section-heading"><div><h2>Популярные бренды</h2></div><div className="rail-actions"><Link to="/brands">Все бренды</Link><button type="button" aria-label="Предыдущие бренды" onClick={() => move(-1)}><Icon name="chevron" className="review-icon--back" /></button><button type="button" aria-label="Следующие бренды" onClick={() => move(1)}><Icon name="chevron" /></button></div></div><div className="brand-grid" ref={rail}>{prototypeData.brands.map(brand => <Link key={brand.id} to={brand.href} aria-label={brand.name}><img className={`review-brand-logo review-brand-logo--${brand.id}`} src={assets + brandPictures[brand.id]} alt={brand.name} loading="lazy" /></Link>)}</div></section>
}
const featurePictures = ['tools-photo.jpg', 'paint-photo.jpg', 'product-compressor.jpg']
const servicePictures = ['repair-photo.jpg', 'rental-photo.jpg', 'mixing-photo.jpg']
function ReviewFeatures({ services = false }: { services?: boolean }) {
  const items = services ? prototypeData.services.map((item, i) => ({ id: item.id, title: item.name, text: item.text, href: item.href, cta: item.cta, label: '', photo: servicePictures[i] })) : prototypeData.promotions.filter(item => item.showOnHome).map((item, i) => ({ ...item, cta: 'Подробнее', label: item.deadline, photo: featurePictures[i] }))
  return <section className={`home-section ${services ? 'services' : 'promotions'}`} aria-label={services ? 'Основные услуги' : undefined}><Heading title={services ? 'Услуги' : 'Акции'} href={services ? '/services' : '/actions'} all={services ? 'Все услуги' : 'Все акции'} /><div className={`${services ? 'service-cards' : 'promotions__grid'} review-feature-grid`}>{items.map(item => <Link className={`review-feature-card${services ? '' : ' promotion-card'}`} key={item.id} to={item.href}><div className="review-feature-photo"><img src={assets + item.photo} alt="" loading="lazy" /></div><div className="review-feature-copy">{item.label && <p className="promotion-card__deadline">{item.label}</p>}<h3>{item.title}</h3><p>{item.text}</p><span className="review-feature-action">{item.cta}<Icon name="arrow" /></span></div></Link>)}</div></section>
}
function ReviewAbout() {
  const facts = ['Годы работы — данные клиента', 'Магазины — данные клиента', 'Направления — данные клиента', 'Бренды — данные клиента']
  return <section className="home-section about-section review-about"><div className="about-section__art" aria-hidden="true" /><div className="about-section__copy"><h2>Знаем оборудование изнутри</h2><p>«Гараж» работает с профессиональным оборудованием, инструментом и материалами для автосервисов, кузовного ремонта и производственных задач.</p><Link className="button" to="/about">Подробнее о компании<Icon name="arrow" /></Link></div><div className="about-facts">{facts.map((fact, i) => <div key={fact}><Icon name={['clock', 'pickup', 'tools', 'brands'][i]} /><strong>{fact.split(" — ")[0]}</strong><span className="review-fact-detail">{fact.split(" — ")[1]}</span></div>)}</div></section>
}
function ReviewConsultation({ onConsult, onCallback }: { onConsult(): void; onCallback(): void }) {
  return <section className="final-cta review-consultation"><div><h2>Не уверены, какое оборудование или материал выбрать?</h2><p>Опишите задачу — специалист поможет определить подходящее направление.</p><div><button className="button button--light" type="button" onClick={onConsult}>Получить консультацию</button><button className="button" type="button" onClick={onCallback}>Заказать обратный звонок</button></div></div></section>
}
export function StyleCheckHomePage() {
  const [dialog, setDialog] = useState<'consultation' | 'callback' | null>(null)
  return <main className="review-home-v2"><h1 className="sr-only">Оборудование для автосервиса — Гараж</h1><ReviewHero /><ReviewCategories /><ReviewMerchandising /><ReviewBenefits /><ReviewBrands /><ReviewFeatures /><ReviewFeatures services /><ReviewAbout /><UsefulSection showAllLink={false} items={prototypeData.useful.filter(item => item.kind !== 'review' || prototypeData.config.showReviews)} /><ReviewConsultation onConsult={() => setDialog('consultation')} onCallback={() => setDialog('callback')} />{dialog && <ContactDialog mode={dialog} onClose={() => setDialog(null)} />}</main>
}
