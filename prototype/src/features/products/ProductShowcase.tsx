import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProductCollection } from '../../data/types'
import { ProductCard } from './ProductCard'
import './ProductCard.css'

export function ProductShowcase({ collections }: { collections: ProductCollection[] }) {
  const [selectedId, setSelectedId] = useState(collections[0]?.id)
  const railRef = useRef<HTMLDivElement>(null)
  const selected = collections.find((collection) => collection.id === selectedId) ?? collections[0]
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * .8, behavior: 'smooth' })
  if (!selected) return null
  return <section className="home-section product-showcase"><div className="section-heading section-heading--with-tabs"><div><h2>Подборки товаров</h2><div role="tablist" aria-label="Подборка товаров">{collections.map((collection) => <button key={collection.id} type="button" role="tab" aria-selected={collection.id === selected.id} onClick={() => setSelectedId(collection.id)}>{collection.label}</button>)}</div></div><div className="rail-actions"><Link to={selected.href}>Смотреть все</Link><button type="button" aria-label="Предыдущие товары" onClick={() => move(-1)}>←</button><button type="button" aria-label="Следующие товары" onClick={() => move(1)}>→</button></div></div><div className="product-grid" role="tabpanel" ref={railRef}>{selected.products.slice(0, 5).map((product, index) => <ProductCard key={`${selected.id}-${product.id}`} product={product} index={index} />)}</div></section>
}
