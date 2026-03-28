import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CatalogPage } from './CatalogPage'
import { CartProvider } from '../context/CartContext'

function renderPage() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CatalogPage />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('CatalogPage', () => {
  it('renders all 3 products', () => {
    renderPage()
    expect(screen.getByText('Knife Set')).toBeInTheDocument()
    expect(screen.getByText('Coffee Cup')).toBeInTheDocument()
    expect(screen.getByText('Toaster')).toBeInTheDocument()
  })

  it('renders product prices', () => {
    renderPage()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
    expect(screen.getByText('$24.99')).toBeInTheDocument()
    expect(screen.getByText('$59.99')).toBeInTheDocument()
  })

  it('renders a page title', () => {
    renderPage()
    expect(screen.getByText(/all products/i)).toBeInTheDocument()
  })

  it('renders product links', () => {
    renderPage()
    const links = screen.getAllByRole('article')
    expect(links).toHaveLength(3)
  })
})
