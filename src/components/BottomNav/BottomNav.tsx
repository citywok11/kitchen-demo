import { NavLink } from 'react-router-dom'
import './BottomNav.css'

interface BottomNavProps {
  cartItemCount: number
  onCartClick: () => void
}

export function BottomNav({ cartItemCount, onCartClick }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
        }
        end
        onClick={() => window.dispatchEvent(new CustomEvent('reset-3d-view'))}
      >
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="bottom-nav__label">3D View</span>
      </NavLink>

      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
        }
      >
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        <span className="bottom-nav__label">Catalog</span>
      </NavLink>

      <button
        className="bottom-nav__item"
        onClick={onCartClick}
        aria-label="Cart"
      >
        <div className="bottom-nav__cart-wrapper">
          <svg className="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartItemCount > 0 && (
            <span className="bottom-nav__badge" data-testid="cart-badge">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="bottom-nav__label">Cart</span>
      </button>
    </nav>
  )
}
