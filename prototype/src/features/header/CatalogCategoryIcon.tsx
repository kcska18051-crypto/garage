import type { ReactNode } from 'react'
import { RoundedIcon } from './RoundedIcon'

const paths: Record<string, ReactNode> = {
  'compressor-equipment': <><rect x="3" y="11" width="18" height="7" rx="3.5" /><circle cx="7" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M7 11V6h7v5M9 6V3h3v3M17 11V7h3v7M5 8H3" /></>,
  'lifting-equipment': <><path d="M4 21V3h3v18M17 21V3h3v18M2 21h7M15 21h7M7 15h10M7 10h10M9 10l1-4h4l1 4" /><path d="M9 15v3M15 15v3" /></>,
  'body-repair': <><path d="m4 10 2-5h12l2 5M3 10h18v8H3ZM6 18v3M18 18v3M3 14h4M17 14h4M10 10l2 3-2 3 2 2" /></>,
  painting: <><path d="M5 9h11v5H5ZM8 14l-2 7h5l2-7M16 10h5v3h-5M7 9V3h7v6M5 5H3M3 14v3h3M11 21h5" /></>,
  tools: <><path d="m14.5 6.5-3.5 3.5 3 3 3.5-3.5a5 5 0 0 1-6 6L6 21a2.1 2.1 0 0 1-3-3l5.5-5.5a5 5 0 0 1 6-6Z" /></>,
  'service-station-equipment': <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M2 7h20M6 7V3h12v4M3 12h18M3 16h18M10 10h4M10 14h4M10 18h4M6 20v2M18 20v2" /></>,
}

export function CatalogCategoryIcon({ category }: { category: string }) {
  if (!paths[category]) return <RoundedIcon name="catalog" />
  return <svg className="catalog-category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[category]}</svg>
}
