import { useCallback, useState } from 'react'
import { useScrollThreshold } from '../../hooks/useScrollThreshold'
import { DesktopHeader, type HeaderCounts } from './DesktopHeader'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileHeader } from './MobileHeader'
import { RegionDialog } from './RegionDialog'
import './Header.css'

export function Header({ counts }: { counts: HeaderCounts }) {
  const [region, setRegion] = useState('Ярославль')
  const [regionOpen, setRegionOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const compact = useScrollThreshold(120)
  const toggleMenu = useCallback(() => setMenuOpen((value) => !value), [])
  return <>
    <header className="site-header">
      <DesktopHeader region={region} onRegion={() => setRegionOpen(true)} counts={counts} compact={compact} catalogOpen={catalogOpen} onCatalog={() => setCatalogOpen((value) => !value)} />
      <MobileHeader region={region} onRegion={() => setRegionOpen(true)} menuOpen={menuOpen} onMenu={toggleMenu} />
    </header>
    <MobileBottomNav favorites={counts.favorites} cart={counts.cart} />
    {regionOpen && <RegionDialog onClose={() => setRegionOpen(false)} onSelect={(city) => { setRegion(city); setRegionOpen(false) }} />}
  </>
}
