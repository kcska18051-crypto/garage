import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { profileData, type ProfileOrder, type ProfileOrganization } from '../data/profileData'
import { useCommerce } from './CommerceState'

type UserData = typeof profileData.user
type Recipient = ProfileOrder['recipient']
export type ProfileAddress = { id: string; label: string; city: string; street: string; house: string; building: string; unit: string; postalCode: string; comment: string; isPrimary: boolean }
export const formatProfileAddress = (address: ProfileAddress) => [address.city, `ул. ${address.street}`, `д. ${address.house}`, address.building && `корп. ${address.building}`, address.unit && `кв./офис ${address.unit}`].filter(Boolean).join(', ')

type ProfileContextValue = {
  user: UserData
  orders: ProfileOrder[]
  organizations: ProfileOrganization[]
  addresses: ProfileAddress[]
  recentProductIds: string[]
  notification: string
  profileDeleted: boolean
  requestCancellation(id: string): void
  updateRecipient(id: string, recipient: Recipient): void
  updateAddress(id: string, address: string): void
  addOrganization(organization: ProfileOrganization): void
  addAddress(address: Omit<ProfileAddress, 'id' | 'isPrimary'>): void
  updateSavedAddress(id: string, address: Omit<ProfileAddress, 'id' | 'isPrimary'>): void
  removeAddress(id: string): void
  setPrimaryAddress(id: string): void
  clearRecentlyViewed(): void
  updateUser(user: UserData): void
  notify(message: string): void
  deleteProfile(): void
  restoreProfile(): void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const commerce = useCommerce()
  const [user, setUser] = useState(profileData.user)
  const [orders, setOrders] = useState<ProfileOrder[]>(profileData.orders)
  const [organizations, setOrganizations] = useState<ProfileOrganization[]>(profileData.organizations)
  const [addresses, setAddresses] = useState<ProfileAddress[]>([
    { id: 'address-home', label: 'Дом', city: 'Ярославль', street: 'Промышленная', house: '12', building: '', unit: '8', postalCode: '150000', comment: '', isPrimary: true },
    { id: 'address-work', label: 'Работа', city: 'Ярославль', street: 'Индустриальная', house: '8', building: '', unit: '12', postalCode: '150010', comment: 'Позвонить перед приездом', isPrimary: false },
  ])
  const [recentProductIds, setRecentProductIds] = useState(profileData.recentlyViewedProductIds)
  const [notification, setNotification] = useState('')
  const [profileDeleted, setProfileDeleted] = useState(false)

  useEffect(() => {
    profileData.favoriteProductIds.forEach(commerce.addFavorite)
  }, [])

  const value = useMemo<ProfileContextValue>(() => ({
    user,
    orders,
    organizations,
    addresses,
    recentProductIds,
    notification,
    profileDeleted,
    requestCancellation: (id) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status: 'Заявка на отмену отправлена', canCancel: false } : order)),
    updateRecipient: (id, recipient) => setOrders((current) => current.map((order) => order.id === id ? { ...order, recipient } : order)),
    updateAddress: (id, address) => setOrders((current) => current.map((order) => order.id === id ? { ...order, address } : order)),
    addOrganization: (organization) => setOrganizations((current) => [...current, organization]),
    addAddress: (address) => setAddresses((current) => [...current, { ...address, id: `address-${Date.now()}`, isPrimary: current.length === 0 }]),
    updateSavedAddress: (id, address) => setAddresses((current) => { const target = current.find((item) => item.id === id); const next = current.map((item) => item.id === id ? { ...item, ...address } : item); if (target && commerce.checkout.address === formatProfileAddress(target)) commerce.updateCheckout({ address: formatProfileAddress({ ...target, ...address }) }); return next }),
    removeAddress: (id) => setAddresses((current) => { const target = current.find((item) => item.id === id); if (!target || (target.isPrimary && current.length === 1)) return current; const next = current.filter((item) => item.id !== id); if (commerce.checkout.address === formatProfileAddress(target)) commerce.updateCheckout({ address: '' }); return target.isPrimary && next.length ? next.map((item, index) => ({ ...item, isPrimary: index === 0 })) : next }),
    setPrimaryAddress: (id) => setAddresses((current) => current.map((item) => ({ ...item, isPrimary: item.id === id }))),
    clearRecentlyViewed: () => setRecentProductIds([]),
    updateUser: setUser,
    notify: setNotification,
    deleteProfile: () => setProfileDeleted(true),
    restoreProfile: () => setProfileDeleted(false),
  }), [addresses, commerce, notification, orders, organizations, profileDeleted, recentProductIds, user])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const value = useContext(ProfileContext)
  if (!value) throw new Error('useProfile must be used inside ProfileProvider')
  return value
}
