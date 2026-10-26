import { images } from './images'

export type PromoDesign = {
  background: 'white' | 'subtle' | 'yellow' | 'graphite'
  text: 'dark' | 'light'
  image: string
  imagePosition: string
  imageFit: 'cover' | 'contain'
  secondaryImage?: string
  cta: 'yellow' | 'outline' | 'dark'
  layout: 'editorial' | 'equipment' | 'photographic'
}

// Presentation only. Content, destinations and order belong to prototypeData.
export const promoDesigns: Record<string, PromoDesign> = {
  season: { background: 'subtle', text: 'dark', image: images['photo-hero-workshop'], imagePosition: '58% center', imageFit: 'cover', cta: 'outline', layout: 'editorial' },
  paint: { background: 'white', text: 'dark', image: images['photo-service-paint'], imagePosition: 'center 55%', imageFit: 'cover', cta: 'yellow', layout: 'photographic' },
  compressors: { background: 'subtle', text: 'dark', image: images['product-remeza-10'], secondaryImage: images['product-compressor'], imagePosition: 'center', imageFit: 'contain', cta: 'yellow', layout: 'equipment' },
  workshop: { background: 'white', text: 'dark', image: images['photo-service-rental'], imagePosition: 'center 54%', imageFit: 'cover', cta: 'outline', layout: 'photographic' },
}
