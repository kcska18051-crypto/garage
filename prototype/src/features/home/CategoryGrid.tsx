import { Link } from 'react-router-dom'
import type { Category } from '../../data/types'

export function CategoryGrid({ items }: { items: Category[] }) {
  return <section className="home-section"><div className="section-heading"><div><p className="eyebrow">Навигация по каталогу</p><h2>Популярные категории</h2></div><Link to="/catalog">Весь каталог →</Link></div><div className="category-grid">{items.map((item) => <Link key={item.id} className="category-card" to={item.href} aria-label={`Перейти в категорию ${item.name}`}><span className="category-card__code">{item.code}</span><div className="category-card__art" aria-hidden="true"><i /><b /></div><strong>{item.name}</strong><span className="category-card__arrow">↗</span></Link>)}</div></section>
}
