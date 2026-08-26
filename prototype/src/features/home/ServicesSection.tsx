import { Link } from 'react-router-dom'
import type { Service } from '../../data/types'

export function ServicesSection({ items }: { items: Service[] }) {
  return <section className="home-section services"><div className="section-heading"><div><p className="eyebrow">Экспертные направления</p><h2>Услуги</h2></div><Link to="/services">Все услуги →</Link></div><div className="service-cards">{items.map((item, index) => <article key={item.id}><div className={`service-cards__art art-${index}`} aria-hidden="true"><span /><i /></div><div><p className="eyebrow">0{index + 1} / Услуга</p><h3>{item.name}</h3><p>{item.text}</p><Link className="button" to={item.href}>{item.cta} →</Link></div></article>)}</div></section>
}
