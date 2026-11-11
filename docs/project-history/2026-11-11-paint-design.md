# Paint matching design follow-up — 11 November 2026

Continued the agreed audit sequence after compressor navigation. Updated /services/paint-matching and both automotive/polyurethane detail pages using PaintServiceShowcase.tsx with scoped .paint-editorial styles. Homepage, catalog and repair pages unchanged.

Overview uses two compact photo cards (180 px desktop / 150 px mobile) and preserves its generic paint inquiry. Details group title, description and request on the left with a 400×240 px photo on desktop, 180 px high mobile. Removed redundant «Об услуге» heading and replaced four boxed steps with a connected sequence. Pending cost/time remain small inline terms. Forms, paint-* item IDs, phone hints, legal consents and request persistence preserved. No exact color match, equipment, turnaround or pricing guarantees added.

Generated using built-in image_gen:
- prototype/public/style-check/review-assets/paint-color-automotive.png: photorealistic hand comparing silver/blue automotive paint swatches with a grey car body panel in daylight; crop-safe, no text/logos.
- prototype/public/style-check/review-assets/paint-color-polyurethane.png: gloved hands comparing neutral/blue/green swatches with coated metal sample plates on a bright workbench; no spraying, no text/logos.
Illustrative imagery, not proof of real equipment or premises.

Validation: build:pages and 32 paint/services tests, including persisted paint requests and both consents; browser checks all three pages at 1440/768/390/320, actual photo heights verified, no overflow, forms identify the correct direction.
