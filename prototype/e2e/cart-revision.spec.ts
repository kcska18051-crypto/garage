import { test } from '@playwright/test'
import { verifyCartRevision } from '../scripts/verify-cart-revision.mjs'

for (const width of [360, 390, 1440, 1920]) {
  test(`cart pricing, account gate and recommendations at ${width}`, async ({ browser, baseURL }) => {
    test.setTimeout(180000)
    await verifyCartRevision(browser, { base: process.env.GARAGE_CART_BASE ?? baseURL, width, screenshotRoot: 'test-results/cart-revision' })
  })
}
