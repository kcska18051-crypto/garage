import { brandDirectory } from './brandDirectoryData'

/** Keep links from the approved early homepage usable after route naming changed. */
export const legacyPublicRoutes = [
  { from: '/catalog/lifting', to: '/catalog/lifting-equipment' },
  { from: '/catalog/body', to: '/catalog/body-repair' },
  { from: '/catalog/paint', to: '/catalog/painting' },
  { from: '/actions/season-workshop', to: '/actions/professional-workshop' },
  { from: '/actions/service-tools', to: '/actions/professional-workshop' },
  { from: '/actions/paint-week', to: '/actions/last-day' },
  { from: '/actions/compressor-season', to: '/actions/one-day' },
  ...brandDirectory.map(brand => ({ from: `/brands/${brand.id}`, to: brand.id === 'remeza' ? '/brand/remeza' : `/brands?q=${encodeURIComponent(brand.name)}` })),
]

export const canonicalPublicHref = (href: string) => legacyPublicRoutes.find(route => route.from === href)?.to ?? href
