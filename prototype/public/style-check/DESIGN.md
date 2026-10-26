# Style Check: Industrial Precision

Approved direction, 26 October 2026: balanced automotive retail on #FFFFFF, existing yellow #FFCC00, red #C92F29, graphite #171717. Preserve the supplied logo unchanged; retain Arial/Helvetica until licensed SkodaSans webfonts are supplied. Do not invent brand assets, inventory, prices, claims or technical specifications.

The signature composition is an integrated paint-matching photographic hero, with a yellow copy field and an angled transition into the existing paint photograph. Navigation and product grids remain compact. Cards use contained images, 2-line names, aligned price zones and full-width cart actions. Radius scale: controls 10px, cards 14px, promotional panels 20px. Spacing follows a 4px base.

## Implementation plan

- [x] Build an independent entry in this directory, importing the prototype's providers, routes, dialogs and data without editing their sources. Remove the old CSS loader from this entry only. Bundle using the existing Vite installation.
- [x] Implement SVG icons, header adapters and a real hero carousel. Preserve search, region, catalog, authentication and all original quick links.
- [x] Implement reusable product cards and collections with existing promotion pricing and commerce actions. Map existing project image URLs by product ID, never DOM position. Preserve quote actions and product navigation.
- [x] Render every existing visible merchandising block, category, brand, promotion, service, article and consultation action. Use one token stylesheet, responsive layouts and reduced-motion support.
- [x] Build both the prototype and the separate entry. Verify widths 1440, 1366, 1280, 1024, 768, 390, 375, image loads, no page overflow and commerce/navigation/form interactions. Review screenshots before completion.

## Constraints and asset status

Only files beneath `prototype/public/style-check/` change. Original prototype sources and build configuration stay untouched. The separate bundle is rebuilt with `node public/style-check/build.mjs`. The page remains available at `/garage/style-check/` after the normal Pages build.

Existing external product photographs are illustrative equipment images, not verified SKU photography (see SOURCES.md). They are retained, not replaced with new stock. Exact digital brand colors, licensed SkodaSans fonts and verified SKU assets remain client dependencies. Demonstration copy remains the supplied prototype content.
