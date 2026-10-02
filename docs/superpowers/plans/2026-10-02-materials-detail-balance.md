# Materials Detail Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Уравновесить композицию детальных страниц материалов на широких экранах, расширив медиаслой до основной колонки и сохранив центрированную читаемую колонку текста.

**Architecture:** Изменение ограничено CSS детального шаблона и E2E-проверками геометрии. DOM, данные, маршруты и сетки списков не меняются.

**Tech Stack:** React, TypeScript, CSS, Playwright, Vite.

## Global Constraints

- Sidebar остаётся компактным и не перекрывается контентом.
- Заголовок, главная обложка и видео занимают `.materials-main` на desktop.
- Текстовые блоки имеют `max-width: 50rem` и центрируются.
- «Читайте дальше» занимает всю основную колонку.
- Сетка списков остаётся 4/3/2/1.
- На mobile два видео складываются вертикально; горизонтальный overflow отсутствует.

---

### Task 1: Геометрия детальной страницы

**Files:**
- Modify: `prototype/e2e/materials.spec.ts`
- Modify: `prototype/src/features/materials/Materials.css`

**Interfaces:**
- Consumes: существующие классы `.materials-main`, `.material-detail__heading`, `.material-detail__cover`, `.material-videos`, `.material-intro`, `.material-section`.
- Produces: широкая медиакомпозиция и центрированная читаемая колонка без изменения DOM.

- [ ] **Step 1: Write the failing test**

Добавить Playwright-проверку на 1920 и 2560 px: ширина заголовка, обложки и видео отличается от `.materials-main` не более чем на 2 px; левый и правый зазоры текста внутри `.materials-main` отличаются не более чем на 2 px.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- materials.spec.ts --grep "balances wide detail composition"`

Expected: FAIL, потому что текущая обложка ограничена 50 rem и прижата слева.

- [ ] **Step 3: Write minimal implementation**

Убрать `max-width: 50rem` у `.material-detail__heading`, `.material-detail__cover` и `.material-videos`; добавить `margin-inline:auto` к `.material-intro`, `.material-contents` и `.material-section`. Сохранить full-width `.material-related`.

- [ ] **Step 4: Run focused tests**

Run: `npm run test:e2e -- materials.spec.ts`

Expected: все сценарии материалов PASS на desktop и mobile.

- [ ] **Step 5: Verify builds and publish**

Run: `npm run build:pages`, затем проверить `git diff --check`, закоммитить, отправить `codex/homepage-prototype` и дождаться успешного GitHub Pages workflow.
