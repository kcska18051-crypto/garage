# 404 Page Design

## Scope

Replace the existing generic unknown-route placeholder with one minimal, responsive 404 screen. Keep the shared site header and footer. Do not add banners, explanatory copy, illustrations, or secondary sections.

## Content and navigation

- Display only the code `404` and heading `Страница не найдена`.
- Provide `На главную` linking to `/` and `В каталог` linking to `/catalog`.
- Continue using the existing wildcard route and the same component for missing catalog/material entities.
- Preserve the GitHub Pages SPA fallback; this guarantees the visual screen, not an HTTP status contract.

## Layout

Use the existing container and tokens. Center the compact content vertically within a responsive main region, keep the actions readable on desktop and stacked on narrow mobile screens, and avoid horizontal overflow.

## Verification

Cover the unknown route, exact content, both links, direct navigation, desktop/mobile overflow, unit tests, production Pages build, and browser tests.
