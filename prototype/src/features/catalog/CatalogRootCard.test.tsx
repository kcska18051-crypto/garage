import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { catalogCategories } from '../../data/catalogData'
import { CatalogRootCard } from './CatalogRootCard'

describe('CatalogRootCard', () => {
  it('shows five links and exposes the remaining links with an accessible button', async () => {
    render(<MemoryRouter><CatalogRootCard category={catalogCategories[0]} /></MemoryRouter>)

    const card = screen.getByTestId('catalog-root-card')
    const heading = screen.getByRole('heading', { level: 2, name: catalogCategories[0].name })
    const button = screen.getByRole('button', { name: `Ещё 1 категория — ${catalogCategories[0].name}` })
    const extraLink = screen.getByRole('link', { name: catalogCategories[0].subcategories[5].name, hidden: true })
    const extraListId = button.getAttribute('aria-controls')

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(card).toHaveAttribute('aria-labelledby', heading.id)
    expect(button).toHaveTextContent('Ещё 1 категория')
    expect(extraListId).toBeTruthy()
    expect(document.getElementById(extraListId!)).toHaveAttribute('hidden')
    expect(extraLink).not.toBeVisible()

    await userEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(extraLink).toBeVisible()
    expect(button).toHaveTextContent('Свернуть')

    await userEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAccessibleName(`Ещё 1 категория — ${catalogCategories[0].name}`)
    expect(extraLink).not.toBeVisible()
  })

  it('keeps another card collapsed when one card expands', async () => {
    render(
      <MemoryRouter>
        <CatalogRootCard category={catalogCategories[0]} />
        <CatalogRootCard category={catalogCategories[1]} />
      </MemoryRouter>,
    )

    const buttons = catalogCategories.slice(0, 2).map((category) => (
      screen.getByRole('button', { name: `Ещё 1 категория — ${category.name}` })
    ))
    await userEvent.click(buttons[0])

    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
  })
})
