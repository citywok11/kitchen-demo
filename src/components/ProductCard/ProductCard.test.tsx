import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from './ProductCard'
import type { Product } from '../../data/products'

const mockProduct: Product = {
  id: 'knife-set',
  name: 'Knife Set',
  price: 89.99,
  description: 'A knife set',
  specs: { Material: 'Steel' },
  meshName: 'KnifeSet',
  imagePath: '/images/knife-set.jpg',
}

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} onClick={vi.fn()} />)
    expect(screen.getByText('Knife Set')).toBeInTheDocument()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<ProductCard product={mockProduct} onClick={onClick} />)
    await userEvent.click(screen.getByRole('article'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders placeholder image', () => {
    render(<ProductCard product={mockProduct} onClick={vi.fn()} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/images/knife-set.jpg')
    expect(img).toHaveAttribute('alt', 'Knife Set')
  })
})
