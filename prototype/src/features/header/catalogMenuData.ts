import { catalogCategories } from '../../data/catalogData'
import type { CatalogRootCategory, CatalogSubcategory } from '../../data/catalogTypes'
import { publicRoutes } from '../../data/publicRoutes'

export type CatalogMenuNode = { id: string; name: string; href: string; children: CatalogMenuNode[] }

// A menu must not advertise a screen that the prototype has not implemented.
export function buildCatalogMenu(categories: CatalogRootCategory[], routes: ReadonlySet<string>): CatalogMenuNode[] {
  return categories.filter(category => routes.has(category.href)).map(category => ({
    id: category.id, name: category.name, href: category.href,
    children: category.subcategories.filter(item => routes.has(item.href)).map(item => ({
      id: item.id, name: item.name, href: item.href,
      children: ((item as CatalogSubcategory).childSections ?? []).filter(child => routes.has(child.href)).map(child => ({
        id: child.id, name: child.name, href: child.href, children: [],
      })),
    })),
  }))
}

export const headerCatalogTree = buildCatalogMenu(catalogCategories, new Set(publicRoutes))
