# Homepage Interactive Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a locally runnable, adaptive, multi-route interactive prototype of the Garage homepage with the approved desktop and mobile header architectures.

**Architecture:** A Vite-powered React single-page application lives entirely in `prototype/`. Feature folders own focused components and tests; shared prototype data is typed and isolated from presentation. React Router provides real client-side routes, while stateful interactions remain local and deterministic until backend contracts are defined.

**Tech Stack:** React, TypeScript, Vite, React Router, Vitest, Testing Library, Playwright, semantic HTML and modular CSS.

**Spec:** `docs/superpowers/specs/2026-08-26-homepage-interactive-prototype-design.md`

## Global Constraints

- Use neutral monochrome identity and gray geometric media placeholders.
- Preserve separate desktop, laptop, tablet and mobile compositions at 1440, 1280, 1024, 768, 390 and 360 px checks.
- Desktop header has service and main rows plus a compact sticky variant; mobile has `menu — logo — region`, full-width search and fixed bottom navigation.
- Do not invent commercial figures, testimonials, delivery promises, discounts or B2B terms.
- Keep testimonials and newsletter disabled by configuration.
- Every visible link and CTA must navigate, open a working interaction or be explicitly disabled.
- Respect keyboard navigation, visible focus, touch target size, `prefers-reduced-motion` and mobile safe areas.
- Text remains HTML; placeholder artwork is decorative unless it communicates content.

---

### Task 1: Application shell and test harness

**Files:**
- Create: `prototype/package.json`
- Create: `prototype/package-lock.json`
- Create: `prototype/index.html`
- Create: `prototype/tsconfig.json`
- Create: `prototype/tsconfig.app.json`
- Create: `prototype/tsconfig.node.json`
- Create: `prototype/vite.config.ts`
- Create: `prototype/playwright.config.ts`
- Create: `prototype/src/main.tsx`
- Create: `prototype/src/app/App.tsx`
- Create: `prototype/src/app/App.test.tsx`
- Create: `prototype/src/test/setup.ts`
- Create: `prototype/src/styles/tokens.css`
- Create: `prototype/src/styles/global.css`
- Modify: `prototype/README.md`

**Interfaces:**
- Consumes: none.
- Produces: `App(): JSX.Element`, npm scripts `dev`, `build`, `test`, `test:run`, `test:e2e`, and shared CSS tokens.

- [ ] **Step 1: Initialize the Vite React TypeScript dependency set**

Run from `prototype/`:

```powershell
npm init -y
npm install react react-dom react-router-dom
npm install -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/react @types/react-dom @playwright/test
```

Set `package.json` to ESM and define the six scripts listed in the Interfaces block.

- [ ] **Step 2: Write the failing shell test**

```tsx
render(<App />)
expect(screen.getByRole('main')).toBeInTheDocument()
expect(screen.getByText('Интерактивный прототип')).toBeInTheDocument()
```

- [ ] **Step 3: Run the shell test and confirm the red state**

Run: `npm run test:run -- src/app/App.test.tsx`  
Expected: FAIL because `App` and the test setup do not exist.

- [ ] **Step 4: Implement the minimal application shell and tokens**

Create a semantic `App` with `header`, `main`, and `footer`, import `tokens.css` and `global.css`, and define tokens for background, surface, border, text, muted text, four gray placeholder levels, focus ring, radii, container width, desktop header height and mobile bottom-nav height.

- [ ] **Step 5: Verify tests and production build**

Run: `npm run test:run` and `npm run build`  
Expected: PASS and a generated `dist/` directory.

- [ ] **Step 6: Document local commands and commit**

```powershell
git add prototype
git commit -m "chore: initialize homepage prototype app"
```

### Task 2: Typed content model and real routes

**Files:**
- Create: `prototype/src/data/types.ts`
- Create: `prototype/src/data/prototypeData.ts`
- Create: `prototype/src/app/routes.tsx`
- Create: `prototype/src/pages/HomePage.tsx`
- Create: `prototype/src/pages/PlaceholderPage.tsx`
- Create: `prototype/src/pages/NotFoundPage.tsx`
- Create: `prototype/src/pages/routes.test.tsx`
- Modify: `prototype/src/app/App.tsx`

**Interfaces:**
- Consumes: `App()` and global tokens from Task 1.
- Produces: `RouteDefinition { path: string; label: string }`, `prototypeRoutes: RouteDefinition[]`, typed `Slide`, `Category`, `Brand`, `Product`, `Service`, `UsefulItem`, and router-backed pages.

- [ ] **Step 1: Write failing route tests**

```tsx
render(<MemoryRouter initialEntries={['/catalog']}><App /></MemoryRouter>)
expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()

render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>)
expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
```

- [ ] **Step 2: Confirm the route tests fail**

Run: `npm run test:run -- src/pages/routes.test.tsx`  
Expected: FAIL because router configuration and pages are absent.

- [ ] **Step 3: Define the exact content interfaces**

```ts
export type Product = {
  id: string
  name: string
  price: string
  availability: string
  href: string
}

export type HomeConfig = {
  showTestimonials: false
  showNewsletter: false
}
```

Add equally explicit interfaces for slides, categories, brands, services and useful content. Populate neutral Russian demonstration copy without unverifiable claims.

- [ ] **Step 4: Implement browser routes**

Configure `/` plus `/catalog`, `/search`, `/services`, `/actions`, `/brands`, `/new`, `/product/:slug`, `/favorites`, `/compare`, `/cart`, `/profile`, `/shops`, `/delivery`, `/about`, `/contacts`, `/articles/:slug`, `/news/:slug`, `/business`, and `*`. Every placeholder page renders its section label, breadcrumbs `Главная / <раздел>` and a link home.

- [ ] **Step 5: Verify routing and commit**

Run: `npm run test:run -- src/pages/routes.test.tsx`  
Expected: PASS for a normal route and 404.

```powershell
git add prototype/src
git commit -m "feat: add prototype content model and routes"
```

### Task 3: Responsive header, search, region and mobile navigation

**Files:**
- Create: `prototype/src/features/header/Header.tsx`
- Create: `prototype/src/features/header/Header.css`
- Create: `prototype/src/features/header/DesktopHeader.tsx`
- Create: `prototype/src/features/header/MobileHeader.tsx`
- Create: `prototype/src/features/header/MobileBottomNav.tsx`
- Create: `prototype/src/features/header/SearchBox.tsx`
- Create: `prototype/src/features/header/RegionDialog.tsx`
- Create: `prototype/src/features/header/Header.test.tsx`
- Create: `prototype/src/hooks/useScrollThreshold.ts`
- Modify: `prototype/src/app/App.tsx`

**Interfaces:**
- Consumes: route URLs and demonstration product/brand data from Task 2.
- Produces: `HeaderState { region: string; favorites: number; compare: number; cart: number }`, `HeaderProps { state: HeaderState }`, `SearchBoxProps { compact?: boolean }`, and responsive global navigation.

- [ ] **Step 1: Write failing interaction tests**

```tsx
await user.click(screen.getByRole('button', { name: 'Выбрать город' }))
await user.click(screen.getByRole('button', { name: 'Вологда' }))
expect(screen.getByText('Вологда')).toBeInTheDocument()

await user.type(screen.getByRole('searchbox'), 'краск')
expect(screen.getByRole('listbox')).toBeInTheDocument()
```

Also assert that the mobile navigation has exactly five named links and that Escape closes the mobile menu.

- [ ] **Step 2: Confirm the header tests fail**

Run: `npm run test:run -- src/features/header/Header.test.tsx`  
Expected: FAIL because header components do not exist.

- [ ] **Step 3: Implement desktop and laptop composition**

Render the service row and main row, prioritize catalog and search, separate services visually, and collapse labels under 1200 px. Use `useScrollThreshold(120)` to toggle a compact sticky header containing logo, catalog, search, profile and cart without changing document flow height.

- [ ] **Step 4: Implement tablet and mobile composition**

At widths below 768 px render the approved top row, dedicated search row and five-item fixed bottom navigation. At 768–1023 px render the tablet composition with catalog, search and an overflow menu. Apply `padding-bottom: calc(var(--mobile-nav-height) + env(safe-area-inset-bottom))` to the page shell on mobile.

- [ ] **Step 5: Implement accessible overlays and search**

Region and menu overlays restore focus to their trigger, close on Escape and outside pointer action, and label their dialog/navigation regions. Search suggestions use a listbox, link to `/search?q=<encoded query>`, and never trap keyboard focus.

- [ ] **Step 6: Verify and commit**

Run: `npm run test:run -- src/features/header/Header.test.tsx` and `npm run build`  
Expected: PASS with no TypeScript errors.

```powershell
git add prototype/src
git commit -m "feat: build responsive interactive header"
```

### Task 4: Accessible hero slider

**Files:**
- Create: `prototype/src/features/home/HeroSlider.tsx`
- Create: `prototype/src/features/home/HeroSlider.css`
- Create: `prototype/src/features/home/HeroSlider.test.tsx`
- Create: `prototype/src/hooks/useReducedMotion.ts`
- Modify: `prototype/src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `Slide[]` from Task 2.
- Produces: `HeroSliderProps { slides: Slide[]; intervalMs?: number }` with arrow, indicator, pause and swipe controls.

- [ ] **Step 1: Write failing slider tests**

```tsx
expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Гараж')
await user.click(screen.getByRole('button', { name: 'Следующий слайд' }))
expect(screen.getByRole('group', { name: /слайд 2/i })).toBeVisible()
await user.click(screen.getByRole('button', { name: 'Остановить автопрокрутку' }))
expect(screen.getByRole('button', { name: 'Запустить автопрокрутку' })).toBeVisible()
```

- [ ] **Step 2: Confirm the tests fail**

Run: `npm run test:run -- src/features/home/HeroSlider.test.tsx`  
Expected: FAIL because slider behavior is absent.

- [ ] **Step 3: Implement deterministic slider state**

Use a single active-index state, a paused state, pointer start/end coordinates for swipe, and one interval effect cleaned up on every dependency change. Disable the interval when paused, document visibility is hidden, the component is hovered/focused, or reduced motion is requested.

- [ ] **Step 4: Implement responsive media placeholders and accessible controls**

Render the first slide H1 only once, HTML copy and CTA links above decorative aspect-ratio placeholder blocks. Use CSS layout changes rather than separate inaccessible markup. Indicators expose `aria-current`, and the changing slide region uses `aria-live="off"` during autoplay.

- [ ] **Step 5: Verify reduced motion, tests and commit**

Run: `npm run test:run -- src/features/home/HeroSlider.test.tsx`  
Expected: PASS, including a mocked `matchMedia('(prefers-reduced-motion: reduce)')` case with no timer advancement.

```powershell
git add prototype/src
git commit -m "feat: add accessible homepage hero slider"
```

### Task 5: Benefits, categories and brands navigation

**Files:**
- Create: `prototype/src/features/home/BenefitsStrip.tsx`
- Create: `prototype/src/features/home/CategoryGrid.tsx`
- Create: `prototype/src/features/home/BrandGrid.tsx`
- Create: `prototype/src/features/home/NavigationSections.css`
- Create: `prototype/src/features/home/NavigationSections.test.tsx`
- Modify: `prototype/src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: benefits, `Category[]` and `Brand[]` from Task 2.
- Produces: semantic linked navigation sections with no internal state.

- [ ] **Step 1: Write failing semantic navigation tests**

```tsx
expect(screen.getByRole('heading', { name: 'Популярные категории' })).toBeVisible()
expect(screen.getAllByRole('link', { name: /перейти в категорию/i })).toHaveLength(categories.length)
expect(screen.getByRole('link', { name: 'Все бренды' })).toHaveAttribute('href', '/brands')
```

- [ ] **Step 2: Confirm the tests fail**

Run: `npm run test:run -- src/features/home/NavigationSections.test.tsx`  
Expected: FAIL because the three sections are absent.

- [ ] **Step 3: Implement data-driven linked sections**

Use ordered lists for categories and brands, neutral aspect-ratio placeholder blocks, visible names and full-card links. Implement mobile brand overflow as finite scroll with all items reachable and a separately visible «Все бренды» link.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:run -- src/features/home/NavigationSections.test.tsx`  
Expected: PASS with every item represented by a real link.

```powershell
git add prototype/src
git commit -m "feat: add homepage navigation sections"
```

### Task 6: Product showcase and shared commerce state

**Files:**
- Create: `prototype/src/features/products/ProductCard.tsx`
- Create: `prototype/src/features/products/ProductCard.css`
- Create: `prototype/src/features/products/ProductShowcase.tsx`
- Create: `prototype/src/features/products/ProductShowcase.test.tsx`
- Create: `prototype/src/state/CommerceState.tsx`
- Modify: `prototype/src/app/App.tsx`
- Modify: `prototype/src/features/header/Header.tsx`
- Modify: `prototype/src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `Product[]`, `HeaderState` badge presentation and `/product/:slug` routes.
- Produces: `CommerceState { favoriteIds: Set<string>; compareIds: Set<string>; cartIds: Set<string> }` plus `toggleFavorite(id)`, `toggleCompare(id)` and `addToCart(id)` actions available through `useCommerce()`.

- [ ] **Step 1: Write failing commerce interaction tests**

```tsx
await user.click(screen.getByRole('button', { name: /добавить в избранное/i }))
expect(screen.getByLabelText('Избранное: 1')).toBeVisible()
await user.click(screen.getByRole('button', { name: /добавить в корзину/i }))
expect(screen.getByLabelText('Корзина: 1')).toBeVisible()
```

Assert four cards per desktop row through a stable `product-grid` class and at most eight rendered products.

- [ ] **Step 2: Confirm the tests fail**

Run: `npm run test:run -- src/features/products/ProductShowcase.test.tsx`  
Expected: FAIL because commerce context and cards are absent.

- [ ] **Step 3: Implement the shared state contract**

Use immutable `Set` copies for toggles, prevent duplicate cart IDs, derive counts from set sizes and expose the context only through `useCommerce()`. Connect header badges to these derived counts.

- [ ] **Step 4: Implement the universal product card and Новинки section**

Render linked media/name, price, availability, pressed-state favorite and compare buttons, and add-to-cart control. Use a four-column wide grid, two columns on tablet and one column below 520 px. Render no more than eight items and link «Все новинки» to `/new`.

- [ ] **Step 5: Verify and commit**

Run: `npm run test:run -- src/features/products/ProductShowcase.test.tsx` and `npm run build`  
Expected: PASS and badge counts update without route reload.

```powershell
git add prototype/src
git commit -m "feat: add interactive new products showcase"
```

### Task 7: Services, B2B, company, useful content, CTA and footer

**Files:**
- Create: `prototype/src/features/home/ServicesSection.tsx`
- Create: `prototype/src/features/home/BusinessSection.tsx`
- Create: `prototype/src/features/home/AboutSection.tsx`
- Create: `prototype/src/features/home/UsefulSection.tsx`
- Create: `prototype/src/features/home/ConsultationCta.tsx`
- Create: `prototype/src/features/home/LowerSections.css`
- Create: `prototype/src/features/home/LowerSections.test.tsx`
- Create: `prototype/src/features/footer/Footer.tsx`
- Create: `prototype/src/features/footer/Footer.css`
- Create: `prototype/src/features/forms/ContactDialog.tsx`
- Modify: `prototype/src/pages/HomePage.tsx`
- Modify: `prototype/src/app/App.tsx`

**Interfaces:**
- Consumes: `Service[]`, `UsefulItem[]`, config flags and route URLs from Task 2.
- Produces: `ContactDialogProps { mode: 'consultation' | 'callback'; onClose(): void }`, controlled useful tabs and responsive footer navigation.

- [ ] **Step 1: Write failing lower-page tests**

```tsx
expect(screen.getByRole('heading', { name: 'Услуги' })).toBeVisible()
expect(screen.getByRole('tab', { name: 'Статьи' })).toHaveAttribute('aria-selected', 'true')
expect(screen.queryByRole('heading', { name: 'Отзывы' })).not.toBeInTheDocument()
expect(screen.queryByRole('heading', { name: 'Подписка' })).not.toBeInTheDocument()
```

Open the consultation dialog, submit an empty form and assert inline validation; then fill required name and contact fields and assert the success message «Спасибо! Ваше сообщение отправлено».

- [ ] **Step 2: Confirm the tests fail**

Run: `npm run test:run -- src/features/home/LowerSections.test.tsx`  
Expected: FAIL because lower sections and dialog do not exist.

- [ ] **Step 3: Implement the lower content sections**

Render two service cards, the confirmed neutral B2B proposition, company copy with visibly editable fact placeholders, and useful-content tabs. Omit the News tab entirely when its configured list is empty. Do not render reviews or newsletter when their flags are false.

- [ ] **Step 4: Implement contextual CTA and dialog**

Buttons open the correct dialog mode. Require a name and one contact field, place errors beside fields, focus the dialog heading on open, return focus on close, and show the approved success message after valid local submission.

- [ ] **Step 5: Implement the responsive footer**

Use semantic groups of links on desktop and button-controlled accordion groups on mobile. Keep all links keyboard-accessible and add bottom spacing equal to the mobile navigation plus safe area.

- [ ] **Step 6: Verify and commit**

Run: `npm run test:run -- src/features/home/LowerSections.test.tsx`  
Expected: PASS for tabs, config-driven omissions, form validation and success.

```powershell
git add prototype/src
git commit -m "feat: complete homepage content and footer"
```

### Task 8: Browser verification, accessibility and handoff

**Files:**
- Create: `prototype/e2e/homepage.spec.ts`
- Create: `prototype/e2e/navigation.spec.ts`
- Create: `prototype/e2e/responsive.spec.ts`
- Create: `prototype/artifacts/.gitkeep`
- Modify: `prototype/README.md`
- Modify: `prototype/src/styles/global.css`
- Modify: component files identified by browser verification.

**Interfaces:**
- Consumes: the complete application from Tasks 1–7.
- Produces: repeatable Playwright checks and documented local review workflow.

- [ ] **Step 1: Write end-to-end tests for primary flows**

```ts
test('mobile navigation does not cover the footer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('footer').scrollIntoViewIfNeeded()
  const footer = await page.locator('footer').boundingBox()
  const nav = await page.getByRole('navigation', { name: 'Мобильная навигация' }).boundingBox()
  expect(footer && nav && footer.y < nav.y).toBeTruthy()
})
```

Add flows for header search navigation, region selection, mobile menu Escape closing, hero manual control, product badge updates, useful tabs, consultation success, placeholder routes and 404.

- [ ] **Step 2: Run all automated checks**

Run: `npm run test:run`, `npm run build`, and `npm run test:e2e`  
Expected: every command exits 0.

- [ ] **Step 3: Perform visual review at every control width**

Start `npm run dev -- --host 127.0.0.1`, capture full-page screenshots at 1440, 1280, 1024, 768, 390 and 360 px, and inspect header switching, grid wrapping, text clipping, focus rings, sticky elements and footer clearance. Save review screenshots under ignored `prototype/artifacts/` except `.gitkeep`.

- [ ] **Step 4: Verify reduced motion and keyboard-only operation**

Emulate reduced motion and confirm no hero autoplay. Traverse header, slider controls, every CTA, product actions, tabs, dialog and footer using Tab/Shift+Tab/Enter/Escape with no focus loss.

- [ ] **Step 5: Fix observed defects and rerun the full suite**

For each defect, add or strengthen a test that reproduces it before modifying the component. Rerun `npm run test:run`, `npm run build`, and `npm run test:e2e` after the final fix.

- [ ] **Step 6: Document review commands and commit**

Update `prototype/README.md` with install, dev, test, build and visual-review commands plus the list of implemented routes.

```powershell
git add prototype docs/superpowers/plans/2026-08-26-homepage-interactive-prototype.md
git commit -m "test: verify adaptive homepage prototype"
```
