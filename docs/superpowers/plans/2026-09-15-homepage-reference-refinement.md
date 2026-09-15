# Homepage Reference Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить первый экран и блок «О компании» главной страницы по утверждённой UX-логике референса, не дублируя существующие акции и товарные подборки.

**Architecture:** Существующий `HeroSlider` остаётся визуальным слайдером без текста и CTA. Новый независимый `HomeOfferGrid` получает шесть ссылок из `prototypeData`, а `AboutSection` переиспользуется с новой внутренней композицией. Существующие `PromotionsSection` и `ProductShowcase` сохраняют данные и порядок; адаптивность задаётся локальными CSS-компонентами и проверяется через Playwright.

**Tech Stack:** React 19, TypeScript 7, React Router 7, CSS, Vitest, Testing Library, Playwright, Vite 8, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-15-homepage-reference-refinement-design.md`

## Global Constraints

- Главный баннер не содержит видимого заголовка, описания или CTA.
- На мобильном главный баннер управляется свайпом и небольшими круглыми индикаторами.
- «Популярные категории» остаются самостоятельной горизонтальной лентой.
- Существующие акции и «Товары Remeza» не дублируются.
- Блок «О компании» не упоминает юридических лиц, магазины и неподтверждённые цифры.
- Новые плитки ведут только на существующие маршруты.
- Контрольные ширины: 1920, 1440, 1280, 1024, 768, 390 и 360 px.
- Нейтральная серая геометрическая айдентика сохраняется; визуальное копирование референса не допускается.

---

## File Structure

- Create: `prototype/src/features/home/HomeOfferGrid.tsx` — вывод шести компактных ссылок первого экрана.
- Create: `prototype/src/features/home/HomeOfferGrid.test.tsx` — модульная проверка состава и ссылок блока.
- Create: `prototype/src/features/home/HomeOfferGrid.css` — сетка 6 × 1 на ПК и 2 × 3 на мобильном.
- Create: `prototype/src/features/home/AboutSection.test.tsx` — проверка новой семантики и запрещённых формулировок.
- Modify: `prototype/src/data/types.ts` — тип `HomeOffer` и поле `homeOffers`.
- Modify: `prototype/src/data/prototypeData.ts` — шесть нейтральных предложений с существующими маршрутами.
- Modify: `prototype/src/pages/HomePage.tsx` — вставка `HomeOfferGrid` между слайдером и категориями без изменения остальных экземпляров секций.
- Modify: `prototype/src/features/home/AboutSection.tsx` — три карточки преимуществ и широкий имиджевый переход.
- Modify: `prototype/src/features/home/LowerSections.css` — новая адаптивная композиция «О компании» и уточнение связки акций с товарами.
- Modify: `prototype/e2e/homepage.spec.ts` — структура первого экрана, отсутствие дублей и адаптивные сценарии.
- Modify: `prototype/e2e/responsive.spec.ts` — отсутствие переполнения на всех контрольных ширинах.

---

### Task 1: Compact Offers Data and Component

**Files:**
- Create: `prototype/src/features/home/HomeOfferGrid.tsx`
- Create: `prototype/src/features/home/HomeOfferGrid.test.tsx`
- Create: `prototype/src/features/home/HomeOfferGrid.css`
- Modify: `prototype/src/data/types.ts`
- Modify: `prototype/src/data/prototypeData.ts`

**Interfaces:**
- Consumes: `HomeOffer[]` with `{ id: string; title: string; href: string }`.
- Produces: `HomeOfferGrid({ items }: { items: HomeOffer[] }): JSX.Element` and `prototypeData.homeOffers`.

- [ ] **Step 1: Write the failing component test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { prototypeData } from '../../data/prototypeData'
import { HomeOfferGrid } from './HomeOfferGrid'

it('renders six compact offers that use existing destinations', () => {
  const { container } = render(
    <MemoryRouter><HomeOfferGrid items={prototypeData.homeOffers} /></MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: 'Подборки для рабочих задач' })).toBeVisible()
  expect(container.querySelectorAll('.home-offer-card')).toHaveLength(6)
  expect(screen.getByRole('link', { name: 'Компрессорное оборудование' })).toHaveAttribute(
    'href',
    '/catalog/compressor-equipment',
  )
})
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run: `npm test -- --run src/features/home/HomeOfferGrid.test.tsx`

Expected: FAIL because `HomeOfferGrid` and `prototypeData.homeOffers` do not exist.

- [ ] **Step 3: Add the data contract and six existing destinations**

Add to `types.ts`:

```ts
export type HomeOffer = { id: string; title: string; href: string }

export type PrototypeData = {
  // existing fields
  homeOffers: HomeOffer[]
}
```

Add to `prototypeData.ts`:

```ts
homeOffers: [
  { id: 'workshop', title: 'Оснащение рабочего поста', href: '/catalog?collection=service' },
  { id: 'compressors', title: 'Компрессорное оборудование', href: '/catalog/compressor-equipment' },
  { id: 'paint', title: 'Покраска и подготовка', href: '/catalog/paint' },
  { id: 'lifting', title: 'Подъёмное оборудование', href: '/catalog/lifting' },
  { id: 'tools', title: 'Инструмент для мастерской', href: '/catalog/tools' },
  { id: 'services', title: 'Сервис и услуги', href: '/services' },
],
```

- [ ] **Step 4: Implement the focused component**

```tsx
import { Link } from 'react-router-dom'
import type { HomeOffer } from '../../data/types'
import './HomeOfferGrid.css'

export function HomeOfferGrid({ items }: { items: HomeOffer[] }) {
  return (
    <section className="home-section home-offers">
      <div className="section-heading"><h2>Подборки для рабочих задач</h2></div>
      <div className="home-offers__grid">
        {items.map((item, index) => (
          <Link className="home-offer-card" to={item.href} key={item.id}>
            <span>{item.title}</span>
            <span className={`home-offer-card__art art-${index}`} aria-hidden="true"><i /><b /></span>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

Implement CSS with exactly six equal columns above 767 px and two equal columns at or below 767 px. Keep cards compact, rounded, neutral grey, and ensure text has a higher stacking level than decoration:

```css
.home-offers__grid { display: grid; gap: .75rem; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.home-offer-card { min-height: 8.5rem; overflow: hidden; position: relative; }
.home-offer-card > span:first-child { position: relative; z-index: 1; }
@media (max-width: 767px) {
  .home-offers__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .home-offer-card { min-height: 7rem; }
}
```

- [ ] **Step 5: Run the focused test and typecheck**

Run: `npm test -- --run src/features/home/HomeOfferGrid.test.tsx`

Expected: 1 test passes.

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 6: Commit the independent component**

```bash
git add prototype/src/data/types.ts prototype/src/data/prototypeData.ts prototype/src/features/home/HomeOfferGrid.tsx prototype/src/features/home/HomeOfferGrid.test.tsx prototype/src/features/home/HomeOfferGrid.css
git commit -m "feat: add compact homepage offers"
```

---

### Task 2: Reference-Inspired About Section

**Files:**
- Create: `prototype/src/features/home/AboutSection.test.tsx`
- Modify: `prototype/src/features/home/AboutSection.tsx`
- Modify: `prototype/src/features/home/LowerSections.css`

**Interfaces:**
- Consumes: existing `/about` route and global button/link styles.
- Produces: `.about-section`, `.about-benefits`, `.about-banner` with exactly three neutral benefit cards and one wide link.

- [ ] **Step 1: Write the failing semantic test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutSection } from './AboutSection'

it('shows three neutral company benefits and one about link', () => {
  const { container } = render(<MemoryRouter><AboutSection /></MemoryRouter>)

  expect(screen.getByRole('heading', { name: 'Оборудование и поддержка для профессиональных задач' })).toBeVisible()
  expect(container.querySelectorAll('.about-benefits article')).toHaveLength(3)
  expect(screen.getByRole('link', { name: /Подробнее о компании/ })).toHaveAttribute('href', '/about')
  expect(container).not.toHaveTextContent(/юридичес|магазин|лет работы|\d+%|\d+\+/i)
})
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run: `npm test -- --run src/features/home/AboutSection.test.tsx`

Expected: FAIL because the current heading, fact grid and copy do not match the approved section.

- [ ] **Step 3: Replace the internal section composition**

Implement `AboutSection` with:

```tsx
const benefits = [
  ['Помогаем с выбором', 'Подбираем направление оборудования и материалов под рабочую задачу.'],
  ['Сопровождаем покупку', 'Показываем доступность и ожидаемый срок для выбранного региона.'],
  ['Профессиональный ассортимент', 'Объединяем оборудование, инструмент и материалы для мастерской.'],
]

export function AboutSection() {
  return (
    <section className="home-section about-section">
      <h2>Оборудование и поддержка для профессиональных задач</h2>
      <div className="about-section__layout">
        <div className="about-benefits">
          {benefits.map(([title, text], index) => (
            <article key={title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <Link className="about-banner" to="/about">
          <span><strong>Знаем оборудование изнутри</strong><small>Подробнее о компании →</small></span>
          <span className="about-banner__art" aria-hidden="true"><i /><b /></span>
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Implement desktop and mobile layouts**

In `LowerSections.css`, replace the obsolete `.about-section__art`, `.about-section__copy` and `.about-facts` rules. Desktop layout uses three compact cards plus the wide banner in one row. Mobile layout keeps the banner full-width below an 82%-width horizontal benefit rail:

```css
.about-section__layout { display: grid; gap: .8rem; grid-template-columns: minmax(0, 1fr) minmax(30rem, 1.45fr); }
.about-benefits { display: grid; gap: .8rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.about-banner { min-height: 13rem; overflow: hidden; position: relative; }
.about-banner > span:first-child { position: relative; z-index: 1; }
@media (max-width: 900px) { .about-section__layout { grid-template-columns: 1fr; } }
@media (max-width: 650px) {
  .about-benefits { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }
  .about-benefits article { flex: 0 0 82%; scroll-snap-align: start; }
  .about-banner { min-height: 10rem; }
}
```

- [ ] **Step 5: Run focused tests and inspect prohibited copy**

Run: `npm test -- --run src/features/home/AboutSection.test.tsx`

Expected: 1 test passes.

Run: `rg -n "Юридичес|Магазины|Годы работы" prototype/src/features/home/AboutSection.tsx prototype/src/features/home/LowerSections.css`

Expected: no matches.

- [ ] **Step 6: Commit the redesigned section**

```bash
git add prototype/src/features/home/AboutSection.tsx prototype/src/features/home/AboutSection.test.tsx prototype/src/features/home/LowerSections.css
git commit -m "feat: redesign homepage about section"
```

---

### Task 3: Homepage Composition and Duplicate Prevention

**Files:**
- Modify: `prototype/src/pages/HomePage.tsx`
- Modify: `prototype/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: `HomeOfferGrid`, `prototypeData.homeOffers`, existing `PromotionsSection` and `ProductShowcase`.
- Produces: DOM order `.hero + .home-offers + .popular-categories` and one existing sequence `.promotions + .product-showcase` for Remeza.

- [ ] **Step 1: Add the failing integration assertions**

Add a Playwright test:

```ts
test('first screen uses one visual hero, compact offers and categories without duplicate commerce sections', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('main > .hero + .home-offers + .popular-categories')).toHaveCount(1)
  await expect(page.locator('.home-offer-card')).toHaveCount(6)
  await expect(page.locator('.hero__stage .hero__copy, .hero__stage a')).toHaveCount(0)
  await expect(page.locator('.promotions')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 2, name: 'Товары Remeza' })).toHaveCount(1)
  await expect(page.locator('main > .promotions + .product-showcase')).toHaveCount(1)
})
```

- [ ] **Step 2: Run the focused browser test and verify the red state**

Run: `npm run test:e2e -- --grep "first screen uses one visual hero"`

Expected: FAIL because `.home-offers` is not mounted.

- [ ] **Step 3: Mount the new section exactly once**

In `HomePage.tsx`, import `HomeOfferGrid` and render it immediately after `HeroSlider`:

```tsx
<HeroSlider slides={prototypeData.slides} />
<HomeOfferGrid items={prototypeData.homeOffers} />
<CategoryGrid items={prototypeData.categories} />
```

Do not add another `PromotionsSection`, `ProductShowcase`, `DividerBanner` or `AboutSection`.

- [ ] **Step 4: Update outdated structure assertions**

Change the existing adjacent-section assertion from:

```ts
main > .hero + .popular-categories
```

to:

```ts
main > .hero + .home-offers + .popular-categories
```

Retain the existing counts: three product showcases, fifteen product cards, two divider banners, one promotions section and one Remeza showcase.

- [ ] **Step 5: Cover mobile gesture navigation without adding visible controls**

Add to `homepage.spec.ts`:

```ts
test('mobile hero changes slide after a horizontal gesture', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const hero = page.locator('.hero')
  const dots = page.getByRole('button', { name: /Перейти к слайду/ })
  await expect(dots.first()).toHaveAttribute('aria-current', 'true')
  await hero.dispatchEvent('pointerdown', { clientX: 300 })
  await hero.dispatchEvent('pointerup', { clientX: 100 })
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true')
  await expect(page.getByRole('button', { name: /Предыдущий слайд|Следующий слайд|автопрокрутку/ })).toHaveCount(0)
})
```

- [ ] **Step 6: Run homepage browser tests**

Run: `npm run test:e2e -- e2e/homepage.spec.ts`

Expected: all homepage tests pass in desktop and mobile Playwright projects.

- [ ] **Step 7: Commit the composition change**

```bash
git add prototype/src/pages/HomePage.tsx prototype/e2e/homepage.spec.ts
git commit -m "feat: refine homepage first-screen composition"
```

---

### Task 4: Responsive Acceptance Tests

**Files:**
- Modify: `prototype/e2e/homepage.spec.ts`
- Modify: `prototype/e2e/responsive.spec.ts`
- Modify if a failing assertion exposes a local defect: `prototype/src/features/home/HomeOfferGrid.css`
- Modify if a failing assertion exposes a local defect: `prototype/src/features/home/LowerSections.css`

**Interfaces:**
- Consumes: `.home-offers__grid`, `.about-benefits`, `.about-banner` and existing page layout tokens.
- Produces: automated coverage for approved desktop/mobile layouts and no page-level horizontal overflow.

- [ ] **Step 1: Write responsive acceptance assertions**

Add to `homepage.spec.ts`:

```ts
for (const viewport of [
  { width: 1440, height: 900, offerColumns: 6 },
  { width: 390, height: 844, offerColumns: 2 },
]) {
  test(`reference refinement follows the approved layout at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const offerColumns = await page.locator('.home-offers__grid').evaluate((grid) =>
      getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    )
    expect(offerColumns).toBe(viewport.offerColumns)

    if (viewport.width < 768) {
      const rail = page.locator('.about-benefits')
      const first = rail.locator('article').first()
      await expect.poll(() => rail.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true)
      expect((await first.boundingBox())!.width / (await rail.boundingBox())!.width).toBeGreaterThan(.78)
      await expect(page.locator('.about-banner')).toBeVisible()
    } else {
      await expect(page.locator('.about-benefits article')).toHaveCount(3)
      const tops = await page.locator('.about-benefits, .about-banner').evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().top),
      )
      expect(Math.abs(tops[0] - tops[1])).toBeLessThan(1)
    }
  })
}
```

- [ ] **Step 2: Extend global overflow coverage**

In `responsive.spec.ts`, keep the existing loop for 1920, 1440, 1280, 1024, 768, 390 and 360 px and include `.home-offers`, `.about-benefits` and `.about-banner` in diagnostic selectors. The assertion remains:

```ts
expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
```

- [ ] **Step 3: Run the new focused assertions**

Run: `npm run test:e2e -- --grep "reference refinement follows|no horizontal overflow"`

Expected: the assertions pass; if a mismatch remains, the failure reports the exact viewport and component for Step 4.

- [ ] **Step 4: Apply only CSS corrections required by the failed assertions**

Keep these invariants while correcting sizes:

```css
.home-offer-card > span:first-child,
.about-banner > span:first-child { position: relative; z-index: 1; }

@media (max-width: 650px) {
  .about-benefits article { flex: 0 0 82%; }
}
```

Do not change global container tokens or the mobile bottom-navigation height.

- [ ] **Step 5: Run all responsive and homepage scenarios**

Run: `npm run test:e2e -- e2e/homepage.spec.ts e2e/responsive.spec.ts`

Expected: all selected scenarios pass in both Playwright projects.

- [ ] **Step 6: Commit responsive acceptance coverage**

```bash
git add prototype/e2e/homepage.spec.ts prototype/e2e/responsive.spec.ts prototype/src/features/home/HomeOfferGrid.css prototype/src/features/home/LowerSections.css
git commit -m "test: cover refined homepage layouts"
```

---

### Task 5: Full Verification and Publication

**Files:**
- Verify only: all modified files from Tasks 1–4.

**Interfaces:**
- Consumes: completed implementation and the GitHub Pages workflow.
- Produces: a clean branch, passing checks, deployed public URL and visual evidence at mobile and desktop widths.

- [ ] **Step 1: Run the complete unit suite**

Run: `npm test -- --run`

Expected: all test files and tests pass with zero failures.

- [ ] **Step 2: Run the complete browser suite**

Run: `npm run test:e2e`

Expected: all desktop and mobile scenarios pass with zero failures.

- [ ] **Step 3: Build the GitHub Pages artifact and check whitespace**

Run: `npm run build:pages`

Expected: TypeScript and Vite build complete and `dist/404.html` is generated.

Run from the repository root: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 4: Verify the working tree and push the branch**

Run: `git status --short`

Expected: no uncommitted files.

Run: `git fetch origin`

Expected: fetch succeeds; reconcile only if the remote branch advanced.

Run: `git push origin codex/homepage-prototype`

Expected: all implementation commits are present on GitHub.

- [ ] **Step 5: Wait for deployment**

Run: `gh run list --branch codex/homepage-prototype --limit 1`

Expected: the newest run is `Deploy prototype to GitHub Pages` for the pushed HEAD.

Run: `$garageRunId = gh run list --branch codex/homepage-prototype --limit 1 --json databaseId --jq '.[0].databaseId'`

Run: `gh run watch $garageRunId --exit-status`

Expected: build and deploy jobs complete successfully.

- [ ] **Step 6: Visually verify the published page**

Run: `$garageHeadSha = git rev-parse --short HEAD`

Open `https://kcska18051-crypto.github.io/garage/?v=$garageHeadSha` at 1440 × 900 and 390 × 844. Confirm:

- the hero has no visible text or CTA and all three slides keep the same size;
- six compact offer tiles appear directly after the hero;
- popular categories remain a separate horizontal mobile rail;
- the promotions and Remeza products each appear once;
- the desktop About section has three cards and one wide banner in a row;
- the mobile About cards swipe horizontally and the banner sits below;
- no text is hidden behind neutral geometry;
- the mobile bottom navigation does not cover content.

- [ ] **Step 7: Report the published result**

Provide the cache-busted public URL, final commit SHA, unit-test count, Playwright-test count and build result. Do not claim completion until all evidence above is fresh and successful.
