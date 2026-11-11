# Rental categories and equipment — 11 November 2026

Updated both rental categories and all four rental details using RentalEquipmentPages.tsx and scoped CSS. ServicesPages re-exports the new category/detail components. Existing URLs, source product associations, specs and rental request IDs preserved.

Compact equipment images: 130–170 px in category cards; 240 px desktop/180 px mobile on detail pages. Real existing product images replace geometric placeholders. Category compressor cards retain direct rental requests plus detail links; tool category retains detail-first flow. Detail pages show source parameters, pending tariff/deposit, rental action, clear booking notice and concise post-request steps. Demo parameter qualification remains visible; no invented availability, prices or guarantees.

Existing form dates/quantity/phone hints, local request persistence, account access, source sale → rental navigation and cart isolation unchanged. Homepage, catalog and other service designs untouched.

Validation: build:pages; 38 ServicesPages/RentalHierarchy tests, including persisted request/account/cart scenario. All six pages inspected at 1440/768/390/320; images decoded, no overflow; each detail opens the correct rental request. Categories retain two matching items each.

## User correction: shorter category cards

User asked to reduce card height in both rental categories. Category preview now shows two main parameters; full specifications remain on detail pages. Reduced category padding, thumbnail height and text spacing. Tablet/mobile places the small image beside the title, with specs/actions across the full card width. Compressor cards measured 265 px desktop (was 385) and 241–287 px at 390 px viewport (was 384–543). Detail pages retain all parameters and existing image/layout sizes. Compactness is a continuing design requirement.
