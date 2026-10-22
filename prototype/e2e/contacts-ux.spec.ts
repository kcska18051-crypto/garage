import { test } from '@playwright/test'
import { verifyContactPages } from '../scripts/verify-contact-pages.mjs'

for (const width of [360, 390, 1440, 1920]) {
  test(`contact pages and checkout stay independent at ${width}`, async ({ browser, baseURL }) => {
    test.setTimeout(120000)
    await verifyContactPages(browser, { base: process.env.GARAGE_CONTACTS_BASE ?? baseURL, width, screenshotRoot: 'test-results/contact-pages' })
  })
}
