# Service center overview — 11 November 2026

User requested improving the overview after approving compressor detail pages. ServicesPages now re-exports ServiceCenterShowcase as ServiceCenterPage; styles scoped to .service-hub preserve other pages.

Composition: workshop hero using existing about-company-workshop.png, a featured compressor card spanning two desktop rows plus four distinct equipment illustrations (custom SVG line art with yellow accents) for impact wrench, grinder, polisher and pressure washer. Removes the arbitrary three-plus-two arrangement and repeated wrench pictogram. Compressor card links to all three finished detail routes and preserves a general compressor request. Other equipment opens its existing specific repair request. The process is a light connected timeline. Headings and descriptions stay together on the left. No deleted request checklist or unsupported service promises introduced.

No new raster assets generated. Existing workshop/piston images reused. Main homepage, catalog and compressor detail pages unchanged.

Checks: build:pages and 25 ServicesPages tests; browser at 1440/1024/768/390/320, all images load, no horizontal overflow, all five repair inquiry selections correct. Photographs have explicit height:auto to preserve their aspect ratio.
