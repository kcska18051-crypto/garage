import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { aboutCities,aboutFigures,aboutRequisites } from '../data/aboutData'
import { footerContacts } from '../data/footerContacts'
import { prototypeData } from '../data/prototypeData'
import { ReviewBrands } from './StyleCheckHomePage'
import { CompanyAdvantages } from './CompanyAdvantages'
import { UsefulSection } from '../features/home/UsefulSection'
import '../features/home/NavigationSections.css'
import '../features/home/LowerSections.css'
import './AboutPage.css'

function AboutSocialIcon({name}:{name:string}) {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">{name==='Telegram'?<path fill="currentColor" d="m21.6 3.3-3.4 17c-.3 1.2-1 1.5-2 .9l-5.1-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.2L17.5 6.5c.4-.4-.1-.6-.6-.3L5.2 13.6.2 12c-1.1-.3-1.1-1.1.3-1.6L20 2.9c.9-.3 1.7.2 1.6.4Z"/>:name==='Rutube'?<><rect x="1" y="4" width="22" height="16" rx="5" fill="currentColor"/><path d="m10 8 7 4-7 4Z" fill="white"/><circle cx="21" cy="4" r="3" fill="#c92f29"/></>:<path fill="currentColor" d="M3 5h4c.2 5 1.5 8 3 9V5h4v5c1.6-.2 3.1-2.7 3.7-5H22c-.7 3-2.7 5.4-4.1 6.6 1.5 1 3.8 3.2 4.7 6.4h-4.3c-.7-2.1-2.3-4-4.3-4.3V18h-1.1C6 18 3.3 13.3 3 5Z"/>}</svg>
}

export function AboutPage() {
  return <main className="about-page review-home-v2">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'О компании' }]} />
    <header className="about-intro">
      <div><h1>О компании</h1><p className="about-lead">«Гараж» — магазин оборудования, инструмента и материалов для профессиональной мастерской.</p><p>Здесь можно собрать решения для автосервиса, кузовного ремонта и оснащения рабочего поста — от отдельного инструмента до комплекта оборудования.</p><p>Работаем для специалистов, владельцев мастерских и тех, кто обслуживает автомобили самостоятельно.</p></div>
      <img className="about-company-image" src="/garage/style-check/review-assets/about-company-workshop.png" alt="Оборудование и инструмент в профессиональной мастерской" width="1536" height="1024" decoding="async" fetchPriority="high" />
    </header>
    <section className="company-about-section" aria-labelledby="about-figures-title"><div className="company-about-section-heading"><h2 id="about-figures-title">Компания в цифрах</h2></div><ul className="about-figures">{aboutFigures.map(figure=><li key={figure.label}><strong>{figure.value}</strong><span>{figure.label}</span></li>)}</ul></section>
    <CompanyAdvantages />
    <ReviewBrands />
    <section className="company-about-section" aria-labelledby="about-cities-title"><div className="company-about-section-heading"><h2 id="about-cities-title">География присутствия</h2></div><div className="about-cities">{aboutCities.map(city=><Link key={city} to={`/contacts?city=${encodeURIComponent(city)}`}><span className="about-city-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span><strong>{city}</strong><span aria-hidden="true">↗</span></Link>)}</div><p className="about-caption">Выберите город, чтобы посмотреть контактные точки и карту.</p></section>
    <UsefulSection title="Новости" showAllLink={false} items={prototypeData.useful.filter(item => item.kind === 'news')} />
    <section className="company-about-section" aria-labelledby="about-social-title"><div className="company-about-section-heading"><h2 id="about-social-title">Наши соцсети</h2></div><ul className="about-social">{footerContacts.social.map(item=><li key={item.label}><span className="about-social-icon"><AboutSocialIcon name={item.label}/></span><div><strong>{item.label}</strong>{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">Перейти в {item.label} ↗</a> : <p>Официальная ссылка уточняется</p>}</div></li>)}</ul></section>
    <section className="company-about-section" aria-labelledby="about-requisites-title"><div className="company-about-section-heading"><h2 id="about-requisites-title">Реквизиты</h2></div><p className="about-caption about-requisites-note">Юридические и банковские данные будут опубликованы после подтверждения.</p><dl className="about-requisites">{aboutRequisites.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
  </main>
}
