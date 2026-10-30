# Популярные категории — локальное сравнение V25

Два оформления существующих карточек: спокойный (светлые жемчужные поверхности, мягкие тени, стеклянные световые грани) и выразительный (жёлтые диагональные световые слои, более глубокие тени и динамичное наведение)

Временный переключатель над сеткой. Все эффекты — scoped CSS в prototype/public/style-check/category-variants-v25.css. Товары — отдельные WebP из тех же исходных фотографий (category-products), подписи — прежний HTML. Новых элементов внутри карточек нет

Изменены только ReviewCategories в StyleCheckHomePage.tsx, подключение CSS в style-check/index.html, добавлены stylesheet и шесть WebP. Габариты, padding, порядок, ссылки и тексты карточек сохранены. Переключатель добавляет место только внутри самого блока категорий

Проверка: npm run build:pages прошёл. Playwright: 320/390/768/1024/1440, оба оформления без горизонтального overflow; размеры всех карточек, тексты и ссылки полностью совпали с baseline; размеры всех других блоков полностью совпали. Проверены hover двух вариантов и prefers-reduced-motion. Скриншоты и QA: artifacts/categories-v25

Локальная ссылка: http://127.0.0.1:4196/garage/style-check/?v=category-variants-25
Ничего не опубликовано

## PNG V27

Сгенерированы built-in imagegen шесть отдельных PNG с настоящим RGBA alpha по тем же товарным референсам. Подключены в обоих вариантах. mix-blend-mode отключён, слои с товаром выше декораций. Файлы: prototype/public/style-check/review-assets/category-products-png-v27/{jack,cabinet,spraygun,compressor,toolset,welder}.png. Исходные результаты генерации не удалены. Полные промпты и абсолютные пути сохранены в artifacts/categories-v25/png-production.json. Build и визуальная проверка desktop/mobile прошли. Playwright 320/390/768/1024/1440: все PNG загружены, normal blending, размеры карточек совпали с baseline, без overflow
