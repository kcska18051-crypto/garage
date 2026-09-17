import { useState } from 'react'
import type { TagGroup } from '../../data/catalogTypes'

export function TagGroups({ groups, activeTag, onSelect }: { groups?: TagGroup[]; activeTag?: { group: string; value: string }; onSelect(group: string, value: string): void }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [allGroupsVisible, setAllGroupsVisible] = useState(false)
  if (!groups?.length) return null
  const visibleGroups = allGroupsVisible ? groups : groups.slice(0, 3)
  const toggleGroup = (groupId: string) => setExpanded((current) => {
    const next = new Set(current)
    if (next.has(groupId)) next.delete(groupId)
    else next.add(groupId)
    return next
  })
  return <section className="catalog-tags" aria-label="Быстрые параметры"><div className="catalog-tags__groups">{visibleGroups.map((group) => {
    const visible = expanded.has(group.id) || !group.limit ? group.values : group.values.slice(0, group.limit)
    const canExpand = Boolean(group.limit && group.values.length > group.limit)
    return <div className="catalog-tag-group" key={group.id}><h3>{group.label}</h3><div>{visible.map((tag) => <button type="button" key={tag.value} aria-label={`Тег ${tag.label}`} aria-pressed={activeTag?.group === group.id && activeTag.value === tag.value} onClick={() => onSelect(group.id, tag.value)}>{tag.label}</button>)}</div>{canExpand ? <button className="catalog-tags__more" type="button" onClick={() => toggleGroup(group.id)} aria-label={`${expanded.has(group.id) ? 'Свернуть' : 'Показать все'}: ${group.label}`}>{expanded.has(group.id) ? 'Свернуть' : 'Показать ещё'}</button> : null}</div>
  })}</div>{groups.length > 3 ? <button className="catalog-tags__groups-toggle" type="button" aria-expanded={allGroupsVisible} onClick={() => setAllGroupsVisible((value) => !value)}>{allGroupsVisible ? 'Свернуть параметры' : 'Ещё параметры'}</button> : null}</section>
}
