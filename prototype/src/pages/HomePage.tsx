import { prototypeData } from '../data/prototypeData'
import { HeroSlider } from '../features/home/HeroSlider'
import { BenefitsStrip } from '../features/home/BenefitsStrip'
import { BrandGrid } from '../features/home/BrandGrid'
import { CategoryGrid } from '../features/home/CategoryGrid'
import '../features/home/NavigationSections.css'
import { ProductShowcase } from '../features/products/ProductShowcase'

export function HomePage() {
  return (
    <main>
      <HeroSlider slides={prototypeData.slides} />
      <BenefitsStrip items={prototypeData.benefits} />
      <CategoryGrid items={prototypeData.categories} />
      <BrandGrid items={prototypeData.brands} />
      <ProductShowcase products={prototypeData.products} />
    </main>
  )
}
