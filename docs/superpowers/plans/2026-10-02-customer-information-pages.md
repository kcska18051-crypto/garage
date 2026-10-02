# Customer Information Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать и опубликовать единый шаблон страниц «Доставка», «Оплата» и «Гарантия на товар».

**Architecture:** Локальный модуль данных описывает три страницы и их секции. `InfoPage` рендерит общий sidebar/mobile-nav, крошки и текст; роутер передаёт ключ страницы. Существующие Header, Footer и ProductSections получают точные ссылки.

**Tech Stack:** React, TypeScript, React Router, CSS, Vitest, Playwright, Vite.

## Global Constraints

- Маршруты: `/delivery`, `/payment`, `/warranty`.
- Никаких цен, сроков, перевозчиков, географии, гарантийных периодов и юридических обязательств.
- Кредит, лизинг, оферта и юридические документы не входят в пакет.
- Desktop sidebar; mobile горизонтальные переключатели.
- Единый левый край контента, общий контейнер шапки, без hero и оглавления.

---

### Task 1: Шаблон и маршруты

**Files:**
- Create: `prototype/src/data/infoPagesData.ts`
- Create: `prototype/src/pages/InfoPage.tsx`
- Create: `prototype/src/features/info/InfoPages.css`
- Create: `prototype/src/pages/InfoPages.test.tsx`
- Modify: `prototype/src/app/routes.tsx`

**Interfaces:**
- Produces: `InfoPage({ page }: { page: InfoPageKey })`, `infoPages`, `infoPageEntries`.

- [ ] Написать unit-тесты трёх URL, H1, крошек, активного меню, трёх секций и переходов между страницами.
- [ ] Запустить `npx vitest run src/pages/InfoPages.test.tsx` и увидеть FAIL на заглушках.
- [ ] Реализовать данные, общий шаблон, CSS и явные маршруты; удалить `/delivery` из placeholder routes.
- [ ] Повторить unit-тест и получить PASS.

### Task 2: Входящие ссылки

**Files:**
- Modify: `prototype/src/features/footer/Footer.tsx`
- Modify: `prototype/src/features/footer/Footer.test.tsx`
- Modify: `prototype/src/features/product-detail/ProductSections.tsx`
- Modify: `prototype/src/pages/ProductDetailPage.test.tsx`
- Modify: `prototype/src/app/routes.tsx`

**Interfaces:**
- Consumes: `/delivery`, `/payment`, `/warranty`, `/privacy`.

- [ ] Сначала добавить падающие проверки отдельных ссылок футера, товара и политики `/privacy`.
- [ ] Обновить ссылки, сохранив общий вход шапки `/delivery`.
- [ ] Запустить соответствующие unit-тесты и получить PASS.

### Task 3: Responsive E2E и публикация

**Files:**
- Create: `prototype/e2e/info-pages.spec.ts`

- [ ] Добавить E2E переходов, активного меню и overflow на 2560/1920/1440/1024/390/360.
- [ ] Запустить `npm run test:e2e -- info-pages.spec.ts`.
- [ ] Запустить `npm run build:pages` и `git diff --check`.
- [ ] Визуально проверить desktop/mobile, закоммитить, push в `codex/homepage-prototype`, дождаться GitHub Pages и проверить прямые публичные URL.
