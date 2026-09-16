import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatProductCount } from '../../data/catalogData'
import type { CatalogRootCategory } from '../../data/catalogTypes'

export function CatalogRootCard({ category }: { category: CatalogRootCategory }) {
  const [expanded, setExpanded] = useState(false)
  const extraId = useId()
  const primary = category.subcategories.slice(0, 5)
  const extra = category.subcategories.slice(5)

  return (
    <article className="catalog-root-card" data-testid="catalog-root-card">
      <div className={`catalog-root-card__art catalog-art--${category.artVariant}`} aria-hidden="true">
        <i />
        <b />
      </div>
      <Link className="catalog-root-card__title" to={category.href}>{category.name}</Link>
      <p className="catalog-root-card__count">{formatProductCount(category.count)}</p>
      <ul className="catalog-root-card__links">
        {primary.map((item) => <li key={item.id}><Link to={item.href}>{item.name}</Link></li>)}
      </ul>
      {extra.length > 0 ? (
        <>
          <ul className="catalog-root-card__links catalog-root-card__links--extra" id={extraId} hidden={!expanded}>
            {extra.map((item) => <li key={item.id}><Link to={item.href}>{item.name}</Link></li>)}
          </ul>
          <button
            className="catalog-root-card__toggle"
            type="button"
            aria-expanded={expanded}
            aria-controls={extraId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Свернуть' : `Ещё ${extra.length} категорий`}
          </button>
        </>
      ) : null}
    </article>
  )
}
