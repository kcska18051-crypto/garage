import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogChildSection } from '../../data/catalogTypes'

export function ChildCategoryGrid({ items }: { items?: CatalogChildSection[] }) {
  const [expanded, setExpanded] = useState(false)
  if (!items?.length) return null
  const visibleItems = expanded ? items : items.slice(0, 4)
  return <section className="catalog-child-sections" aria-label="Дочерние разделы">
    <div className="catalog-section-heading"><h2>Выберите тип оборудования</h2></div>
    <div id="catalog-child-sections-grid" className="catalog-child-sections__grid">{visibleItems.map((item, index) => <Link key={item.id} to={item.href}><span>{String(index + 1).padStart(2, '0')}</span><div className="catalog-child-sections__art" aria-hidden="true"><i /><b /></div><h3>{item.name}</h3>{item.count ? <small>{item.count} товаров</small> : null}<strong aria-hidden="true">→</strong></Link>)}</div>
    {items.length > 4 ? <button className="catalog-child-sections__more" type="button" aria-controls="catalog-child-sections-grid" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Свернуть' : `Показать ещё ${items.length - 4}`}</button> : null}
  </section>
}
