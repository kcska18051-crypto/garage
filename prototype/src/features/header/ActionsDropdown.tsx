import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { activeActions } from '../../data/actionsData'
import { RoundedIcon } from './RoundedIcon'
import './ActionsDropdown.css'

export function ActionsDropdown({ drawer = false, mobile = false, onNavigate }: { drawer?: boolean; mobile?: boolean; onNavigate?(): void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLElement>(null)
  const [top, setTop] = useState(0)
  const id = useId()
  const location = useLocation()
  const close = () => setOpen(false)
  const navigate = () => { close(); onNavigate?.() }
  const blur = (event: FocusEvent) => {
    if (!root.current?.contains(event.relatedTarget) && !list.current?.contains(event.relatedTarget)) close()
  }
  useEffect(close, [location])
  useEffect(() => {
    if (!open) return
    if (mobile && !drawer) setTop((root.current?.getBoundingClientRect().bottom ?? 120) + 6)
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node) && !list.current?.contains(event.target as Node)) close()
    }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open, mobile, drawer])
  const panel = open && <nav ref={list} id={id} className={`actions-dropdown__list${drawer ? ' actions-dropdown__list--drawer' : mobile ? ' actions-dropdown__list--touch' : ''}`} style={mobile && !drawer ? { top } : undefined} aria-label="Действующие акции" onBlur={blur}>
    {activeActions().map(action => <Link key={action.id} to={`/actions/${action.slug}`} onClick={navigate}>{action.title}</Link>)}
    <Link className="actions-dropdown__all" to="/actions" onClick={navigate}>Все акции</Link>
  </nav>
  return <div ref={root} className={`header-actions-menu${drawer ? ' header-actions-menu--drawer' : ''}`} onMouseEnter={() => { if (!drawer && (window.matchMedia?.('(hover: hover)').matches ?? true)) setOpen(true) }} onMouseLeave={() => { if (!drawer && (window.matchMedia?.('(hover: hover)').matches ?? true)) close() }} onBlur={blur}>
    <div className="actions-dropdown__row">
      <NavLink className={drawer ? 'actions-dropdown__main' : 'third-level-nav__link third-level-nav__link--accent'} to="/actions" onClick={navigate} onFocus={() => { if (!drawer && !mobile) setOpen(true) }}>{drawer && <RoundedIcon name="sale" />}<span>Акции</span></NavLink>
      <button className="actions-dropdown__toggle" type="button" aria-label="Показать список акций" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(value => !value)}><span aria-hidden="true">⌄</span></button>
    </div>
    {mobile && !drawer ? createPortal(panel, document.body) : panel}
  </div>
}
