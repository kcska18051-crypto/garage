# Banner art direction — 30 October 2026
Scope: local Style Check only. Header, catalog/product cards, footer and carousel behavior remain unchanged.
Approved brief: Premium Industrial Glass / 3D Commerce, brand white/yellow/graphite, existing subjects and no invented claims.
Inventory: 3 hero slides; 4 merchandising banners; 3 promotion cards; 3 service banners; consultation background. Keep banner dimensions at 375/390/768/1024/1440/1920 (baseline in local QA report).
Implementation: one responsive HTML composition and one shared image set per campaign, no mobile image sources. Live title/subtitle/CTA, contained primary product, central max-width safe region. Original photos optimized to WebP, no generative substitute products. CSS supplies glass panels, restrained reflections and shadows; no WebGL.
Files: CampaignArtwork component, StyleCheckHomePage banner renderers, new isolated campaigns-v19.css loaded after existing styles, review-assets/campaigns images.
Verification: build; responsive geometry comparison against baseline, all campaign text/CTA/image bounds and image identity across six widths; slide switching/links, screenshots and keyboard focus. Review dimensions and fix visual issues before delivery. No push or publication.
