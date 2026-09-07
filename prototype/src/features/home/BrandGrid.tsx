import { Link } from 'react-router-dom'
import type { Brand } from '../../data/types'

export function BrandGrid({ items }: { items: Brand[] }) {
  return <section className="home-section home-section--brands"><div className="section-heading"><div><h2>Популярные бренды</h2></div><Link to="/brands">Все бренды</Link></div><div className="brand-grid">{items.map((item, index) => <div key={item.id}><span className={`brand-symbol brand-symbol--${index % 4}`} aria-hidden="true" />{item.name}</div>)}</div></section>
}
