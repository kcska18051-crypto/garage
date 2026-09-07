import { useMemo, useState } from 'react'
import { brandCategories, brandDirectory, type BrandDirectoryItem } from '../../data/brandDirectoryData'

const ALL_CATEGORIES = 'Все направления'
const ALL_LETTERS = 'Все'

function BrandCard({ brand }: { brand: BrandDirectoryItem }) {
  return <article className="brand-directory-card"><span aria-hidden="true" /><div><h3>{brand.name}</h3><p>{brand.categories.join(' · ')}</p></div></article>
}

export function BrandsDirectory() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [letter, setLetter] = useState(ALL_LETTERS)
  const letters = useMemo(() => [...new Set(brandDirectory.map((brand) => brand.name[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, 'ru')), [])
  const filtered = useMemo(() => brandDirectory.filter((brand) => {
    const matchesSearch = brand.name.toLocaleLowerCase('ru').includes(search.trim().toLocaleLowerCase('ru'))
    const matchesCategory = category === ALL_CATEGORIES || brand.categories.includes(category)
    const matchesLetter = letter === ALL_LETTERS || brand.name[0].toUpperCase() === letter
    return matchesSearch && matchesCategory && matchesLetter
  }).sort((a, b) => a.name.localeCompare(b.name, 'ru')), [category, letter, search])
  const grouped = useMemo(() => filtered.reduce<Array<[string, BrandDirectoryItem[]]>>((groups, brand) => {
    const groupLetter = brand.name[0].toUpperCase()
    const group = groups.find(([currentLetter]) => currentLetter === groupLetter)
    if (group) group[1].push(brand)
    else groups.push([groupLetter, [brand]])
    return groups
  }, []), [filtered])

  return <>
    <section className="brands-popular" aria-labelledby="popular-brands-title">
      <div><h2 id="popular-brands-title">Популярные бренды</h2></div>
      <div className="brands-popular__grid">{brandDirectory.filter((brand) => brand.popular).slice(0, 6).map((brand) => <BrandCard key={brand.id} brand={brand} />)}</div>
    </section>
    <section className="brands-controls" aria-label="Фильтры брендов">
      <label>Поиск по названию<input type="search" aria-label="Поиск бренда" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Например, Remeza" /></label>
      <div className="brands-controls__categories">{[ALL_CATEGORIES, ...brandCategories].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="brands-controls__alphabet" aria-label="Алфавит">{[ALL_LETTERS, ...letters].map((item) => <button type="button" key={item} aria-label={item === ALL_LETTERS ? 'Все буквы' : `Буква ${item}`} aria-pressed={letter === item} onClick={() => setLetter(item)}>{item}</button>)}</div>
    </section>
    <section className="brands-list" aria-label="Все бренды">
      {filtered.length === 0 ? <div className="brands-list__empty"><h2>Бренды не найдены</h2><p>Измените запрос или сбросьте выбранное направление.</p></div> : grouped.map(([groupLetter, brands]) => <section className="brands-group" key={groupLetter}><h2>{groupLetter}</h2><div>{brands.map((brand) => <BrandCard key={brand.id} brand={brand} />)}</div></section>)}
    </section>
  </>
}
