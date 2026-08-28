import { Link } from 'react-router-dom'

export type CatalogCardItem = { id: string; name: string; href: string; count: number; description: string; childNames?: string[] }

export function CatalogCategoryGrid({ items, compact = false }: { items: CatalogCardItem[]; compact?: boolean }) {
  return <div className={`catalog-category-grid${compact ? ' catalog-category-grid--compact' : ''}`}>{items.map((item, index) => <article className="catalog-category-card" key={item.id}><Link to={item.href} aria-label={`${item.name}, ${item.count} товаров`}><span className="catalog-category-card__number">{String(index + 1).padStart(2, '0')}</span><div className="catalog-category-card__art" aria-hidden="true"><i /><b /></div><h2>{item.name}</h2><p>{item.description}</p><strong>{item.count} товаров</strong>{item.childNames?.length ? <ul>{item.childNames.map((name) => <li key={name}>{name}</li>)}</ul> : null}<span className="catalog-category-card__arrow">↗</span></Link></article>)}</div>
}
