// Only the approved product detail and its variants are part of the demonstration.
export const designedProductIds = ['remeza-vk-10-gr-0001','remeza-vk-10-380-55','remeza-vk-10-220-55']
export const removedCatalogPaths = ['lifting-equipment','body-repair','painting','tools','service-station-equipment'].map(slug => `/catalog/${slug}`)
export const screwListingPath = '/catalog/compressor-equipment/screw-compressors'
export const screwSelectionQueries: Record<string,string> = {
 receiver: 'receiver=300&receiver=500', dryer: 'configuration=dryer', stations: 'configuration=station',
 'direct-drive': 'drive=direct', 'belt-drive': 'drive=belt', turnkey: 'configuration=turnkey',
}
export function isRemovedDemoPath(path: string) {
 const pathname = path.split(/[?#]/)[0].replace(/\/$/, '')
 return ['/catalog/lifting','/catalog/body','/catalog/paint'].includes(pathname) || removedCatalogPaths.includes(pathname) || (pathname.startsWith('/product/') && !designedProductIds.includes(pathname.slice('/product/'.length)))
}
export function demoSelectionHref(path: string) {
 const selection = path.startsWith(screwListingPath + '/') ? path.slice(screwListingPath.length + 1).split(/[?#]/)[0] : ''
 return screwSelectionQueries[selection] ? `${screwListingPath}?${screwSelectionQueries[selection]}` : path
}
