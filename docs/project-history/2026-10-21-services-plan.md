# Services Implementation Plan

> Execution: inline по явному разрешению пользователя; независимые диалоги могут быть делегированы после фиксации интерфейса. Один общий релиз услуг, после завершённого релиза фильтров.

**Goal:** Реализовать согласованную иерархию услуг и честные демонстрационные заявки.
**Architecture:** Общие данные `servicesData.ts`, шаблоны `ServicesPages.tsx`, отдельный `ServiceRequestDialog`; URL в существующем router и publicRoutes manifest. Без зависимостей/API/корзины/ЛК.
**Tech Stack:** React/TypeScript/React Router, CSS tokens, Vitest/Testing Library, Playwright, Vite Pages.
**Spec:** [Согласованное ТЗ](2026-10-21-services-spec.md).

## Global constraints

Все данные явно демонстрационные. Тариф/залог/стоимость/сроки «Уточняются». Меню каталога не менять. Не добавлять ложные серверные заявки/бронь/историю ЛК. Все новые URL имеют статический entry point.

## Review focus

- Query/slug неизвестной услуги не подменяет реальную позицию — 404 UI.
- Фото не сохраняется/не отправляется; objectURL/input очищаются после удаления и закрытия.
- Локальная дата (не UTC) и целое количество; ошибки и успех не подтверждают бронь.
- Закрытие/Escape/Tab/Shift+Tab/возврат фокуса; mobile-панели не перекрывают submit.
- Имена/URL/CTA существующих ссылок главной согласованы; rent не вызывает commerce/session/ЛК.

## Task 1 — данные, страницы, маршруты

Files: create `src/data/serviceTypes.ts`, `src/data/servicesData.ts`, `src/pages/ServicesPages.tsx`, `ServicesPages.css`, tests; update routes, publicRoutes, существующую hero-ссылку.

Interface: `ServiceRequest = {kind:'repair'|'paint'|'rental';title:string;itemId:string}`; dialog receives `{request:ServiceRequest,onClose():void}`.

- [ ] RED unit: корень 3 направления, каждый путь с правильным H1/крошками, rental→own detail, unknown→404, manifest entry points.
- [ ] GREEN данные/шаблоны/маршруты. 3 rental items связаны с имеющимися примерами, без цены покупки как тарифа.
- [ ] Проверить переходы/произвольные URL/CTA и отсутствие giant hero/overflow.

## Task 2 — независимые формы

Files: create `src/features/services/ServiceRequestDialog.tsx`, CSS, validation helpers/tests. Consumes только `serviceTypes.ts`, никаких изменений pages/router/data/commerce.

- [ ] RED тесты ремонта/автоэмали/аренды, errors/success, фото, даты/количество, focus/Escape.
- [ ] GREEN общий диалог по контракту, только память/локальный demo-номер.
- [ ] Relevant unit GREEN; отчёт о файлах/проверках; не делать отдельный push/deploy.

## Task 3 — интеграция, проверка, публикация

- [ ] Соединить страницы и диалог; browser все уровни/формы/фото/даты/mobile; 360/390/1024/1440/1920/2560.
- [ ] Read-only review всех изменений, исправить важные замечания с regression tests.
- [ ] Build + unit/CI, единый commit/push/deploy услуг; публичные HTTP200/reload/link/form checks.
- [ ] Скриншоты/отчёт/SHA/ограничения; закрыть собственный браузер, независимая приёмка отдельно.

## Progress ledger

Начальная точка: фильтры опубликованы `f914f38`, отчёт `7e5d934`. ТЗ/план фиксируются до продуктового кода. Решение по rental-набору и URL дано в ТЗ; дополнительное согласование не требуется.

21.10: задачи 1–3 реализации/форм/релиза выполнены; код `e059861`, CI/deploy success, публичные проверки пройдены, собственный браузер закрыт. Подробная проверочная ведомость и ограничения: [результат](2026-10-21-services-results.md). Независимая приёмка услуг отдельно. Последующая доработка sticky/query-parser не относится к этому релизу.
