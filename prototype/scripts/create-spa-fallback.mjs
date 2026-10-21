import { copyFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { createServer } from 'vite'

export async function loadPublicRoutes() {
  const server = await createServer({ server:{middlewareMode:true}, appType:'custom' })
  try { return (await server.ssrLoadModule('/src/data/publicRoutes.ts')).publicRoutes }
  finally { await server.close() }
}
export async function writeSpaRoutes(outputDirectory, routes) {
  const entryFile=new URL('index.html',outputDirectory)
  await copyFile(entryFile,new URL('404.html',outputDirectory))
  for(const route of routes) {
    const path=route.replace(/^\/+|\/+$/g,'')
    if(!path) continue
    if(!/^[a-zA-Z0-9\/_-]+$/.test(path) || path.split('/').includes('..')) throw Error(`Unsafe public route: ${route}`)
    const directory=new URL(`${path}/`,outputDirectory)
    await mkdir(directory,{recursive:true})
    await copyFile(entryFile,new URL('index.html',directory))
  }
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const routes=await loadPublicRoutes()
  await writeSpaRoutes(new URL('../dist/',import.meta.url),routes)
  console.log(`Published ${routes.length} implemented routes and a 404 fallback`)
}
