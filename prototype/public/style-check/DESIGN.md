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

## V3 art direction and sequence

Use the existing palette and 8/12/16px geometry. Preserve the entire prototype sequence, data and routes. Hero: no eyebrow, fixed heading/description/CTA rows, large edge-to-edge scene and one previous/count/next group. Categories: three large columns on desktop, two on mobile; gray surface, top-aligned titles and contained equipment. Product cards: consistent status/media/title/existing specs/stock/purchase zones; red sale, outlined yellow new and solid yellow hit badges. Existing voltage/power values are read from the product registry only where present; missing specs stay absent.

Best sellers receive a single gray composition zone with white cards. Benefits become four equal gray cards with consistent yellow icon fields and original texts. Promos consume a typed presentation config (palette background/text, image and optional secondary image, position, fit, CTA variant and composition) separate from business data. The compressor scene combines two existing equipment photographs. Services, company, materials and final dark consultation retain their arrangement.

- [x] Finish hero, header, categories and card composition.
- [x] Apply configurable promos, best-seller zone and benefit cards.
- [x] Compare headings, products, prices, categories, links, promos, services, brands and material cards with the original rendered prototype.
- [x] Check seven widths plus large desktop, every slide's fixed anchors, price/button alignment, image loads and existing interactions; inspect screenshots.

Final verification: TypeScript and both builds pass; 425 original tests pass with two workers, plus five isolated promo-configuration checks. Eight widths cover 24 slide combinations with fixed anchors and 32 aligned product rows. The original comparison preserves 18 headings, 20 products, six categories, eight brands, four promos, three services and 51 original destinations, plus all material tabs. Two timeouts in the initial concurrent full test run did not recur with limited parallelism. Review's graphite-image blending issue is corrected and covered by browser verification.

References: the user supplied VseInstrumenti and Bigam URLs were inspected for navigation, image-led entries, merchandised offers and distinct trust blocks. No layouts or assets are copied. The earlier Hoff screenshots are not attached in this chat; only the explicitly described gray-zone principle is used. There are no separate brand-logo image files in this repository; the existing brand names remain intact.

## Constraints and asset status

Only files beneath `prototype/public/style-check/` change. Original prototype sources and build configuration stay untouched. The separate bundle is rebuilt with `node public/style-check/build.mjs`. The page remains available at `/garage/style-check/` after the normal Pages build.

Existing external product photographs are illustrative equipment images, not verified SKU photography (see SOURCES.md). They are retained, not replaced with new stock. Exact digital brand colors, licensed SkodaSans fonts and verified SKU assets remain client dependencies. Demonstration copy remains the supplied prototype content.
