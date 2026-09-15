import { prototypeData } from '../data/prototypeData'
import { HeroSlider } from '../features/home/HeroSlider'
import { BenefitsStrip } from '../features/home/BenefitsStrip'
import { BrandGrid } from '../features/home/BrandGrid'
import { CategoryGrid } from '../features/home/CategoryGrid'
import '../features/home/NavigationSections.css'
import { ProductShowcase } from '../features/products/ProductShowcase'
import { useState } from 'react'
import { ServicesSection } from '../features/home/ServicesSection'
import { AboutSection } from '../features/home/AboutSection'
import { UsefulSection } from '../features/home/UsefulSection'
import { PromoStrip } from '../features/home/PromoStrip'
import { PromotionsSection } from '../features/home/PromotionsSection'
import { ConsultationCta } from '../features/home/ConsultationCta'
import { ContactDialog } from '../features/forms/ContactDialog'
import '../features/home/LowerSections.css'

export function HomePage() {
  const [dialog, setDialog] = useState<'consultation' | 'callback' | null>(null)
  return (
    <main>
      <HeroSlider slides={prototypeData.slides} />
      <BenefitsStrip items={prototypeData.benefits} />
      <CategoryGrid items={prototypeData.categories} />
      <ProductShowcase collections={prototypeData.productCollections} />
      <BrandGrid items={prototypeData.brands} />
      <PromoStrip items={prototypeData.promoBanners} />
      <PromotionsSection items={prototypeData.promotions} />
      <ServicesSection items={prototypeData.services} />
      <AboutSection />
      <UsefulSection items={prototypeData.useful.filter((item) => item.kind !== 'testimonial' || prototypeData.config.showTestimonials)} />
      <ConsultationCta onConsult={() => setDialog('consultation')} onCallback={() => setDialog('callback')} />
      {dialog && <ContactDialog mode={dialog} onClose={() => setDialog(null)} />}
    </main>
  )
}
