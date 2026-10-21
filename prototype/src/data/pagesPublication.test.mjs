import { mkdtemp,writeFile,readFile,rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadPublicRoutes,writeSpaRoutes } from '../../scripts/create-spa-fallback.mjs'

it('writes real entry points for implemented screens and existing SKUs but not invented pages',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'garage-pages-'))
  try {
    await writeFile(join(directory,'index.html'),'<html>Garage entry</html>')
    await writeSpaRoutes(pathToFileURL(`${directory}/`),await loadPublicRoutes())
    const servicePaths=['services','services/service-center','services/service-center/compressor-repair',...['screw','piston','diesel'].map(id=>`services/service-center/compressor-repair/${id}`),'services/paint-matching','services/rental',...['hydraulic-jack','tool-set','piston-compressor'].map(id=>`services/rental/${id}`),'services/workshop','profile/services/request']
    for(const path of ['about','news','compare','cart','search','profile/favorites','product/product-1','product/product-2','product/product-5','product/remeza-vk-10-220-55',...servicePaths]) expect(await readFile(join(directory,path,'index.html'),'utf8')).toBe('<html>Garage entry</html>')
    expect(await readFile(join(directory,'404.html'),'utf8')).toBe('<html>Garage entry</html>')
    await expect(readFile(join(directory,'product/not-a-real-sku/index.html'))).rejects.toThrow()
    await expect(readFile(join(directory,'services/rental/not-a-real-item/index.html'))).rejects.toThrow()
  } finally { await rm(directory,{recursive:true,force:true}) }
},20000)
