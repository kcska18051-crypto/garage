import type { ConfirmedCheckoutOrder } from './CommerceState'
import type { ProfileOrder } from '../data/profileData'
import { getDemoProduct } from '../data/productRegistry'
import { normalizePhoneIdentity } from '../utils/phoneIdentity'

export const orderHistoryStorageKey = 'garage-profile-orders-v1'
export type LocalProfileOrder = { ownerPhone: string; checkoutId: string; order: ProfileOrder }
export type OrderPresentation = Pick<ProfileOrder, 'delivery' | 'payment' | 'address' | 'recipient'>
const statuses = new Set(['В обработке', 'Получен', 'Отменён', 'Заявка на отмену отправлена'])
const text = (value: unknown): value is string => typeof value === 'string' && value.length <= 4000
const object = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value))

function validRecord(value: unknown): value is LocalProfileOrder {
  if (!object(value) || !text(value.ownerPhone) || !value.ownerPhone || normalizePhoneIdentity(value.ownerPhone) !== value.ownerPhone || !text(value.checkoutId) || !value.checkoutId.startsWith('checkout-') || value.checkoutId.length > 200 || !object(value.order)) return false
  const o = value.order
  if (!['id','number','date','status','total','delivery','payment','address'].every(key => text(o[key])) || o.id !== value.checkoutId || !statuses.has(o.status as string) || !['personal','organization'].includes(o.kind as string) || typeof o.canEdit !== 'boolean' || typeof o.canCancel !== 'boolean') return false
  if (o.organization !== undefined && !text(o.organization) || o.inn !== undefined && !text(o.inn)) return false
  if (!object(o.recipient) || !['firstName','lastName','phone'].every(key => text(o.recipient && (o.recipient as Record<string,unknown>)[key])) || !['owner','other'].includes(o.recipient.relation as string)) return false
  if (!Array.isArray(o.items) || !o.items.length || o.items.length > 100 || !o.items.every(item => object(item) && text(item.productId) && text(item.name) && Number.isInteger(item.quantity) && Number(item.quantity) > 0 && Number(item.quantity) <= 999 && typeof item.available === 'boolean')) return false
  return Array.isArray(o.timeline) && o.timeline.length <= 20 && o.timeline.every(stage => object(stage) && text(stage.label) && typeof stage.complete === 'boolean' && (stage.current === undefined || typeof stage.current === 'boolean'))
}

export function readOrderHistory(): LocalProfileOrder[] {
  try {
    const raw = localStorage.getItem(orderHistoryStorageKey)
    if (!raw || raw.length > 1_000_000) return []
    const value: unknown = JSON.parse(raw)
    if (!object(value) || value.version !== 1 || !Array.isArray(value.records) || value.records.length > 100 || !value.records.every(validRecord)) return []
    if (new Set(value.records.map(record => record.checkoutId)).size !== value.records.length) return []
    return value.records
  } catch { return [] }
}

export function saveOrderHistory(records: LocalProfileOrder[]) {
  try { localStorage.setItem(orderHistoryStorageKey, JSON.stringify({ version: 1, records: records.slice(0,100) })) } catch { /* The current demo remains usable in memory. */ }
}

export function buildLocalOrder(snapshot: ConfirmedCheckoutOrder, presentation: OrderPresentation): LocalProfileOrder | null {
  const ownerPhone = normalizePhoneIdentity(snapshot.ownerPhone ?? '')
  if (!ownerPhone || !snapshot.id || !snapshot.number || !snapshot.createdAt || !Number.isFinite(Date.parse(snapshot.createdAt)) || !snapshot.lines.length || !Number.isSafeInteger(snapshot.pricing.totalCents) || snapshot.pricing.totalCents < 0) return null
  const order: ProfileOrder = {
    id: snapshot.id, number: snapshot.number,
    date: new Intl.DateTimeFormat('ru-RU', { day:'numeric', month:'long', year:'numeric' }).format(new Date(snapshot.createdAt)),
    status: 'В обработке', kind: snapshot.details.customerType,
    total: snapshot.pricing.rows.every(row => row.quote) ? 'Уточняется' : `${new Intl.NumberFormat('ru-RU').format(snapshot.pricing.totalCents / 100)} ₽`,
    ...presentation,
    ...(snapshot.details.customerType === 'organization' ? { organization:snapshot.details.organization, inn:snapshot.details.organizationInn } : {}),
    items: snapshot.lines.map(line => { const p = getDemoProduct(line.id); return { productId:line.id, name:p?.name ?? line.id, quantity:line.quantity, available:Boolean(p && p.availabilityStatus === 'available' && p.purchaseMode !== 'quote') } }),
    canEdit:true, canCancel:true,
    timeline:[{label:'Заказ оформлен',complete:true},{label:'В обработке',complete:true,current:true},{label:'Готовится к передаче',complete:false},{label:'Получен',complete:false}],
  }
  const record = { ownerPhone, checkoutId:snapshot.id, order }
  return validRecord(record) ? record : null
}
