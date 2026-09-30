const key = 'garage-search-history'
const limit = 6
export function readSearchHistory(): string[] { try { return JSON.parse(localStorage.getItem(key) || '[]') as string[] } catch { return [] } }
export function addSearchHistory(value: string) { const query = value.trim(); if (!query) return; localStorage.setItem(key, JSON.stringify([query, ...readSearchHistory().filter((item) => item.toLocaleLowerCase() !== query.toLocaleLowerCase())].slice(0, limit))) }
export function removeSearchHistory(value: string) { localStorage.setItem(key, JSON.stringify(readSearchHistory().filter((item) => item !== value))) }
export function clearSearchHistory() { localStorage.removeItem(key) }
