import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { compareCategories, compareProducts, demoCompareIds, money, type CompareProduct } from '../data/compareData'
import { useCommerce } from '../state/CommerceState'
import './ComparePage.css'

function CompareCard({ product, index, onRemove }: { product: CompareProduct; index: number; onRemove: () => void }) {
  const commerce = useCommerce()
  return <article className="compare-card" data-testid="compare-product-card">
    <button className="compare-card__remove" type="button" aria-label={`Убрать из сравнения: ${product.name}`} onClick={onRemove}>×</button>
    <Link className={`compare-card__media compare-card__media--${index % 4}`} to={product.href} aria-label={`Открыть товар: ${product.name}`}><i /><b /></Link>
    <Link className="compare-card__name" to={product.href}>{product.name}</Link>
    <p>Артикул: {product.sku}</p>
    <p className="compare-card__availability"><i />{product.availability}</p>
    <div className="compare-card__price">{product.oldPrice ? <del>{money(product.oldPrice)}</del> : null}<strong>{money(product.price)}</strong></div>
    <button className="compare-card__cart" type="button" onClick={() => commerce.addToCart(product.id)}>{commerce.cartIds.has(product.id) ? 'В корзине' : 'В корзину'}</button>
  </article>
}

export function ComparePage() {
  const commerce = useCommerce()
  const [activeCategory, setActiveCategory] = useState<(typeof compareCategories)[number]['id']>('compressors')
  const [onlyDifferences, setOnlyDifferences] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  useEffect(() => commerce.ensureDemoCompare(demoCompareIds), [])

  const selectedProducts = compareProducts.filter((product) => commerce.compareIds.has(product.id))
  const categoryCounts = Object.fromEntries(compareCategories.map((category) => [category.id, selectedProducts.filter((product) => product.categoryId === category.id).length]))
  const visibleProducts = selectedProducts.filter((product) => product.categoryId === activeCategory)
  const candidates = compareProducts.filter((product) => product.categoryId === activeCategory && !commerce.compareIds.has(product.id))
  const specNames = useMemo(() => {
    const names = [...new Set(visibleProducts.flatMap((product) => Object.keys(product.specs)))]
    return onlyDifferences ? names.filter((name) => new Set(visibleProducts.map((product) => product.specs[name] ?? '—')).size > 1) : names
  }, [onlyDifferences, visibleProducts])
  const activeIds = visibleProducts.map((product) => product.id)

  return <main className="compare-page container">
    <nav className="compare-breadcrumbs" aria-label="Хлебные крошки"><Link to="/">Главная</Link><span>/</span><span>Сравнение товаров</span></nav>
    <header className="compare-heading"><div><h1>Сравнение товаров</h1><p>Сопоставьте параметры и выберите подходящий вариант.</p></div>{commerce.compareIds.size ? <button type="button" onClick={() => commerce.clearCompare()}>Очистить всё</button> : null}</header>

    <div className="compare-tabs" role="tablist" aria-label="Категории сравнения">
      {compareCategories.map((category) => <button key={category.id} role="tab" aria-selected={activeCategory === category.id} onClick={() => { setActiveCategory(category.id); setPickerOpen(false) }}>{category.label} <span>{categoryCounts[category.id] ?? 0}</span></button>)}
    </div>

    <section className="compare-toolbar" aria-label="Настройки сравнения">
      <label><input type="checkbox" checked={onlyDifferences} onChange={(event) => setOnlyDifferences(event.target.checked)} />Показывать только различия</label>
      <div><button type="button" onClick={() => setPickerOpen((open) => !open)}>Добавить товар</button><button type="button" onClick={() => commerce.clearCompare(activeIds)} disabled={!activeIds.length}>Очистить категорию</button></div>
    </section>

    {pickerOpen ? <section className="compare-picker" aria-label="Добавление товара"><div><h2>Добавить в сравнение</h2><button type="button" aria-label="Закрыть выбор товара" onClick={() => setPickerOpen(false)}>×</button></div>{candidates.length ? <div className="compare-picker__items">{candidates.map((product) => <button type="button" key={product.id} aria-label={`Добавить ${product.name}`} onClick={() => { commerce.addCompare(product.id); setPickerOpen(false) }}><span className="compare-picker__art" aria-hidden="true" /><span><strong>{product.name}</strong><small>{product.sku} · {money(product.price)}</small></span><b aria-hidden="true">＋</b></button>)}</div> : <p>Все доступные демонстрационные товары этой категории уже добавлены.</p>}</section> : null}

    {visibleProducts.length ? <>
      <div className="compare-scroll" data-testid="compare-scroll-area">
        <div className="compare-products" style={{ '--compare-count': visibleProducts.length } as CSSProperties}>{visibleProducts.map((product, index) => <CompareCard key={product.id} product={product} index={index} onRemove={() => commerce.removeCompare(product.id)} />)}</div>
        <table className="compare-table" aria-label="Сравнение характеристик">
          <tbody>{specNames.map((name) => <tr key={name}><th scope="row">{name}</th>{visibleProducts.map((product) => <td key={product.id}>{product.specs[name] ?? '—'}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p className="compare-swipe-hint">← Проведите в сторону, чтобы увидеть другие товары →</p>
    </> : <section className="compare-empty"><span aria-hidden="true">≡</span><h2>В этой категории пока нет товаров</h2><p>Добавьте товары кнопкой выше, чтобы сравнить их характеристики рядом.</p></section>}
  </main>
}
