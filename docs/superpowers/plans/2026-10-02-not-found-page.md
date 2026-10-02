# 404 Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a minimal responsive 404 screen for every visually unknown application route.

**Architecture:** Keep the existing wildcard route and replace the shared `NotFoundPage` presentation. Add focused component and Playwright coverage without changing the router fallback behavior.

**Tech Stack:** React, TypeScript, React Router, CSS, Vitest, Testing Library, Playwright, Vite

## Global Constraints

- Content is limited to `404`, `Страница не найдена`, `На главную`, and `В каталог`.
- Keep the common header, footer, responsive shell, and GitHub Pages SPA fallback.
- Do not start services, company, contacts, or legal pages.

---

### Task 1: 404 component and routes

**Files:**
- Modify: `prototype/src/pages/routes.test.tsx`
- Modify: `prototype/src/pages/NotFoundPage.tsx`
- Create: `prototype/src/pages/NotFoundPage.css`

**Interfaces:**
- Consumes: existing `NotFoundPage` imports and wildcard route
- Produces: accessible links to `/` and `/catalog`

- [ ] Write an exact-content and link test for `/missing`.
- [ ] Run the focused Vitest file and confirm the new assertions fail.
- [ ] Implement the minimal component and responsive CSS.
- [ ] Run the focused test and confirm it passes.

### Task 2: Direct-route responsive verification

**Files:**
- Create: `prototype/e2e/not-found.spec.ts`

**Interfaces:**
- Consumes: the published application wildcard route
- Produces: desktop/mobile regression coverage for direct unknown URLs and both actions

- [ ] Add Playwright checks for direct unknown navigation, actions, and overflow at desktop/mobile widths.
- [ ] Run the focused browser test, then unit tests and `build:pages`.
- [ ] Commit the implementation, push `codex/homepage-prototype`, and verify the deployed direct URL.
