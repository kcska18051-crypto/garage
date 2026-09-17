# Product Detail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить детальную страницу товара в интерактивную трехколоночную карточку с вариантами, четырьмя статусами, расширенной галереей и коммерческим предложением.

**Architecture:** Страница хранит выбранное предложение и коммерческий статус, передавая их независимым компонентам галереи, вариантов и покупки. Модель данных описывает произвольные группы вариантов и доступные сочетания; условные разделы строятся только по данным.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library, Playwright, CSS.

**Spec:** `docs/superpowers/specs/2026-09-17-product-detail-redesign-design.md`

## Global Constraints

- Сохранять серый прототипный язык и существующий маршрут `/product/remeza-vk-10-gr-0001/`.
- Не использовать неподтвержденные коммерческие обещания как реальные данные.
- Один главный CTA на коммерческое состояние.
- Все условные блоки исчезают без пустого места.
- Не изменять общую шапку и мобильную нижнюю навигацию.

---

### Task 1: Data model and variants

**Files:**
- Modify: `prototype/src/data/productDetailData.ts`
- Create: `prototype/src/features/product-detail/ProductVariants.tsx`
- Create: `prototype/src/features/product-detail/ProductVariants.test.tsx`

**Interfaces:**
- Produces: `ProductVariantGroup`, `ProductOffer`, `resolveProductOffer()`, `ProductVariants`.

- [ ] Write failing tests for option selection, disabled combinations and empty groups.
- [ ] Run the focused test and verify failure because the component/model is missing.
- [ ] Implement the typed groups and offer resolution with no placeholder container for empty groups.
- [ ] Run the focused test and verify pass.

### Task 2: Product header and gallery

**Files:**
- Modify: `prototype/src/pages/ProductDetailPage.tsx`
- Modify: `prototype/src/features/product-detail/ProductGallery.tsx`
- Modify: `prototype/src/pages/ProductDetailPage.test.tsx`

**Interfaces:**
- Consumes: selected `ProductOffer`.
- Produces: page-level product header and `ProductGallery` with cyclic navigation and purchase-aware modal.

- [ ] Write failing tests for the long H1 above `.product-hero`, arrows, video thumb, sharing feedback, and enlarged dialog purchase panel.
- [ ] Run the focused test and verify the expected missing behavior.
- [ ] Implement the header, compact icon actions, cyclic arrows and accessible enlarged dialog.
- [ ] Run the focused test and verify pass.

### Task 3: Purchase states and commercial proposal

**Files:**
- Modify: `prototype/src/features/product-detail/ProductPurchase.tsx`
- Create: `prototype/src/features/product-detail/CommercialProposal.tsx`
- Modify: `prototype/src/pages/ProductDetailPage.test.tsx`

**Interfaces:**
- Consumes: selected `ProductOffer`, `CommercialState`, quantity.
- Produces: state-aware purchase panel, mobile CTA and commercial proposal dialog.

- [ ] Write failing tests for four statuses, CTA mapping, city availability, separate financing actions and proposal feedback.
- [ ] Run the focused test and verify failure for the missing states/dialog.
- [ ] Implement the purchase state map, availability rows, secondary actions and proposal dialog.
- [ ] Run the focused test and verify pass.

### Task 4: Lower content and responsive composition

**Files:**
- Modify: `prototype/src/features/product-detail/ProductSections.tsx`
- Modify: `prototype/src/features/product-detail/ProductDetail.css`
- Modify: `prototype/e2e/product-detail.spec.ts`

**Interfaces:**
- Consumes: product section data and selected offer.
- Produces: conditional anchor navigation, calm text/table content and responsive desktop/mobile layout.

- [ ] Write failing browser assertions for content order, mobile sticky CTA, modal purchase panel and horizontal overflow.
- [ ] Run focused Playwright tests and verify failure.
- [ ] Replace feature tiles with text, add conditional video/payment/service sections and complete responsive CSS.
- [ ] Run focused unit and Playwright tests, then full tests and build.

### Task 5: Visual verification and publication

**Files:**
- Review all modified product-detail files.

**Interfaces:**
- Produces: published GitHub Pages route.

- [ ] Inspect desktop at 1440 px and mobile at 390 px, including all four statuses and both dialogs.
- [ ] Run `git diff --check`, unit tests, production build and full Playwright suite.
- [ ] Commit the coherent redesign and push `codex/homepage-prototype`.
- [ ] Wait for GitHub Pages and verify the direct production URL.
