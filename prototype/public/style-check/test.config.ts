import { mergeConfig, defineConfig } from 'vitest/config'
import base from '../../vite.config.ts'

// Separate checks avoid executing copies of public sources from dist/.
export default mergeConfig(base, defineConfig({
  test: { include: ['public/style-check/src/*.check.tsx'] },
}))
