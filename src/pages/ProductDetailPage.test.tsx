import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProductDetailPage } from './ProductDetailPage'
import { CartProvider } from '../context/CartContext'

function renderWithRoute(productId: string) {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <CartProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  )
}

describe('ProductDetailPage', () => {
  it('renders product details for a valid product', () => {
    renderWithRoute('knife-set')
    expect(screen.getByText('Knife Set')).toBeInTheDocument()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
    expect(screen.getByText(/premium chef knife set/i)).toBeInTheDocument()
    expect(screen.getByText('High-carbon stainless steel')).toBeInTheDocument()
  })

  it('renders not found for invalid product', () => {
    renderWithRoute('nonexistent')
    expect(screen.getByText(/product not found/i)).toBeInTheDocument()
  })

  it('renders specs table', () => {
    renderWithRoute('toaster')
    expect(screen.getByText('Stainless steel')).toBeInTheDocument()
    expect(screen.getByText('800W')).toBeInTheDocument()
  })

  it('has an add to cart button', () => {
    renderWithRoute('knife-set')
    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument()
  })

  it('renders a back link', () => {
    renderWithRoute('knife-set')
    expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument()
  })
})
