# Materials Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable news, article, and review list/detail pages with responsive section navigation and optional interactive video.

**Architecture:** Keep all demo content in `materialsData.ts`, render it through shared list/detail templates, and derive the active section from the route. Use local query parameters for list controls and component-local state for video playback.

**Tech Stack:** React, TypeScript, React Router, Vitest, Testing Library, Playwright, CSS.

## Global Constraints

- Preserve the existing header, footer, container tokens, mobile navigation, and visual DNA.
- News, Articles, and Reviews have separate list and detail URLs; Events is a news category.
- Never mix product “Новинки” with company news.
- Video is local demonstration UI, starts only after a user click, and disappears entirely when absent.
- Lists and details share section navigation; article contents is a separate in-article anchor block.

---

### Task 1: Content model and shared routes

**Files:**
- Create: `prototype/src/data/materialsData.ts`
- Create: `prototype/src/pages/MaterialsPages.test.tsx`
- Create: `prototype/src/pages/MaterialsPages.tsx`
- Modify: `prototype/src/app/routes.tsx`

**Interfaces:**
- Produces: `Material`, `MaterialKind`, `materials`, `getMaterial(kind, slug)` and reusable list/detail routes.
- Consumes: `Breadcrumbs`, React Router params/search params.

- [ ] Write failing route tests for all three lists, all three details, 404, breadcrumbs, active navigation and related links.
- [ ] Run `npx vitest run src/pages/MaterialsPages.test.tsx` and confirm failures are missing pages/routes.
- [ ] Add typed content data and minimal shared pages/routes.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: List controls and responsive presentation

**Files:**
- Modify: `prototype/src/pages/MaterialsPages.test.tsx`
- Modify: `prototype/src/pages/MaterialsPages.tsx`
- Create: `prototype/src/features/materials/Materials.css`

**Interfaces:**
- Produces: query-backed category, sorting and pagination behavior.
- Consumes: typed material cards from Task 1.

- [ ] Add failing tests for category filtering, sorting, pagination and video badges.
- [ ] Run the focused test and confirm expected behavioral failures.
- [ ] Implement controls, cards, desktop sidebar and mobile horizontal navigation.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Detail content and optional video

**Files:**
- Create: `prototype/src/features/materials/DemoVideo.tsx`
- Modify: `prototype/src/pages/MaterialsPages.tsx`
- Modify: `prototype/src/pages/MaterialsPages.test.tsx`
- Modify: `prototype/src/features/materials/Materials.css`

**Interfaces:**
- Produces: `DemoVideo({ title })` with click-to-play state and no autoplay.
- Consumes: content sections and optional video metadata from `Material`.

- [ ] Add failing tests for review/news/article video placement, playback state, article anchors and no-video details.
- [ ] Run the focused test and confirm expected failures.
- [ ] Implement detail sections, contents anchors, related cards and optional video.
- [ ] Re-run the focused test and confirm it passes.

### Task 4: Home, footer, E2E and publication

**Files:**
- Modify: `prototype/src/data/prototypeData.ts`
- Modify: `prototype/src/features/home/UsefulSection.tsx`
- Modify: `prototype/src/features/footer/Footer.tsx`
- Modify: corresponding unit tests.
- Create: `prototype/e2e/materials.spec.ts`

**Interfaces:**
- Consumes: public material URLs from Tasks 1–3.
- Produces: entry points from home/footer and responsive end-to-end coverage.

- [ ] Add failing integration tests for home/footer entry points and E2E scenarios for navigation, video and overflow.
- [ ] Implement synchronized links and footer entries.
- [ ] Run unit tests, `npm run build:pages`, and `npm run test:e2e -- e2e/materials.spec.ts`.
- [ ] Review the diff, commit, push, wait for Pages and verify direct public URLs.
