# Локальная версия баннеров V24 — 30 октября 2026

Статус: локально, без публикации и push. Preview: http://127.0.0.1:4196/garage/style-check/?v=responsive-raster-24

## Решения

- Для основных баннеров используются отдельные законченные WebP для desktop/mobile. Текст и CTA запечены в растровый файл до загрузки на сайт. Десктопные варианты используют всю ширину с фотографическим окружением и увеличенными товарами и типографикой
- Последнее уточнение пользователя: в акциях ТОЛЬКО изображение. Заголовок, описание, срок и CTA снова отдельным редактируемым HTML под обложкой, как ранее. Данные берутся из prototypeData.promotions, ссылки сохранены
- Размеры контейнеров и согласованные шапка, карточки товаров, навигация не менялись
- Предыдущие V22/V23 материалы оставлены как история, V23 не подключался

## Файлы

- prototype/src/features/home/CampaignRaster.tsx — выбор готового растра через picture
- prototype/src/pages/StyleCheckHomePage.tsx — восстановленный текст акций под обложкой
- prototype/public/style-check/campaigns-responsive-v24.css — геометрия без графических слоёв
- prototype/public/style-check/review-assets/raster-responsive-v24/ — 20 desktop/mobile файлов и три picture-only обложки акций
- prototype/scripts/render-responsive-raster-campaigns.py — офлайн экспорт растров
- artifacts/banner-review-v24/production.json — тексты и исходные фотографии
- artifacts/banner-review-v24/masters/ — PNG исходники десктопных макетов

## Проверка

npm run build:pages прошёл. Два целевых test files / 5 тестов прошли. Playwright проверил 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920: без горизонтального overflow, высоты карточек акций совпадают с прежними (446/428/414/472/451 по брейкпоинтам), все три картинки загружены и подписи отдельным HTML. На 320/390/768/1024/1440/1920 проверена загрузка и object-fit:cover рекламных изображений. Визуально просмотрены hero, услуги, акции на мобильном и desktop; изображения и QA JSON в artifacts/banner-review-v24. Read-only review исходников не выявил регрессий

## Запуск

cd C:/Users/Admin/garage-design/prototype
npm run build:pages
npm run preview -- --host 127.0.0.1 --port 4196 --base=/garage/
