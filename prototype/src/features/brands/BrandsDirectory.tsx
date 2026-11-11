import { brandPictures } from '../home/brandPictures'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { brandCategories, brandDirectory, type BrandDirectoryItem } from '../../data/brandDirectoryData'

const ALL_CATEGORIES = 'Все направления'
const ALL_LETTERS = 'Все'

function BrandCard({ brand }: { brand: BrandDirectoryItem }) {
  const logo = brand.id === 'remeza' ? 'logo-remeza.svg' : brandPictures[brand.id]
  const content = <>{logo&&<span className={`brand-directory-card__logo brand-directory-card__logo--${brand.id}`} aria-hidden="true"><img src={'/garage/style-check/review-assets/'+logo} alt="" width="180" height="70" decoding="async"/></span>}<div className="brand-directory-card__copy"><h3>{brand.name}</h3><p>{brand.categories.join(' · ')}</p></div></>
  return brand.id === 'remeza' ? <Link className="brand-directory-card brand-directory-card--link" to="/brand/remeza/" aria-label={brand.name}>{content}</Link> : <article className="brand-directory-card" aria-label={brand.name}>{content}</article>
}

export function BrandsDirectory() {
  const [searchParams,setSearchParams]=useSearchParams()
  const search=searchParams.get('q')??''
  const setSearch=(value:string)=>{const next=new URLSearchParams(searchParams);if(value) next.set('q',value);else next.delete('q');setSearchParams(next,{replace:true})}
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [letter, setLetter] = useState(ALL_LETTERS)
  const letters = useMemo(() => [...new Set(brandDirectory.map((brand) => brand.name[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, 'ru')), [])
  const filtered = useMemo(() => brandDirectory.filter((brand) => {
    const matchesSearch = brand.name.toLocaleLowerCase('ru').includes(search.trim().toLocaleLowerCase('ru'))
    const matchesCategory = category === ALL_CATEGORIES || brand.categories.includes(category)
    const matchesLetter = letter === ALL_LETTERS || brand.name[0].toUpperCase() === letter
    return matchesSearch && matchesCategory && matchesLetter
  }).sort((a, b) => a.name.localeCompare(b.name, 'ru')), [category, letter, search])


  return <>
    <section className="brands-popular" aria-labelledby="popular-brands-title">
      <div><h2 id="popular-brands-title">Популярные бренды</h2></div>
      <div className="brands-popular__grid">{['remeza','nordberg','jtc','rupes','jonnesway','sivik','wiederkraft','car-tool'].map(id => brandDirectory.find(brand=>brand.id===id)!).map((brand) => <BrandCard key={brand.id} brand={brand} />)}</div>
    </section>
    <section className="brands-controls" aria-label="Фильтры брендов">
      <label>Поиск по названию<input type="search" aria-label="Поиск бренда" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Например, Remeza" /></label>
      <div className="brands-controls__categories">{[ALL_CATEGORIES, ...brandCategories].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="brands-controls__alphabet" aria-label="Алфавит">{[ALL_LETTERS, ...letters].map((item) => <button type="button" key={item} aria-label={item === ALL_LETTERS ? 'Все буквы' : `Буква ${item}`} aria-pressed={letter === item} onClick={() => setLetter(item)}>{item}</button>)}</div>
    </section>
    <section className="brands-list" aria-label="Все бренды"><p className="brands-result-count" role="status">Бренды: {filtered.length}</p>
      {filtered.length === 0 ? <div className="brands-list__empty"><h2>Бренды не найдены</h2><p>Измените запрос или сбросьте выбранное направление.</p><button type="button" onClick={()=>{setSearch('');setCategory(ALL_CATEGORIES);setLetter(ALL_LETTERS)}}>Сбросить фильтры</button></div> : <div className="brands-list__grid">{filtered.map(brand=><BrandCard key={brand.id} brand={brand}/>)}</div>}

    </section>
  </>
}
