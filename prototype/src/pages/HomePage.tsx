import { prototypeData } from '../data/prototypeData'
import { HeroSlider } from '../features/home/HeroSlider'
import { BenefitsStrip } from '../features/home/BenefitsStrip'
import { BrandGrid } from '../features/home/BrandGrid'
import { CategoryGrid } from '../features/home/CategoryGrid'
import '../features/home/NavigationSections.css'
import { useState } from 'react'
import { ServicesSection } from '../features/home/ServicesSection'
import { AboutSection } from '../features/home/AboutSection'
import { UsefulSection } from '../features/home/UsefulSection'
import { PromotionsSection } from '../features/home/PromotionsSection'
import { ConsultationCta } from '../features/home/ConsultationCta'
import { ContactDialog } from '../features/forms/ContactDialog'
import '../features/home/LowerSections.css'
import { HomeMerchandisingStream } from '../features/home/HomeMerchandisingStream'

export function HomePage() {
  const [dialog, setDialog] = useState<'consultation' | 'callback' | null>(null)
  return (
    <main>
      <h1 className="sr-only">Оборудование для автосервиса — Гараж</h1>
      <HeroSlider slides={prototypeData.slides} />
      <CategoryGrid items={prototypeData.categories} />
      <HomeMerchandisingStream blocks={prototypeData.homeMerchandising} collections={prototypeData.productCollections} banners={prototypeData.promoBanners} />
      <BenefitsStrip items={prototypeData.benefits} />
      <BrandGrid items={prototypeData.brands} />
      <PromotionsSection items={prototypeData.promotions} />
      <ServicesSection items={prototypeData.services} />
      <AboutSection />
      <UsefulSection items={prototypeData.useful.filter((item) => item.kind !== 'review' || prototypeData.config.showReviews)} />
      <ConsultationCta onConsult={() => setDialog('consultation')} onCallback={() => setDialog('callback')} />
      {dialog && <ContactDialog mode={dialog} onClose={() => setDialog(null)} />}
    </main>
  )
}
