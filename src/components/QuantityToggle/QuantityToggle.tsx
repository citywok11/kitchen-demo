import './QuantityToggle.css'

interface QuantityToggleProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export function QuantityToggle({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityToggleProps) {
  return (
    <div className="quantity-toggle">
      <button
        className="quantity-toggle__btn"
        onClick={onDecrement}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="quantity-toggle__value">{quantity}</span>
      <button
        className="quantity-toggle__btn"
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
