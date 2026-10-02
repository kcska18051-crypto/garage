# Materials Compact Banners Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать баннеры детальных материалов компактными, удалить оглавление и выровнять весь текст по левому краю основной области.

**Architecture:** Шаблон детали теряет условный nav оглавления и получает обычный нейтральный абзац для статей. CSS задаёт главным и декоративным обложкам пропорцию 3:1, сохраняет видео 16:9 и убирает центрирующие auto-отступы текстовой колонки.

**Tech Stack:** React, TypeScript, CSS, Vitest, Playwright, Vite.

## Global Constraints

- Изменяются только страницы Новости/Статьи/Обзоры.
- Sidebar, шапка, крошки, сетка 4/3/2/1 и «Читайте дальше» сохраняются.
- Главная и декоративные обложки используют пропорцию 3:1.
- Видео остаётся 16:9; один ролик крупный, два рядом, mobile вертикально.
- В DOM нет блока «Содержание» и якорной навигации материала.
- Лид, абзацы и подзаголовки начинаются от левого края `.materials-main`.

---

### Task 1: Удаление оглавления

**Files:**
- Modify: `prototype/src/pages/MaterialsPages.test.tsx`
- Modify: `prototype/src/pages/MaterialsPages.tsx`

**Interfaces:**
- Consumes: `MaterialDetailPage`, `item.sections`.
- Produces: обычный абзац `.material-detail__note` без ссылок-якорей.

- [ ] **Step 1: Write the failing test**

Проверить, что `/articles/work-area` не содержит navigation «Содержание статьи» и текста «Содержание», но показывает нейтральный абзац с `data-testid="material-detail-note"`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/MaterialsPages.test.tsx`

Expected: FAIL из-за существующего оглавления.

- [ ] **Step 3: Write minimal implementation**

Удалить условный `<nav className="material-contents">` и заменить его для статьи на `<p className="material-detail__note" data-testid="material-detail-note">…</p>` без ссылок.

- [ ] **Step 4: Run unit test**

Run: `npx vitest run src/pages/MaterialsPages.test.tsx`

Expected: все проверки PASS.

### Task 2: Компактная геометрия

**Files:**
- Modify: `prototype/e2e/materials.spec.ts`
- Modify: `prototype/src/features/materials/Materials.css`

**Interfaces:**
- Consumes: `.materials-main`, `.material-detail__cover`, `.material-inline-image`, `.material-intro`, `.material-section`, `.material-videos`.
- Produces: баннеры 3:1, текст с общим левым краем и видео 16:9.

- [ ] **Step 1: Write the failing browser test**

На 1920 и 2560 px проверить отношение ширины к высоте главной и декоративной обложки не менее 2.9, совпадение их левого края и левых краёв лида/секций с `.materials-main` в пределах 2 px, а также отсутствие `.material-contents`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- materials.spec.ts --grep "keeps compact banners and one content line"`

Expected: FAIL на 16:9 и центрированных текстовых секциях.

- [ ] **Step 3: Write minimal CSS**

Задать `aspect-ratio: 3 / 1` для `.material-detail__cover .material-cover` и `.material-inline-image`; удалить `margin-inline:auto` у `.material-detail__heading > p`, `.material-intro`, `.material-section`; оформить `.material-detail__note` как обычный левый абзац шириной до 50 rem.

- [ ] **Step 4: Verify and publish**

Run: `npx vitest run src/pages/MaterialsPages.test.tsx`, `npm run test:e2e -- materials.spec.ts`, `npm run build:pages`, `git diff --check`. Затем закоммитить, отправить `codex/homepage-prototype` и дождаться успешной GitHub Pages публикации.
