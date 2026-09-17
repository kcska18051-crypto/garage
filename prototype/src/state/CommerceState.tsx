import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type CommerceContextValue = {
  favoriteIds: Set<string>; compareIds: Set<string>; cartIds: Set<string>
  toggleFavorite(id: string): void; addFavorite(id: string): void; removeFavorite(id: string): void
  toggleCompare(id: string): void; addToCart(id: string): void; addManyToCart(ids: string[]): void
}

const CommerceContext = createContext<CommerceContextValue | null>(null)
const toggle = (current: Set<string>, id: string) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next }

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavorites] = useState<Set<string>>(() => new Set())
  const [compareIds, setCompare] = useState<Set<string>>(() => new Set())
  const [cartIds, setCart] = useState<Set<string>>(() => new Set())
  const value = useMemo(() => ({ favoriteIds, compareIds, cartIds, toggleFavorite: (id: string) => setFavorites((current) => toggle(current, id)), addFavorite: (id: string) => setFavorites((current) => new Set(current).add(id)), removeFavorite: (id: string) => setFavorites((current) => { const next = new Set(current); next.delete(id); return next }), toggleCompare: (id: string) => setCompare((current) => toggle(current, id)), addToCart: (id: string) => setCart((current) => new Set(current).add(id)), addManyToCart: (ids: string[]) => setCart((current) => new Set([...current, ...ids])) }), [cartIds, compareIds, favoriteIds])
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}

export function useCommerce() {
  const value = useContext(CommerceContext)
  if (!value) throw new Error('useCommerce must be used inside CommerceProvider')
  return value
}
