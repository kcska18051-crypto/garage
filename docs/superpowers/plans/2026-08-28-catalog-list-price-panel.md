# Catalog List Price Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make price and purchase action immediately visible in desktop list-mode product cards.

**Architecture:** Add a semantic price label to the existing card bottom block, then style that block as a dedicated right-hand purchase panel only when its parent results container is in list mode. Keep tile and mobile layouts unchanged through scoped selectors and the existing mobile reset.

**Tech Stack:** React 19, TypeScript, CSS, Playwright, Vite, GitHub Pages.

## Global Constraints

- Work on `codex/homepage-prototype` in `C:\Users\Admin\garage-work\garage`.
- Preserve all commerce handlers and product data.
- Apply the panel only to `.catalog-results--list` above 767 px.
- Keep the list at one outer column on 1440 and 1920 px.
- Publish the verified result through the existing GitHub Pages workflow.

---

### Task 1: Add and style the list price panel

**Files:**
- Modify: `prototype/e2e/catalog.spec.ts`
- Modify: `prototype/src/features/catalog/CatalogProductCard.tsx`
- Modify: `prototype/src/features/catalog/Catalog.css`

**Interfaces:**
- Consumes: the existing `.catalog-product-card__bottom` block and list-mode parent class.
- Produces: `.catalog-product-card__price-label` and a visually distinct list purchase panel.

- [ ] **Step 1: Write the failing E2E test**

Add a test that opens the screw-compressor category at 1920 px, switches to list view, and asserts that the first card has a visible «Цена» label, a price font of at least 20 px, a panel width of at least 160 px, and a purchase button nearly as wide as the panel.

```ts
test('list cards expose a distinct readable price panel', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await page.getByRole('button', { name: 'Список' }).click()

  const card = page.locator('.catalog-product-card').first()
  await expect(card.getByText('Цена', { exact: true })).toBeVisible()
  const metrics = await card.locator('.catalog-product-card__bottom').evaluate((panel) => {
    const price = panel.querySelector('strong')!
    const action = panel.querySelector('button')!
    return {
      panelWidth: panel.getBoundingClientRect().width,
      actionWidth: action.getBoundingClientRect().width,
      priceSize: Number.parseFloat(getComputedStyle(price).fontSize),
    }
  })
  expect(metrics.panelWidth).toBeGreaterThanOrEqual(160)
  expect(metrics.actionWidth).toBeGreaterThanOrEqual(metrics.panelWidth - 40)
  expect(metrics.priceSize).toBeGreaterThanOrEqual(20)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:e2e -- --grep "distinct readable price panel"`

Expected: failure because «Цена» is absent.

- [ ] **Step 3: Add the price label**

Inside the price wrapper in `CatalogProductCard.tsx`, add:

```tsx
<small className="catalog-product-card__price-label">Цена</small>
```

- [ ] **Step 4: Style the desktop list panel**

Keep the label hidden by default. In list mode, give the bottom block a 10–12 rem third column, neutral background, left border, safe top padding, vertical price stack, larger current price, and a full-width purchase button. In the existing `max-width: 767px` rule, restore the ordinary bottom block so tile/mobile behavior remains unchanged.

- [ ] **Step 5: Run focused and full verification**

Run:

```powershell
npm run test:e2e -- --grep "distinct readable price panel"
npm test -- --run
npm run build:pages
npm run test:e2e
```

Expected: all commands exit 0.

- [ ] **Step 6: Commit, push, and verify Pages**

```powershell
git add -- prototype/src/features/catalog/CatalogProductCard.tsx prototype/src/features/catalog/Catalog.css prototype/e2e/catalog.spec.ts
git commit -m "fix: emphasize prices in catalog list view"
git push origin codex/homepage-prototype
```

Wait for the Pages workflow and verify the public `?view=list` URL at 1920 px.
