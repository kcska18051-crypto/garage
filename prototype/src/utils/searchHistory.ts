const key = 'garage-search-history'
const limit = 5
const demo = ['Компрессор', 'Краскопульт', 'Набор инструмента']
export function readSearchHistory(): string[] { try { const saved = localStorage.getItem(key); return saved === null ? demo : JSON.parse(saved) as string[] } catch { return demo } }
export function addSearchHistory(value: string) { const query = value.trim(); if (!query) return; localStorage.setItem(key, JSON.stringify([query, ...readSearchHistory().filter((item) => item.toLocaleLowerCase() !== query.toLocaleLowerCase())].slice(0, limit))) }
export function removeSearchHistory(value: string) { localStorage.setItem(key, JSON.stringify(readSearchHistory().filter((item) => item !== value))) }
export function clearSearchHistory() { localStorage.setItem(key, '[]') }
