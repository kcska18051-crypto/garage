import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { profileData, type ProfileOrder, type ProfileOrganization } from '../data/profileData'
import { useCommerce } from './CommerceState'

type UserData = typeof profileData.user
type Recipient = ProfileOrder['recipient']

type ProfileContextValue = {
  user: UserData
  orders: ProfileOrder[]
  organizations: ProfileOrganization[]
  recentProductIds: string[]
  notification: string
  requestCancellation(id: string): void
  updateRecipient(id: string, recipient: Recipient): void
  updateAddress(id: string, address: string): void
  addOrganization(organization: ProfileOrganization): void
  clearRecentlyViewed(): void
  updateUser(user: UserData): void
  notify(message: string): void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const commerce = useCommerce()
  const [user, setUser] = useState(profileData.user)
  const [orders, setOrders] = useState<ProfileOrder[]>(profileData.orders)
  const [organizations, setOrganizations] = useState<ProfileOrganization[]>(profileData.organizations)
  const [recentProductIds, setRecentProductIds] = useState(profileData.recentlyViewedProductIds)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    profileData.favoriteProductIds.forEach(commerce.addFavorite)
  }, [])

  const value = useMemo<ProfileContextValue>(() => ({
    user,
    orders,
    organizations,
    recentProductIds,
    notification,
    requestCancellation: (id) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status: 'Заявка на отмену отправлена', canCancel: false } : order)),
    updateRecipient: (id, recipient) => setOrders((current) => current.map((order) => order.id === id ? { ...order, recipient } : order)),
    updateAddress: (id, address) => setOrders((current) => current.map((order) => order.id === id ? { ...order, address } : order)),
    addOrganization: (organization) => setOrganizations((current) => [...current, organization]),
    clearRecentlyViewed: () => setRecentProductIds([]),
    updateUser: setUser,
    notify: setNotification,
  }), [notification, orders, organizations, recentProductIds, user])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const value = useContext(ProfileContext)
  if (!value) throw new Error('useProfile must be used inside ProfileProvider')
  return value
}
