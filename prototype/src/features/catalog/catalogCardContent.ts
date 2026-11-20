import type { CatalogProduct } from '../../data/catalogTypes'
import { getDemoProduct } from '../../data/productRegistry'
import { formatTechnicalValue, technicalLabels } from '../../data/productProperties'

const compressorSpecs = ['performance', 'pressure', 'power', 'voltage', 'receiver']
const categorySpecs: Record<string, string[]> = {
  'screw-compressors': compressorSpecs,
  'piston-compressors': compressorSpecs,
  'oil-free-compressors': ['performance', 'pressure', 'power', 'voltage', 'receiver', 'noise', 'drive'],
  receivers: ['receiver', 'pressure'],
  dryers: ['performance', 'pressure', 'power', 'voltage', 'noise'],
}

/** Uses the existing catalog values only; never infers a specification from the name. */
export function catalogCardContent(product: CatalogProduct) {
  const registered = getDemoProduct(product.id)
  const keys = categorySpecs[product.subcategoryId] ?? Object.keys(product.specs).filter(key => technicalLabels[key])
  const specs = keys.flatMap(key => {
    const label = technicalLabels[key]
    const value = product.specs[key]?.trim()
    const registeredValue = registered?.specs[label]?.trim()
    return value ? [{ label, value: formatTechnicalValue(key, value) }] : registeredValue ? [{ label, value: registeredValue }] : []
  }).slice(0, 7)
  const description = registered?.modification
  const announcement = description && !description.startsWith('Демонстрацион') ? description : 'Характеристики уточняются при заказе.'
  return { specs, announcement }
}
