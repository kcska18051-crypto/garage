import { isApprovedHomepage } from '../../app/approvedHomepage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CatalogMenu } from './CatalogMenu'
import { usePinnedHeaderHeight } from '../../hooks/usePinnedHeaderHeight'
import { useScrollThreshold } from '../../hooks/useScrollThreshold'
import { DesktopHeader, type HeaderCounts } from './DesktopHeader'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileHeader } from './MobileHeader'
import { RegionDialog } from './RegionDialog'
import { RegionConfirmation } from './RegionConfirmation'
import { useRegion } from '../../state/RegionState'
import { ThirdLevelNavigation } from './ThirdLevelNavigation'
import { compactHeaderScrollThreshold } from '../../data/headerNavigationData'
import './Header.css'

export function Header({ counts, customerName }: { counts: HeaderCounts; customerName?: string }) {
  const { region, setRegion, needsConfirmation } = useRegion()
  const [regionOpen, setRegionOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [catalogHovered, setCatalogHovered] = useState(false)
  const catalogCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const keepCatalogOpen = useCallback(() => {
    if (catalogCloseTimer.current !== null) clearTimeout(catalogCloseTimer.current)
    catalogCloseTimer.current = null
  }, [])
  const [menuOpen, setMenuOpen] = useState(false)
  const compact = useScrollThreshold(compactHeaderScrollThreshold)
  const showBackToTop = useScrollThreshold(500)
  const header=useRef<HTMLElement>(null)
  const opener=useRef<HTMLElement>(null)
  const location=useLocation()
  usePinnedHeaderHeight(header,compact)
  const toggleMenu = useCallback(() => setMenuOpen((value) => !value), [])
  const closeCatalog = useCallback((restoreFocus = true) => {
    keepCatalogOpen()
    setCatalogHovered(false)
    setCatalogOpen(false)
    if (restoreFocus) requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLElement>(innerWidth < 768 ? '.mobile-bottom-nav [aria-label="Каталог"]' : '.catalog-button')
      ;(opener.current?.getClientRects().length ? opener.current : fallback)?.focus({ preventScroll: true })
    })
  }, [keepCatalogOpen])
  const leaveCatalog = useCallback(() => {
    if (!catalogHovered) return
    keepCatalogOpen()
    catalogCloseTimer.current = setTimeout(() => closeCatalog(false), 300)
  }, [catalogHovered, closeCatalog, keepCatalogOpen])
  useEffect(() => keepCatalogOpen, [keepCatalogOpen])
  const hoverCatalog = (button: HTMLButtonElement) => {
    if (!(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false)) return
    keepCatalogOpen()
    if (catalogOpen) return
    opener.current = button
    setCatalogHovered(true)
    setMenuOpen(false); setRegionOpen(false); setCatalogOpen(true)
  }
  const toggleCatalog = () => {
    keepCatalogOpen()
    if (catalogOpen && catalogHovered) { setCatalogHovered(false); return }
    if (catalogOpen) { closeCatalog(); return }
    setCatalogHovered(false)
    opener.current=document.activeElement as HTMLElement
    // The mobile-menu opener is unmounted when the drawer replaces that menu.
    if (opener.current?.closest('.mobile-menu')) opener.current=document.querySelector('.mobile-bottom-nav [aria-label="Каталог"]')
    setMenuOpen(false); setRegionOpen(false); setCatalogOpen(true)
  }
  const openRegion = () => { closeCatalog(false); setMenuOpen(false); setRegionOpen(true) }
  useEffect(() => { keepCatalogOpen(); setCatalogHovered(false); setCatalogOpen(false); setMenuOpen(false); setRegionOpen(false) }, [location, keepCatalogOpen])
  return <>
    <header className="site-header" ref={header} onFocusCapture={event => { if ((event.target as HTMLElement).closest('.search-box')) { closeCatalog(false); setRegionOpen(false); setMenuOpen(false) } }}>
      <DesktopHeader customerName={customerName} region={region} onRegion={openRegion} counts={counts} compact={compact} catalogOpen={catalogOpen} onCatalog={toggleCatalog} onCatalogHover={hoverCatalog} onCatalogLeave={leaveCatalog} searchSuspended={catalogOpen || regionOpen || menuOpen} />
      <MobileHeader compact={compact} compareCount={counts.compare} region={region} onRegion={openRegion} menuOpen={menuOpen} onMenu={toggleMenu} onCatalog={toggleCatalog} searchSuspended={catalogOpen || regionOpen || menuOpen} />
      <ThirdLevelNavigation compact={compact} />
      {needsConfirmation && !regionOpen && !catalogOpen && !menuOpen && <RegionConfirmation onChoose={openRegion} />}
    </header>
    <MobileBottomNav favorites={counts.favorites} cart={counts.cart} catalogOpen={catalogOpen} onCatalog={toggleCatalog} />
    {showBackToTop && isApprovedHomepage(location.pathname) && !catalogOpen && !regionOpen && !menuOpen && <button className="reference-back-to-top" type="button" aria-label="Наверх" title="Наверх" onClick={() => window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 11 6-6 6 6M12 5v14" /></svg></button>}
    {catalogOpen && <CatalogMenu region={region} onRegion={openRegion} header={header} opener={opener} compact={compact} onClose={closeCatalog} hoverOpened={catalogHovered} onMouseEnter={keepCatalogOpen} onMouseLeave={leaveCatalog} />}
    {regionOpen && <RegionDialog onClose={() => setRegionOpen(false)} onSelect={(city) => { setRegion(city); setRegionOpen(false) }} />}
  </>
}
