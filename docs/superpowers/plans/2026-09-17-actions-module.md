# Actions Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать три связанные страницы раздела «Акции» и нейтральный акцент в шапке.

**Architecture:** Единая модель данных вычисляет статус из дат; маршруты используют общие карточки и универсальный детальный шаблон. Товарная часть переиспользует каталожную выдачу.

**Tech Stack:** React 19, React Router, TypeScript, Vitest, Playwright, CSS.

**Spec:** `docs/superpowers/specs/2026-09-17-actions-module-design.md`

## Global Constraints

- Не создавать деталку завершённой акции.
- Не дублировать систему фильтрации каталога.
- Сохранять монохромную айдентику и обычные ссылки.
- Исключить горизонтальный скролл страницы на контрольных ширинах.

### Task 1: Модель и сроки

**Files:** `prototype/src/data/actionsData.ts`, `prototype/src/data/actionsData.test.ts`

- [x] Написать падающие тесты для обычного срока, 7 дней, 1 дня и последнего дня.
- [x] Реализовать типизированную модель, вычисление статуса и форматирование периода.
- [x] Запустить `npm test -- --run src/data/actionsData.test.ts`.

### Task 2: Маршруты и карточки

**Files:** `prototype/src/pages/ActionsPage.tsx`, `prototype/src/pages/CompletedActionsPage.tsx`, `prototype/src/features/actions/ActionCard.tsx`, `prototype/src/features/actions/Actions.css`

- [x] Написать падающие маршрутные тесты.
- [x] Реализовать актуальный список и архив на одном источнике данных.
- [x] Проверить семантику ссылок и архивное визуальное состояние.

### Task 3: Универсальная деталка

**Files:** `prototype/src/pages/ActionDetailPage.tsx`, `prototype/src/features/catalog/ProductListing.tsx`

- [x] Подключить обязательные и конфигурируемые блоки.
- [x] Расширить `ProductListing` опциональными заголовком и тегами без изменения существующих вызовов.
- [x] Связать вкладки с единым входным набором выдачи.

### Task 4: Навигация, адаптив и регрессия

**Files:** `prototype/src/data/headerNavigationData.ts`, `prototype/src/features/header/Header.css`, `prototype/e2e/actions.spec.ts`

- [x] Поставить «Акции» первым пунктом и применить нейтральный акцент.
- [x] Проверить 1440, 1024 и 390 px, вкладки и отсутствие overflow.
- [x] Запустить полный unit/E2E/build набор и зафиксировать изменения.
