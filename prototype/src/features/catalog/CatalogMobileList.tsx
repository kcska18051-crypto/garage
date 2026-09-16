import { Link } from 'react-router-dom'
import type { CatalogRootCategory } from '../../data/catalogTypes'

export function CatalogMobileList({ items }: { items: CatalogRootCategory[] }) {
  return (
    <nav className="catalog-root-mobile" aria-label="Категории каталога">
      {items.map((item) => (
        <Link className="catalog-root-row" data-testid="catalog-mobile-row" key={item.id} to={item.href}>
          <span className={`catalog-row-art catalog-art--${item.artVariant}`} aria-hidden="true"><i /><b /></span>
          <span>{item.name}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ))}
    </nav>
  )
}
