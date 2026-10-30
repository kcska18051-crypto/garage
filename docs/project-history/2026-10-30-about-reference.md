# О компании — локальная версия V29

Согласованная композиция: существующая фотография мастерской слева и компактный HTML текст справа, ниже четыре светлые карточки фактов. Без цифр; подписи «данные клиента» сохранены. На мобильном фото, текст, сетка фактов 2 × 2. Декор приглушённый, отдельные прозрачные PNG, сгенерированные built-in imagegen. Иконки и текст остаются кодом

Изменены только ReviewAbout в prototype/src/pages/StyleCheckHomePage.tsx и подключение отдельного scoped CSS about-reference-v29.css. PNG в prototype/public/style-check/review-assets/about-v29. Полные промпты и абсолютные пути: artifacts/about-v29/production.json

Проверка: npm run build:pages прошёл. Playwright 320/390/768/1024/1440: без горизонтального переполнения страницы, четыре подписи без цифр, ссылка /garage/about сохранена, изображения загружены. Выход декора за внутренний край карточек намеренно обрезается overflow:hidden. Визуально проверены screenshots 390 и 1440 в artifacts/about-v29

Preview: http://127.0.0.1:4196/garage/style-check/?v=about-29
Локально, без push и публикации
