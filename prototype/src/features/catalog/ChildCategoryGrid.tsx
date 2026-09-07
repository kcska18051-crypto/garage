import { Link } from 'react-router-dom'
import type { CatalogChildSection } from '../../data/catalogTypes'

export function ChildCategoryGrid({ items }: { items?: CatalogChildSection[] }) {
  if (!items?.length) return null
  return <section className="catalog-child-sections" aria-label="Дочерние разделы">
    <div className="catalog-section-heading"><h2>Выберите тип оборудования</h2></div>
    <div className="catalog-child-sections__grid">{items.map((item, index) => <Link key={item.id} to={item.href}><span>{String(index + 1).padStart(2, '0')}</span><div className="catalog-child-sections__art" aria-hidden="true"><i /><b /></div><h3>{item.name}</h3><p>{item.description}</p><strong aria-hidden="true">→</strong></Link>)}</div>
  </section>
}
