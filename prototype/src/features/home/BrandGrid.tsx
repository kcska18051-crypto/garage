import { Link } from 'react-router-dom'
import type { Brand } from '../../data/types'

export function BrandGrid({ items }: { items: Brand[] }) {
  return <section className="home-section home-section--brands"><div className="section-heading"><div><p className="eyebrow">Производители</p><h2>Популярные бренды</h2></div><Link to="/brands">Все бренды</Link></div><div className="brand-grid">{items.map((item, index) => <Link key={item.id} to={item.href}><span className={`brand-symbol brand-symbol--${index % 4}`} aria-hidden="true" />{item.name}</Link>)}</div></section>
}
