import { Link } from 'react-router-dom'
import { formatProductCount } from '../../data/catalogData'
import type { CatalogRootSubcategory } from '../../data/catalogTypes'

type SectionItem = CatalogRootSubcategory & { count?: number }

function itemCount(item: SectionItem) {
  return typeof item.count === 'number' ? formatProductCount(item.count) : null
}

export function CatalogSectionGrid({ items }: { items: SectionItem[] }) {
  return (
    <nav className="catalog-subcategory-grid" aria-label="Подкатегории">
      {items.map((item) => {
        const count = itemCount(item)
        return (
          <Link aria-label={count ? `${item.name}, ${count}` : item.name} className="catalog-subcategory-card" data-testid="catalog-subcategory-card" key={item.id} to={item.href}>
            <span className="catalog-subcategory-card__copy"><strong>{item.name}</strong>{count ? <small>{count}</small> : null}</span>
            <span className={`catalog-subcategory-card__art catalog-art--${item.artVariant}`} aria-hidden="true"><i /><b /></span>
            <span className="catalog-subcategory-card__arrow" aria-hidden="true">↗</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function CatalogSectionList({ items, className = '' }: { items: SectionItem[]; className?: string }) {
  return (
    <nav className={`catalog-section-list ${className}`.trim()} aria-label="Подкатегории">
      {items.map((item) => (
        <Link className="catalog-section-row" data-testid="catalog-section-row" key={item.id} to={item.href}>
          <span className={`catalog-row-art catalog-art--${item.artVariant}`} aria-hidden="true"><i /><b /></span>
          <span>{item.name}{itemCount(item) ? <small>{itemCount(item)}</small> : null}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ))}
    </nav>
  )
}
