import { Link } from 'react-router-dom'
import type { CatalogRootSubcategory } from '../../data/catalogTypes'

export function CatalogSectionList({ items, className = '' }: { items: CatalogRootSubcategory[]; className?: string }) {
  return (
    <nav className={`catalog-section-list ${className}`.trim()} aria-label="Подкатегории">
      {items.map((item) => (
        <Link className="catalog-section-row" data-testid="catalog-section-row" key={item.id} to={item.href}>
          <span className={`catalog-row-art catalog-art--${item.artVariant}`} aria-hidden="true"><i /><b /></span>
          <span>{item.name}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ))}
    </nav>
  )
}
