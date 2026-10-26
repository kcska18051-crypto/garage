import { build } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const here = path.dirname(fileURLToPath(import.meta.url))
await build({
  configFile: false,
  root: path.resolve(here, '../..'),
  base: './',
  publicDir: false,
  build: {
    outDir: path.join(here, 'assets'),
    emptyOutDir: true,
    rolldownOptions: {
      input: path.join(here, 'src/main.tsx'),
      output: { entryFileNames: 'app.js', assetFileNames: 'app.[ext]' },
    },
  },
  esbuild: { jsx: 'automatic' },
})
