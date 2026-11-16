import { Link, type LinkProps } from 'react-router-dom'
import { demoSelectionHref, isRemovedDemoPath } from './demoNavigation'

/** Keep assortment visible while exposing only completed demonstration pages. */
export function DemoLink({ to, children, onClick, ...props }: LinkProps) {
 const path = typeof to === 'string' ? to : to.pathname ?? ''
 if (isRemovedDemoPath(path)) {
  return <a {...props} data-static-preview="true">{children}</a>
 }
 return <Link {...props} to={typeof to === 'string' ? demoSelectionHref(to) : { ...to, pathname: to.pathname }} onClick={onClick}>{children}</Link>
}
