import type { CartItem } from '../../context/CartContext'
import { QuantityToggle } from '../QuantityToggle/QuantityToggle'
import './CartOverlay.css'

interface CartOverlayProps {
  isOpen: boolean
  items: CartItem[]
  totalPrice: number
  onClose: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export function CartOverlay({
  isOpen,
  items,
  totalPrice,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}: CartOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="cart-overlay-container">
      <div className="cart-overlay-backdrop" onClick={onClose} />
      <div className="cart-overlay">
        <div className="cart-overlay__handle" />
        <div className="cart-overlay__header">
          <h2 className="cart-overlay__title">Cart ({items.length})</h2>
          <button
            className="cart-overlay__close"
            onClick={onClose}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-overlay__empty">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-overlay__items">
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item__image-wrapper">
                    <img
                      className="cart-item__image"
                      src={item.product.imagePath}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="cart-item__info">
                    <h3 className="cart-item__name">{item.product.name}</h3>
                    <span className="cart-item__price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-item__actions">
                    <QuantityToggle
                      quantity={item.quantity}
                      onIncrement={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      onDecrement={() => {
                        if (item.quantity <= 1) {
                          onRemoveItem(item.product.id)
                        } else {
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-overlay__footer">
              <div className="cart-overlay__total">
                <span>Subtotal</span>
                <span className="cart-overlay__total-price">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <button className="cart-overlay__checkout">Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
