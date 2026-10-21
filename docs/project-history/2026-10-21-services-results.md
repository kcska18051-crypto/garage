# Услуги — результат реализации 21 октября 2026

Код: `e0598610f7f67b0bf891ed6aee6610fc30662e9a`, опубликован в `origin/codex/homepage-prototype`.
CI/deploy: https://github.com/kcska18051-crypto/garage/actions/runs/39572681059 — success, 48 файлов / 288 тестов.
Артефакт: `index-XVkZXVy_.js`, `index-C29vLxz_.css`, 149 статических маршрутов.

## Просмотр

- [Все услуги](https://kcska18051-crypto.github.io/garage/services/)
- [Сервисный центр](https://kcska18051-crypto.github.io/garage/services/service-center/)
- [Ремонт компрессоров](https://kcska18051-crypto.github.io/garage/services/service-center/compressor-repair/)
- [Винтовые](https://kcska18051-crypto.github.io/garage/services/service-center/compressor-repair/screw/), [поршневые](https://kcska18051-crypto.github.io/garage/services/service-center/compressor-repair/piston/), [дизельные](https://kcska18051-crypto.github.io/garage/services/service-center/compressor-repair/diesel/)
- [Подбор автоэмали](https://kcska18051-crypto.github.io/garage/services/paint-matching/)
- [Аренда](https://kcska18051-crypto.github.io/garage/services/rental/)
- [Домкрат](https://kcska18051-crypto.github.io/garage/services/rental/hydraulic-jack/), [набор инструмента](https://kcska18051-crypto.github.io/garage/services/rental/tool-set/), [компрессор](https://kcska18051-crypto.github.io/garage/services/rental/piston-compressor/)

## Проверки

- RED страниц: 14 ожидаемых падений на старых заглушках. RED форм и валидации: 11 + 11 ожидаемых падений; затем GREEN.
- Первые релевантные unit: 43/43; после расширения проверок маршрутов и manifest — 18/18 страниц/publication, ранее 29/29 форм/валидации.
- Исправлена тестовая ошибка TypeScript: Testing Library `getByRole` не принимает `exact`; `tsc -b` GREEN.
- Playwright `e2e/services.spec.ts --project=desktop --workers=1`: 12/12. Все 11 экранов на 360/390/1024/1440/1920/2560; три ремонтных заявки, локальное фото/type/size/preview/remove, автоэмаль, каталог аренды и каждая деталка, даты/количество, demo-результат, focus trap/Escape/возврат фокуса, блокировка фона и отсутствие перекрытия mobile submit; localStorage не меняется.
- Первый прогон E2E выявил гонку самого теста при чтении заголовка до перехода; добавлено ожидание URL/H1, финальный полный прогон 12/12.
- Build Pages GREEN, 149 маршрутов. Полный локальный unit-run завис без результатов и был прерван; это не считается успешной проверкой. Полный набор успешно выполнен в CI.
- Независимый read-only source review: Critical/Important не обнаружены. Проверка с реальным assistive technology не выполнялась; overlay/Tab/Escape проверены в браузере.
- `node scripts/verify-services-public.mjs e059861`: все 12 URL, включая legacy workshop→services, HTTP200 с/без slash и reload; пять типов экранов и demo rental submit/focus на всех шести ширинах; JS pageerror отсутствуют; публичный JS соответствует сборке. Все собственные браузеры закрыты через finally, общий браузер не использовался.
- Визуально просмотрены сохранённые mobile/desktop изображения: [390](screenshots/services/services-390.png), [1920](screenshots/services/services-1920.png), [деталка 1440](screenshots/services/rental-1440.png), [форма 390](screenshots/services/rental-form-390.png).

## Границы и дальнейшая приёмка

Всё наполнение демонстрационное. Нет реальных заявок/загрузок, бронирования/оплаты, тарифов, интеграции с ЛК или хранения персональных данных. Изображения — нейтральные геометрические заглушки. Меню каталога не изменено. Независимая пользовательская приёмка услуг остаётся отдельным шагом.

Sticky-фильтры были опубликованы ранее: код `f914f38`, отчёт `7e5d934`. Независимая приёмка отклонена: точный URL с `?v=f914f38` даёт пустую выдачу, поскольку неизвестный query-параметр ошибочно становится техническим фильтром. Без `v` закрепление работает; с `v` воспроизведены отрицательные top и укороченный контейнер. Это отдельный следующий hotfix URL-parser, а не принятая задача. Не выдавать прежний отчёт за успешную независимую приёмку.
