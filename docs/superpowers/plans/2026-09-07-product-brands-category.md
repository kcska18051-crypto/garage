# Product, Brands, and Category Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive product detail page, an interactive brand directory, and a child-category grid for screw compressors without regressing the existing prototype.

**Architecture:** Add focused page components backed by small typed data modules, reuse shared commerce and catalog primitives, and introduce a shared region context for cross-page delivery copy. Extend existing catalog data with optional child sections so the second-level template stays reusable.

**Tech Stack:** React 19, React Router 7, TypeScript, Vite, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-07-product-brands-category-design.md`

## Global Constraints

- Remeza is informational text only; do not create a Remeza detail route.
- All commercial, availability, delivery, warranty, rating, and review content is visibly demonstrative.
- Preserve existing header, footer, filters, URL state, and commerce counters.
- Verify 1920, 1440, 1280, 1024, 768, 390, and 360 pixel widths.

---

### Task 1: Shared region state

**Files:**
- Create: `prototype/src/state/RegionState.tsx`
- Modify: `prototype/src/app/App.tsx`
- Modify: `prototype/src/features/header/Header.tsx`
- Test: `prototype/src/features/header/Header.test.tsx`

**Interfaces:**
- Produces: `RegionProvider` and `useRegion(): { region: string; setRegion(region: string): void }`.
- Consumes: existing `Header` and `RegionDialog` behavior.

- [ ] Add a failing test proving a region change is visible outside the header.
- [ ] Run `npx vitest run src/features/header/Header.test.tsx` and confirm the new assertion fails.
- [ ] Implement the region context and migrate `Header` to it.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Product detail page

**Files:**
- Create: `prototype/src/data/productDetailData.ts`
- Create: `prototype/src/pages/ProductDetailPage.tsx`
- Create: `prototype/src/features/product-detail/ProductGallery.tsx`
- Create: `prototype/src/features/product-detail/ProductPurchase.tsx`
- Create: `prototype/src/features/product-detail/ProductSections.tsx`
- Create: `prototype/src/features/product-detail/ProductDetail.css`
- Modify: `prototype/src/app/routes.tsx`
- Modify: `prototype/scripts/create-spa-fallback.mjs`
- Test: `prototype/src/pages/ProductDetailPage.test.tsx`
- Test: `prototype/e2e/product-detail.spec.ts`

**Interfaces:**
- Consumes: `useCommerce()`, `useRegion()`, `Breadcrumbs`, and the neutral geometric visual system.
- Produces: route `/product/remeza-vk-10-gr-0001/`, synchronized counters, gallery modal, anchors, and mobile purchase bar.

- [ ] Add failing route/component tests for identity, plain-text brand, product actions, gallery, anchors, and commercial disclaimer.
- [ ] Run focused Vitest and Playwright tests and confirm expected failures.
- [ ] Implement typed product data and the three focused UI components.
- [ ] Register the route and Pages fallback.
- [ ] Re-run focused tests and confirm they pass.

### Task 3: Brand directory

**Files:**
- Create: `prototype/src/data/brandDirectoryData.ts`
- Create: `prototype/src/pages/BrandsPage.tsx`
- Create: `prototype/src/features/brands/BrandsDirectory.tsx`
- Create: `prototype/src/features/brands/Brands.css`
- Modify: `prototype/src/app/routes.tsx`
- Modify: `prototype/src/features/home/BrandGrid.tsx`
- Modify: `prototype/src/pages/CatalogPage.tsx`
- Modify: `prototype/scripts/create-spa-fallback.mjs`
- Test: `prototype/src/pages/BrandsPage.test.tsx`
- Test: `prototype/e2e/brands.spec.ts`

**Interfaces:**
- Produces: route `/brands/` with search, category filtering, alphabet filtering, and informational brand cards.
- Consumes: shared breadcrumbs, container, tokens, header, and footer.

- [ ] Add failing tests for the route, search, category chips, alphabet index, grouped results, and absence of brand detail links.
- [ ] Run focused tests and confirm expected failures.
- [ ] Implement data, directory behavior, and responsive styling.
- [ ] Redirect existing brand entry points to `/brands/` without detail paths.
- [ ] Re-run focused tests and confirm they pass.

### Task 4: Child-category grid and SEO tail

**Files:**
- Modify: `prototype/src/data/catalogTypes.ts`
- Modify: `prototype/src/data/catalogData.ts`
- Create: `prototype/src/features/catalog/ChildCategoryGrid.tsx`
- Modify: `prototype/src/pages/CatalogSubcategoryPage.tsx`
- Modify: `prototype/src/features/catalog/Catalog.css`
- Test: `prototype/src/pages/routes.test.tsx`
- Test: `prototype/e2e/catalog.spec.ts`

**Interfaces:**
- Produces: optional `childSections` on `CatalogSubcategory`, rendered before `TagGroups`, plus a post-listing SEO section.
- Consumes: the existing reusable subcategory template and URL-backed listing.

- [ ] Add failing tests for six child cards, semantic ordering, tag separation, and SEO text placement.
- [ ] Run focused tests and confirm expected failures.
- [ ] Add typed child-section data and render the reusable visual grid.
- [ ] Add responsive styling and the SEO text.
- [ ] Re-run focused tests and confirm they pass.

### Task 5: Full verification and publication

**Files:**
- Modify only files required by findings from verification.

**Interfaces:**
- Produces: published GitHub Pages routes for product, brands, and updated screw-compressor category.

- [ ] Run `npm run test:run` and confirm all unit tests pass.
- [ ] Run `npm run test:e2e` and confirm all browser tests pass.
- [ ] Run `npm run build:pages` and confirm the Pages artifact builds.
- [ ] Capture and inspect screenshots at all seven control widths.
- [ ] Review `git diff --check` and the complete diff.
- [ ] Commit and push `codex/homepage-prototype`.
- [ ] Wait for GitHub Pages deployment and verify all three public URLs.
