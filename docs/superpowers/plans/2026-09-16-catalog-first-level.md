# Catalog First-Level Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the responsive first-level catalog prototype with expandable desktop cards, a compact mobile root list, and reusable category landing routes for all six demonstration categories.

**Architecture:** A normalized catalog data model is the single source for desktop cards, mobile rows, and category landing pages. Root catalog rendering uses separate semantic desktop and mobile components selected by CSS; route-level category lookup uses one reusable page while preserving the existing compressor listing route.

**Tech Stack:** React 19, TypeScript, React Router 7, CSS, Vitest, Testing Library, Playwright, Vite.

**Spec:** `docs/superpowers/specs/2026-09-16-catalog-first-level-design.md`

## Global Constraints

- Preserve the existing `Header`, `Footer`, compressor listing, nested compressor routes, and the locked homepage popular-category layout.
- Use exactly six demonstration first-level categories: compressors, lifting equipment, body repair, painting, tools, and service-station equipment.
- Desktop at 1200 px and wider uses three cards per row; tablet from 768 through 1199 px uses two cards per row; mobile below 768 px uses a vertical category list.
- Expansion state is local to each desktop card and never appears in the URL.
- Every category and subcategory is a real React Router link with a permanent human-readable URL.
- No production implementation is written before its corresponding test has failed for the expected missing behavior.

---

### Task 1: Normalize Catalog Data and Product-Count Grammar

**Files:**
- Modify: `prototype/src/data/catalogTypes.ts`
- Modify: `prototype/src/data/catalogData.ts`
- Create: `prototype/src/data/catalogData.test.ts`

**Interfaces:**
- Produces: `CatalogRootCategory`, `CatalogRootSubcategory`, `catalogCategories: CatalogRootCategory[]`, `getCatalogCategory(slug)`, and `formatProductCount(count)`.
- Consumes: existing compressor URLs and `compressorSubcategories` names.

- [ ] **Step 1: Write the failing data-contract tests**

```tsx
import { catalogCategories, formatProductCount, getCatalogCategory } from './catalogData'

describe('first-level catalog data', () => {
  it('contains six routable categories with more than five linked subcategories', () => {
    expect(catalogCategories).toHaveLength(6)
    expect(catalogCategories.map(({ slug }) => slug)).toEqual([
      'compressor-equipment', 'lifting-equipment', 'body-repair',
      'painting', 'tools', 'service-station-equipment',
    ])
    for (const category of catalogCategories) {
      expect(category.href).toBe(`/catalog/${category.slug}`)
      expect(category.subcategories.length).toBeGreaterThan(5)
      expect(category.subcategories.every(({ href }) => href.startsWith(`${category.href}/`))).toBe(true)
    }
  })

  it.each([[1, '1 товар'], [2, '2 товара'], [5, '5 товаров'], [11, '11 товаров'], [21, '21 товар'], [114, '114 товаров']])(
    'formats %i as %s', (count, expected) => expect(formatProductCount(count)).toBe(expected),
  )

  it('finds a category by slug without inventing an unknown category', () => {
    expect(getCatalogCategory('tools')?.name).toBe('Инструмент')
    expect(getCatalogCategory('missing')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm run test:run -- src/data/catalogData.test.ts`

Expected: FAIL because `slug`, `subcategories`, `getCatalogCategory`, and `formatProductCount` do not yet exist.

- [ ] **Step 3: Add the normalized types and data helpers**

```ts
export type CatalogRootSubcategory = {
  id: string
  name: string
  href: string
  artVariant: number
}

export type CatalogRootCategory = {
  id: string
  slug: string
  name: string
  href: string
  count: number
  artVariant: number
  subcategories: CatalogRootSubcategory[]
}

export const getCatalogCategory = (slug: string | undefined) =>
  catalogCategories.find((category) => category.slug === slug)

export function formatProductCount(count: number) {
  const lastTwo = count % 100
  const last = count % 10
  const word = lastTwo >= 11 && lastTwo <= 14 ? 'товаров' : last === 1 ? 'товар' : last >= 2 && last <= 4 ? 'товара' : 'товаров'
  return `${count} ${word}`
}
```

Use a small factory and explicit data so every URL is reviewable:

```ts
const children = (parent: string, names: Array<[string, string]>) => names.map(([id, name], index) => ({
  id, name, href: `/catalog/${parent}/${id}`, artVariant: index % 4,
}))

export const catalogCategories: CatalogRootCategory[] = [
  { id: 'compressor-equipment', slug: 'compressor-equipment', name: 'Компрессоры', href: '/catalog/compressor-equipment', count: 164, artVariant: 0, subcategories: children('compressor-equipment', [
    ['screw-compressors', 'Винтовые компрессоры'], ['piston-compressors', 'Поршневые компрессоры'], ['oil-free-compressors', 'Безмасляные компрессоры'], ['receivers', 'Ресиверы'], ['dryers', 'Осушители'], ['compressor-accessories', 'Комплектующие'],
  ]) },
  { id: 'lifting-equipment', slug: 'lifting-equipment', name: 'Подъёмное оборудование', href: '/catalog/lifting-equipment', count: 238, artVariant: 1, subcategories: children('lifting-equipment', [
    ['car-lifts', 'Автоподъёмники'], ['jacks', 'Домкраты'], ['stands', 'Стойки'], ['cranes', 'Краны'], ['presses', 'Прессы'], ['wheel-lifters', 'Колёсные подъёмники'],
  ]) },
  { id: 'body-repair', slug: 'body-repair', name: 'Кузовной ремонт', href: '/catalog/body-repair', count: 412, artVariant: 2, subcategories: children('body-repair', [
    ['frame-machines', 'Стапели'], ['spotters', 'Споттеры'], ['straightening-tools', 'Рихтовочный инструмент'], ['welding', 'Сварочное оборудование'], ['measuring', 'Измерительные системы'], ['body-clamps', 'Зажимы и захваты'],
  ]) },
  { id: 'painting', slug: 'painting', name: 'Покраска', href: '/catalog/painting', count: 527, artVariant: 3, subcategories: children('painting', [
    ['spray-guns', 'Краскопульты'], ['paint-booths', 'Покрасочные камеры'], ['sanders', 'Шлифовальные машинки'], ['preparation', 'Подготовка поверхности'], ['drying', 'Сушка'], ['painting-accessories', 'Малярные принадлежности'],
  ]) },
  { id: 'tools', slug: 'tools', name: 'Инструмент', href: '/catalog/tools', count: 1184, artVariant: 0, subcategories: children('tools', [
    ['hand-tools', 'Ручной инструмент'], ['pneumatic-tools', 'Пневмоинструмент'], ['power-tools', 'Электроинструмент'], ['tool-sets', 'Наборы инструментов'], ['storage', 'Тележки и хранение'], ['special-tools', 'Специальный инструмент'],
  ]) },
  { id: 'service-station-equipment', slug: 'service-station-equipment', name: 'Оснащение автосервиса', href: '/catalog/service-station-equipment', count: 296, artVariant: 1, subcategories: children('service-station-equipment', [
    ['diagnostics', 'Диагностика'], ['tire-service', 'Шиномонтаж'], ['oil-service', 'Замена масла'], ['cleaning', 'Мойка и уборка'], ['workbenches', 'Верстаки'], ['service-furniture', 'Мебель для сервиса'],
  ]) },
]
```

- [ ] **Step 4: Run the data tests and verify GREEN**

Run: `npm run test:run -- src/data/catalogData.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the data contract**

```powershell
git add prototype/src/data/catalogTypes.ts prototype/src/data/catalogData.ts prototype/src/data/catalogData.test.ts
git commit -m "feat: define first-level catalog data"
```

---

### Task 2: Build Accessible Expandable Desktop Cards

**Files:**
- Create: `prototype/src/features/catalog/CatalogRootCard.tsx`
- Create: `prototype/src/features/catalog/CatalogRootCard.test.tsx`
- Modify: `prototype/src/features/catalog/CategoryGrid.tsx`

**Interfaces:**
- Consumes: `CatalogRootCategory` and `formatProductCount` from Task 1.
- Produces: `CatalogRootCard({ category })` with independent `expanded` state and `CatalogRootGrid({ items })`.

- [ ] **Step 1: Write the failing interaction tests**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { catalogCategories } from '../../data/catalogData'
import { CatalogRootCard } from './CatalogRootCard'

it('shows five links and exposes the remaining links with an accessible button', async () => {
  render(<MemoryRouter><CatalogRootCard category={catalogCategories[0]} /></MemoryRouter>)
  const button = screen.getByRole('button', { name: /Ещё \d+ категорий/ })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(screen.getByRole('link', { name: catalogCategories[0].subcategories[5].name })).not.toBeVisible()
  await userEvent.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: catalogCategories[0].subcategories[5].name })).toBeVisible()
  expect(button).toHaveTextContent('Свернуть')
})

it('keeps another card collapsed when one card expands', async () => {
  render(<MemoryRouter><><CatalogRootCard category={catalogCategories[0]} /><CatalogRootCard category={catalogCategories[1]} /></></MemoryRouter>)
  const buttons = screen.getAllByRole('button', { name: /Ещё \d+ категорий/ })
  await userEvent.click(buttons[0])
  expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
  expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
})
```

- [ ] **Step 2: Run the component test and verify RED**

Run: `npm run test:run -- src/features/catalog/CatalogRootCard.test.tsx`

Expected: FAIL because `CatalogRootCard` is missing.

- [ ] **Step 3: Implement the card with all subcategories in the DOM**

Implement the component with all links present from the first render:

```tsx
export function CatalogRootCard({ category }: { category: CatalogRootCategory }) {
  const [expanded, setExpanded] = useState(false)
  const extraId = useId()
  const primary = category.subcategories.slice(0, 5)
  const extra = category.subcategories.slice(5)
  return <article className="catalog-root-card" data-testid="catalog-root-card">
    <div className={`catalog-root-card__art catalog-art--${category.artVariant}`} aria-hidden="true"><i /><b /></div>
    <Link className="catalog-root-card__title" to={category.href}>{category.name}</Link>
    <p className="catalog-root-card__count">{formatProductCount(category.count)}</p>
    <ul>{primary.map((item) => <li key={item.id}><Link to={item.href}>{item.name}</Link></li>)}</ul>
    {extra.length > 0 && <>
      <ul id={extraId} hidden={!expanded}>{extra.map((item) => <li key={item.id}><Link to={item.href}>{item.name}</Link></li>)}</ul>
      <button type="button" aria-expanded={expanded} aria-controls={extraId} onClick={() => setExpanded((value) => !value)}>
        {expanded ? 'Свернуть' : `Ещё ${extra.length} категорий`}
      </button>
    </>}
  </article>
}
```

- [ ] **Step 4: Run the component tests and verify GREEN**

Run: `npm run test:run -- src/features/catalog/CatalogRootCard.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the accessible card**

```powershell
git add prototype/src/features/catalog/CatalogRootCard.tsx prototype/src/features/catalog/CatalogRootCard.test.tsx prototype/src/features/catalog/CategoryGrid.tsx
git commit -m "feat: add expandable catalog cards"
```

---

### Task 3: Add Mobile Root List and Reusable Category Landing Pages

**Files:**
- Create: `prototype/src/features/catalog/CatalogMobileList.tsx`
- Create: `prototype/src/features/catalog/CatalogSectionList.tsx`
- Modify: `prototype/src/pages/CatalogPage.tsx`
- Create: `prototype/src/pages/CatalogSectionPage.tsx`
- Modify: `prototype/src/pages/CatalogCategoryPage.tsx`
- Modify: `prototype/src/app/routes.tsx`
- Modify: `prototype/src/pages/routes.test.tsx`

**Interfaces:**
- Consumes: `catalogCategories` and `getCatalogCategory` from Task 1.
- Produces: mobile root rows, reusable section list, and `/catalog/:categorySlug` routing for five generic sections while retaining the specialized compressor page.

- [ ] **Step 1: Write failing route and rendering tests**

Add these behaviors to `routes.test.tsx`:

```tsx
it('renders the catalog root from the normalized six-category model', () => {
  render(<MemoryRouter initialEntries={['/catalog']}><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1, name: 'Каталог' })).toBeInTheDocument()
  expect(screen.getAllByTestId('catalog-mobile-row')).toHaveLength(6)
  expect(screen.getAllByTestId('catalog-root-card')).toHaveLength(6)
})

it('uses one category landing template for a generic first-level section', () => {
  render(<MemoryRouter initialEntries={['/catalog/lifting-equipment']}><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1, name: 'Подъёмное оборудование' })).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
  expect(screen.getAllByTestId('catalog-section-row').length).toBeGreaterThan(5)
})

it('shows 404 for an unknown first-level catalog slug', () => {
  render(<MemoryRouter initialEntries={['/catalog/not-a-category']}><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run route tests and verify RED**

Run: `npm run test:run -- src/pages/routes.test.tsx`

Expected: FAIL because the new lists, route template, and unknown-category handling are missing.

- [ ] **Step 3: Implement the shared lists and routes**

Render both root representations in `CatalogPage` with classes `catalog-root-desktop` and `catalog-root-mobile`; CSS will expose exactly one. Register specialized routes before the generic route:

```tsx
<Route path="/catalog/compressor-equipment" element={<CatalogCategoryPage />} />
<Route path="/catalog/compressor-equipment/:subcategorySlug" element={<CatalogSubcategoryPage />} />
<Route path="/catalog/compressor-equipment/:subcategorySlug/:childSlug" element={<CatalogSubcategoryPage />} />
<Route path="/catalog/:categorySlug" element={<CatalogSectionPage />} />
```

`CatalogSectionPage` reads `categorySlug`, resolves it with `getCatalogCategory`, renders `<NotFoundPage />` when absent, and otherwise renders breadcrumbs, H1, and `CatalogSectionList`.

- [ ] **Step 4: Run route tests and verify GREEN**

Run: `npm run test:run -- src/pages/routes.test.tsx`

Expected: PASS with the existing compressor route tests still green.

- [ ] **Step 5: Commit routing and mobile structure**

```powershell
git add prototype/src/features/catalog/CatalogMobileList.tsx prototype/src/features/catalog/CatalogSectionList.tsx prototype/src/pages/CatalogPage.tsx prototype/src/pages/CatalogSectionPage.tsx prototype/src/pages/CatalogCategoryPage.tsx prototype/src/app/routes.tsx prototype/src/pages/routes.test.tsx
git commit -m "feat: add responsive catalog section routes"
```

---

### Task 4: Implement Responsive Layout, Hover, Focus, and Reduced Motion

**Files:**
- Modify: `prototype/src/features/catalog/Catalog.css`
- Modify: `prototype/e2e/catalog.spec.ts`

**Interfaces:**
- Consumes: class names emitted by Tasks 2 and 3.
- Produces: 3-column desktop, 2-column tablet, vertical mobile list, bounded art hover, focus-visible treatment, and reduced-motion behavior.

- [ ] **Step 1: Add failing Playwright layout and interaction tests**

```ts
for (const viewport of [
  { width: 1920, height: 1080, columns: 3 },
  { width: 1440, height: 900, columns: 3 },
  { width: 1024, height: 900, columns: 2 },
  { width: 768, height: 900, columns: 2 },
]) {
  test(`catalog root uses ${viewport.columns} columns at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/catalog')
    await expect(page.locator('.catalog-root-desktop')).toBeVisible()
    const columns = await page.locator('.catalog-root-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(viewport.columns)
  })
}

for (const width of [390, 360]) {
  test(`catalog root is a compact list at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/catalog')
    await expect(page.locator('.catalog-root-desktop')).toBeHidden()
    await expect(page.getByTestId('catalog-mobile-row')).toHaveCount(6)
    await expect(page.locator('.catalog-root-mobile')).not.toContainText(/\d+ товар/)
    await expect(page.locator('.catalog-root-mobile').getByRole('button')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}
```

Add the desktop interaction and navigation check:

```ts
test('one catalog card expands independently and a category opens its landing page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalog')
  const cards = page.getByTestId('catalog-root-card')
  const firstButton = cards.nth(0).getByRole('button')
  const secondButton = cards.nth(1).getByRole('button')
  await firstButton.click()
  await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  await expect(secondButton).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('link', { name: 'Подъёмное оборудование', exact: true }).click()
  await expect(page).toHaveURL(/\/catalog\/lifting-equipment$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Подъёмное оборудование' })).toBeVisible()
  await expect(page.getByTestId('catalog-section-row')).toHaveCount(6)
})
```

- [ ] **Step 2: Run the focused E2E tests and verify RED**

Run: `npm run test:e2e -- e2e/catalog.spec.ts --grep "catalog root|expands one"`

Expected: FAIL because responsive classes have no final layout and behavior styling.

- [ ] **Step 3: Implement scoped responsive CSS**

Add these responsive rules, extending them only with the spacing and neutral art needed by the existing token system:

```css
.catalog-root-grid { display: grid; gap: 1rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.catalog-root-mobile { display: none; }
.catalog-root-card { border: 1px solid var(--color-border); border-radius: var(--radius-md); min-width: 0; overflow: hidden; position: relative; }
.catalog-root-card:focus-within { border-color: var(--color-text); }
.catalog-root-row, .catalog-section-row { align-items: center; border-bottom: 1px solid var(--color-border); display: grid; gap: .8rem; grid-template-columns: 3rem minmax(0, 1fr) auto; min-width: 0; text-decoration: none; }

@media (max-width: 1199px) and (min-width: 768px) {
  .catalog-root-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .catalog-root-desktop { display: none; }
  .catalog-root-mobile { display: block; }
}
@media (hover: hover) and (pointer: fine) {
  .catalog-root-card__art { transition: transform .2s ease; }
  .catalog-root-card:hover .catalog-root-card__art { transform: translateY(-.25rem) scale(1.04); }
}
@media (prefers-reduced-motion: reduce) {
  .catalog-root-card, .catalog-root-card__art { transition: none; }
}
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm run test:e2e -- e2e/catalog.spec.ts --grep "catalog root|expands one"`

Expected: PASS.

- [ ] **Step 5: Commit the responsive presentation**

```powershell
git add prototype/src/features/catalog/Catalog.css prototype/e2e/catalog.spec.ts
git commit -m "feat: style responsive first-level catalog"
```

---

### Task 5: Regression Verification, Visual Review, and Publication

**Files:**
- Modify only if a verified regression is found in files already listed above.

**Interfaces:**
- Consumes: the complete feature from Tasks 1–4.
- Produces: a tested production build and published GitHub Pages revision.

- [ ] **Step 1: Run all unit tests**

Run: `npm run test:run`

Expected: all Vitest suites pass without warnings or unhandled errors.

- [ ] **Step 2: Run the full Playwright suite**

Run: `npm run test:e2e`

Expected: all existing and new E2E tests pass.

- [ ] **Step 3: Build the GitHub Pages artifact**

Run: `npm run build:pages`

Expected: TypeScript and Vite complete successfully and `dist/404.html` is generated.

- [ ] **Step 4: Visually inspect control widths**

Open `/catalog` at 1920, 1440, 1024, 768, 390, and 360 px. Open each of the six category routes, expand and collapse two different desktop cards, use keyboard focus, and confirm no horizontal overflow. Capture temporary screenshots only for comparison and remove them before commit.

- [ ] **Step 5: Review and commit any verified correction**

Run: `git diff --check` and `git status --short`.

If a correction was required, add only the affected feature/test files and commit with `fix: polish first-level catalog prototype`. If no correction was required, do not create an empty commit.

- [ ] **Step 6: Push and verify publication**

Run: `git push origin codex/homepage-prototype`, then verify that the public GitHub Pages HTML references the new build assets and that `/garage/catalog` plus all six direct category URLs open successfully.
