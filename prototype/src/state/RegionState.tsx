import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type RegionContextValue = {
  region: string
  setRegion(region: string): void
  needsConfirmation: boolean
  confirmRegion(): void
  dismissConfirmation(): void
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, updateRegion] = useState(() => {
    try { return localStorage.getItem('garage-region-v1') || 'Ярославль' } catch { return 'Ярославль' }
  })
  const [needsConfirmation, setNeedsConfirmation] = useState(() => {
    try { return !localStorage.getItem('garage-region-v1') && !sessionStorage.getItem('garage-region-dismissed-v1') } catch { return true }
  })
  const value = useMemo(() => ({
    region, needsConfirmation,
    setRegion(city: string) {
      updateRegion(city)
      setNeedsConfirmation(false)
      try { localStorage.setItem('garage-region-v1', city) } catch { /* Keep the choice for this visit when storage is unavailable. */ }
    },
    confirmRegion() {
      setNeedsConfirmation(false)
      try { localStorage.setItem('garage-region-v1', region) } catch { /* Keep the confirmation in memory. */ }
    },
    dismissConfirmation() {
      setNeedsConfirmation(false)
      try { sessionStorage.setItem('garage-region-dismissed-v1', '1') } catch { /* Keep dismissal in memory. */ }
    },
  }), [region, needsConfirmation])
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const value = useContext(RegionContext)
  if (!value) throw new Error('useRegion must be used inside RegionProvider')
  return value
}
