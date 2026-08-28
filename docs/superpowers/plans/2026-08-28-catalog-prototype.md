# Catalog Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing «Гараж» homepage prototype with a connected catalog root, compressor-equipment category, and reusable second-level category listing with interactive local filtering.

**Architecture:** Keep the shared application shell, commerce context, tokens, and React Router. Add a typed catalog data module, pure query/filter functions, a URL-backed listing hook, and focused catalog components shared by both listing levels. The root page only navigates categories; the first level uses a reduced filter schema; the second level uses the full category-defined schema and optional tag groups.

**Tech Stack:** React 19, TypeScript 7, React Router 7, Vite 8, Vitest, Testing Library, Playwright, CSS custom properties.

## Global Constraints

- Work only in `C:\Users\Admin\garage-work\garage` on `codex/homepage-prototype`; preserve commit `80db320` and all existing work.
- Keep all catalog data local and separate from React components; do not add backend, 1C, real stock, real regional delivery, or product-detail scope.
- Keep the existing header, footer, mobile bottom navigation, commerce state, and monochrome visual system.
- Use `--container` everywhere; switch it from `90rem` to `96rem` at `min-width: 1680px`.
- Required viewports are 1920, 1440/1340, 768, 390, and 360 pixels.
- Product results use three columns beside the filter at the default desktop container and four at the wide container.
- Filter and tag state is shareable through the URL; tags and ordinary filters remain separate query mechanisms.
- Desktop filters apply immediately except numeric fields, which apply on blur or Enter; mobile filters use a draft and an explicit “Показать N товаров” action.
- No new visual style or alternate shell is introduced.

---

## File Map

- `prototype/src/data/catalogTypes.ts`: catalog domain types, filter schema, tag schema, and listing state interfaces.
- `prototype/src/data/catalogData.ts`: local categories, subcategories, brands, tags, and products.
- `prototype/src/features/catalog/catalogFilters.ts`: pure query parsing, serialization, filtering, sorting, and pagination.
- `prototype/src/features/catalog/useCatalogListing.ts`: URL-backed listing state and mobile-draft application.
- `prototype/src/features/catalog/Breadcrumbs.tsx`: shared accessible breadcrumb navigation.
- `prototype/src/features/catalog/CategoryGrid.tsx`: root and first-level category cards.
- `prototype/src/features/catalog/TagGroups.tsx`: optional expandable tag navigation.
- `prototype/src/features/catalog/FilterPanel.tsx`: schema-driven collapsible desktop/mobile filter controls.
- `prototype/src/features/catalog/ActiveFilters.tsx`: removable chips and clear-all action.
- `prototype/src/features/catalog/CatalogProductCard.tsx`: rich grid/list product card using `useCommerce`.
- `prototype/src/features/catalog/ProductListing.tsx`: result toolbar, filter layout, view switcher, pagination, show-more, and empty state.
- `prototype/src/features/catalog/Catalog.css`: catalog page, listing, card, tag, filter, responsive, and widescreen rules.
- `prototype/src/pages/CatalogPage.tsx`: catalog root without filters or product issue.
- `prototype/src/pages/CatalogCategoryPage.tsx`: compressor-equipment first level with reduced filter schema.
- `prototype/src/pages/CatalogSubcategoryPage.tsx`: reusable second level with full filter schema and optional tags.
- `prototype/src/app/routes.tsx`: concrete catalog routes before the placeholder wildcard.
- `prototype/src/styles/tokens.css`: semantic default and wide container tokens.
- `prototype/src/data/prototypeData.ts`: homepage compressor category and two additional wide-screen products.
- `prototype/src/features/products/ProductShowcase.tsx` and `.css`: eight products below 1680, ten and five columns above.
- `prototype/src/features/header/DesktopHeader.tsx`: real compressor route in catalog menu and close-on-navigation behavior.
- Unit tests colocated with filters, listing, routes, and navigation; E2E tests in `prototype/e2e/catalog.spec.ts` and `responsive.spec.ts`.

---

### Task 1: Implement the Approved Wide Container

**Files:**
- Modify: `prototype/src/styles/tokens.css`
- Modify: `prototype/src/data/prototypeData.ts`
- Modify: `prototype/src/features/products/ProductShowcase.tsx`
- Modify: `prototype/src/features/products/ProductCard.css`
- Modify: `prototype/e2e/responsive.spec.ts`

**Interfaces:**
- Produces: `--container-default`, `--container-wide`, and active `--container` tokens.
- Produces: ten homepage products, with `.product-card:nth-child(n + 9)` visible only from 1680 pixels.

- [ ] **Step 1: Add failing Playwright coverage for 1920 pixels**

Add a `1920 × 1080` case that asserts no overflow, a 1536-pixel `.home-section` outer width, five computed product columns, and ten visible `.product-card` elements.

```ts
test('uses the approved widescreen container and product grid at 1920px', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')
  await expect(page.locator('.product-card:visible')).toHaveCount(10)
  const layout = await page.locator('.product-showcase').evaluate((section) => ({
    width: section.getBoundingClientRect().width,
    columns: getComputedStyle(section.querySelector('.product-grid')!).gridTemplateColumns.split(' ').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))
  expect(layout).toEqual({ width: 1536, columns: 5, overflow: false })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm run test:e2e -- responsive.spec.ts --project=desktop -g "approved widescreen"`  
Expected: FAIL because only eight cards and four columns are present.

- [ ] **Step 3: Implement the semantic tokens and responsive product count**

Use this token structure and keep existing component references to `--container`:

```css
:root {
  --container-default: 90rem;
  --container-wide: 96rem;
  --container: var(--container-default);
}

@media (min-width: 1680px) {
  :root { --container: var(--container-wide); }
  .product-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .product-showcase .product-card:nth-child(n + 9) { display: flex; }
}
```

Render ten items in `ProductShowcase`, hide items 9–10 by default, and append two typed demo products in `prototypeData.products`.

- [ ] **Step 4: Run regression checks**

Run: `npm run test:run && npm run build && npm run test:e2e -- responsive.spec.ts --project=desktop`  
Expected: all commands PASS; 1440 remains four columns/eight visible products and 1920 becomes five/ten.

- [ ] **Step 5: Commit**

```powershell
git add prototype/src/styles/tokens.css prototype/src/data/prototypeData.ts prototype/src/features/products/ProductShowcase.tsx prototype/src/features/products/ProductCard.css prototype/e2e/responsive.spec.ts
git commit -m "feat: add approved widescreen layout"
```

---

### Task 2: Add Catalog Domain Data and Pure Filtering

**Files:**
- Create: `prototype/src/data/catalogTypes.ts`
- Create: `prototype/src/data/catalogData.ts`
- Create: `prototype/src/features/catalog/catalogFilters.ts`
- Create: `prototype/src/features/catalog/catalogFilters.test.ts`

**Interfaces:**
- Produces: `CatalogProduct`, `CatalogCategory`, `CatalogSubcategory`, `CatalogBrand`, `FilterGroup`, `TagGroup`, `ListingState`.
- Produces: `parseListingState(params)`, `serializeListingState(state)`, `filterCatalogProducts(products, state)`, `sortCatalogProducts(products, sort)`, and `paginateProducts(products, page, pageSize)`.

- [ ] **Step 1: Define failing tests for filter semantics and URL round-tripping**

Cover availability, price, brand, technical characteristics, separate `tag` criteria, zero-result combinations, sorting, and page slicing.

```ts
const state = parseListingState(new URLSearchParams('brand=remeza&voltage=380&tag=pressure%3A10&sort=price-asc&view=list'))
expect(state.brands).toEqual(['remeza'])
expect(state.specs.voltage).toEqual(['380'])
expect(state.tag).toEqual({ group: 'pressure', value: '10' })
expect(serializeListingState(state).get('view')).toBe('list')
expect(filterCatalogProducts(catalogProducts, state).every((product) => product.brandId === 'remeza')).toBe(true)
```

- [ ] **Step 2: Run tests and verify missing-module failure**

Run: `npm run test:run -- src/features/catalog/catalogFilters.test.ts`  
Expected: FAIL because catalog modules do not exist.

- [ ] **Step 3: Create typed reusable data**

Define category-configured filters rather than hard-coding UI groups. Include compressor subcategories, linked brands, at least 24 varied products, disabled zero-count values, optional `tagGroups` for screw compressors, and no `tagGroups` for oil-free compressors. Tag definitions carry `seoIndexable: false`; the prototype must not derive sitemap or indexing behavior from tag availability.

```ts
export type ListingState = {
  availability: string[]
  brands: string[]
  subcategories: string[]
  specs: Record<string, string[]>
  priceFrom?: number
  priceTo?: number
  tag?: { group: string; value: string }
  sort: 'popular' | 'price-asc' | 'price-desc' | 'new' | 'available'
  view: 'grid' | 'list'
  page: number
}
```

- [ ] **Step 4: Implement pure state/query and listing functions**

Treat ordinary filters as repeated named query parameters and tags as one `tag=group:value` criterion. Preserve unrelated catalog UI parameters when updating one field. Filtering must be deterministic and side-effect free.

- [ ] **Step 5: Run tests and build**

Run: `npm run test:run -- src/features/catalog/catalogFilters.test.ts && npm run build`  
Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```powershell
git add prototype/src/data/catalogTypes.ts prototype/src/data/catalogData.ts prototype/src/features/catalog/catalogFilters.ts prototype/src/features/catalog/catalogFilters.test.ts
git commit -m "feat: add reusable catalog data model"
```

---

### Task 3: Add the Catalog Navigation Chain

**Files:**
- Create: `prototype/src/features/catalog/Breadcrumbs.tsx`
- Create: `prototype/src/features/catalog/CategoryGrid.tsx`
- Create: `prototype/src/pages/CatalogPage.tsx`
- Create: `prototype/src/pages/CatalogCategoryPage.tsx`
- Create: `prototype/src/pages/CatalogSubcategoryPage.tsx`
- Create: `prototype/src/features/catalog/Catalog.css`
- Modify: `prototype/src/app/routes.tsx`
- Modify: `prototype/src/data/prototypeData.ts`
- Modify: `prototype/src/features/header/DesktopHeader.tsx`
- Modify: `prototype/src/features/header/Header.tsx`
- Modify: `prototype/src/pages/routes.test.tsx`
- Modify: `prototype/e2e/navigation.spec.ts`

**Interfaces:**
- Produces routes `/catalog`, `/catalog/compressor-equipment`, and `/catalog/compressor-equipment/:subcategorySlug`.
- Produces `Breadcrumbs({ items }: { items: { label: string; to?: string }[] })` and `CatalogCategoryGrid`.

- [ ] **Step 1: Write failing route and navigation tests**

Assert the exact H1 at each route, the breadcrumb chain, the homepage compressor card route, and navigation root → first level → screw compressors.

```tsx
render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)
expect(screen.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' })).toBeInTheDocument()
expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalog')
```

- [ ] **Step 2: Run tests and verify placeholder-page failure**

Run: `npm run test:run -- src/pages/routes.test.tsx`  
Expected: FAIL because `/catalog/*` still renders `PlaceholderPage`.

- [ ] **Step 3: Implement concrete routes before placeholder routes**

Use an index route and exact category route plus dynamic subcategory route. Keep a final `/catalog/*` placeholder only for non-prototyped catalog links.

```tsx
<Route path="/catalog" element={<CatalogPage />} />
<Route path="/catalog/compressor-equipment" element={<CatalogCategoryPage />} />
<Route path="/catalog/compressor-equipment/:subcategorySlug" element={<CatalogSubcategoryPage />} />
```

- [ ] **Step 4: Implement page headers and navigation cards**

The root contains breadcrumbs, H1, main-category cards, popular brands, and short informational copy only. The first level contains breadcrumbs, description, result count, subcategory cards, linked brands, and a placeholder mount point for Task 5’s reduced listing. The second level resolves data by slug and renders sibling links plus mount points for optional tags and the full listing.

- [ ] **Step 5: Connect existing entry points**

Replace the homepage diagnostics category with compressor equipment, point the desktop catalog menu to real routes, add “Все категории”, and close the panel after a catalog link click. Keep hero, footer, mobile menu, and bottom navigation links to `/catalog`.

- [ ] **Step 6: Run unit and E2E navigation tests**

Run: `npm run test:run -- src/pages/routes.test.tsx && npm run test:e2e -- navigation.spec.ts --project=desktop`  
Expected: PASS through the full homepage → catalog → level one → level two chain.

- [ ] **Step 7: Commit**

```powershell
git add prototype/src/features/catalog prototype/src/pages/CatalogPage.tsx prototype/src/pages/CatalogCategoryPage.tsx prototype/src/pages/CatalogSubcategoryPage.tsx prototype/src/app/routes.tsx prototype/src/data/prototypeData.ts prototype/src/features/header/DesktopHeader.tsx prototype/src/features/header/Header.tsx prototype/src/pages/routes.test.tsx prototype/e2e/navigation.spec.ts
git commit -m "feat: add interactive catalog navigation"
```

---

### Task 4: Build URL-Backed Listing State and Tags

**Files:**
- Create: `prototype/src/features/catalog/useCatalogListing.ts`
- Create: `prototype/src/features/catalog/TagGroups.tsx`
- Create: `prototype/src/features/catalog/ActiveFilters.tsx`
- Create: `prototype/src/features/catalog/useCatalogListing.test.tsx`
- Modify: `prototype/src/pages/CatalogSubcategoryPage.tsx`

**Interfaces:**
- Produces: `useCatalogListing({ products, pageSize })` with `state`, `results`, `pageItems`, `setFilter`, `removeCriterion`, `clearAll`, `setSort`, `setView`, `setPage`, and `applyTag`.
- Produces: `TagGroups({ groups, activeTag, onSelect })`; `groups` may be absent and then renders nothing.

- [ ] **Step 1: Write failing hook and tag tests**

Test URL updates, removable chips, clear-all, separate tag query, expand/collapse “Показать все”, and an undefined-tag-groups render with no reserved wrapper.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm run test:run -- src/features/catalog/useCatalogListing.test.tsx`  
Expected: FAIL because the hook and components do not exist.

- [ ] **Step 3: Implement the URL-backed hook**

Use `useSearchParams`; every committed update replaces only catalog-owned query keys and resets `page` to 1. Expose filtered result count for mobile draft application.

- [ ] **Step 4: Implement optional tag groups and active chips**

Show four requested groups (brand, voltage, performance, pressure), initially limit long groups, and use a real button for “Показать все”. A selected tag adds a chip prefixed with “Тег:” but does not check the equivalent filter checkbox.

- [ ] **Step 5: Demonstrate the no-tag template**

Resolve `/oil-free-compressors` through the same page component with `tagGroups` undefined. Its sibling link must produce no `.catalog-tags` element and no vertical gap.

- [ ] **Step 6: Run tests**

Run: `npm run test:run -- src/features/catalog/useCatalogListing.test.tsx`  
Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add prototype/src/features/catalog/useCatalogListing.ts prototype/src/features/catalog/TagGroups.tsx prototype/src/features/catalog/ActiveFilters.tsx prototype/src/features/catalog/useCatalogListing.test.tsx prototype/src/pages/CatalogSubcategoryPage.tsx
git commit -m "feat: add URL-backed catalog tags"
```

---

### Task 5: Build Schema-Driven Filters and Product Results

**Files:**
- Create: `prototype/src/features/catalog/FilterPanel.tsx`
- Create: `prototype/src/features/catalog/CatalogProductCard.tsx`
- Create: `prototype/src/features/catalog/ProductListing.tsx`
- Create: `prototype/src/features/catalog/ProductListing.test.tsx`
- Modify: `prototype/src/pages/CatalogCategoryPage.tsx`
- Modify: `prototype/src/pages/CatalogSubcategoryPage.tsx`
- Modify: `prototype/src/features/catalog/Catalog.css`

**Interfaces:**
- Consumes: category-defined `FilterGroup[]`, `CatalogProduct[]`, and `useCatalogListing` actions.
- Produces: `ProductListing({ products, filterGroups, mode }: { mode: 'reduced' | 'full' })`.

- [ ] **Step 1: Write failing interaction tests**

Cover collapsible groups, brand search, value counts, disabled zero-count values, show-all, immediate checkbox filtering, price blur, sort, grid/list switch, pagination, show-more, commerce actions, request-price cards, and zero-results reset.

```tsx
await user.click(screen.getByLabelText('Remeza'))
expect(screen.getByText(/Найдено .* товаров/)).toBeInTheDocument()
expect(screen.getByRole('button', { name: 'Удалить фильтр Remeza' })).toBeInTheDocument()
await user.selectOptions(screen.getByLabelText('Сортировка'), 'price-asc')
await user.click(screen.getByRole('button', { name: 'Список' }))
expect(screen.getByTestId('catalog-results')).toHaveClass('catalog-results--list')
```

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm run test:run -- src/features/catalog/ProductListing.test.tsx`  
Expected: FAIL because listing components do not exist.

- [ ] **Step 3: Implement the filter panel**

Render category-configured groups with native disclosure controls. The reduced first-level schema contains subcategory, availability, price, and brand. The full second-level schema additionally contains performance, voltage, power, pressure, receiver volume, lubrication, drive, noise, and country.

- [ ] **Step 4: Implement rich shared product cards**

Show placeholder image, name, SKU, brand, four characteristics, availability, indicative delivery, price and optional old price, favorite, compare, and cart/request-price action. Use existing `useCommerce` IDs so header counters continue to update.

- [ ] **Step 5: Implement the toolbar, results, pagination, and empty state**

Provide count, active chips, four sort modes, grid/list view, numbered accessible pagination, “Показать ещё”, and a clear-filter zero-results action. Page size is 12 on listing pages.

- [ ] **Step 6: Mount reduced and full variants**

First level filters all compressor products with the reduced schema. Second level pre-restricts products by the resolved subcategory and uses the full schema.

- [ ] **Step 7: Run component tests and build**

Run: `npm run test:run -- src/features/catalog/ProductListing.test.tsx && npm run build`  
Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add prototype/src/features/catalog/FilterPanel.tsx prototype/src/features/catalog/CatalogProductCard.tsx prototype/src/features/catalog/ProductListing.tsx prototype/src/features/catalog/ProductListing.test.tsx prototype/src/features/catalog/Catalog.css prototype/src/pages/CatalogCategoryPage.tsx prototype/src/pages/CatalogSubcategoryPage.tsx
git commit -m "feat: add interactive catalog filtering"
```

---

### Task 6: Add Responsive Desktop and Mobile Filter Behavior

**Files:**
- Modify: `prototype/src/features/catalog/FilterPanel.tsx`
- Modify: `prototype/src/features/catalog/ProductListing.tsx`
- Modify: `prototype/src/features/catalog/Catalog.css`
- Create: `prototype/e2e/catalog.spec.ts`

**Interfaces:**
- Produces desktop sticky sidebar at 1024+ pixels.
- Produces mobile modal drawer with isolated draft state and explicit apply/cancel actions below 768 pixels.

- [ ] **Step 1: Write failing E2E tests for desktop and mobile**

Desktop: assert three result columns at 1440 and four at 1920 beside the sidebar. Mobile: open “Фильтры”, select a value without changing the page behind it, apply with “Показать N товаров”, then remove the resulting chip.

- [ ] **Step 2: Run E2E tests and verify responsive failure**

Run: `npm run test:e2e -- catalog.spec.ts`  
Expected: FAIL because the mobile drawer and catalog breakpoints are absent.

- [ ] **Step 3: Implement responsive grid rules**

```css
.catalog-listing__layout { display: grid; grid-template-columns: minmax(15rem, 18rem) minmax(0, 1fr); }
.catalog-results { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (min-width: 1680px) { .catalog-results { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 767px) { .catalog-listing__layout { display: block; } }
```

Use one or two category columns according to available mobile width and one product column at 360–390 pixels. Preserve the shared mobile header, bottom navigation, safe area, and footer.

- [ ] **Step 4: Implement the accessible mobile filter drawer**

Use `role="dialog"`, `aria-modal="true"`, a labelled heading, Escape close, body-scroll protection, and focus restoration. Initialize draft state when opening; Cancel discards it; Apply serializes it to the URL and closes.

- [ ] **Step 5: Run E2E responsive tests**

Run: `npm run test:e2e -- catalog.spec.ts`  
Expected: PASS in desktop and mobile Playwright projects.

- [ ] **Step 6: Commit**

```powershell
git add prototype/src/features/catalog/FilterPanel.tsx prototype/src/features/catalog/ProductListing.tsx prototype/src/features/catalog/Catalog.css prototype/e2e/catalog.spec.ts
git commit -m "feat: add responsive catalog filters"
```

---

### Task 7: Complete Regression and Visual Verification

**Files:**
- Modify: `prototype/e2e/homepage.spec.ts`
- Modify: `prototype/e2e/responsive.spec.ts`
- Modify: `prototype/README.md`

**Interfaces:**
- Produces documented routes and verification commands.
- Produces final evidence for 1920, 1440, 768, 390, and 360 pixels.

- [ ] **Step 1: Add final cross-page assertions**

Check that commerce actions on a catalog card update the existing header counters, breadcrumbs return to root/home, the no-tag sibling has no tag container, and catalog pages have no horizontal overflow at every required width.

- [ ] **Step 2: Update prototype documentation**

Document the three catalog routes, the oil-free no-tag demonstration route, URL-backed filters, and existing local commands. State that `npm run build` performs TypeScript checking and that no separate lint script is configured.

- [ ] **Step 3: Run the full verification suite**

Run:

```powershell
npm run test:run
npm run build
npm run test:e2e
```

Expected: all Vitest tests, TypeScript/Vite production build, and all Playwright projects PASS.

- [ ] **Step 4: Perform visual checks**

Run the app and capture full-page screenshots for `/catalog`, `/catalog/compressor-equipment`, and `/catalog/compressor-equipment/screw-compressors` at 1920 × 1080, 1440 × 900, 768 × 900, 390 × 844, and 360 × 800. Inspect overflow, text length, sidebar/card proportions, sticky behavior, mobile drawer, footer alignment, and the five-column homepage wide grid. Keep generated images in ignored `prototype/artifacts/`.

- [ ] **Step 5: Commit documentation and verification changes**

```powershell
git add prototype/e2e/homepage.spec.ts prototype/e2e/responsive.spec.ts prototype/README.md
git commit -m "test: verify catalog prototype"
```

- [ ] **Step 6: Push the completed branch**

```powershell
git status --short --branch
git push origin codex/homepage-prototype
```

Expected: clean working tree and `codex/homepage-prototype` synchronized with origin.
