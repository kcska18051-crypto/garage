import { prototypeData } from '../data/prototypeData'
import { HeroSlider } from '../features/home/HeroSlider'

export function HomePage() {
  return (
    <main>
      <HeroSlider slides={prototypeData.slides} />
    </main>
  )
}
