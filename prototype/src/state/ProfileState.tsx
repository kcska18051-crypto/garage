import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { profileData, type ProfileOrder, type ProfileOrganization } from '../data/profileData'
import { useCommerce, type ConfirmedCheckoutOrder } from './CommerceState'
import { buildLocalOrder, readOrderHistory, saveOrderHistory, type LocalProfileOrder, type OrderPresentation } from './orderHistory'
import type {ServiceRequestDraft} from '../data/serviceTypes'
import {buildServiceRequest,readServiceRequests,saveServiceRequests,type ProfileServiceRequest,type ServiceCreationResult,type ServiceIdentity} from './serviceRequests'
import {normalizePhoneIdentity} from '../utils/phoneIdentity'
import { getDemoProduct } from '../data/productRegistry'

const recentStorageKey = 'garage-recent-products-v1'
function readRecentProducts(): string[] {
  try { const ids: unknown = JSON.parse(localStorage.getItem(recentStorageKey) ?? '[]'); return Array.isArray(ids) ? [...new Set(ids.filter((id): id is string => typeof id === 'string' && Boolean(getDemoProduct(id))))].slice(0, 20) : [] } catch { return [] }
}

type UserData = typeof profileData.user
export const profileUserStorageKey = 'garage-profile-users-v1'
function readProfileUsers(): Record<string, UserData> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(profileUserStorageKey) ?? '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([phone, value]) => {
      if (!normalizePhoneIdentity(phone) || !value || typeof value !== 'object') return false
      const user = value as Partial<UserData>
      return ['firstName', 'lastName', 'phone', 'email'].every(key => typeof user[key as keyof UserData] === 'string') && typeof user.phoneVerified === 'boolean'
    }))
  } catch { return {} }
}
type Recipient = ProfileOrder['recipient']
export type ProfileAddress = { id: string; label: string; city: string; street: string; house: string; building: string; unit: string; postalCode: string; comment: string; isPrimary: boolean }
export const formatProfileAddress = (address: ProfileAddress) => [address.city, `ул. ${address.street}`, `д. ${address.house}`, address.building && `корп. ${address.building}`, address.unit && `кв./офис ${address.unit}`].filter(Boolean).join(', ')

const addressStorageKey = 'garage-profile-addresses-v1'
const defaultAddresses: ProfileAddress[] = [
  { id: 'address-home', label: 'Дом', city: 'Ярославль', street: 'Промышленная', house: '12', building: '', unit: '8', postalCode: '150000', comment: '', isPrimary: true },
  { id: 'address-work', label: 'Работа', city: 'Ярославль', street: 'Индустриальная', house: '8', building: '', unit: '12', postalCode: '150010', comment: 'Позвонить перед приездом', isPrimary: false },
]
const addressStringFields = ['id', 'label', 'city', 'street', 'house', 'building', 'unit', 'postalCode', 'comment'] as const
const isProfileAddress = (value: unknown): value is ProfileAddress => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return addressStringFields.every((field) => typeof candidate[field] === 'string')
    && typeof candidate.isPrimary === 'boolean'
    && Boolean((candidate.id as string).trim() && (candidate.city as string).trim() && (candidate.street as string).trim() && (candidate.house as string).trim())
}
const readAddresses = (): ProfileAddress[] => {
  try {
    if (typeof localStorage === 'undefined') return defaultAddresses
    const saved = localStorage.getItem(addressStorageKey)
    if (saved === null) return defaultAddresses
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.every(isProfileAddress)) return defaultAddresses
    if (parsed.length === 0) return []
    if (new Set(parsed.map((address) => address.id)).size !== parsed.length || parsed.filter((address) => address.isPrimary).length !== 1) return defaultAddresses
    return parsed
  } catch {
    return defaultAddresses
  }
}
const writeAddresses = (addresses: ProfileAddress[]) => {
  try { localStorage.setItem(addressStorageKey, JSON.stringify(addresses)) } catch { /* Storage may be unavailable; in-memory behavior remains usable. */ }
}

type ProfileContextValue = {
  serviceRequests: ProfileServiceRequest[]
  serviceStorageError: string
  createServiceRequest(input:ServiceRequestDraft,ownerPhone:string|null):ServiceCreationResult
  claimServiceRequests(identity:ServiceIdentity):void
  user: UserData
  orders: ProfileOrder[]
  createCheckoutOrder(snapshot: ConfirmedCheckoutOrder, presentation: OrderPresentation): ProfileOrder | null
  organizations: ProfileOrganization[]
  addresses: ProfileAddress[]
  recentProductIds: string[]
  recordRecentlyViewed(id: string): void
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

export function ProfileProvider({ children, ownerPhone = null }: { children: ReactNode; ownerPhone?: string | null }) {
  const commerce = useCommerce()
  const [profileUsers, setProfileUsers] = useState(readProfileUsers)
  const activeUserKey = normalizePhoneIdentity(ownerPhone ?? '')
  const [unboundUser, setUnboundUser] = useState(profileData.user)
  const user = activeUserKey ? profileUsers[activeUserKey] ?? profileData.user : unboundUser
  const updateUser = useCallback((next: UserData) => {
    if (!activeUserKey) { setUnboundUser(next); return }
    setProfileUsers(current => {
      const updated = { ...current, [activeUserKey]: next }
      try { localStorage.setItem(profileUserStorageKey, JSON.stringify(updated)) } catch { /* Keep in-memory edits. */ }
      return updated
    })
  }, [activeUserKey])
  const [seedOrders, setSeedOrders] = useState<ProfileOrder[]>(profileData.orders)
  const [localOrders, setLocalOrders] = useState<LocalProfileOrder[]>(readOrderHistory)
  const localOrdersRef = useRef(localOrders)
  const activeOwnerPhone = normalizePhoneIdentity(ownerPhone ?? '')
  const orders = useMemo(() => [
    ...localOrders.filter(record => record.ownerPhone === activeOwnerPhone).map(record => record.order),
    ...seedOrders,
  ], [activeOwnerPhone, localOrders, seedOrders])
  const commitLocalOrders = useCallback((records: LocalProfileOrder[]) => {
    localOrdersRef.current = records
    setLocalOrders(records)
    saveOrderHistory(records)
  }, [])
  const createCheckoutOrder = useCallback((snapshot: ConfirmedCheckoutOrder, presentation: OrderPresentation) => {
    const phone = normalizePhoneIdentity(snapshot.ownerPhone ?? '')
    if (!activeOwnerPhone || phone !== activeOwnerPhone) return null
    const existing = localOrdersRef.current.find(record => record.checkoutId === snapshot.id)
    if (existing) return existing.ownerPhone === phone ? existing.order : null
    const record = buildLocalOrder(snapshot, presentation)
    if (!record) return null
    commitLocalOrders([record, ...localOrdersRef.current].slice(0,100))
    return record.order
  }, [activeOwnerPhone, commitLocalOrders])
  const updateOrder = useCallback((id: string, update: (order: ProfileOrder) => ProfileOrder) => {
    setSeedOrders(current => current.map(order => order.id === id ? update(order) : order))
    const current = localOrdersRef.current
    const next = current.map(record => record.order.id === id && record.ownerPhone === activeOwnerPhone ? { ...record, order:update(record.order) } : record)
    if (next.some((record,index) => record !== current[index])) commitLocalOrders(next)
  }, [activeOwnerPhone, commitLocalOrders])
  const [organizations, setOrganizations] = useState<ProfileOrganization[]>(profileData.organizations)
  const [addresses, setAddresses] = useState<ProfileAddress[]>(readAddresses)
  const [recentProductIds, setRecentProductIds] = useState<string[]>(readRecentProducts)
  const recordRecentlyViewed = useCallback((id: string) => { if (getDemoProduct(id)) setRecentProductIds(ids => ids[0] === id ? ids : [id, ...ids.filter(value => value !== id)].slice(0, 20)) }, [])
  useEffect(() => { try { localStorage.setItem(recentStorageKey, JSON.stringify(recentProductIds)) } catch { /* Keep in-memory history. */ } }, [recentProductIds])
  const [notification, setNotification] = useState('')
  const [profileDeleted, setProfileDeleted] = useState(false)
  const [serviceSnapshot]=useState(readServiceRequests)
  const [serviceRequests,setServiceRequests]=useState(serviceSnapshot.records)
  const serviceRef=useRef(serviceRequests)
  const [serviceStorageError,setServiceStorageError]=useState(serviceSnapshot.error)
  const createServiceRequest=useCallback((input:ServiceRequestDraft,ownerPhone:string|null):ServiceCreationResult=>{
    if(serviceSnapshot.error)return{ok:false,error:serviceSnapshot.error}
    const latest=readServiceRequests()
    if(latest.error){setServiceStorageError(latest.error);return{ok:false,error:latest.error}}
    const existing=latest.records.find(record=>record.submissionId===input.submissionId)
    if(existing)return{ok:true,record:existing}
    const record=buildServiceRequest(input,ownerPhone)
    if(!record)return{ok:false,error:'Заявка не сохранена: проверьте данные и допустимую длину полей.'}
    const next=[record,...latest.records]
    const error=saveServiceRequests(next)
    if(error){setServiceStorageError(error);return{ok:false,error}}
    serviceRef.current=next;setServiceRequests(next);setServiceStorageError('')
    return{ok:true,record}
  },[serviceSnapshot.error])
  const claimServiceRequests=useCallback((identity:ServiceIdentity)=>{
    if(!identity.phoneConfirmed||serviceSnapshot.error)return
    const phone=normalizePhoneIdentity(identity.phone)
    if(!phone)return
    const latest=readServiceRequests()
    if(latest.error){setServiceStorageError(latest.error);return}
    // Repair older misbound local requests only after confirmation of their submitted phone.
    // Preserve historical fixtures and every request's payload/ID.
    const next=latest.records.map(record=>!record.seed&&record.ownerPhone!==phone&&normalizePhoneIdentity(record.fields.phone)===phone?{...record,ownerPhone:phone}:record)
    if(next.every((record,index)=>record===latest.records[index]))return
    const error=saveServiceRequests(next)
    if(error){setServiceStorageError(error);return}
    serviceRef.current=next;setServiceRequests(next);setServiceStorageError('')
  },[serviceSnapshot.error])

  useEffect(() => writeAddresses(addresses), [addresses])

  const value = useMemo<ProfileContextValue>(() => ({
    serviceRequests,serviceStorageError,createServiceRequest,claimServiceRequests,
    user,
    orders,
    createCheckoutOrder,
    organizations,
    addresses,
    recentProductIds,
    recordRecentlyViewed,
    notification,
    profileDeleted,
    requestCancellation: (id) => updateOrder(id, order => ({ ...order, status:'Заявка на отмену отправлена', canCancel:false })),
    updateRecipient: (id, recipient) => updateOrder(id, order => ({ ...order, recipient })),
    updateAddress: (id, address) => updateOrder(id, order => ({ ...order, address })),
    addOrganization: (organization) => setOrganizations((current) => [...current, organization]),
    addAddress: (address) => setAddresses((current) => [...current, { ...address, id: `address-${Date.now()}`, isPrimary: current.length === 0 }]),
    updateSavedAddress: (id, address) => { const target = addresses.find(item => item.id === id); if (target && (commerce.checkout.savedAddressId === id || commerce.checkout.address === formatProfileAddress(target))) commerce.updateCheckout({ address: formatProfileAddress({ ...target, ...address }), savedAddressId: id }); setAddresses(current => current.map(item => item.id === id ? { ...item, ...address } : item)) },
    removeAddress: (id) => { const target = addresses.find(item => item.id === id); if (!target) return; if (commerce.checkout.savedAddressId === id || commerce.checkout.address === formatProfileAddress(target)) commerce.updateCheckout({ address: '', savedAddressId: '' }); setAddresses(current => { const remaining = current.filter(item => item.id !== id); return target.isPrimary ? remaining.map((item,index) => ({ ...item, isPrimary: index === 0 })) : remaining }) },
    setPrimaryAddress: (id) => setAddresses((current) => current.map((item) => ({ ...item, isPrimary: item.id === id }))),
    clearRecentlyViewed: () => setRecentProductIds([]),
    updateUser,
    notify: setNotification,
    deleteProfile: () => setProfileDeleted(true),
    restoreProfile: () => setProfileDeleted(false),
  }), [addresses, commerce, notification, orders, organizations, profileDeleted, recentProductIds, user,updateUser,serviceRequests,serviceStorageError,createServiceRequest,claimServiceRequests,createCheckoutOrder,updateOrder])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const value = useContext(ProfileContext)
  if (!value) throw new Error('useProfile must be used inside ProfileProvider')
  return value
}

export function useOptionalProfile() { return useContext(ProfileContext) }
