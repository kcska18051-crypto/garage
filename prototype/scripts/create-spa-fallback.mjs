import { copyFile, mkdir } from 'node:fs/promises'

const outputDirectory = new URL('../dist/', import.meta.url)
const entryFile = new URL('index.html', outputDirectory)
const publicRoutes = [
  'catalog',
  'catalog/compressor-equipment',
  'catalog/compressor-equipment/screw-compressors',
  'catalog/compressor-equipment/oil-free-compressors',
]

await copyFile(entryFile, new URL('404.html', outputDirectory))

for (const route of publicRoutes) {
  const routeDirectory = new URL(`${route}/`, outputDirectory)
  await mkdir(routeDirectory, { recursive: true })
  await copyFile(entryFile, new URL('index.html', routeDirectory))
}
