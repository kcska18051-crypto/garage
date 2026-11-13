import { aboutAdvantages } from '../data/aboutData'
import './CompanyAdvantages.css'

function AdvantageIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 && <>
      <path className="company-advantages__accent" d="M7 17h34v10H7z" />
      <rect x="7" y="17" width="34" height="23" rx="3" />
      <path d="M17 17v-6h14v6M7 27h34M21 25v6h6v-6" />
    </>}
    {index === 1 && <>
      <path className="company-advantages__accent" d="M12 14h24v5H12z" />
      <path d="M12 7h24a7 7 0 0 1 7 7v15a7 7 0 0 1-7 7H19L8 43v-8a7 7 0 0 1-3-6V14a7 7 0 0 1 7-7Z" />
      <path d="M13 24h22M13 29h14" />
    </>}
    {index === 2 && <>
      <path className="company-advantages__accent" d="M5 13h23v20H5z" />
      <path d="M5 33V13h23v20M28 20h8l7 9v7h-4M28 36H16M5 36h3M28 20v16M33 24h3l4 6h-7z" />
      <circle cx="12" cy="36" r="4" /><circle cx="35" cy="36" r="4" />
    </>}
    {index === 3 && <>
      <path className="company-advantages__accent" d="m24 6 15 6v10c0 10-15 20-15 20Z" />
      <path d="m24 6-15 6v10c0 10 15 20 15 20s15-10 15-20V12Z" />
      <path d="m17 23 5 5 10-11" />
    </>}
  </svg>
}

export function CompanyAdvantages() {
  return <section className="home-section company-advantages" aria-labelledby="company-advantages-title">
    <div className="section-heading"><h2 id="company-advantages-title">Наши преимущества</h2></div>
    <div className="company-advantages__grid">
      {aboutAdvantages.map((item, index) => <article key={item.title}>
        <span className="company-advantages__icon"><AdvantageIcon index={index} /></span>
        <div><h3>{item.title}</h3><p>{item.text}</p></div>
      </article>)}
    </div>
  </section>
}
