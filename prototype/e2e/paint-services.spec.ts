import { test } from '@playwright/test'
import { verifyPaintServices } from '../scripts/verify-paint-services.mjs'

for (const width of [360, 390, 768, 1024, 1440, 1920, 2560]) {
  test(`paint service selection and exact owned requests at ${width}`, async ({ browser, baseURL }) => {
    test.setTimeout(120000)
    await verifyPaintServices(browser, { base: process.env.GARAGE_PAINT_BASE ?? baseURL, width, screenshotRoot: 'test-results/paint-services' })
  })
}
