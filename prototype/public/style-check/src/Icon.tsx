export type IconName = 'cart' | 'heart' | 'compare' | 'user' | 'menu' | 'search' | 'arrow' | 'left' | 'right' | 'check' | 'pin' | 'home' | 'grid' | 'truck' | 'shield' | 'case' | 'pickup' | 'close' | 'wrench'
const paths: Record<IconName, string> = {
  wrench: 'M14 6a6 6 0 0 0-8 8L2 18a3 3 0 0 0 4 4l4-4a6 6 0 0 0 8-8l-4 4-4-4Z',
  cart: 'M3 4h2l2.2 11h11.6L21 7H6M9 20h.01M18 20h.01',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  compare: 'M5 20V10M12 20V4M19 20V7',
  user: 'M20 21v-2a8 8 0 0 0-16 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  menu: 'M4 6h16M4 12h16M4 18h16', search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6', left: 'm14 5-7 7 7 7', right: 'm10 5 7 7-7 7',
  check: 'm5 12 4 4L19 6', pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  home: 'm3 10 9-7 9 7v11h-6v-7H9v7H3Z', grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
  truck: 'M1 4h13v13H1ZM14 9h4l4 5v3h-8M8 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M21 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  shield: 'm12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-5 9 3 3 7-7',
  case: 'M3 7h18v14H3ZM8 7V3h8v4M3 12h18M10 12v3h4v-3',
  pickup: 'M3 10h18v12H3ZM2 10l2-7h16l2 7M8 22v-8h8v8', close: 'm6 6 12 12M6 18 18 6',
}
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
