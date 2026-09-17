# Личный кабинет Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать связанный адаптивный интерактивный прототип личного кабинета «Гаража» на маршрутах `/profile/*`.

**Architecture:** Вложенные React Router маршруты используют единый `ProfileShell` и `ProfileProvider`. Демонстрационные данные отделены от изменяемого состояния, а корзина и избранное переиспользуют `CommerceState`.

**Tech Stack:** React 19, React Router 7, TypeScript, CSS, Vitest/Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-17-profile-prototype-design.md`

## Global Constraints

- Не подключать реальные SMS, 1С, DaData или карты.
- Не показывать бонусную программу, документы юрлица, сотрудников и роли.
- Все коммерческие и персональные данные являются демонстрационными.
- Сохранять существующие `/cart` и `/favorites`; `/favorites` перенаправить осознанно.
- Использовать существующие карточки товаров и единое состояние корзины/избранного.

---

### Task 1: Данные, конфигурация и общее состояние

**Files:**
- Create: `prototype/src/data/profileData.ts`
- Create: `prototype/src/state/ProfileState.tsx`
- Modify: `prototype/src/state/CommerceState.tsx`
- Test: `prototype/src/state/ProfileState.test.tsx`

**Interfaces:**
- Produces: `profileConfig`, `profileData`, `ProfileProvider`, `useProfile`, `CommerceContextValue.removeFavorite`, `CommerceContextValue.addManyToCart`.

- [ ] Написать падающие тесты для скрытого bonus flag, отмены заказа, очистки истории и пакетного добавления в корзину.
- [ ] Запустить `npm test -- ProfileState.test.tsx --run` и подтвердить ожидаемое падение.
- [ ] Реализовать типизированные данные и минимальные операции состояния.
- [ ] Повторно запустить тест и получить PASS.

### Task 2: Единая оболочка и маршруты

**Files:**
- Create: `prototype/src/features/profile/ProfileShell.tsx`
- Create: `prototype/src/features/profile/Profile.css`
- Create: `prototype/src/pages/ProfilePages.tsx`
- Modify: `prototype/src/app/routes.tsx`
- Test: `prototype/src/pages/ProfilePages.test.tsx`

**Interfaces:**
- Consumes: `ProfileProvider`, `profileConfig`.
- Produces: вложенные маршруты `/profile/*` и redirect `/favorites`.

- [ ] Написать падающий маршрутный тест для всех разделов, активной навигации и отсутствия бонусной карты.
- [ ] Запустить тест и подтвердить отсутствие страниц.
- [ ] Реализовать shell, navigation и route table.
- [ ] Запустить тест и получить PASS.

### Task 3: Обзор и SMS-сценарий

**Files:**
- Create: `prototype/src/features/profile/ProfileOverview.tsx`
- Create: `prototype/src/features/profile/ProfileAuth.tsx`
- Modify: `prototype/src/pages/ProfilePages.tsx`
- Test: `prototype/src/features/profile/ProfileAuth.test.tsx`

**Interfaces:**
- Consumes: `useProfile()` auth state and overview data.
- Produces: phone → code → success flow and compact dashboard.

- [ ] Написать падающие тесты для отдельных согласий, неверного/истёкшего кода, resend и успешного кода `1234`.
- [ ] Запустить тесты и подтвердить RED.
- [ ] Реализовать формы и обзор.
- [ ] Запустить тесты и получить PASS.

### Task 4: Заказы и детальная карточка

**Files:**
- Create: `prototype/src/features/profile/ProfileOrders.tsx`
- Create: `prototype/src/features/profile/ProfileOrderDetail.tsx`
- Test: `prototype/src/features/profile/ProfileOrders.test.tsx`

**Interfaces:**
- Consumes: `useProfile()`, `useCommerce()`.
- Produces: вкладки заказов, repeat dialog, cancel request, recipient editor, address suggestions и map dialog.

- [ ] Написать падающие тесты для вкладок, повторного заказа, недоступной позиции, отмены, получателя и карты.
- [ ] Запустить тесты и подтвердить RED.
- [ ] Реализовать списки, детали и диалоги.
- [ ] Запустить тесты и получить PASS.

### Task 5: Организации, избранное и история

**Files:**
- Create: `prototype/src/features/profile/ProfileOrganizations.tsx`
- Create: `prototype/src/features/profile/ProfileFavorites.tsx`
- Create: `prototype/src/features/profile/ProfileRecentlyViewed.tsx`
- Test: `prototype/src/features/profile/ProfileCollections.test.tsx`

**Interfaces:**
- Consumes: `profileData`, `useProfile()`, `useCommerce()`, `ProductCard`.
- Produces: INN lookup/confirm, synchronized favorites and clearable viewing history.

- [ ] Написать падающие тесты для INN autofil, удаления избранного и подтверждения очистки истории.
- [ ] Запустить тесты и подтвердить RED.
- [ ] Реализовать три раздела.
- [ ] Запустить тесты и получить PASS.

### Task 6: Услуги, отзывы и данные профиля

**Files:**
- Create: `prototype/src/features/profile/ProfileServices.tsx`
- Create: `prototype/src/features/profile/ProfileReviews.tsx`
- Create: `prototype/src/features/profile/ProfileData.tsx`
- Test: `prototype/src/features/profile/ProfileSecondarySections.test.tsx`

**Interfaces:**
- Consumes: `profileData`, `useProfile()`.
- Produces: статусы заявок/отзывов, profile editing и демонстрационное подтверждение нового телефона.

- [ ] Написать падающие тесты для четырёх статусов услуг, трёх статусов отзывов и смены телефона.
- [ ] Запустить тесты и подтвердить RED.
- [ ] Реализовать разделы.
- [ ] Запустить тесты и получить PASS.

### Task 7: Адаптив, E2E и публикация

**Files:**
- Modify: `prototype/src/features/profile/Profile.css`
- Create: `prototype/e2e/profile.spec.ts`

**Interfaces:**
- Consumes: все маршруты и сценарии Tasks 1–6.
- Produces: desktop/mobile regression coverage.

- [ ] Написать E2E проверки маршрутов, сценариев и overflow на 1440, 768, 390 и 360 px.
- [ ] Запустить `npm run test:e2e -- profile.spec.ts` и исправить только подтверждённые ошибки.
- [ ] Запустить `npm test -- --run`, `npm run build` и полный релевантный E2E-набор.
- [ ] Визуально проверить `/profile`, `/profile/orders/order-102`, `/profile/organizations` и `/profile/data` на desktop/mobile.
- [ ] Зафиксировать изменения, отправить ветку и дождаться успешного GitHub Pages deploy.
