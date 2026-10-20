import { copyFile, mkdir } from 'node:fs/promises'

const outputDirectory = new URL('../dist/', import.meta.url)
const entryFile = new URL('index.html', outputDirectory)
const publicRoutes = [
  'profile', 'profile/data', 'profile/addresses', 'profile/recently-viewed', 'profile/documents', 'profile/help',
  'contacts', 'contacts/store', 'contacts/pickup', 'contacts/service',
  'catalog',
  'catalog/compressor-equipment',
  'catalog/compressor-equipment/screw-compressors',
  'catalog/compressor-equipment/screw-compressors/receiver',
  'catalog/compressor-equipment/oil-free-compressors',
  'product/remeza-vk-10-gr-0001',
  'brands',
  'brand/remeza',
  'actions',
  'actions/professional-workshop',
  'actions/archive-one',
  'actions/archive-two',
  'actions/completed',
  'cart',
  'checkout/review',
  'checkout/delivery',
  'checkout/success',
  'search',
]

await copyFile(entryFile, new URL('404.html', outputDirectory))

for (const route of publicRoutes) {
  const routeDirectory = new URL(`${route}/`, outputDirectory)
  await mkdir(routeDirectory, { recursive: true })
  await copyFile(entryFile, new URL('index.html', routeDirectory))
}
