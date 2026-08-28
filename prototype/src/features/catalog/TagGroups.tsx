import { useState } from 'react'
import type { TagGroup } from '../../data/catalogTypes'

export function TagGroups({ groups, activeTag, onSelect }: { groups?: TagGroup[]; activeTag?: { group: string; value: string }; onSelect(group: string, value: string): void }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  if (!groups?.length) return null
  return <section className="catalog-tags" aria-labelledby="catalog-tags-title"><div className="catalog-tags__heading"><p className="eyebrow">Готовые подборки</p><h2 id="catalog-tags-title">Быстрый выбор по параметрам</h2></div><div className="catalog-tags__groups">{groups.map((group) => {
    const visible = expanded.has(group.id) || !group.limit ? group.values : group.values.slice(0, group.limit)
    return <div className="catalog-tag-group" key={group.id}><h3>{group.label}</h3><div>{visible.map((tag) => <button type="button" key={tag.value} aria-label={`Тег ${tag.label}`} aria-pressed={activeTag?.group === group.id && activeTag.value === tag.value} onClick={() => onSelect(group.id, tag.value)}>{tag.label}</button>)}</div>{group.limit && group.values.length > group.limit && !expanded.has(group.id) ? <button className="catalog-tags__more" type="button" onClick={() => setExpanded((current) => new Set(current).add(group.id))} aria-label={`Показать все: ${group.label}`}>Показать все</button> : null}</div>
  })}</div></section>
}
