# План реализации единого пакета клиентских корректировок

> **Spec:** `docs/superpowers/specs/2026-09-30-client-revision-package-design.md`
>
> **Execution:** inline, по прямому указанию исходного проектного чата. Каждый блок выполняется TDD: тест сначала должен падать, затем минимальная реализация и зелёный повторный прогон.

## Глобальные ограничения

- Не менять нейтральную серую айдентику и утверждённую архитектуру шапки.
- Не добавлять реальные платежи, складскую логику, обещания по срокам хранения данных или интеграции.
- Сохранять существующие query-параметры каталога и мобильный drawer фильтров.
- Все новые прямые маршруты должны открываться на GitHub Pages.

## Task 1. Каталог и единая доступность (пункты 1–3)

**Файлы:**
- изменить `prototype/src/features/catalog/ChildCategoryGrid.tsx`
- изменить `prototype/src/features/catalog/Catalog.css`
- изменить `prototype/src/data/catalogTypes.ts`, `catalogData.ts`, `productDetailData.ts`
- создать `prototype/src/utils/availability.ts`
- изменить карточки каталога/PDP и их тесты

**RED:** добавить тесты, что шесть дочерних карточек видны сразу, кнопки раскрытия нет, desktop sidebar не sticky, точные штуки отсутствуют, склонение магазинов корректно.

**GREEN:** упростить сетку подкатегорий, удалить sticky, ввести общую модель/форматтер доступности и применить в выдаче и PDP.

**Verify:** `npm run test:run -- ChildCategoryGrid availability ProductDetailPage ProductListing`.

## Task 2. Бренд и акции (пункты 4–8)

**Файлы:**
- изменить `BrandDetailPage.tsx`, `BrandDetail.css`, `BrandDetailPage.test.tsx`
- изменить `ActionsPage.tsx`, `ActionDetailPage.tsx`, `ActionCard.tsx`, `Actions.css`, `actionsData.ts`
- изменить `routes.tsx`, `create-spa-fallback.mjs`, action unit/E2E tests
- удалить пользовательское использование `CompletedActionsPage.tsx`

**RED:** тесты на отсутствие двух бренд-блоков; архив внутри `/actions`; ссылки архивных карточек; redirect `/actions/completed`; завершённую деталку без CTA; высоты hero; выдачу акции без фильтра и тегов.

**GREEN:** убрать брендовые блоки, встроить архив, добавить завершённое состояние деталки, перенастроить hero и full-width product listing.

**Verify:** `npm run test:run -- BrandDetailPage ActionsPages actionsData ProductListing` и `npx playwright test e2e/actions.spec.ts e2e/brands.spec.ts`.

## Task 3. Профиль (пункты 9–10)

**Файлы:**
- изменить `ProfileState.tsx`, `ProfileSections.tsx`, `Profile.css`
- изменить `ProfileSections.test.tsx`, `ProfilePages.test.tsx`, `e2e/profile.spec.ts`

**RED:** тесты компактной сетки, read-only телефона, двухступенчатого удаления, отдельного удалённого состояния, подтверждения восстановления и success.

**GREEN:** переиспользовать компактный teaser, расширить profile state статусом удаления и реализовать danger-zone/restore flow.

**Verify:** `npm run test:run -- ProfileSections ProfilePages` и `npx playwright test e2e/profile.spec.ts`.

## Task 4. Корзина и checkout (пункт 11)

**Файлы:**
- расширить `CommerceState.tsx`
- создать `data/checkoutData.ts`
- создать `features/cart/*`, `pages/CartPage.tsx`, `pages/CheckoutPages.tsx`
- изменить `App.tsx`, `routes.tsx`, header tests/styles, SPA fallback
- создать unit и `e2e/cart-checkout.spec.ts`

**RED:** тесты количества в корзине, суммы счётчика, изменения количества, удаления/избранного, пустого состояния, трёх шагов, guest phone, сохранённого пользователя, другого получателя, физлица/юрлица и итогов.

**GREEN:** заменить `Set` корзины на строки с количеством, добавить совместимые методы, реализовать страницы и общий summary, mobile sticky CTA.

**Verify:** целевые unit-тесты и `npx playwright test e2e/cart-checkout.spec.ts`.

## Task 5. Полный поиск (пункт 12)

**Файлы:**
- создать `data/searchData.ts`, `features/search/*`, `pages/SearchResultsPage.tsx`
- изменить `SearchBox.tsx`, `Header.css`, `routes.tsx`, SPA fallback
- создать unit и `e2e/search.spec.ts`

**RED:** тесты пустого фокуса и истории, dedupe/limit, удаления и очистки, групп подсказок, выбора маршрута, Enter/Escape/outside, результатов `/search`, mobile promo rail.

**GREEN:** реализовать storage helper, search overlay и реальную страницу результатов на общей карточке товара.

**Verify:** целевые unit-тесты и `npx playwright test e2e/search.spec.ts`.

## Task 6. Стабилизация существующих тестов

**Файлы:** `ActionsPages.test.tsx`, `LowerSections.test.tsx` и код только при выявленной первопричине.

**RED/diagnose:** воспроизвести оба сбоя отдельно, устранить зависимость от текущей даты и причину timeout без ослабления пользовательских ожиданий.

**Verify:** `npm run test:run`; результат — все unit-тесты успешны.

## Task 7. Полная адаптивная и функциональная проверка

**Файлы:** обновить существующие E2E и responsive-сценарии.

**Шаги:**
1. `npm run build:pages`.
2. `npm run test:run`.
3. `npm run test:e2e` и подтвердить exit code 0 без зависания.
4. Проверить 1920, 1440, 1280, 1024, 768, 390, 360 px для всех изменённых экранов.
5. Проверить клавиатурные сценарии поиска и отсутствие перекрытия mobile CTA.

## Task 8. Review, commit, deploy и опубликованная приёмка

1. Выполнить whole-branch review против спецификации по пунктам 1–12.
2. Исправить Critical/Important через RED→GREEN.
3. Зафиксировать изменения одним итоговым feature-коммитом (допускаются промежуточные task-коммиты).
4. Push `codex/homepage-prototype`.
5. Дождаться успешного GitHub Pages workflow.
6. Проверить опубликованные маршруты, включая redirect и mobile/desktop состояния.
7. Передать отчёт строго 1–12: статус, изменение, опубликованный URL, фактическая проверка; отдельно SHA, build, unit, E2E, ширины и ограничения.

## Review focus

- Сумма количества, а не число уникальных SKU, в header badge.
- Русское склонение числа магазинов и отсутствие точных единиц.
- Отсутствие активного CTA на завершённых акциях.
- Redirect сохраняет якорь `#archive`.
- Мобильные sticky CTA и search overlay не конфликтуют с нижней навигацией/safe-area.
- Удалённый профиль не маскируется под logout и восстанавливается только после подтверждения.
- История поиска не принимает пустые строки, не дублируется и ограничена семью элементами.
