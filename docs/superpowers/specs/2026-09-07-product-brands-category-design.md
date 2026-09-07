# Product, brands, and second-level catalog design

## Scope

Extend the existing React/Vite prototype with three connected outcomes:

1. A detailed prototype product page for `Remeza ВК 10` at `/product/remeza-vk-10-gr-0001/`.
2. An interactive brand directory at `/brands/` without brand detail routes or clickable Remeza links.
3. A visual child-category grid on the screw-compressor category before quick tags, followed by the existing listing and a concise SEO text.

## Product page

The product page reuses the shared header, footer, commerce state, breadcrumbs, tokens, and product-card language. The first screen contains a geometric prototype gallery, product identity, informational brand text, demonstrative review/status information, key specifications, and a commercial card. All monetary, availability, delivery, warranty, and review values are explicitly marked as prototype data.

Favorite, comparison, and cart actions update the shared header counters. The gallery supports thumbnail switching and a modal enlargement. A sticky anchor navigation is derived from sections that exist on the page. The mobile layout adds a purchase bar above the existing bottom navigation.

The selected region moves into a shared region context so the header selector and product delivery copy stay synchronized.

## Brand directory

The directory provides text search, category chips, an alphabet index, a popular-brand area, and a complete list grouped by initial. Brand cards are informational elements, not links. Existing homepage and catalog brand links point to the directory root instead of nonexistent detail pages.

## Second-level category

Only the screw-compressor data receives the new child-section collection. A reusable child-category grid renders after the H1/description and before quick tags. Child cards are stable catalog navigation entries and do not duplicate characteristic tags. The existing tags, URL-backed filters, result count, and listing behavior remain unchanged. A concise SEO text follows the listing.

## Responsive and verification requirements

Layouts must remain usable without horizontal overflow at 1920, 1440, 1280, 1024, 768, 390, and 360 pixels. Unit tests cover stateful components and route behavior; Playwright covers navigation, commerce actions, gallery, brand filters, category ordering, sticky purchase UI, and all control widths. The Pages build must expose direct fallback routes for the three requested URLs.
