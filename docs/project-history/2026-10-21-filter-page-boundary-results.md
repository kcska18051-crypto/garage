# Фильтр сохраняется через текст категории до подвала

Код: `cba7c4428d4460fd42dbdda8d05308b64c269f8f`, `origin/codex/homepage-prototype`.
CI: https://github.com/kcska18051-crypto/garage/actions/runs/39583142035 — **success**,53файла / **323теста**,82,73s; build/deploy success.
Сборка150routes: `index-D41UESUe.js`, `index-DNZVj-D1.css`.

## Что исправлено

Повторное замечание уточнило UX: прежний sticky был технически ограничен grid и уходил раньше footer, когда карточки уже закончились, а текст категории ещё прокручивался. URL/query hotfix `c582e2f` решал другую причину — ложное обнуление выдачи параметромv — и сохранён.

Общий ProductListing теперь имеет естественный slot колонки и ограниченную фиксацию sidebar относительно closest main. Начальная колонка прокручивается до шапки естественно; затем остаётся под её фактической нижней границей+12px. Нижняя граница — вся основная область, включая текст после сетки, а не конец карточек. При приближении footer уменьшается доступная внутренняя высота, reset остаётся снаружи прокрутки. При остатке меньше180px рабочей области колонка уходит с main, не накрывая footer. Маленький по содержимому фильтр искусственно не растягивается.

Slot резервирует только реальную доступную высоту колонки: фиктивных товаров, пустых продуктовых рядов или minheight для растягивания выдачи не добавлено. Текст категории и продолжение страницы бренда размещены правее занятой фильтром колонки; перекрытия текста нет. Mobile≤767: слот скрыт, фиксация очищена, прежний drawer/draft/apply сохранён. Меню/данные товаров/услуги/ЛК не менялись.

Hook обрабатывает scroll через RAF; ResizeObserver наблюдает колонку, main и реальные параметры; изменение root-переменной шапки и раскрытие фильтров отслеживаются. При unmount отключаются наблюдатели/события/RAF и очищаются inline-стили/восстанавливается boundary-атрибут.

## Локальные доказательства

- RED1920Y1200: прежнее положение отличалось от ожидаемого под шапкой на232,09px.
- Geometry: после создания минимального API4поведенческихRED/1pass→5GREEN; совместно с ProductListing14/14unit.
- Playwright21/21: обычная выдача4widths650/900/1200/последнийэкранпередfooter; суженнаяRemeza и пустаяpricefilter4widths с нижними полями/innerwheel/reset; brand continuation4widths; versionedURL; фактическая высота шапки/fullcompact/resize;360/390drawer. Documentoverflow отсутствует.
- Первый совместный прогон19/20: один старый footer-test читал координату сразу после scroll до RAF-кадра. Добавлено ожидание фактической нижней границы; финальный21/21, production-код задержками не маскировался.
- Source review без actionable findings; предварительное замечание о scrollHeight reviewer отозвал после проверки flex-grow:0. Дальнейшая visual/public проверка не подменялась source-review.
- Build150routes и TypeScript GREEN. [Локальный1920Y1200](screenshots/filter-page-boundary/local/filter-1920-1200.png) и [передfooter](screenshots/filter-page-boundary/local/filter-1920-before-footer.png) визуально просмотрены. Сохранены16local screenshots4widths×4точки.

## Публичная приёмка разработчика

`node scripts/verify-sticky-public.mjs cba7c44 index-D41UESUe.js` — **PASS** после deploy. Основные замеры сделаны на receiver **БЕЗ query**; на каждой ширине подтверждён актуальный publicasset `index-D41UESUe.js`. Короткая/пустая выдача дополнительно проверена с параметрами фильтра иv,360/390drawer — сv. Нижняя «Беларусь», изменение результата, общий reset, innerwheel, нижняя границаmain/footer, отсутствиеoverflow — PASS.

| Ширина | top650 | top900 | top1200 | Высота передfooter | Низфильтра передfooter | footer.top |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1024 | 82,39 | 82,39 | 82,39 | 725,55 | 807,94 | 859,94 |
| 1440 | 82,39 | 82,39 | 82,39 | 725,47 | 807,86 | 859,86 |
| 1920 | 82,39 | 82,39 | 82,39 | 725,45 | 807,84 | 859,84 |
| 2560 | 82,39 | 82,39 | 82,39 | 725,45 | 807,84 | 859,84 |

На1920/2560 приY1200 grid.bottom655,91 (как в отклонённой приёмке), но фильтр **top82,39/bottom888**; main.bottom1028,84, footer.top1068,84. Значит, колонка больше не уходит с концом карточек. Полная высота фильтра на650/900/1200 —805,61px. В последнем экране уменьшается только внутренняя доступная область до725,45–725,55px; верх остаётся82,39, reset доступен. Имеющийся отступ40px междуmain/footer сохранён, новые пустые товарные ряды не добавлены.

### Все публичные скриншоты

| Ширина | scroll650 | scroll900 | scroll1200 | Последнийэкранпередfooter |
| --- | --- | --- | --- | --- |
| 1024 | [650](screenshots/filter-page-boundary/public/1024-650.png) | [900](screenshots/filter-page-boundary/public/1024-900.png) | [1200](screenshots/filter-page-boundary/public/1024-1200.png) | [footer](screenshots/filter-page-boundary/public/1024-before-footer.png) |
| 1440 | [650](screenshots/filter-page-boundary/public/1440-650.png) | [900](screenshots/filter-page-boundary/public/1440-900.png) | [1200](screenshots/filter-page-boundary/public/1440-1200.png) | [footer](screenshots/filter-page-boundary/public/1440-before-footer.png) |
| 1920 | [650](screenshots/filter-page-boundary/public/1920-650.png) | [900](screenshots/filter-page-boundary/public/1920-900.png) | [1200](screenshots/filter-page-boundary/public/1920-1200.png) | [footer](screenshots/filter-page-boundary/public/1920-before-footer.png) |
| 2560 | [650](screenshots/filter-page-boundary/public/2560-650.png) | [900](screenshots/filter-page-boundary/public/2560-900.png) | [1200](screenshots/filter-page-boundary/public/2560-1200.png) | [footer](screenshots/filter-page-boundary/public/2560-before-footer.png) |

Визуально осмотрены public1920Y1200 и1440beforefooter: фильтр остаётся на месте, текст справа не закрыт, footer не перекрыт. Все собственные контексты/браузер закрыты вfinally; общий браузер пользователя не использовался. Рабочая копия проверяется после сохранения отчёта. Независимая повторная приёмка отдельно.

[Открыть receiver](https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment/screw-compressors/receiver/?v=cba7c44) — cache-version; проверена также ссылка без параметров.
