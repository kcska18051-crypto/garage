const mobileAssets = '/garage/style-check/review-assets/mobile-raster-v31/'
const rasterAssets = '/garage/style-check/review-assets/raster-responsive-v24/'

/** A finished raster for each viewport; copy and CTA are baked into the asset. */
export function CampaignRaster({ file, alt, eager = false }: { file: string; alt: string; eager?: boolean }) {
  const corrected = ['hero-service', 'service-center'].includes(file)
  const desktop = corrected ? `/garage/style-check/review-assets/service-fix-v36/${file}-desktop.webp` : `${rasterAssets}${file}-desktop.webp`
  const mobile = corrected ? `/garage/style-check/review-assets/service-fix-v36/${file}-mobile.webp` : `${mobileAssets}${file}.webp`
  const breakpoint = ['banner-season', 'banner-paint'].includes(file) ? 1024 : 768
  return <picture className="campaign-picture"><source media={`(min-width: ${breakpoint}px)`} srcSet={desktop} /><img className="campaign-raster" src={mobile} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" /></picture>
}
