import { useState } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { ContactDialog } from '../features/forms/ContactDialog'
import { demoSelectionHref, isRemovedDemoPath } from './demoNavigation'

/** Keep assortment visible while exposing only completed demonstration pages. */
export function DemoLink({ to, children, onClick, ...props }: LinkProps) {
 const [quoteOpen, setQuoteOpen] = useState(false)
 const path = typeof to === 'string' ? to : to.pathname ?? ''
 if (isRemovedDemoPath(path)) {
  if (children === 'Запросить цену') return <><button type="button" className={props.className} onClick={() => setQuoteOpen(true)}>{children}</button>{quoteOpen && <ContactDialog mode="consultation" onClose={() => setQuoteOpen(false)}/>}</>
  return <a {...props} data-static-preview="true">{children}</a>
 }
 return <Link {...props} to={typeof to === 'string' ? demoSelectionHref(to) : { ...to, pathname: to.pathname }} onClick={onClick}>{children}</Link>
}
