/** The approved homepage and its original review address share one design. */
export function isApprovedHomepage(pathname: string) {
  const path = pathname.replace(/\/$/, '')
  return path === '' || path === '/style-check'
}

/** All application routes share the approved header and footer. */
export function isApprovedChrome(pathname: string) {
  return pathname.startsWith('/')
}

// Preserve the exact cascade of the client-approved style check.
const stylesheets = [
  '/garage/style-check/style-v3.css?v=20261113-palette',
  '/garage/style-check/header-iteration-1.css?v=20261113-palette',
  '/garage/style-check/art-direction-header.css?v=20261113-palette',
  '/garage/style-check/homepage-visual-review.css?v=20261113-palette',
  '/garage/style-check/homepage-review-v2.css?v=20261113-palette',
  '/garage/style-check/homepage-review-v3.css?v=20261113-palette',
  '/garage/style-check/homepage-review-v5.css?v=20261113-palette',
  '/garage/style-check/header-review-v11.css?v=20261113-palette',
  '/garage/style-check/product-scale-v15.css?v=20261113-palette',
  '/garage/style-check/design-light-v16.css?v=20261113-palette',
  '/garage/style-check/header-local-v17.css?v=20261113-palette',
  '/garage/style-check/header-reference-v18.css?v=20261113-palette',
  '/garage/style-check/campaigns-responsive-v24.css?v=20261113-palette',
  '/garage/style-check/category-variants-v25.css?v=20261113-palette',
  '/garage/style-check/about-reference-v29.css?v=20261113-palette',
  '/garage/style-check/benefits-variants-v30.css?v=20261113-palette',
  '/garage/style-check/mobile-unified-v31.css?v=20261113-palette',
  '/garage/style-check/lower-spacing-v35.css?v=20261113-palette',
  '/garage/style-check/service-tiles-v37.css?v=20261113-palette',
  '/garage/style-check/category-art-v38.css?v=20261113-palette',
  '/garage/style-check/section-spacing-v41.css?v=20261113-palette',
  '/garage/style-check/final-polish-v42.css?v=20261113-palette',
  '/garage/style-check/approved-layout-v43.css?v=20261113-palette',
]

export function ApprovedHomepageStyles() {
  return <>{stylesheets.map(href => <link key={href} rel="stylesheet" href={href} />)}</>
}
