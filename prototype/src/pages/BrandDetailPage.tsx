import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { remezaCategories, remezaFilterGroups, remezaProducts, remezaQuickTags } from '../data/brandDetailData'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogProductCard } from '../features/catalog/CatalogProductCard'
import { ProductListing } from '../features/catalog/ProductListing'
import { ContactDialog } from '../features/forms/ContactDialog'
import '../features/brands/BrandDetail.css'

const canonicalUrl = 'https://kcska18051-crypto.github.io/garage/brand/remeza/'
const metaDescription = 'Оборудование Remeza: категории, товары и материалы бренда в интерактивном прототипе магазина «Гараж».'

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

function BrandQuickTags() {
  const [params, setParams] = useSearchParams()
  const active = params.get('tag')
  const toggle = (group: string, value: string) => {
    const next = new URLSearchParams(params)
    const selected = `${group}:${value}`
    if (active === selected) next.delete('tag'); else next.set('tag', selected)
    next.delete('page')
    setParams(next)
  }
  return <section className="catalog-tags brand-quick-tags" aria-labelledby="brand-tags-title"><div className="catalog-tags__heading"><h2 id="brand-tags-title">Быстрый выбор по параметрам</h2></div><div className="catalog-tags__groups">{remezaQuickTags.map((group) => <div className="catalog-tag-group" key={group.id}><h3>{group.label}</h3><div>{group.values.map((tag) => <button type="button" key={tag.value} aria-label={`Тег ${tag.label}`} aria-pressed={active === `${group.id}:${tag.value}`} onClick={() => toggle(group.id, tag.value)}>{tag.label}</button>)}</div></div>)}</div></section>
}

export function BrandDetailPage() {
  const [consultationOpen, setConsultationOpen] = useState(false)
  useBrandMetadata()
  return <main className="brand-detail-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Бренды', to: '/brands' }, { label: 'Remeza' }]} />
    <header className="brand-detail-hero"><div className="brand-detail-hero__copy"><div className="brand-detail-logo" aria-label="Логотип Remeza">REMEZA</div><h1>Оборудование Remeza</h1><p>Компрессорное оборудование и компоненты для подготовки воздуха. Страница показывает будущую структуру каталога бренда; ассортимент и характеристики требуют сверки с данными клиента.</p><dl><div><dt>Страна бренда</dt><dd>Беларусь · демонстрационное значение</dd></div><div><dt>Статус и гарантия</dt><dd>Условия официального дилера и гарантии уточняются</dd></div></dl><a className="button button--dark" href="#brand-products">Перейти к товарам</a></div><div className="brand-detail-hero__art" aria-hidden="true"><span /><i /><b>R</b></div></header>

    <section className="brand-detail-section" aria-label="Категории товаров Remeza"><div className="brand-detail-heading"><h2>Категории товаров Remeza</h2><p>Активными сделаны только направления, связанные с существующей выдачей прототипа.</p></div><div className="brand-category-grid">{remezaCategories.map((category, index) => {
      const content = <><span>{String(index + 1).padStart(2, '0')}</span><div aria-hidden="true"><i /><b /></div><h3>{category.name}</h3><p>{category.description}</p>{category.href ? <strong aria-hidden="true">→</strong> : <small>Маршрут будет добавлен после согласования</small>}</>
      return category.href ? <Link key={category.id} to={category.href}>{content}</Link> : <article key={category.id}>{content}</article>
    })}</div></section>

    <section className="brand-detail-section brand-popular-products" aria-label="Популярные товары Remeza"><div className="brand-detail-heading brand-detail-heading--row"><h2>Популярные товары Remeza</h2><a href="#brand-products">Смотреть все товары Remeza</a></div><p className="brand-detail-note">Ассортимент, цены и наличие приведены для демонстрации структуры прототипа.</p><div className="brand-popular-products__grid">{remezaProducts.slice(0, 6).map((product, index) => <CatalogProductCard key={product.id} product={product} index={index} />)}</div></section>

    <section id="brand-products" className="brand-products" aria-label="Все товары Remeza"><div className="brand-detail-heading"><h2>Все товары бренда</h2><p>Для примера показана контекстная выдача компрессорного оборудования Remeza. Параметры других товарных групп будут подключаться отдельно.</p></div><BrandQuickTags /><ProductListing products={remezaProducts} filterGroups={remezaFilterGroups} mode="full" /></section>

    <section className="brand-about" aria-label="О бренде Remeza"><div><h2>О бренде Remeza</h2><p>Remeza представлен в прототипе как производитель компрессорного оборудования и решений для подготовки сжатого воздуха. Такой ассортимент применяется в мастерских, сервисных центрах и производственных системах.</p><p>Краткая история, страна производства отдельных серий, технологии и фактические преимущества будут уточнены по официальным материалам. До проверки этот текст не является утверждением о производителе.</p></div><dl><div><dt>Специализация</dt><dd>Компрессорное оборудование</dd></div><div><dt>Направления</dt><dd>Компрессоры, ресиверы, подготовка воздуха</dd></div><div><dt>Применение</dt><dd>Сервисные и производственные задачи</dd></div><div><dt>Страна и история</dt><dd>Данные требуют подтверждения</dd></div></dl></section>

    <section className="brand-detail-section brand-benefits" aria-label="Преимущества покупки Remeza в Гараже"><div className="brand-detail-heading"><h2>Преимущества покупки Remeza в Гараже</h2><p>Условный контент прототипа — каждое преимущество требует согласования клиентом.</p></div><div>{['Оригинальная продукция', 'Гарантия', 'Сервис', 'Помощь в подборе', 'Доставка', 'Работа с физическими и юридическими лицами'].map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3><p>Формулировка и условия требуют согласования.</p></article>)}</div></section>

    <section className="brand-detail-section brand-materials" aria-label="Документы и материалы"><div className="brand-detail-heading"><h2>Документы и материалы</h2><p>Раздел можно полностью скрыть, если подтверждённых материалов нет.</p></div><div>{['Сертификаты', 'Каталог производителя', 'Инструкции', 'Гарантийные документы'].map((item) => <article key={item}><h3>{item}</h3><p>Материал будет доступен после проверки и загрузки.</p><span>Условная карточка</span></article>)}</div></section>

    <section className="brand-detail-section brand-useful" aria-label="Полезные материалы о Remeza"><div className="brand-detail-heading"><h2>Полезные материалы о Remeza</h2><p>Скрываемый раздел для статей, обзоров и рекомендаций.</p></div><div>{['Как подобрать компрессор под рабочую задачу', 'Что учитывать при проектировании пневмосети', 'Подготовка воздуха: базовые компоненты'].map((item, index) => <Link key={item} to={`/articles/remeza-guide-${index + 1}`}><span>Материал · прототип</span><h3>{item}</h3><strong>Читать →</strong></Link>)}</div></section>

    <section className="brand-final-cta"><div><h2>Поможем подобрать оборудование Remeza под ваши задачи</h2><p>Опишите рабочий сценарий — специалист поможет определить подходящую конфигурацию.</p></div><button className="button" type="button" onClick={() => setConsultationOpen(true)}>Получить консультацию</button></section>
    {consultationOpen && <ContactDialog mode="consultation" onClose={() => setConsultationOpen(false)} />}
  </main>
}
