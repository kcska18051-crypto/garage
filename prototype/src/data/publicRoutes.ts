import { demoProducts } from './productRegistry'
import { catalogCategories, compressorSubcategories } from './catalogData'
import { contactPoints } from './contactsData'
import { materials, materialKinds } from './materialsData'
import { actions } from './actionsData'
import { profileData } from './profileData'
import {serviceRoutes} from './servicesData'

// Only implemented routes and existing records, not wildcard placeholders.
export const publicRoutes = [...new Set([
  '/','/catalog','/brands','/brand/remeza','/compare','/search','/favorites','/cart',
  ...serviceRoutes,
  '/about','/contacts','/delivery','/payment','/warranty','/actions','/actions/completed',
  '/checkout/review','/checkout/delivery','/checkout/success','/profile','/profile/auth','/profile/recovery',
  ...['data','addresses','recently-viewed','favorites','documents','help','orders','organizations','services','reviews'].map(path=>`/profile/${path}`),
  ...profileData.orders.map(order=>`/profile/orders/${order.id}`),
  ...contactPoints.map(point=>`/contacts/${point.id}`),
  ...catalogCategories.map(category=>category.href),
  ...compressorSubcategories.flatMap(category=>[category.href,...(category.childSections??[]).map(child=>child.href)]),
  ...demoProducts.map(product=>product.href),
  ...Object.values(materialKinds).map(kind=>kind.path),
  ...materials.map(material=>`${materialKinds[material.kind].path}/${material.slug}`),
  ...actions.filter(action=>action.published).map(action=>`/actions/${action.slug}`),
])]
