import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { ProductCard } from './ProductCard'
import './ProductCard.css'

export function ProductShowcase({ products }: { products: Product[] }) {
  return <section className="home-section product-showcase"><div className="section-heading"><div><p className="eyebrow">Товарная подборка</p><h2>Новинки</h2></div><Link to="/new">Все новинки →</Link></div><div className="product-grid">{products.slice(0, 10).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div></section>
}
