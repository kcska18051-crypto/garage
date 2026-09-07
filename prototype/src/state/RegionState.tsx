import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type RegionContextValue = {
  region: string
  setRegion(region: string): void
}

const RegionContext = createContext<RegionContextValue | null>(null)

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState('Ярославль')
  const value = useMemo(() => ({ region, setRegion }), [region])
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const value = useContext(RegionContext)
  if (!value) throw new Error('useRegion must be used inside RegionProvider')
  return value
}
