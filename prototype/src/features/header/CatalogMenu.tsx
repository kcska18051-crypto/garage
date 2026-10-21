import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { headerCatalogTree, type CatalogMenuNode } from './catalogMenuData'
import './CatalogMenu.css'

type Props = {
  header: RefObject<HTMLElement | null>
  opener: RefObject<HTMLElement | null>
  compact: boolean
  onClose(restoreFocus?: boolean): void
}

export function CatalogMenu({ header, opener, compact, onClose }: Props) {
  const [active, setActive] = useState(headerCatalogTree[0].id)
  const [path, setPath] = useState<CatalogMenuNode[]>([])
  const [narrow, setNarrow] = useState(() => innerWidth < 768)
  const [top, setTop] = useState(0)
  const panel = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const current = path.at(-1)
  const selected = headerCatalogTree.find(node => node.id === active) ?? headerCatalogTree[0]

  useLayoutEffect(() => {
    const measure = () => {
      setNarrow(innerWidth < 768)
      const anchor = compact ? header.current?.querySelector('.desktop-header--compact') : header.current
      setTop(Math.max(0, Math.min(anchor?.getBoundingClientRect().bottom ?? 0, innerHeight - 120)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (header.current) observer.observe(header.current)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure)
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure) }
  }, [header, compact])

  useEffect(() => {
    const previous = { paddingRight: document.body.style.paddingRight }
    const gap = innerWidth - document.documentElement.clientWidth
    if (gap > 0) document.body.style.paddingRight = `${gap + parseFloat(getComputedStyle(document.body).paddingRight || '0')}px`
    document.body.classList.add('catalog-overlay-open')
    panel.current?.querySelector<HTMLButtonElement>('[aria-label="Закрыть каталог"]')?.focus({ preventScroll: true })
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]') ?? []).filter(node => node.getClientRects().length > 0)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return }
      if (event.key !== 'Tab') return
      const nodes = focusable()
      if (!narrow && opener.current?.getClientRects().length) nodes.unshift(opener.current)
      const index = nodes.indexOf(document.activeElement as HTMLElement)
      const next = event.shiftKey ? (index <= 0 ? nodes.length - 1 : index - 1) : (index + 1) % nodes.length
      event.preventDefault()
      nodes[next]?.focus()
    }
    const outside = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panel.current?.contains(target) && !opener.current?.contains(target)) onClose(!header.current?.contains(target))
    }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('pointerdown', outside)
    return () => {
      Object.assign(document.body.style, previous)
      document.body.classList.remove('catalog-overlay-open')
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('pointerdown', outside)
    }
  }, [onClose, narrow, opener, header])

  useLayoutEffect(() => {
    if (narrow) title.current?.focus({ preventScroll: true })
    if (scroll.current) scroll.current.scrollTop = 0
  }, [path, active, narrow])

  const link = (node: CatalogMenuNode, className?: string) => <Link className={className} key={node.id} to={node.href} onClick={() => onClose(false)}>{node.name}</Link>
  return createPortal(<div className="catalog-menu-layer" style={{ '--catalog-menu-top': `${top}px` } as React.CSSProperties}>
    <div className="catalog-menu-backdrop" aria-hidden="true" />
    <section className="catalog-mega" id="header-catalog-panel" role="dialog" aria-modal="true" aria-label="Каталог товаров" ref={panel}>
      <div className="catalog-mega__toolbar">
        {narrow && current ? <button type="button" onClick={() => setPath(items => items.slice(0, -1))}><span aria-hidden="true">← </span><span>Назад</span></button> : <Link to="/catalog" onClick={() => onClose(false)}>Весь каталог →</Link>}
        <button type="button" aria-label="Закрыть каталог" onClick={() => onClose()}>×</button>
      </div>
      {narrow ? <>
        <h2 className="catalog-mega__mobile-title" tabIndex={-1} ref={title}>{current?.name ?? 'Каталог'}</h2>
        <div className="catalog-mega__mobile-body" ref={scroll}>
          {current && <Link className="catalog-mega__all" to={current.href} onClick={() => onClose(false)}>Все товары раздела →</Link>}
          <nav aria-label="Разделы каталога">
            {(current?.children ?? headerCatalogTree).map(node => node.children.length || !current
              ? <button className="catalog-mega__step" type="button" key={node.id} onClick={() => setPath(items => [...items, node])}>{node.name}<span aria-hidden="true">→</span></button>
              : link(node, 'catalog-mega__step'))}
          </nav>
        </div>
      </> : <div className="catalog-mega__layout">
        <nav className="catalog-mega__roots" aria-label="Направления каталога">
          {headerCatalogTree.map(node => <button type="button" key={node.id} aria-pressed={active === node.id} aria-controls="catalog-mega-details" onClick={() => setActive(node.id)}>{node.name}<span aria-hidden="true">→</span></button>)}
        </nav>
        <div className="catalog-mega__details" id="catalog-mega-details" ref={scroll}>
          <h2>{selected.name}</h2>
          <Link className="catalog-mega__all" to={selected.href} onClick={() => onClose(false)}>Все товары раздела →</Link>
          <nav className="catalog-mega__groups" aria-label={`Подкатегории: ${selected.name}`}>
            {selected.children.map(node => <div className="catalog-mega__group" key={node.id}>
              {link(node, 'catalog-mega__group-title')}
              {node.children.length > 0 && <ul>{node.children.map(child => <li key={child.id}>{link(child)}</li>)}</ul>}
            </div>)}
          </nav>
        </div>
      </div>}
    </section>
  </div>, document.body)
}
