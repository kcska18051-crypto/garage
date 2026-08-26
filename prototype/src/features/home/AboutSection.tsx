import { Link } from 'react-router-dom'

export function AboutSection() {
  return <section className="home-section about-section"><div className="about-section__art" aria-hidden="true"><span /><i /><b /></div><div className="about-section__copy"><p className="eyebrow">О компании</p><h2>Знаем оборудование изнутри</h2><p>«Гараж» работает с профессиональным оборудованием, инструментом и материалами для автосервисов, кузовного ремонта и производственных задач.</p><Link className="button" to="/about">Подробнее о компании →</Link></div><div className="about-facts">{['Годы работы — данные клиента', 'Магазины — данные клиента', 'Направления — данные клиента', 'Бренды — данные клиента'].map((fact, index) => <div key={fact}><span>0{index + 1}</span><strong>{fact}</strong></div>)}</div></section>
}
