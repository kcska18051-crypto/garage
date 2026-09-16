# Homepage Merchandising Stream Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать управляемую последовательность из четырёх товарных полок и трёх групп компактных баннеров на главной странице.

**Architecture:** `ProductShowcase` и `DividerBanner` остаются базовыми визуальными компонентами. Новый `HomeMerchandisingStream` получает коллекции, баннеры и конфигурацию блоков, фильтрует невидимые элементы и рендерит единый поток без копирования разметки. Порядок задаётся массивом конфигурации, а «Хиты продаж» добавляются как обычная `ProductCollection` с источником `automatic-bestseller`.

**Tech Stack:** React 19, TypeScript 7, React Router 7, CSS, Vitest, Testing Library, Playwright, Vite 8, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-16-homepage-merchandising-stream-design.md`

## Global Constraints

- Меняется только главная страница и общие данные, которые она потребляет.
- Главный баннер остаётся без HTML-текста и CTA.
- После баннера сразу идут ровно шесть популярных категорий.
- Товарные полки: актуальная категория, «Новинки», «Хиты продаж», Remeza.
- Между полками три группы баннеров с составом 2 + 1 + 1.
- Поиск по фотографии не добавляется.
- Мобильные товарные полки сохраняют горизонтальный `scroll-snap`.
- Контрольные ширины: 1920, 1440, 1280, 1024, 768, 390 и 360 px.

---

### Task 1: Failing Acceptance Test for the Approved Sequence

**Files:**
- Modify: `prototype/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: rendered home page.
- Produces: an acceptance test that catches a missing bestseller shelf, incorrect order, duplicate shelf or wrong banner grouping.

- [ ] Add this test before production changes:

```ts
test('homepage renders the configured merchandising stream in the approved order', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('main > .hero + .popular-categories')).toHaveCount(1)
  await expect(page.locator('.popular-categories .category-card')).toHaveCount(6)
  await expect(page.locator('.home-merchandising-stream > .product-showcase')).toHaveCount(4)
  await expect(page.locator('.home-merchandising-stream .product-card')).toHaveCount(20)
  await expect(page.locator('.compact-banner-group')).toHaveCount(3)
  await expect(page.locator('.compact-banner-group .divider-banner')).toHaveCount(4)

  const sequence = await page.locator('.home-merchandising-stream > *').evaluateAll((items) =>
    items.map((item) => item.classList.contains('product-showcase')
      ? item.querySelector('h2')?.textContent
      : `banners:${item.childElementCount}`),
  )
  expect(sequence).toEqual([
    'Оборудование для автосервиса',
    'banners:2',
    'Новинки',
    'banners:1',
    'Хиты продаж',
    'banners:1',
    'Товары Remeza',
  ])
})
```

- [ ] Run: `npm run test:e2e -- --grep "configured merchandising stream"`

Expected: FAIL because `.home-merchandising-stream` and «Хиты продаж» do not exist.

- [ ] Commit the red test:

```bash
git add prototype/e2e/homepage.spec.ts
git commit -m "test: define homepage merchandising sequence"
```

---

### Task 2: Data Contract and Bestseller Collection

**Files:**
- Modify: `prototype/src/data/types.ts`
- Modify: `prototype/src/data/prototypeData.ts`
- Create: `prototype/src/features/home/HomeMerchandisingStream.test.tsx`

**Interfaces:**
- Produces: `HomeMerchandisingBlock = { id: string; collectionId: string; bannerIds: string[]; visible: boolean }`.
- Produces: `prototypeData.productCollections` with `service`, `new`, `bestsellers`, `remeza`.
- Produces: `prototypeData.homeMerchandising` ordered as service → new → bestsellers → remeza.

- [ ] Write a failing data-driven component test using the wished-for API:

```tsx
it('renders only visible blocks in configuration order', () => {
  render(<MemoryRouter><CommerceProvider><HomeMerchandisingStream
    blocks={[
      { id: 'second', collectionId: 'new', bannerIds: [], visible: true },
      { id: 'hidden', collectionId: 'service', bannerIds: [], visible: false },
      { id: 'first', collectionId: 'service', bannerIds: [], visible: true },
    ]}
    collections={prototypeData.productCollections}
    banners={prototypeData.promoBanners}
  /></CommerceProvider></MemoryRouter>)

  expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent))
    .toEqual(['Новинки', 'Оборудование для автосервиса'])
})
```

- [ ] Run: `npm test -- --run src/features/home/HomeMerchandisingStream.test.tsx`

Expected: FAIL because the component and `homeMerchandising` contract do not exist.

- [ ] Add the type and `homeMerchandising` field to `PrototypeData`.

- [ ] Add a bestseller collection using five existing products and source `automatic-bestseller`:

```ts
{
  id: 'bestsellers',
  label: 'Хиты продаж',
  href: '/catalog?collection=bestsellers',
  source: 'automatic-bestseller',
  products: [products[1], products[3], products[4], products[6], products[8]],
}
```

- [ ] Expand `promoBanners` to four neutral banners with existing destinations, then add:

```ts
homeMerchandising: [
  { id: 'service-row', collectionId: 'service', bannerIds: ['season', 'paint'], visible: true },
  { id: 'new-row', collectionId: 'new', bannerIds: ['compressors'], visible: true },
  { id: 'bestseller-row', collectionId: 'bestsellers', bannerIds: ['workshop'], visible: true },
  { id: 'remeza-row', collectionId: 'remeza', bannerIds: [], visible: true },
],
```

- [ ] Run: `npm run build`

Expected: TypeScript reports only the still-missing component import in the new unit test; application data type errors are resolved.

---

### Task 3: Generic Merchandising Stream Component

**Files:**
- Create: `prototype/src/features/home/HomeMerchandisingStream.tsx`
- Create: `prototype/src/features/home/HomeMerchandisingStream.css`
- Modify: `prototype/src/features/home/HomeMerchandisingStream.test.tsx`

**Interfaces:**
- Consumes: `blocks: HomeMerchandisingBlock[]`, `collections: ProductCollection[]`, `banners: PromoBanner[]`.
- Produces: `.home-merchandising-stream`, `.compact-banner-group`, existing `ProductShowcase` and `DividerBanner` instances.

- [ ] Implement the minimal component after the red test:

```tsx
export function HomeMerchandisingStream({ blocks, collections, banners }: Props) {
  return <div className="home-merchandising-stream">
    {blocks.filter((block) => block.visible).map((block) => {
      const collection = collections.find((item) => item.id === block.collectionId)
      if (!collection) return null
      const blockBanners = block.bannerIds
        .map((id) => banners.find((item) => item.id === id))
        .filter((item): item is PromoBanner => Boolean(item))
      return <Fragment key={block.id}>
        <ProductShowcase collection={collection} />
        {blockBanners.length > 0 && <div className={`compact-banner-group compact-banner-group--${blockBanners.length}`}>
          {blockBanners.map((banner, index) => <DividerBanner key={banner.id} item={banner} index={index} />)}
        </div>}
      </Fragment>
    })}
  </div>
}
```

- [ ] Add CSS so a two-banner group is two columns on desktop, one banner keeps the existing container width, and two banners form an 82%-width horizontal rail at 650 px and below.

- [ ] Run: `npm test -- --run src/features/home/HomeMerchandisingStream.test.tsx`

Expected: the data-order test passes.

- [ ] Run: `npm run build`

Expected: build passes.

- [ ] Commit data and component:

```bash
git add prototype/src/data/types.ts prototype/src/data/prototypeData.ts prototype/src/features/home/HomeMerchandisingStream.tsx prototype/src/features/home/HomeMerchandisingStream.css prototype/src/features/home/HomeMerchandisingStream.test.tsx
git commit -m "feat: add configurable homepage merchandising stream"
```

---

### Task 4: Mount the Stream and Remove Hard-Coded Shelf Markup

**Files:**
- Modify: `prototype/src/pages/HomePage.tsx`
- Modify: `prototype/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: `prototypeData.homeMerchandising`, collections and banners.
- Produces: hero → categories → merchandising stream → existing informational sections.

- [ ] Replace the hard-coded `ProductShowcase` and `DividerBanner` sequence with:

```tsx
<HeroSlider slides={prototypeData.slides} />
<CategoryGrid items={prototypeData.categories} />
<HomeMerchandisingStream
  blocks={prototypeData.homeMerchandising}
  collections={prototypeData.productCollections}
  banners={prototypeData.promoBanners}
/>
<BenefitsStrip items={prototypeData.benefits} />
```

- [ ] Keep every later informational component once: `BrandGrid`, `PromotionsSection`, `ServicesSection`, `AboutSection`, `UsefulSection`, `ConsultationCta`.

- [ ] Update obsolete homepage assertions from three shelves/fifteen cards/two banners to four shelves/twenty cards/four banners.

- [ ] Run: `npm run test:e2e -- --grep "configured merchandising stream|brand products appear once|homepage alternates"`

Expected: all selected tests pass after updating their names and expectations to the approved stream.

- [ ] Commit:

```bash
git add prototype/src/pages/HomePage.tsx prototype/e2e/homepage.spec.ts
git commit -m "feat: mount homepage merchandising stream"
```

---

### Task 5: Mobile and Full Verification

**Files:**
- Modify: `prototype/e2e/homepage.spec.ts`
- Modify only if tests expose a defect: `prototype/src/features/home/HomeMerchandisingStream.css`

- [ ] Extend the existing mobile-rails test to expect four product grids and three compact banner groups. Assert every product grid scrolls sideways with its first card between 78% and 86% of the rail width.

- [ ] Assert at 1440 px that the first banner group has two columns and the other groups one column; at 390 px assert the first group scrolls horizontally and single groups do not overflow the viewport.

- [ ] Run focused tests and correct only failures covered by these assertions:

Run: `npm run test:e2e -- e2e/homepage.spec.ts`

- [ ] Run full verification:

```powershell
npm test -- --run
npm run test:e2e
npm run build:pages
git diff --check
```

Expected: all unit tests, all Playwright tests, build and whitespace check pass.

- [ ] Visually inspect local 1440 × 900 and 390 × 844 versions. Confirm the approved order, the banner image-only hero, readable compact banners, mobile swipe and no covered content.

- [ ] Commit any final test-backed CSS correction with `git commit -m "fix: refine homepage merchandising layout"`.

- [ ] Push `codex/homepage-prototype`, wait for `Deploy prototype to GitHub Pages`, and visually verify `https://kcska18051-crypto.github.io/garage/` with a commit cache-buster.

- [ ] Report the public link, final commit SHA, test counts and a concise list of changes.
