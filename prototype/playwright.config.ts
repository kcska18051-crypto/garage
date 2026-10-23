import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://127.0.0.1:43991'
const acceptedCookieState = {
  cookies: [],
  origins: [{ origin: baseURL, localStorage: [{ name: 'garage-cookie-preference', value: JSON.stringify({ version: 1, choice: 'necessary' }) }] }],
}

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
    storageState: acceptedCookieState,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
})
