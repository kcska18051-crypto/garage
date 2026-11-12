import {catalogProducts} from './catalogData'
import { checkoutProducts } from './checkoutData'
import { promotionPrice } from './promotionPricing'
import { formatAvailability } from '../utils/availability'
export type CompareProduct = {
  id: string
  categoryId: 'compressors' | 'tools' | 'other'
  categoryLabel: string
  name: string
  sku: string
  price: number
  purchaseMode?:'cart'|'quote'
  oldPrice?: number
  href: string
  availability: string
  specs: Record<string, string>
}

const compareSource: CompareProduct[] = [
  {
    id: 'remeza-vk-10-gr-0001', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Remeza ВК 10', sku: 'GR-0001', price: 185000, oldPrice: 207200,
    href: '/product/remeza-vk-10-gr-0001', availability: 'В наличии в 2 магазинах',
    specs: { 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'compressor-2', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Berg ВК 11', sku: 'GR-0004', price: 208750,
    href: '/catalog/compressor-equipment/screw-compressors', availability: 'Получение ориентировочно завтра',
    specs: { 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'compressor-3', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Dali ВК 12', sku: 'GR-0006', price: 232500,
    href: '/catalog/compressor-equipment/screw-compressors', availability: 'Под заказ',
    specs: { 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'compressor-4', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Comaro Air 13', sku: 'GR-0009', price: 256250,
    href: '/catalog/compressor-equipment/screw-compressors', availability: 'В наличии в 1 магазине',
    specs: { 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-2', categoryId: 'tools', categoryLabel: 'Инструмент', name: 'Набор инструмента для мастерской', sku: 'GR-0002', price: 27900,
    href: '/catalog/tools', availability: 'В наличии в 3 магазинах',
    specs: { 'Тип набора': 'Универсальный', 'Количество предметов': '108', 'Материал': 'Хромованадиевая сталь', 'Привод': '1/4″ и 1/2″', 'Кейс': 'Да', 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-7', categoryId: 'tools', categoryLabel: 'Инструмент', name: 'Тележка инструментальная', sku: 'GR-0007', price: 72900,
    href: '/catalog/tools', availability: 'Получение ориентировочно через 3 дня',
    specs: { 'Тип набора': 'Тележка', 'Количество предметов': '196', 'Материал': 'Сталь', 'Привод': '1/4″, 3/8″ и 1/2″', 'Кейс': 'Нет', 'Гарантия': 'Условия уточняются' },
  },
]

const initialCompareProducts: CompareProduct[] = compareSource.map(product => { const shared = checkoutProducts.find(p => p.id === product.id); return { ...product, specs:{...product.specs,...shared?.specs}, categoryId: product.categoryId as CompareProduct['categoryId'], name: shared?.name ?? product.name, sku: shared?.sku ?? product.sku, href: shared?.href ?? product.href, price: shared?.price ?? product.price, purchaseMode:shared?.purchaseMode, oldPrice: promotionPrice(product.id, shared?.price ?? product.price,shared?.purchaseMode==='quote').oldPrice, availability: shared ? formatAvailability(shared.availabilityStatus,Math.min(3,shared.storeCount)) : product.availability } })

export const compareProducts:CompareProduct[]=[...initialCompareProducts,...checkoutProducts.filter(product=>!initialCompareProducts.some(existing=>existing.id===product.id)).map(product=>{
 const compressor=catalogProducts.some(item=>item.id===product.id)||product.specs['Тип компрессора']!==undefined||['product-4','product-9','product-10'].includes(product.id)
 const tools=['product-2','product-6','product-7'].includes(product.id)
 const categoryId:CompareProduct['categoryId']=compressor?'compressors':tools?'tools':'other'
 return {id:product.id,categoryId,categoryLabel:compressor?'Компрессоры':tools?'Инструмент':'Другие товары',name:product.name,sku:product.sku,price:product.price,href:product.href,purchaseMode:product.purchaseMode,oldPrice:promotionPrice(product.id,product.price,product.purchaseMode==='quote').oldPrice,availability:formatAvailability(product.availabilityStatus,Math.min(3,product.storeCount)),specs:product.specs}
})]

export const demoCompareIds = ['remeza-vk-10-gr-0001', 'compressor-2', 'compressor-3', 'product-2']

export const compareCategories = [
  { id: 'compressors' as const, label: 'Компрессоры' },
  { id: 'tools' as const, label: 'Инструмент' },
  { id: 'other' as const, label: 'Другие товары' },
]

export const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
