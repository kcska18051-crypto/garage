# Compressor repair navigation — 11 November 2026

User requested updating the common compressor repair entry after the three detail pages and service center overview. ServicesPages re-exports CompressorRepairOverview for /services/service-center/compressor-repair.

Three equal image-led navigation cards use the existing screw/piston/diesel photographs and link to their finished detail routes. Single-column mobile. No generic engine hero and no repeated preparation checklist. Intro heading and description share the left axis. A compact help block opens a general repair request with itemId=compressor-repair for visitors uncertain about equipment type; model/description fields and optional photo retain existing behavior and phone hint.

No new raster assets. Homepage, catalog and detail pages unchanged. Build:pages and 26 ServicesPages tests passed; browser checks at 1440/1024/768/390/320, all images load without overflow, all three routes and general inquiry verified.
