# Catalog Tag and Header Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove product counts from quick-selection tags and category headers while preserving counts in the full filter and product-listing toolbar.

**Architecture:** Keep all `count` fields in catalog data and change only the rendering boundaries. `TagGroups` renders the tag label without its count; both category page headers stop rendering their duplicate total; `ProductListing` and `FilterPanel` remain the authoritative result-count surfaces.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library, Playwright, Vite, GitHub Pages

## Global Constraints

- Quick-selection chips contain only their value labels.
- Keep tag selection, active state, URL state, and «Показать все» behavior unchanged.
- Remove the separate total from both first- and second-level category headers.
- Keep `Найдено N товаров` immediately above each product listing.
- Keep per-option counts in the full filter unchanged.
- Do not change category-card, brand-block, or mobile filter apply-button counts.

---

### Task 1: Enforce count placement in catalog UI

**Files:**
- Modify: `prototype/src/features/catalog/useCatalogListing.test.tsx`
- Modify: `prototype/src/features/catalog/ProductListing.test.tsx`
- Modify: `prototype/e2e/catalog.spec.ts`
- Modify: `prototype/src/features/catalog/TagGroups.tsx`
- Modify: `prototype/src/pages/CatalogCategoryPage.tsx`
- Modify: `prototype/src/pages/CatalogSubcategoryPage.tsx`

**Interfaces:**
- Consumes: `TagGroup.values[].label`, `TagGroup.values[].count`, `ProductListing`, and both category page headers.
- Produces: label-only quick tags, count-free top headers, preserved filter-option counts, and preserved listing totals.

- [ ] **Step 1: Add failing unit assertions for tag and filter text**

In the existing `TagGroups` expansion test, add:

```ts
expect(screen.getByRole('button', { name: 'Тег Remeza' })).toHaveTextContent(/^Remeza$/)
```

In `ProductListing.test.tsx`, add to the full-filter count test:

```ts
expect(screen.getByLabelText('Remeza').closest('label')).toHaveTextContent('Remeza6')
```

- [ ] **Step 2: Add a failing E2E test for both category headers and listing totals**

Add to `prototype/e2e/catalog.spec.ts`:

```ts
test('counts appear only in filters and directly above product results', async ({ page }) => {
  await page.goto('/catalog/compressor-equipment')
  await expect(page.locator('.catalog-page__header').getByText(/\d+ товар/)).toHaveCount(0)
  await expect(page.locator('.catalog-listing__toolbar').getByText('Найдено 32 товара')).toBeVisible()

  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await expect(page.locator('.catalog-page__header').getByText(/\d+ товар/)).toHaveCount(0)
  await expect(page.locator('.catalog-listing__toolbar').getByText(/Найдено \d+ товар/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Тег Remeza' })).toHaveText('Remeza')
  const fullFilterBrand = page.locator('.catalog-listing__sidebar').getByLabel('Remeza', { exact: true })
  await expect(fullFilterBrand.locator('xpath=..')).toContainText(/\d+/)
})
```

- [ ] **Step 3: Run focused tests and verify the expected failures**

Run:

```bash
npm run test:run -- useCatalogListing.test.tsx ProductListing.test.tsx
npx playwright test e2e/catalog.spec.ts --grep "counts appear only" --project=desktop
```

Expected: the tag text assertion fails because the button still includes a number, and the E2E test fails because the category header still contains a total.

- [ ] **Step 4: Remove count rendering from quick tags**

Change the tag button body in `TagGroups.tsx` from:

```tsx
{tag.label}<small>{tag.count}</small>
```

to:

```tsx
{tag.label}
```

Do not change the `TagValue` type or `catalogData.ts`.

- [ ] **Step 5: Remove totals from both top headers**

In `CatalogCategoryPage.tsx`, remove:

```tsx
<strong>{catalogProducts.length} товаров в демонстрационной выдаче</strong>
```

In `CatalogSubcategoryPage.tsx`, remove:

```tsx
<strong>{products.length} товаров</strong>
```

Keep descriptions and every `ProductListing` instance unchanged.

- [ ] **Step 6: Run focused tests and verify they pass**

Run:

```bash
npm run test:run -- useCatalogListing.test.tsx ProductListing.test.tsx
npx playwright test e2e/catalog.spec.ts --grep "counts appear only" --project=desktop
```

Expected: both unit-test files and the focused E2E test pass.

- [ ] **Step 7: Run complete verification**

Run:

```bash
npm run test:run
npm run build:pages
npm run test:e2e
```

Expected: all unit tests and E2E tests pass, and the Pages build exits with code 0.

- [ ] **Step 8: Commit the implementation**

```bash
git add prototype/src/features/catalog/useCatalogListing.test.tsx prototype/src/features/catalog/ProductListing.test.tsx prototype/e2e/catalog.spec.ts prototype/src/features/catalog/TagGroups.tsx prototype/src/pages/CatalogCategoryPage.tsx prototype/src/pages/CatalogSubcategoryPage.tsx
git commit -m "fix: simplify catalog count placement"
```

### Task 2: Publish and verify GitHub Pages

**Files:**
- No source files modified.

**Interfaces:**
- Consumes: branch `codex/homepage-prototype` and the Pages deployment workflow.
- Produces: updated public category pages.

- [ ] **Step 1: Push the branch**

```bash
git push origin codex/homepage-prototype
```

- [ ] **Step 2: Wait for deployment**

```powershell
$runId = gh run list --workflow deploy-prototype-pages.yml --branch codex/homepage-prototype --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch $runId --exit-status
```

Expected: build and deploy jobs complete successfully.

- [ ] **Step 3: Verify public pages**

Check both public routes at 1920, 1440, 390, and 360 px:

```text
https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment
https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment/screw-compressors
```

Expected: quick tags contain no product counts; both top headers contain no totals; toolbar and full-filter counts remain visible; no horizontal overflow is introduced.
