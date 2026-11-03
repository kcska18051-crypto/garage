import { Link } from 'react-router-dom'
import type { CatalogChildSection } from '../../data/catalogTypes'

export function ChildCategoryGrid({ items }: { items?: CatalogChildSection[] }) {
  if (!items?.length) return null
  return <section className="catalog-child-sections" aria-label="Дочерние разделы">
    <div id="catalog-child-sections-grid" className="catalog-child-sections__grid">{items.map((item) => <Link key={item.id} to={item.href}><div className="catalog-child-sections__art" aria-hidden="true"><img src="/garage/style-check/review-assets/product-remeza1.jpg" alt="" loading="lazy" /></div><h3>{item.name}</h3>{item.count ? <small>{item.count} товаров</small> : null}</Link>)}</div>
  </section>
}
