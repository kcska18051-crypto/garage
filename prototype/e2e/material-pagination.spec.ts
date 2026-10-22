import { test } from '@playwright/test'
import { verifyMaterialPagination } from '../scripts/verify-material-pagination.mjs'

for (const width of [360, 390, 768, 1024, 1440, 1920, 2560]) {
  test(`nine materials per page with real controls at ${width}`, async ({ browser, baseURL }) => {
    test.setTimeout(120000)
    await verifyMaterialPagination(browser, { base: baseURL, width, fixtures: true, screenshotRoot: 'test-results/material-pagination' })
  })
}
