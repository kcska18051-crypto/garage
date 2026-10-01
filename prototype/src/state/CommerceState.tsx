import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type CommerceContextValue = {
  favoriteIds: Set<string>; compareIds: Set<string>; cartIds: Set<string>
  cartItems: CartLine[]; cartCount: number; checkout: CheckoutState
  toggleFavorite(id: string): void; addFavorite(id: string): void; removeFavorite(id: string): void
  toggleCompare(id: string): void; addCompare(id: string): void; removeCompare(id: string): void; clearCompare(ids?: string[]): void; ensureDemoCompare(ids: string[]): void
  addToCart(id: string): void; addManyToCart(ids: string[]): void
  updateQuantity(id: string, quantity: number): void; removeFromCart(id: string): void; moveToFavorites(id: string): void
  ensureDemoCart(): void
  updateCheckout(patch: Partial<CheckoutState>): void
}

export type CartLine = { id: string; quantity: number }
export type CheckoutState = {
  customerType: 'personal' | 'organization'; organization: string; guest: boolean; phoneVerified: boolean
  otherRecipient: boolean; recipientName: string; recipientPhone: string
  delivery: 'delivery' | 'pickup'; payment: 'card' | 'cash' | 'invoice'; address: string; store: string
}

const CommerceContext = createContext<CommerceContextValue | null>(null)
const toggle = (current: Set<string>, id: string) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next }

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavorites] = useState<Set<string>>(() => new Set())
  const [compareIds, setCompare] = useState<Set<string>>(() => new Set())
  const [cartItems, setCartItems] = useState<CartLine[]>(() => [])
  const [checkout, setCheckout] = useState<CheckoutState>({ customerType: 'personal', organization: 'ООО «Гараж»', guest: false, phoneVerified: false, otherRecipient: false, recipientName: '', recipientPhone: '', delivery: 'delivery', payment: 'card', address: 'Ярославль', store: 'Магазин в выбранном городе' })
  const cartIds = useMemo(() => new Set(cartItems.map(({ id }) => id)), [cartItems])
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const addToCart = (id: string) => setCartItems((current) => current.some((item) => item.id === id) ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { id, quantity: 1 }])
  const removeFromCart = (id: string) => setCartItems((current) => current.filter((item) => item.id !== id))
  const value = useMemo(() => ({ favoriteIds, compareIds, cartIds, cartItems, cartCount, checkout,
    toggleFavorite: (id: string) => setFavorites((current) => toggle(current, id)),
    addFavorite: (id: string) => setFavorites((current) => new Set(current).add(id)),
    removeFavorite: (id: string) => setFavorites((current) => { const next = new Set(current); next.delete(id); return next }),
    toggleCompare: (id: string) => setCompare((current) => toggle(current, id)),
    addCompare: (id: string) => setCompare((current) => new Set(current).add(id)),
    removeCompare: (id: string) => setCompare((current) => { const next = new Set(current); next.delete(id); return next }),
    clearCompare: (ids?: string[]) => setCompare((current) => ids ? new Set([...current].filter((id) => !ids.includes(id))) : new Set()),
    ensureDemoCompare: (ids: string[]) => setCompare((current) => current.size ? current : new Set(ids)),
    addToCart,
    addManyToCart: (ids: string[]) => ids.forEach(addToCart),
    updateQuantity: (id: string, quantity: number) => quantity < 1 ? removeFromCart(id) : setCartItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item)),
    removeFromCart,
    moveToFavorites: (id: string) => { setFavorites((current) => new Set(current).add(id)); removeFromCart(id) },
    ensureDemoCart: () => setCartItems((current) => current.length ? current : [{ id: 'product-1', quantity: 1 }, { id: 'product-2', quantity: 2 }]),
    updateCheckout: (patch: Partial<CheckoutState>) => setCheckout((current) => ({ ...current, ...patch })),
  }), [cartCount, cartIds, cartItems, checkout, compareIds, favoriteIds])
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}

export function useCommerce() {
  const value = useContext(CommerceContext)
  if (!value) throw new Error('useCommerce must be used inside CommerceProvider')
  return value
}
