import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { aboutCities,aboutFigures,aboutRequisites,aboutSocialPlaces } from '../data/aboutData'
import { prototypeData } from '../data/prototypeData'
import { ReviewBenefits, ReviewBrands } from './StyleCheckHomePage'
import { UsefulSection } from '../features/home/UsefulSection'
import '../features/home/NavigationSections.css'
import '../features/home/LowerSections.css'
import './AboutPage.css'

export function AboutPage() {
  return <main className="about-page review-home-v2">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'О компании' }]} />
    <header className="about-intro">
      <div><h1>О компании</h1><p className="about-lead">«Гараж» — магазин оборудования, инструмента и материалов для профессиональной мастерской.</p><p>Здесь можно собрать решения для автосервиса, кузовного ремонта и оснащения рабочего поста — от отдельного инструмента до комплекта оборудования.</p><p>Работаем для специалистов, владельцев мастерских и тех, кто обслуживает автомобили самостоятельно.</p></div>
      <img className="about-company-image" src="/garage/style-check/review-assets/about-company-workshop.png" alt="Оборудование и инструмент в профессиональной мастерской" />
    </header>
    <section className="company-about-section" aria-labelledby="about-figures-title"><div className="company-about-section-heading"><h2 id="about-figures-title">Компания в цифрах</h2></div><ul className="about-figures">{aboutFigures.map(figure=><li key={figure}><strong>{figure}</strong></li>)}</ul></section>
    <ReviewBenefits />
    <ReviewBrands />
    <section className="company-about-section" aria-labelledby="about-cities-title"><div className="company-about-section-heading"><h2 id="about-cities-title">География присутствия</h2></div><div className="about-cities">{aboutCities.map(city=><Link key={city} to={`/contacts?city=${encodeURIComponent(city)}`}><span className="about-city-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span><strong>{city}</strong><span aria-hidden="true">↗</span></Link>)}</div><p className="about-caption">Выберите город, чтобы посмотреть контактные точки и карту.</p></section>
    <UsefulSection showAllLink={false} items={prototypeData.useful.filter(item => item.kind !== 'review' || prototypeData.config.showReviews)} />
    <section className="company-about-section" aria-labelledby="about-social-title"><div className="company-about-section-heading"><h2 id="about-social-title">Наши соцсети</h2></div><ul className="about-social">{aboutSocialPlaces.map((name,index)=><li key={name}><span className="about-social-icon" aria-hidden="true">0{index+1}</span><div><strong>{name}</strong><p>Ссылка будет добавлена</p></div></li>)}</ul></section>
    <section className="company-about-section" aria-labelledby="about-requisites-title"><div className="company-about-section-heading"><h2 id="about-requisites-title">Реквизиты</h2></div><dl className="about-requisites">{aboutRequisites.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
  </main>
}
