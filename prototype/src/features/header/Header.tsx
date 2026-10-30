import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CatalogMenu } from './CatalogMenu'
import { usePinnedHeaderHeight } from '../../hooks/usePinnedHeaderHeight'
import { useScrollThreshold } from '../../hooks/useScrollThreshold'
import { DesktopHeader, type HeaderCounts } from './DesktopHeader'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileHeader } from './MobileHeader'
import { RegionDialog } from './RegionDialog'
import { useRegion } from '../../state/RegionState'
import { ThirdLevelNavigation } from './ThirdLevelNavigation'
import { compactHeaderScrollThreshold } from '../../data/headerNavigationData'
import './Header.css'

export function Header({ counts }: { counts: HeaderCounts }) {
  const { region, setRegion } = useRegion()
  const [regionOpen, setRegionOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const compact = useScrollThreshold(compactHeaderScrollThreshold)
  const showBackToTop = useScrollThreshold(500)
  const header=useRef<HTMLElement>(null)
  const opener=useRef<HTMLElement>(null)
  const location=useLocation()
  usePinnedHeaderHeight(header,compact)
  const toggleMenu = useCallback(() => setMenuOpen((value) => !value), [])
  const closeCatalog = useCallback((restoreFocus = true) => {
    setCatalogOpen(false)
    if (restoreFocus) requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLElement>(innerWidth < 768 ? '.mobile-bottom-nav [aria-label="Каталог"]' : '.catalog-button')
      ;(opener.current?.getClientRects().length ? opener.current : fallback)?.focus({ preventScroll: true })
    })
  }, [])
  const toggleCatalog = () => {
    if (catalogOpen) { closeCatalog(); return }
    opener.current=document.activeElement as HTMLElement
    // The mobile-menu opener is unmounted when the drawer replaces that menu.
    if (opener.current?.closest('.mobile-menu')) opener.current=document.querySelector('.mobile-bottom-nav [aria-label="Каталог"]')
    setMenuOpen(false); setRegionOpen(false); setCatalogOpen(true)
  }
  const openRegion = () => { closeCatalog(false); setMenuOpen(false); setRegionOpen(true) }
  useEffect(() => { setCatalogOpen(false); setMenuOpen(false); setRegionOpen(false) }, [location])
  return <>
    <header className="site-header" ref={header} onFocusCapture={event => { if ((event.target as HTMLElement).closest('.search-box')) { closeCatalog(false); setRegionOpen(false); setMenuOpen(false) } }}>
      <DesktopHeader region={region} onRegion={openRegion} counts={counts} compact={compact} catalogOpen={catalogOpen} onCatalog={toggleCatalog} searchSuspended={catalogOpen || regionOpen || menuOpen} />
      <MobileHeader compact={compact && location.pathname.replace(/\/$/, '') === '/style-check'} compareCount={counts.compare} region={region} onRegion={openRegion} menuOpen={menuOpen} onMenu={toggleMenu} onCatalog={toggleCatalog} searchSuspended={catalogOpen || regionOpen || menuOpen} />
      <ThirdLevelNavigation compact={compact} />
    </header>
    <MobileBottomNav favorites={counts.favorites} cart={counts.cart} catalogOpen={catalogOpen} onCatalog={toggleCatalog} />
    {showBackToTop && location.pathname.replace(/\/$/, '') === '/style-check' && !catalogOpen && !regionOpen && !menuOpen && <button className="reference-back-to-top" type="button" aria-label="Наверх" title="Наверх" onClick={() => window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 11 6-6 6 6M12 5v14" /></svg></button>}
    {catalogOpen && <CatalogMenu header={header} opener={opener} compact={compact} onClose={closeCatalog} />}
    {regionOpen && <RegionDialog onClose={() => setRegionOpen(false)} onSelect={(city) => { setRegion(city); setRegionOpen(false) }} />}
  </>
}
