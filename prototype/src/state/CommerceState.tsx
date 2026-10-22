import { createContext, useContext, useMemo, useState, useEffect, useRef, type ReactNode } from 'react'
import type { Coordinates } from '../features/maps/CoordinateMap'
import { profileData } from '../data/profileData'
import type { priceCart } from '../features/cart/cartPricing'

type CommerceContextValue = {
  favoriteIds: Set<string>; compareIds: Set<string>; cartIds: Set<string>
  cartItems: CartLine[]; cartCount: number; checkout: CheckoutState
  toggleFavorite(id: string): void; addFavorite(id: string): void; removeFavorite(id: string): void
  toggleCompare(id: string): void; addCompare(id: string): void; removeCompare(id: string): void; clearCompare(ids?: string[]): void; ensureDemoCompare(ids: string[]): void
  addToCart(id: string, quantity?: number, optionFor?: string): void; addManyToCart(ids: string[]): void
  importCart(lines: CartLine[]): void
  updateQuantity(id: string, quantity: number): void; removeFromCart(id: string): void; moveToFavorites(id: string): void
  ensureDemoCart(): void
  updateCheckout(patch: Partial<CheckoutState>): void
}

export type CartLine = { id: string; quantity: number; optionFor?: string; optionParents?: Record<string, number> }
const parentAllocations = (line: CartLine) => line.optionParents ?? (line.optionFor ? { [line.optionFor]: line.quantity } : {})

export function mergeCartLines(current: CartLine[], incoming: CartLine[]): CartLine[] {
  const merged = current.map(line => ({ ...line, optionParents: { ...parentAllocations(line) } }))
  for (const line of incoming) {
    const existing = merged.find(item => item.id === line.id)
    const parents = { ...parentAllocations(line) }
    if (!existing) { merged.push({ ...line, optionParents: parents, optionFor: Object.keys(parents)[0] }); continue }
    existing.quantity += line.quantity
    for (const [parentId, count] of Object.entries(parents)) existing.optionParents[parentId] = (existing.optionParents[parentId] ?? 0) + count
    existing.optionFor = Object.keys(existing.optionParents)[0]
  }
  return merged
}
export type CheckoutState = {
  promoCode?: string; selectedCartIds?: string[]
  confirmedOrder?: { lines: CartLine[]; pricing: ReturnType<typeof priceCart>; details: Omit<CheckoutState, 'confirmedOrder'> }
  customerType: 'personal' | 'organization'; organization: string; guest: boolean; phoneVerified: boolean
  guestName: string; guestEmail: string; guestPhone: string
  otherRecipient: boolean; recipientName: string; recipientLastName: string; recipientPhone: string
  organizationInn: string
  delivery: 'pickup' | 'courier' | 'transport'; payment: 'card' | 'sbp' | 'cash' | 'installment' | 'invoice'
  address: string; store: string; transportAddress: string
  pickupCity?: string; storeId?: string; deliveryMode?: 'address' | 'point'; deliveryPoint?: Coordinates | null; pointComment?: string; savedAddressId?: string; carrier?: string; customCarrier?: string
  comment: string; marketingConsent: boolean
}

const CommerceContext = createContext<CommerceContextValue | null>(null)
const toggle = (current: Set<string>, id: string) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next }
const readStored = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback } }
const resizeLine = (item: CartLine, quantity: number): CartLine => {
  const normalized = Math.max(1, Math.min(999, Math.floor(quantity) || 1)); let remaining = normalized
  const parents: Record<string, number> = {}
  for (const [id, count] of Object.entries(item.optionParents ?? (item.optionFor ? { [item.optionFor]: item.quantity } : {}))) { const allocated = Math.min(remaining,count); if (allocated > 0) parents[id] = allocated; remaining -= allocated }
  return { ...item, quantity: normalized, optionParents: parents, optionFor: Object.keys(parents)[0] }
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavorites] = useState<Set<string>>(() => { const saved=readStored<unknown>('garage-favorites-v1', null); return new Set(Array.isArray(saved) && saved.every(id => typeof id === 'string') ? saved : profileData.favoriteProductIds) })
  useEffect(() => { try { localStorage.setItem('garage-favorites-v1', JSON.stringify([...favoriteIds])) } catch { /* In-memory fallback. */ } }, [favoriteIds])
  const [compareIds, setCompare] = useState<Set<string>>(() => new Set())
  const [cartItems, setCartItems] = useState<CartLine[]>(() => readStored('garage-cart-v2', []))
  const seeded = useRef(readStored('garage-cart-v2', null) !== null)
  const [checkout, setCheckout] = useState<CheckoutState>(() => ({ customerType: 'personal', organization: 'ООО «Гараж»', guest: false, phoneVerified: false, guestName: '', guestEmail: '', guestPhone: '', otherRecipient: false, recipientName: '', recipientLastName: '', recipientPhone: '', organizationInn: '', delivery: 'pickup', payment: 'card', address: '', store: '', transportAddress: '', comment: '', marketingConsent: false, ...readStored<Partial<CheckoutState>>('garage-checkout-v2', {}) }))
  useEffect(() => { try { localStorage.setItem('garage-cart-v2', JSON.stringify(cartItems)); localStorage.setItem('garage-checkout-v2', JSON.stringify(checkout)) } catch { /* In-memory fallback. */ } }, [cartItems, checkout])
  const cartIds = useMemo(() => new Set(cartItems.map(({ id }) => id)), [cartItems])
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const addToCart = (id: string, quantity = 1, optionFor?: string) => { seeded.current = true; setCheckout(current => Array.isArray(current.selectedCartIds) ? { ...current, selectedCartIds: [...new Set([...current.selectedCartIds, id])] } : current); setCartItems((current) => current.some((item) => item.id === id) ? current.map((item) => { if (item.id !== id) return item; const parents = item.optionParents ?? (item.optionFor ? { [item.optionFor]: item.quantity } : {}); return { ...item, optionFor: item.optionFor ?? optionFor, optionParents: optionFor ? { ...parents, [optionFor]: (parents[optionFor] ?? 0) + quantity } : parents, quantity: item.quantity + quantity } }) : [...current, { id, quantity, optionFor, optionParents: optionFor ? { [optionFor]: quantity } : undefined }]) }
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
    importCart: (lines: CartLine[]) => { seeded.current = true; setCartItems(current => mergeCartLines(current, lines)); setCheckout(current => Array.isArray(current.selectedCartIds) ? { ...current, selectedCartIds: [...new Set([...current.selectedCartIds, ...lines.map(line => line.id)])] } : current) },
    addManyToCart: (ids: string[]) => ids.forEach(id => addToCart(id)),
    updateQuantity: (id: string, quantity: number) => quantity < 1 ? removeFromCart(id) : setCartItems((current) => current.map((item) => item.id === id ? resizeLine(item, quantity) : item)),
    removeFromCart,
    moveToFavorites: (id: string) => { setFavorites((current) => new Set(current).add(id)); removeFromCart(id) },
    ensureDemoCart: () => { if (!seeded.current) { seeded.current = true; setCartItems((current) => current.length ? current : [{ id: 'product-1', quantity: 1 }, { id: 'product-2', quantity: 2 }]) } },
    updateCheckout: (patch: Partial<CheckoutState>) => setCheckout((current) => ({ ...current, ...patch })),
  }), [cartCount, cartIds, cartItems, checkout, compareIds, favoriteIds])
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}

export function useCommerce() {
  const value = useContext(CommerceContext)
  if (!value) throw new Error('useCommerce must be used inside CommerceProvider')
  return value
}
