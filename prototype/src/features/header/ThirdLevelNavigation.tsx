import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getVisibleHeaderQuickLinks, headerQuickLinksConfig, type HeaderQuickLink, type HeaderQuickLinksConfig } from '../../data/headerNavigationData'

function QuickLink({ item, onClick }: { item: HeaderQuickLink; onClick?: () => void }) {
  return <NavLink className={`third-level-nav__link${item.tone === 'accent' ? ' third-level-nav__link--accent' : ''}`} to={item.href} onClick={onClick}>{item.label}</NavLink>
}

export function ThirdLevelNavigation({ compact, config = headerQuickLinksConfig }: { compact: boolean; config?: HeaderQuickLinksConfig }) {
  const desktopItems = useMemo(() => getVisibleHeaderQuickLinks(config), [config])
  const mobileItems = useMemo(() => getVisibleHeaderQuickLinks(config, true), [config])
  const [visibleCount, setVisibleCount] = useState(desktopItems.length)
  const [moreOpen, setMoreOpen] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const moreAreaRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = desktopRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const update = () => {
      const linkWidths = [...measure.querySelectorAll<HTMLElement>('[data-measure-link]')].map((link) => link.getBoundingClientRect().width)
      const moreWidth = measure.querySelector<HTMLElement>('[data-measure-more]')?.getBoundingClientRect().width ?? 0
      const gap = Number.parseFloat(getComputedStyle(measure).columnGap) || 0
      const available = container.clientWidth
      const completeWidth = linkWidths.reduce((sum, width) => sum + width, 0) + Math.max(0, linkWidths.length - 1) * gap

      if (completeWidth <= available) {
        setVisibleCount(linkWidths.length)
        return
      }

      let used = 0
      let count = 0
      for (const width of linkWidths) {
        const candidate = used + (count > 0 ? gap : 0) + width + gap + moreWidth
        if (candidate > available) break
        used += (count > 0 ? gap : 0) + width
        count += 1
      }
      setVisibleCount(Math.max(1, count))
    }

    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [desktopItems])

  useEffect(() => {
    if (!moreOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMoreOpen(false) }
    const closeOutside = (event: PointerEvent) => { if (!moreAreaRef.current?.contains(event.target as Node)) setMoreOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('pointerdown', closeOutside)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('pointerdown', closeOutside)
    }
  }, [moreOpen])

  useEffect(() => {
    if (compact) setMoreOpen(false)
  }, [compact])

  if (!config.enabled) return null
  const primaryItems = desktopItems.slice(0, visibleCount)
  const overflowItems = desktopItems.slice(visibleCount)

  return <div className={`third-level-nav${compact ? ' third-level-nav--compact' : ''}${config.mobileEnabled ? '' : ' third-level-nav--mobile-disabled'}`}>
    <div className="third-level-nav__desktop" ref={desktopRef}>
      <nav aria-label="Быстрые ссылки">
        {primaryItems.map((item) => <QuickLink key={item.id} item={item} />)}
        {overflowItems.length > 0 && <div className="third-level-nav__more" ref={moreAreaRef}>
          <button type="button" aria-expanded={moreOpen} aria-haspopup="true" onClick={() => setMoreOpen((open) => !open)}>Ещё <span aria-hidden="true">⌄</span></button>
          {moreOpen && <nav aria-label="Дополнительные быстрые ссылки">{overflowItems.map((item) => <QuickLink key={item.id} item={item} onClick={() => setMoreOpen(false)} />)}</nav>}
        </div>}
      </nav>
      <div className="third-level-nav__measure" ref={measureRef} aria-hidden="true">
        {desktopItems.map((item) => <span key={item.id} data-measure-link>{item.label}</span>)}
        <span data-measure-more>Ещё ⌄</span>
      </div>
    </div>
    {config.mobileEnabled && <nav className="third-level-nav__mobile" aria-label="Быстрые ссылки на мобильных">
      {mobileItems.map((item) => <QuickLink key={item.id} item={item} />)}
    </nav>}
  </div>
}
