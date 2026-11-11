# Screw compressor repair: art direction sample — 11 November 2026

User requested a more designed sample page following the visual audit, keeping the homepage and catalog unchanged. This is a proposal for review, not approval to propagate it to other repair pages.

Only /services/service-center/compressor-repair/screw uses ScrewRepairShowcase.tsx and its scoped CSS. Piston keeps ApprovedCompressorRepairPage; diesel still uses the old ServiceDetail.

Design: a cohesive two-column hero with a specific compressor image; a practical preparation list without cards; a connected process timeline; a warm closing request block. Manrope, white background, restrained yellow accents, existing repair dialog and itemId=screw. No invented prices, turnaround times or proof of service results. Both request buttons open the same selected repair form.

Asset: prototype/public/style-check/review-assets/screw-compressor-diagnostics.png. Built-in image_gen prompt: photorealistic editorial rotary screw compressor with open cabinet, visible air-end, motor, separator and cooling system; technician diagnosing controller in a bright industrial workshop; charcoal/blue equipment, restrained yellow accents; landscape 4:3, no logos, no car engines. Illustrative service imagery.

Validation: production build and 21 ServicesPages tests; browser checks at 1440/768/390/320 px, image loads, no horizontal overflow or page errors, both request actions identify screw compressor repair correctly.

## Content follow-up

After review, the user identified duplication between the preparation list and process timeline. The page now separates: examples of the reported problem and equipment scope; a compact three-item form checklist; a repair journey from inquiry through diagnostic arrangements, work agreement and repair/collection. Conditions remain individually agreed; no fixed diagnosis terms, prices, warranty or logistics promises were introduced. The approved heading is «Что указать в заявке».

## Final simplification requested by user

Section headings and their supporting descriptions must stay together on the same left-hand axis, never split across left/right columns. Removed «О ремонте» eyebrow, the equipment-scope note («Что может потребовать ремонта») and the entire request-preparation checklist («Что указать в заявке»). Keep the problem examples and repair journey. This supersedes the content follow-up above.
