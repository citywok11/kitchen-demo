import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuantityToggle } from './QuantityToggle'

describe('QuantityToggle', () => {
  it('displays the current quantity', () => {
    render(
      <QuantityToggle quantity={3} onIncrement={vi.fn()} onDecrement={vi.fn()} />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onIncrement when + is clicked', async () => {
    const onIncrement = vi.fn()
    render(
      <QuantityToggle quantity={1} onIncrement={onIncrement} onDecrement={vi.fn()} />
    )
    await userEvent.click(screen.getByRole('button', { name: /increase/i }))
    expect(onIncrement).toHaveBeenCalledOnce()
  })

  it('calls onDecrement when - is clicked', async () => {
    const onDecrement = vi.fn()
    render(
      <QuantityToggle quantity={2} onIncrement={vi.fn()} onDecrement={onDecrement} />
    )
    await userEvent.click(screen.getByRole('button', { name: /decrease/i }))
    expect(onDecrement).toHaveBeenCalledOnce()
  })
})
