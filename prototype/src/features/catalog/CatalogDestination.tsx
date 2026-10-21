import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { publicRoutes } from '../../data/publicRoutes'

const implemented = new Set(publicRoutes)

// Keep the planned assortment visible without offering dead-end navigation.
export function CatalogDestination({ href, children, arrow = false, ...props }: {
  href: string; children: ReactNode; arrow?: boolean; className?: string; 'data-testid'?: string
}) {
  return implemented.has(href)
    ? <Link to={href} {...props}>{children}{arrow && <span aria-hidden="true">→</span>}</Link>
    : <div {...props}>{children}</div>
}
