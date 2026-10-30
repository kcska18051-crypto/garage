# Гараж — рекламные баннеры V20, 30 октября 2026

Локальная переработка после отклонения V19. Не опубликована. Согласованные шапка, карточки товаров, категории и подвал не изменялись в рамках этой правки.

## Что изменено

- Три слайда главного баннера: мастерская, подбор автоэмали, сервисный центр.
- Четыре вставки между товарными полками: сезон, кузовные материалы, компрессоры, рабочий пост.
- Графические обложки трёх акций. Заголовки, описания, демонстрационные сроки и CTA сохранены.
- Три карточки услуг: ремонт, аренда, подбор автоэмали.
- Фон существующего блока консультации согласован с графитовой частью кампании.

V19 больше не загружается: index.html подключает campaigns-v20.css. Убраны вложенные панели, двойные рамки, белые подложки и псевдообъём прямоугольников. Глубина теперь заложена в растровые предметные композиции, освещение и материалы. Используются графитовые, тёплые светлые и жёлтые сцены; в части блоков предметы расположены слева от текста.

## Референс и ограничения исследования

https://www.vseinstrumenti.ru/ — текстовая главная доступна. Браузерные попытки при 1440 и 390 px показывают антибот-проверку: полноценный просмотр живой главной не состоялся. Проверка не обходилась.

Отдельно доступны три актуальных креатива из ссылок главной на CDN: «Скидкохват», «Закрытая распродажа», «Оплата бонусами Спасибо». Они просмотрены как ориентир масштаба предмета, лаконичности и отсутствия вложенных фоторамок. Изображения, тексты и палитры этих рекламных кампаний не переносились в проект. Нельзя утверждать, что проведён полный визуальный аудит десктопной и мобильной главной конкурента.

## Созданная графика

Метод: встроенный image_gen, без CLI/API. Исходные фотографии — существующие материалы проекта. Сгенерированные композиции являются рекламной интерпретацией этих фотографий; не заменяют каталожные изображения или технические спецификации товаров.

Финальные файлы в prototype/public/style-check/review-assets/cinematic-v20/:

| Файл | Сюжет | Исходные материалы |
| --- | --- | --- |
| workshop.webp | Тележка и подкатной домкрат | product-cabinet.jpg, product-jack.jpg |
| paint.webp | Краскопульт и веер образцов цвета | product-spraygun.jpg; нейтральный веер — реквизит услуги |
| compressor.webp | Поршневой компрессор | product-compressor.jpg |
| service.webp | Работа с открытым механизмом | repair-photo.jpg |
| rental.webp | Композиция из трёх инструментов | rental-photo.jpg |

Все WebP — 1200×800 с сохранённым alpha-каналом. Суммарный размер около 1,04 МБ. Один и тот же набор файлов используется на всех разрешениях. Изображения не содержат рекламных заголовков и CTA; они реализованы в HTML. Основные предметы выводятся через object-fit: contain без обрезки. Коммерческие обещания, скидки и новые бренды в тексты не добавлялись.

## Финальный набор промптов

Общие ограничения всех пяти запросов: premium photorealistic industrial advertising, horizontal 3:2, genuinely transparent background; preserve reference product identity, materials and controls; no new brand, no text or UI; no white rectangle, no frame, no glass box, no pedestal; all important product parts fully visible. Commercial studio light, realistic contact shadows and restrained reflection fading to transparency. Результаты проверены визуально до интеграции.

1. **Workshop — compositing.** Input image 1 exact red/black MEEC TOOLS rolling cabinet; input image 2 exact red floor jack. Coherent low three-quarter advertising composition: cabinet dominant at rear right, jack diagonally across foreground lower left. Products occupy most of the canvas, retain markings, mechanism, handle and wheels. Soft warm key and white rim lighting; precise metal and rubber surfaces.
2. **Paint — compositing / color-matching advertising.** Preserve the exact blue gravity-feed gun, white cup, knobs and nozzle from the reference. Place it behind a fan of metallic automotive sample leaves in silver, charcoal, pearl white, yellow, red and blue. The neutral fan is service demonstration material. High-detail metallic microtexture and controlled highlights, coherent advertising still life.
3. **Compressor — product advertising cutout.** Preserve the red MEEC TOOLS compressor tank, motor, pipes, handle, wheels and labels. Whole compressor fills approximately 90% of the wide canvas. Lower three-quarter commercial angle, realistic glossy red metal and machined fittings, black motor and rubber; white rim and soft key light.
4. **Service — compositing.** Use repair-photo.jpg as actual mechanical repair context. Isolated open metal housing and two gloved technician hands working with a ratchet; two loose sockets. Show forearms only. Diagonal overhead commercial close-up, complete important housing, convincing metallic detail, warm key and white edge light. No surrounding rectangular table/photo background.
5. **Rental — compositing.** Preserve the three tools from rental-photo.jpg: dark blue drill, red jigsaw and red/black grinder. Upright drill rear left, jigsaw foreground, grinder rear right. Coherent overlapping still life, entire tools visible, realistic wear and materials, sharp studio highlights, contact shadow/reflection fading into alpha.

Original generated PNG files are retained in C:/Users/Admin/.codex/generated_images/01a178ab-be7d-7f43-999e-6aef757bf653/:
- workshop: exec-91d7952d-bced-4438-adaf-1a8a89c97743.png
- paint: exec-7ec49c8f-c21e-4433-a647-b8c002d81b95.png
- compressor: exec-974ea1fe-8b4f-4dde-95ee-1a42edef8bba.png
- service: exec-e9b4f96d-a72e-45aa-ab24-9ddb87e02a7d.png
- rental: exec-49b59215-f753-4903-ae79-db5fdcf7ea52.png

## Проверки

375, 390, 768, 1024, 1440, 1920 px:
- ширина и высота всех 12 существующих контейнеров совпали с измерениями до переработки;
- все три слайда проверены на каждой ширине;
- заголовки, подзаголовки, CTA и прямоугольники основных изображений находятся внутри баннеров;
- одинаковые image src на всех разрешениях, отдельных мобильных ассетов нет;
- горизонтального переполнения страницы нет;
- свайп и автопереключение подтверждены в браузере, 0 ошибок JavaScript;
- npm run build:pages — успешно;
- HomeMerchandisingStream и StyleCheckHeader — 5 тестов успешно;
- дополнительное ревью реализации не выявило конкретных ошибок.

Выполнен просмотр скриншотов главного баннера, вставок, акций и услуг на 390/1440 px, отдельно услуг на 768 px. Детальные локальные отчёты и снимки: %TEMP%/garage-header-local/cinematic-*.

Локальный просмотр: http://127.0.0.1:4196/garage/style-check/?v=cinematic-20
