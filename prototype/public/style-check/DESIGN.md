# Style Check: Industrial Precision

Approved direction, 26 October 2026: balanced automotive retail on #FFFFFF, existing yellow #FFCC00, red #C92F29, graphite #171717. Preserve the supplied logo unchanged; retain Arial/Helvetica until licensed SkodaSans webfonts are supplied. Do not invent brand assets, inventory, prices, claims or technical specifications.

V2 direction, 26 October 2026: preserve the V1 components, content, section order and interactions. The hero uses a light copy area, large inset photograph and yellow CTA, without diagonals, masks or overlay gradients. All three slides share this composition. Seasonal and workstation promotions become light; paint retains a restrained yellow CTA/accent; rental joins the light service-card system. Only the final consultation panel remains a large dark surface.

## V2 token contract

Colors: #FFFFFF page/card base, #F5F6F7 local neutral surface, #171717 primary text, #62666B secondary text, #E2E4E7 borders, #FFCC00 primary action, #C92F29 sales, #EDBE00 action hover. Existing colors are preserved; no new saturated palette is introduced.

Geometry: controls 8px, cards 12px, promotional panels 16px. Spacing 4/8/12/16/24/32/40px. Buttons at least 44px tall; carousel buttons 44px square; product icon controls 40px square. Photo areas use contain for equipment and cover with per-slide focal points for scenes.

Typography: inherited Arial/Helvetica pending licensed SkodaSans; section headings 24–30px, hero 34–48px, promo 24–34px, product names 15px desktop / 14px mobile, prices 26px / 24px, metadata 12px. Product names reserve two lines desktop, three mobile; stock, prices and purchase actions retain fixed alignment zones.

## V2 sequence

- [x] Update the shared hero composition and check all three slides on desktop and mobile.
- [x] Adjust four existing promo compositions and rental service colors without changing order or content.
- [x] Apply shared radius, spacing, control and typography tokens; refine categories and product alignment.
- [x] Build and typecheck; verify all seven widths, every slide, price/action alignment, image loads and existing interactions; inspect desktop/mobile screenshots.

## Implementation plan

- [x] Build an independent entry in this directory, importing the prototype's providers, routes, dialogs and data without editing their sources. Remove the old CSS loader from this entry only. Bundle using the existing Vite installation.
- [x] Implement SVG icons, header adapters and a real hero carousel. Preserve search, region, catalog, authentication and all original quick links.
- [x] Implement reusable product cards and collections with existing promotion pricing and commerce actions. Map existing project image URLs by product ID, never DOM position. Preserve quote actions and product navigation.
- [x] Render every existing visible merchandising block, category, brand, promotion, service, article and consultation action. Use one token stylesheet, responsive layouts and reduced-motion support.
- [x] Build both the prototype and the separate entry. Verify widths 1440, 1366, 1280, 1024, 768, 390, 375, image loads, no page overflow and commerce/navigation/form interactions. Review screenshots before completion.

## Constraints and asset status

Only files beneath `prototype/public/style-check/` change. Original prototype sources and build configuration stay untouched. The separate bundle is rebuilt with `node public/style-check/build.mjs`. The page remains available at `/garage/style-check/` after the normal Pages build.

Existing external product photographs are illustrative equipment images, not verified SKU photography (see SOURCES.md). They are retained, not replaced with new stock. Exact digital brand colors, licensed SkodaSans fonts and verified SKU assets remain client dependencies. Demonstration copy remains the supplied prototype content.
