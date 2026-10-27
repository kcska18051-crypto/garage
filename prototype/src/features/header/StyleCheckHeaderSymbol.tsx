import { useLocation } from 'react-router-dom'

/** Preserve the prototype glyph metrics; SVG artwork is a style-check-only layer. */
export function StyleCheckHeaderSymbol({ name, symbol }: { name: 'menu' | 'location'; symbol: string }) {
  const enabled = useLocation().pathname.replace(/\/$/, '') === '/style-check'
  return enabled ? <span className={`style-check-header-symbol style-check-header-symbol--${name}`} aria-hidden="true">{symbol}</span> : symbol
}
