import { prototypeData } from '../data/prototypeData'
import { HeroSlider } from '../features/home/HeroSlider'
import { BenefitsStrip } from '../features/home/BenefitsStrip'
import { BrandGrid } from '../features/home/BrandGrid'
import { CategoryGrid } from '../features/home/CategoryGrid'
import '../features/home/NavigationSections.css'
import { ProductShowcase } from '../features/products/ProductShowcase'
import { useState } from 'react'
import { ServicesSection } from '../features/home/ServicesSection'
import { BusinessSection } from '../features/home/BusinessSection'
import { AboutSection } from '../features/home/AboutSection'
import { UsefulSection } from '../features/home/UsefulSection'
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
      <BrandGrid items={prototypeData.brands} />
      <ProductShowcase products={prototypeData.products} />
      <ServicesSection items={prototypeData.services} />
      <BusinessSection onConsult={() => setDialog('consultation')} />
      <AboutSection />
      <UsefulSection items={prototypeData.useful} />
      <ConsultationCta onConsult={() => setDialog('consultation')} onCallback={() => setDialog('callback')} />
      {dialog && <ContactDialog mode={dialog} onClose={() => setDialog(null)} />}
    </main>
  )
}
